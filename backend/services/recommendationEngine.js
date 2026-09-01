import User from "../models/User.js"
import Itinerary from "../models/Itinerary.js"
import Destination from "../models/Destination.js"
import { resolveDestination, getNormalizedKey } from "./destinationService.js"
import { getFallbackCoverImage } from "./tripImageService.js"
import { STATIC_DESTINATIONS } from "../utils/staticDestinations.js"

const CONTENT_WEIGHT = 0.65
const COLLAB_WEIGHT = 0.35
const MAX_CANDIDATES = 120

/**
 * @param {object} preferences
 * @param {number} [preferences.nights]
 * @param {string} [preferences.destination]
 * @param {string[]} [preferences.tags]
 * @param {number} [preferences.budgetMin]
 * @param {number} [preferences.budgetMax]
 */
export function buildContentPreferences(preferences = {}) {
  const tags = Array.isArray(preferences.tags)
    ? preferences.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean)
    : String(preferences.tags || "")
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)

  const nights = preferences.nights != null ? Number(preferences.nights) : null
  const budgetMin = preferences.budgetMin != null ? Number(preferences.budgetMin) : null
  const budgetMax =
    preferences.budgetMax != null
      ? Number(preferences.budgetMax)
      : preferences.budget != null
        ? Number(preferences.budget)
        : null

  return {
    nights: Number.isFinite(nights) ? nights : null,
    destination: String(preferences.destination || "").trim(),
    tags,
    budgetMin: Number.isFinite(budgetMin) ? budgetMin : null,
    budgetMax: Number.isFinite(budgetMax) ? budgetMax : null,
  }
}

/**
 * Content-based score 0–100 from tags, duration (nights), and budget fit.
 * @param {object} itinerary - lean or mongoose doc
 * @param {ReturnType<typeof buildContentPreferences>} preferences
 */
export function scoreContentBased(itinerary, preferences) {
  let score = 0
  let maxScore = 0

  const itinTags = (itinerary.tags || []).map((t) => String(t).toLowerCase())

  if (preferences.tags.length > 0) {
    maxScore += 40
    const prefSet = new Set(preferences.tags)
    const overlap = itinTags.filter((t) => prefSet.has(t)).length
    const union = new Set([...preferences.tags, ...itinTags]).size
    score += union > 0 ? (overlap / union) * 40 : 0
  }

  if (preferences.nights != null) {
    maxScore += 30
    const diff = Math.abs(Number(itinerary.numberOfNights) - preferences.nights)
    score += Math.max(0, 30 - diff * 12)
  }

  if (preferences.budgetMax != null) {
    maxScore += 30
    const itinMin = Number(itinerary.budget?.min)
    const itinMax = Number(itinerary.budget?.max)
    if (Number.isFinite(itinMax) && itinMax <= preferences.budgetMax) {
      score += 30
    } else if (
      Number.isFinite(itinMin) &&
      Number.isFinite(itinMax) &&
      itinMin <= preferences.budgetMax &&
      itinMax >= (preferences.budgetMin ?? 0)
    ) {
      score += 18
    } else if (!Number.isFinite(itinMax)) {
      score += 10
    }
  }

  if (preferences.destination) {
    maxScore += 20
    const dest = String(itinerary.destination || "").toLowerCase()
    const pref = preferences.destination.toLowerCase()
    if (dest.includes(pref) || pref.includes(dest)) {
      score += 20
    } else {
      const prefParts = pref.split(",").map((p) => p.trim()).filter(Boolean)
      if (prefParts.some((part) => dest.includes(part))) {
        score += 12
      }
    }
  }

  if (maxScore === 0) {
    return itinerary.isRecommended ? 55 : 40
  }

  return Math.round((score / maxScore) * 100)
}

/**
 * Collaborative score 0–100: users with overlapping saved itineraries.
 * @param {string} userId
 * @param {string[]} candidateIds - itinerary ids to score
 * @param {Set<string>} excludeIds - already saved by user
 */
export async function scoreCollaborative(userId, candidateIds, excludeIds = new Set()) {
  const scores = new Map()
  for (const id of candidateIds) {
    scores.set(String(id), 0)
  }

  const user = await User.findById(userId).select("savedItineraries").lean()
  const mySaved = (user?.savedItineraries || []).map((id) => String(id))

  if (mySaved.length === 0) {
    return scores
  }

  const mySavedSet = new Set(mySaved)

  const similarUsers = await User.find({
    _id: { $ne: userId },
    savedItineraries: { $in: user.savedItineraries },
  })
    .select("savedItineraries")
    .lean()

  if (similarUsers.length === 0) {
    return scores
  }

  const rawCounts = new Map()
  for (const other of similarUsers) {
    for (const itinId of other.savedItineraries || []) {
      const idStr = String(itinId)
      if (mySavedSet.has(idStr) || excludeIds.has(idStr)) continue
      if (!scores.has(idStr)) continue
      rawCounts.set(idStr, (rawCounts.get(idStr) || 0) + 1)
    }
  }

  const maxCount = Math.max(1, ...rawCounts.values())
  for (const [id, count] of rawCounts) {
    scores.set(id, Math.round((count / maxCount) * 100))
  }

  return scores
}

/**
 * Derive preferences from a seed itinerary for content-based scoring.
 * @param {string} itineraryId
 */
export async function preferencesFromItinerary(itineraryId) {
  const seed = await Itinerary.findById(itineraryId).lean()
  if (!seed) return null
  return buildContentPreferences({
    nights: seed.numberOfNights,
    destination: seed.destination,
    tags: seed.tags,
    budgetMin: seed.budget?.min,
    budgetMax: seed.budget?.max,
  })
}

/**
 * @param {object} options
 * @param {ReturnType<typeof buildContentPreferences>} options.preferences
 * @param {string} [options.userId]
 * @param {string} [options.seedItineraryId]
 * @param {number} [options.limit]
 */
export async function getAdvancedRecommendations({
  preferences,
  userId = null,
  seedItineraryId = null,
  limit = 10,
}) {
  let prefs = preferences
  const excludeIds = new Set()

  if (seedItineraryId) {
    excludeIds.add(String(seedItineraryId))
    const seedPrefs = await preferencesFromItinerary(seedItineraryId)
    if (seedPrefs) {
      prefs = {
        nights: prefs.nights ?? seedPrefs.nights,
        destination: prefs.destination || seedPrefs.destination,
        tags: prefs.tags.length > 0 ? prefs.tags : seedPrefs.tags,
        budgetMin: prefs.budgetMin ?? seedPrefs.budgetMin,
        budgetMax: prefs.budgetMax ?? seedPrefs.budgetMax,
      }
    }
  }

  if (userId) {
    const user = await User.findById(userId).select("savedItineraries").lean()
    for (const id of user?.savedItineraries || []) {
      excludeIds.add(String(id))
    }
  }

  const candidates = await Itinerary.find(
    excludeIds.size > 0 ? { _id: { $nin: [...excludeIds] } } : {},
  )
    .sort({ isRecommended: -1, createdAt: -1 })
    .limit(MAX_CANDIDATES)
    .lean()

  const candidateIds = candidates.map((c) => String(c._id))
  const collabScores = userId
    ? await scoreCollaborative(userId, candidateIds, excludeIds)
    : new Map()

  const hasCollab = [...collabScores.values()].some((v) => v > 0)
  const contentW = hasCollab ? CONTENT_WEIGHT : 1
  const collabW = hasCollab ? COLLAB_WEIGHT : 0

  const scored = candidates.map((itinerary) => {
    const id = String(itinerary._id)
    const contentScore = scoreContentBased(itinerary, prefs)
    const collaborativeScore = collabScores.get(id) || 0
    const combinedScore = Math.round(contentScore * contentW + collaborativeScore * collabW)

    return {
      itinerary,
      scores: {
        combined: combinedScore,
        contentBased: contentScore,
        collaborative: collaborativeScore,
      },
    }
  })

  scored.sort((a, b) => {
    if (b.scores.combined !== a.scores.combined) {
      return b.scores.combined - a.scores.combined
    }
    if (b.scores.contentBased !== a.scores.contentBased) {
      return b.scores.contentBased - a.scores.contentBased
    }
    return new Date(b.itinerary.createdAt) - new Date(a.itinerary.createdAt)
  })

  const top = scored.slice(0, Math.min(Math.max(1, limit), 30))

  return {
    preferences: prefs,
    engine: {
      contentBased: true,
      collaborative: Boolean(userId && hasCollab),
      candidatePool: candidates.length,
    },
    results: top,
  }
}

/**
 * Scoring helper for discovery ranking
 */
function scoreCombination(item, criteria) {
  let score = 0
  
  if (criteria.destination) {
    const normDest = getNormalizedKey(item.destination)
    const normCrit = getNormalizedKey(criteria.destination)
    if (normDest.includes(normCrit) || normCrit.includes(normDest)) {
      score += 40
    }
  } else if (criteria.q) {
    const normDest = getNormalizedKey(item.destination)
    const normCrit = getNormalizedKey(criteria.q)
    if (normDest.includes(normCrit) || normCrit.includes(normDest)) {
      score += 40
    }
  }

  if (criteria.style) {
    const itemTags = (item.tags || []).map(t => t.toLowerCase())
    if (itemTags.includes(criteria.style.toLowerCase())) {
      score += 30
    }
  }

  if (criteria.nights) {
    const diff = Math.abs(Number(item.numberOfNights) - Number(criteria.nights))
    if (diff === 0) {
      score += 20
    } else if (diff === 1) {
      score += 12
    } else if (diff === 2) {
      score += 6
    }
  }

  if (criteria.budget) {
    const maxBudget = Number(criteria.budget)
    const itemMax = item.budget?.max || item.totalBudget || 0
    if (itemMax > 0 && itemMax <= maxBudget) {
      score += 10
    }
  }

  const popularity = item.popularity || 50
  const rating = item.rating || 4.0
  score += (popularity / 100) * 5 + (rating / 5) * 5

  return Math.round(score)
}

/**
 * Scaling helper to compute dynamic estimatedTotal combinations
 */
function estimateDiscoveryUniverseSize(matchedDestinationsCount, criteria) {
  let multiplier = 6 // nights (2, 3, 5, 7, 10, 14)
  let styleMultiplier = 15 // travel styles / tags
  let budgetMultiplier = 3 // budget ranges (low, med, high)
  
  if (criteria.nights) multiplier = 1
  if (criteria.style) styleMultiplier = 1
  if (criteria.budget) budgetMultiplier = 1

  const activeDests = Math.max(1, matchedDestinationsCount)
  // Let the base size be scaled dynamically up to 5,000,000+ conceptually
  return Math.min(5000000, activeDests * multiplier * styleMultiplier * budgetMultiplier * 100)
}

/**
 * Unified discovery search engine spanning database itineraries + external destination caching + combination synthesis
 */
export async function searchDiscoveryUniverse({
  q = "",
  destination = "",
  nights = "",
  style = "",
  tags = "",
  budget = "",
  country = "",
  region = "",
  page = 1,
  limit = 24,
  userId = null,
}) {
  const pageNum = Math.max(1, Number(page) || 1)
  const limitNum = Math.max(1, Number(limit) || 24)

  const activeStyle = String(style || tags || "").trim()

  const criteria = {
    q: String(q || "").trim(),
    destination: String(destination || "").trim(),
    nights: nights ? Number(nights) : null,
    style: activeStyle,
    budget: budget ? Number(budget) : null,
    country: String(country || "").trim(),
    region: String(region || "").trim(),
  }

  // 1. Resolve/Geocode searched destination if needed
  const destSearchTerm = criteria.destination || criteria.q
  const isSearchTermStyle = ["beach", "adventure", "cultural", "luxury", "budget", "family", "romantic", "solo", "spiritual", "mountain", "nature", "food", "history", "snowfall"].includes(destSearchTerm.toLowerCase())

  if (destSearchTerm && !isSearchTermStyle) {
    try {
      await resolveDestination(destSearchTerm)
    } catch (err) {
      console.warn("[discovery-engine] Failed resolving searched destination:", err.message)
    }
  }

  // 2. Fetch all cached Destinations from MongoDB
  const destQuery = {}
  if (criteria.country) destQuery.country = { $regex: criteria.country, $options: "i" }
  if (criteria.region) destQuery.region = { $regex: criteria.region, $options: "i" }
  if (criteria.style) destQuery.tags = { $in: [criteria.style.toLowerCase()] }

  if (destSearchTerm) {
    if (isSearchTermStyle) {
      destQuery.tags = { $in: [destSearchTerm.toLowerCase()] }
    } else {
      const matchPattern = { $regex: destSearchTerm, $options: "i" }
      destQuery.$or = [
        { name: matchPattern },
        { country: matchPattern },
        { region: matchPattern },
        { tags: matchPattern }
      ]
    }
  }

  const resolvedDestinations = await Destination.find(destQuery).lean()

  // 3. Fetch real itineraries from MongoDB matching filters
  const itineraryQuery = {}
  if (criteria.nights) {
    const n = Number(criteria.nights)
    itineraryQuery.numberOfNights = { $gte: n - 1, $lte: n + 1 }
  }
  if (criteria.style) {
    itineraryQuery.tags = { $in: [criteria.style.toLowerCase()] }
  }
  if (criteria.budget) {
    itineraryQuery.$or = [{ "budget.max": { $lte: criteria.budget } }, { "budget.max": { $exists: false } }]
  }
  if (destSearchTerm) {
    if (isSearchTermStyle) {
      itineraryQuery.tags = { $in: [destSearchTerm.toLowerCase()] }
    } else {
      itineraryQuery.destination = { $regex: destSearchTerm, $options: "i" }
    }
  }

  const realItineraries = await Itinerary.find(itineraryQuery)
    .populate({
      path: "days",
      populate: { path: "activities", model: "Activity" }
    })
    .lean()

  // 4. Generate virtual itineraries for resolved destinations to ensure rich results
  const virtualItineraries = []
  const generatedKeys = new Set(realItineraries.map(i => `${getNormalizedKey(i.destination)}-${i.numberOfNights}-${(i.tags || [])[0] || ""}`))

  const virtualNights = criteria.nights ? [criteria.nights] : [3, 5, 7]
  const virtualStyles = criteria.style ? [criteria.style] : ["cultural", "adventure", "beach", "nature"]

  for (const dest of resolvedDestinations) {
    const destNormKey = getNormalizedKey(dest.name)

    for (const n of virtualNights) {
      for (const st of virtualStyles) {
        const comboKey = `${destNormKey}-${n}-${st}`
        if (generatedKeys.has(comboKey)) continue // Skip if we already have a real itinerary matching this
        generatedKeys.add(comboKey)

        const minBudget = Math.round((dest.estimatedBudget?.min || 150) * (n / 3))
        const maxBudget = Math.round((dest.estimatedBudget?.max || 600) * (n / 3))

        if (criteria.budget && maxBudget > criteria.budget) continue

        virtualItineraries.push({
          _id: `virtual-${destNormKey}-${n}-${st}-${maxBudget}`,
          isVirtual: true,
          title: `${dest.name.split(",")[0]} ${n}-Nights ${st.charAt(0).toUpperCase() + st.slice(1)} Getaway`,
          destination: dest.name,
          numberOfNights: n,
          totalDays: n + 1,
          description: dest.description || `Enjoy a custom ${n}-nights getaway to ${dest.name} matching your preference for ${st} style travel.`,
          tags: [st],
          highlights: (dest.activities || []).slice(0, 3),
          budget: { min: minBudget, max: maxBudget, currency: "USD" },
          bestTimeToVisit: dest.bestTimeToVisit || "November – February",
          coverImage: dest.image?.url
            ? dest.image
            : await getFallbackCoverImage({ destination: dest.name, title: dest.name, tags: [st, ...(dest.tags || [])] }),
          popularity: dest.popularity || 60,
          rating: dest.rating || 4.2,
          createdAt: new Date("2026-01-01T00:00:00Z"), // Constant deterministic date
        })
      }
    }
  }

  // 5. Merge and Score results
  const candidates = [
    ...realItineraries.map(x => ({ ...x, isVirtual: false })),
    ...virtualItineraries
  ]

  const scoredCandidates = candidates.map(item => {
    const score = scoreCombination(item, criteria)
    return {
      item,
      score,
    }
  })

  // 6. Deterministic sort: Score desc -> isVirtual asc (real first) -> nights asc -> destination name
  scoredCandidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (a.item.isVirtual !== b.item.isVirtual) return a.item.isVirtual ? 1 : -1
    if (a.item.numberOfNights !== b.item.numberOfNights) return a.item.numberOfNights - b.item.numberOfNights
    const nameA = String(a.item.destination || "")
    const nameB = String(b.item.destination || "")
    return nameA.localeCompare(nameB)
  })

  // 7. Paginate
  const total = scoredCandidates.length
  const startIndex = (pageNum - 1) * limitNum
  const paginated = scoredCandidates.slice(startIndex, startIndex + limitNum).map(x => x.item)

  const estimatedTotal = estimateDiscoveryUniverseSize(resolvedDestinations.length, criteria)

  return {
    results: paginated,
    total,
    estimatedTotal,
    hasMore: startIndex + limitNum < total,
    pagination: {
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum) || 1,
    }
  }
}
