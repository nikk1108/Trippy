import express from "express"
import {
  getRecommendations,
  getDestinations,
  getSimilarItineraries,
  getAdvancedRecommendationsHandler,
  getNearbyRecommendations,
  getNearbyCategories,
  getClientIpLocation,
  getDiscover,
  getDestinationByName,
} from "../controllers/recommendationController.js"
import { optionalProtect } from "../middlewares/authMiddleware.js"
import { publicApiRateLimiter } from "../middlewares/rateLimiter.js"

const router = express.Router()

router.use(publicApiRateLimiter)

// Routes — static paths before parameterized routes
router.get("/advanced", optionalProtect, getAdvancedRecommendationsHandler)
router.get("/nearby/categories", getNearbyCategories)
router.get("/nearby/client-location", getClientIpLocation)
router.get("/nearby", getNearbyRecommendations)
router.post("/nearby", getNearbyRecommendations)
router.get("/destinations", getDestinations)
router.get("/destination/:name", getDestinationByName)
router.get("/discover", getDiscover)
router.get("/similar/:id", getSimilarItineraries)
router.get("/", getRecommendations)

export default router
