import Itinerary from "../models/Itinerary.js"
import Destination from "../models/Destination.js"
import { mergeBudgetIntoResponse } from "../utils/budgetCalculations.js"
import { getTripCoverImage, urlStem } from "../services/tripImageService.js"
import {
  buildContentPreferences,
  getAdvancedRecommendations,
  searchDiscoveryUniverse,
} from "../services/recommendationEngine.js"
import { getNearbyPlaces, listNearbyCategories } from "../services/nearbyPlacesService.js"
import { geolocateClientIp } from "../utils/ipGeolocation.js"
import { resolveDestination } from "../services/destinationService.js"

// @desc    Get recommended itineraries via discovery search
// @route   GET /api/recommendations
// @access  Public
export const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user?._id?.toString() || req.user?.id || null
    const result = await searchDiscoveryUniverse({
      ...req.query,
      userId,
    })
    res.status(200).json({
      success: true,
      count: result.results.length,
      data: result.results,
      pagination: result.pagination,
      total: result.total,
      estimatedTotal: result.estimatedTotal,
      hasMore: result.hasMore,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Advanced recommendations (content-based + collaborative)
// @route   GET /api/recommendations/advanced
// @access  Public (collaborative signals when authenticated)
export const getAdvancedRecommendationsHandler = async (req, res, next) => {
  try {
    const userId = req.user?._id?.toString() || req.user?.id || null
    const result = await searchDiscoveryUniverse({
      ...req.query,
      userId,
    })
    res.status(200).json({
      success: true,
      count: result.results.length,
      data: result.results,
      pagination: result.pagination,
      total: result.total,
      estimatedTotal: result.estimatedTotal,
      hasMore: result.hasMore,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Dynamic discovery search
// @route   GET /api/discover
// @access  Public
export const getDiscover = async (req, res, next) => {
  try {
    const userId = req.user?._id?.toString() || req.user?.id || null
    const result = await searchDiscoveryUniverse({
      ...req.query,
      userId,
    })
    res.status(200).json({
      success: true,
      ...result,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get destination details by name
// @route   GET /api/recommendations/destination/:name
// @access  Public
export const getDestinationByName = async (req, res, next) => {
  try {
    const { name } = req.params
    const dest = await resolveDestination(name)
    if (!dest) {
      return res.status(404).json({
        success: false,
        message: "Destination not found and could not be resolved.",
      })
    }
    res.status(200).json({
      success: true,
      data: dest,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get destination highlights / popular destinations
// @route   GET /api/recommendations/destinations
// @access  Public
export const getDestinations = async (req, res, next) => {
  try {
    const { withCache, RedisKeys, TTL } = await import("../utils/cacheHelpers.js")
    
    const data = await withCache(
      RedisKeys.placesNearby("popular-destinations"),
      TTL.PLACES,
      async () => {
        // Fetch destinations from DB
        let dests = await Destination.find({}).sort({ popularity: -1 }).lean()
        
        // If DB has no destinations, resolve static ones to bootstrap
        if (dests.length === 0) {
          const { STATIC_DESTINATIONS } = await import("../utils/staticDestinations.js")
          for (const d of STATIC_DESTINATIONS) {
            try {
              await resolveDestination(d.name)
            } catch {}
          }
          dests = await Destination.find({}).sort({ popularity: -1 }).lean()
        }
        
        const finalDests = dests.slice(0, 18)
        
        const { getFallbackCoverImage } = await import("../services/tripImageService.js")

        const results = []
        for (const dest of finalDests) {
          const itineraryCount = await Itinerary.countDocuments({
            destination: { $regex: dest.name.split(",")[0].trim(), $options: "i" }
          })
          
          let coverImage = dest.image?.url ? dest.image : null
          if (!coverImage) {
            coverImage = await getFallbackCoverImage({
              destination: dest.name,
              title: dest.name,
              tags: dest.tags || [],
            })
          }

          results.push({
            destination: dest.name,
            itineraryCount: itineraryCount || 1,
            nightRange: {
              min: Math.max(1, dest.recommendedDuration - 1),
              max: dest.recommendedDuration + 2
            },
            tags: dest.tags || [],
            highlights: dest.activities || [],
            coverImage,
            title: dest.name,
            description: dest.description,
            rating: dest.rating,
            popularity: dest.popularity,
          })
        }
        
        return results
      }
    )

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Approximate client location from public IP (when browser GPS is coarse)
// @route   GET /api/recommendations/nearby/client-location
// @access  Public
export const getClientIpLocation = async (req, res) => {
  const location = await geolocateClientIp(req)
  if (!location) {
    return res.status(503).json({
      success: false,
      message: "Could not determine location from IP (local dev or unavailable).",
    })
  }
  res.status(200).json({ success: true, data: location })
}

// @desc    Nearby place recommendations from user coordinates
// @route   GET /api/recommendations/nearby?lat=&lng=&type=restaurant&limit=8
// @access  Public
export const getNearbyRecommendations = async (req, res, next) => {
  try {
    const query = req.query || {}
    const body = req.body || {}
    const lat = query.lat ?? query.latitude ?? body.lat ?? body.latitude
    const lng = query.lng ?? query.longitude ?? body.lng ?? body.longitude
    const type = query.type ?? body.type
    const limit = query.limit ?? body.limit
    const destination = query.destination ?? body.destination
    const locationSource = query.locationSource ?? body.locationSource
    const noCache = query.noCache ?? body.noCache

    const source = String(locationSource || "").toLowerCase()
    const isCurrent = source === "current" || source === "gps"

    if (process.env.NODE_ENV !== "production") {
      console.log("[nearby-location] Backend received", {
        latitude: lat,
        longitude: lng,
        locationSource: source,
        destination: isCurrent ? null : destination || null,
      })
    }

    const result = await getNearbyPlaces({
      latitude: lat,
      longitude: lng,
      destination: isCurrent ? undefined : destination,
      locationSource: source || undefined,
      type,
      limit,
      noCache: noCache === "1" || noCache === "true",
    })

    res.status(200).json({
      success: true,
      demo: result.demo,
      source: result.source,
      locationSource: result.locationSource,
      locationSourceLabel: result.locationSourceLabel,
      requestCoordinates: result.requestCoordinates,
      googlePlacesCoordinates: result.googlePlacesCoordinates,
      warning: result.warning || undefined,
      location: result.location,
      category: result.category,
      count: result.count,
      data: result.data,
    })
  } catch (error) {
    if (error?.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message })
    }
    next(error)
  }
}

// @desc    Nearby recommendation categories (restaurants, ATMs, etc.)
// @route   GET /api/recommendations/nearby/categories
// @access  Public
export const getNearbyCategories = async (_req, res) => {
  res.status(200).json({
    success: true,
    data: listNearbyCategories(),
  })
}

// @desc    Get similar itineraries
// @route   GET /api/recommendations/similar/:id
// @access  Public
export const getSimilarItineraries = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id)

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        error: "Itinerary not found",
      })
    }

    // Find similar itineraries based on destination, nights, and tags
    const similar = await Itinerary.find({
      _id: { $ne: itinerary._id },
      $or: [
        { destination: itinerary.destination },
        { numberOfNights: { $gte: itinerary.numberOfNights - 1, $lte: itinerary.numberOfNights + 1 } },
        { tags: { $in: itinerary.tags } },
      ],
    })
      .populate({
        path: "days",
        populate: {
          path: "activities",
          model: "Activity",
        },
      })
      .limit(6)

    res.status(200).json({
      success: true,
      count: similar.length,
      data: similar.map((doc) => mergeBudgetIntoResponse(doc)),
    })
  } catch (error) {
    next(error)
  }
}
