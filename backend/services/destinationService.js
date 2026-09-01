import Destination from "../models/Destination.js"
import { STATIC_DESTINATIONS } from "../utils/staticDestinations.js"
import { geocodePlace } from "./geocodingService.js"
import { getNearbyPlaces } from "./nearbyPlacesService.js"
import { llmChatJson } from "./aiService.js"
import { RedisKeys, TTL } from "../utils/cacheHelpers.js"
import { cacheGet, cacheSet } from "./cacheService.js"
import { logAi } from "../logger/index.js"

// Normalizes the search term/destination name to group variations together
export function getNormalizedKey(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s,]/g, "")
}

// Generate travel description for a destination using AI, with a solid fallback
async function generateDescription(name, country, tags = []) {
  const system = "You are a travel writer. Write a short, engaging description (2-3 sentences) for a travel destination. Output ONLY valid JSON: {\"description\": \"text\"}"
  const user = `Destination: ${name}, ${country || ""}\nTravel Styles: ${tags.join(", ")}`

  try {
    const res = await llmChatJson({ system, user })
    if (res && !res.demo && res.parsed?.description) {
      return res.parsed.description
    }
  } catch (err) {
    console.warn(`[destination-service] AI description failed for ${name}:`, err.message)
  }

  // Fallback description template
  const styleStr = tags.length > 0 ? ` ideal for ${tags.join(" and ")} travelers` : ""
  return `Discover the wonders of ${name}${country ? `, ${country}` : ""}${styleStr}. Explore rich cultural landmarks, local culinary delights, and unforgettable sightseeing adventures.`
}

// Main function to search/resolve a destination dynamically
export async function resolveDestination(destinationQuery) {
  const query = String(destinationQuery || "").trim()
  if (!query) return null

  const normKey = getNormalizedKey(query)

  // 1. Check local/memory cache or Redis first
  try {
    const cacheKey = RedisKeys.placesNearby(`dest-norm:${normKey}`)
    const cached = await cacheGet(cacheKey)
    if (cached) return cached
  } catch (err) {
    console.warn("[destination-service] Redis cache read failed:", err.message)
  }

  // 2. Check Database for exact match on normalizedName
  let dest = await Destination.findOne({ normalizedName: normKey })
  if (dest) {
    return dest.toObject()
  }

  // 3. Check if it matches a name in STATIC_DESTINATIONS (case-insensitive)
  const staticMatch = STATIC_DESTINATIONS.find(
    (d) => getNormalizedKey(d.name) === normKey || getNormalizedKey(d.name.split(",")[0]) === normKey
  )

  if (staticMatch) {
    dest = await Destination.create({
      ...staticMatch,
      normalizedName: getNormalizedKey(staticMatch.name),
      source: "static",
    })
    const obj = dest.toObject()
    await cacheDestination(obj)
    return obj
  }

  // 4. Resolve via Geocoding
  let geo = null
  try {
    geo = await geocodePlace(query)
  } catch (err) {
    console.error(`[destination-service] Geocoding failed for "${query}":`, err.message)
  }

  if (!geo) {
    return null // Could not resolve location
  }

  // Check database again using the geocoded normalized name
  const geoNormKey = getNormalizedKey(geo.displayName)
  dest = await Destination.findOne({ normalizedName: geoNormKey })
  if (dest) {
    // Also map the original query normKey to this existing destination in cache to save future geocoding calls
    await cacheDestination(dest.toObject(), normKey)
    return dest.toObject()
  }

  // 5. Discover details dynamically using coordinates
  const lat = geo.latitude
  const lng = geo.longitude
  const displayName = geo.displayName
  const nameParts = displayName.split(",")
  const canonicalName = nameParts[0].trim()
  const country = nameParts[nameParts.length - 1].trim()
  const region = nameParts.length > 2 ? nameParts[1].trim() : ""

  // Fetch nearby POIs (attractions, restaurants, hotels) using the geocoded coordinates
  let attractions = []
  let hotels = []
  let restaurants = []
  let source = "nominatim"

  try {
    const attractionResults = await getNearbyPlaces({
      latitude: lat,
      longitude: lng,
      locationSource: "current",
      type: "attraction",
      limit: 5,
    })
    attractions = (attractionResults.data || []).map((x) => x.name)
    if (attractionResults.source && attractionResults.source !== "demo") {
      source = attractionResults.source
    }

    const hotelResults = await getNearbyPlaces({
      latitude: lat,
      longitude: lng,
      locationSource: "current",
      type: "hotel",
      limit: 5,
    })
    hotels = (hotelResults.data || []).map((x) => x.name)

    const restaurantResults = await getNearbyPlaces({
      latitude: lat,
      longitude: lng,
      locationSource: "current",
      type: "restaurant",
      limit: 5,
    })
    restaurants = (restaurantResults.data || []).map((x) => x.name)
  } catch (err) {
    console.warn(`[destination-service] Nearby places query failed for ${displayName}:`, err.message)
  }

  // Categorize tags/styles based on name/attractions
  const tags = ["cultural"]
  const lowerName = displayName.toLowerCase()
  if (lowerName.includes("beach") || lowerName.includes("coast") || lowerName.includes("island")) {
    tags.push("beach")
  }
  if (lowerName.includes("mountain") || lowerName.includes("hill") || lowerName.includes("alps")) {
    tags.push("mountain")
    tags.push("nature")
  }
  if (lowerName.includes("temple") || lowerName.includes("church") || lowerName.includes("holy")) {
    tags.push("spiritual")
  }
  if (tags.length === 1) {
    tags.push("nature")
    tags.push("adventure")
  }

  // Generate description
  const description = await generateDescription(canonicalName, country, tags)

  // Create new Destination record
  dest = await Destination.create({
    name: displayName,
    normalizedName: geoNormKey,
    country,
    region,
    coordinates: { latitude: lat, longitude: lng },
    description,
    tags,
    activities: attractions,
    hotels,
    restaurants,
    recommendedDuration: 3,
    estimatedBudget: { min: 200, max: 800, currency: "USD" },
    popularity: 70,
    rating: 4.2,
    source: source === "google-places" ? "google-places" : "nominatim",
  })

  const obj = dest.toObject()
  await cacheDestination(obj, normKey)
  return obj
}

// Caches the destination details under its main normalized name and optionally under a search alias
async function cacheDestination(destObj, queryNormKey = null) {
  try {
    const mainKey = RedisKeys.placesNearby(`dest-norm:${destObj.normalizedName}`)
    await cacheSet(mainKey, destObj, TTL.PLACES)

    if (queryNormKey && queryNormKey !== destObj.normalizedName) {
      const aliasKey = RedisKeys.placesNearby(`dest-norm:${queryNormKey}`)
      await cacheSet(aliasKey, destObj, TTL.PLACES)
    }
  } catch (err) {
    console.warn("[destination-service] Redis cache write failed:", err.message)
  }
}
