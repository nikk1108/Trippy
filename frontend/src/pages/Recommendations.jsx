"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { MapPin, Calendar, Tag, Compass, Loader2, Star, Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { recommendationAPI } from "../services/api"
import ItineraryCard from "../components/ItineraryCard"
import DestinationHeroImage from "../components/DestinationHeroImage"
import { ITINERARY_TAG_OPTIONS } from "../constants/itineraryTags"

const Recommendations = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [recommendations, setRecommendations] = useState([])
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(false)
  const [destinationsLoading, setDestinationsLoading] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const [criteria, setCriteria] = useState({
    nights: searchParams.get("nights") || "",
    destination: searchParams.get("destination") || "",
    tags: searchParams.get("tags") || "",
    budget: searchParams.get("budget") || "",
    country: searchParams.get("country") || "",
    region: searchParams.get("region") || "",
    season: searchParams.get("season") || "",
    q: searchParams.get("q") || "",
  })

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 24,
    total: 0,
    estimatedTotal: 0,
    pages: 0,
    hasMore: false,
  })

  const tagOptions = ITINERARY_TAG_OPTIONS

  // Fetch popular destinations on mount
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await recommendationAPI.getDestinations()
        setDestinations(response.data?.data ?? [])
      } catch (error) {
        console.error("Error fetching destinations:", error)
      } finally {
        setDestinationsLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  // Fetch recommendations whenever criteria or page changes
  useEffect(() => {
    fetchRecommendations(pagination.page)
  }, [criteria, pagination.page])

  const fetchRecommendations = async (pageNumber = 1) => {
    setLoading(true)
    try {
      const params = {
        page: pageNumber,
        limit: 24,
        ...Object.fromEntries(Object.entries(criteria).filter(([_, value]) => value !== "")),
      }
      const response = await recommendationAPI.getRecommendations(params)
      setRecommendations(response.data?.data ?? [])
      setPagination({
        page: response.data?.pagination?.page ?? pageNumber,
        limit: response.data?.pagination?.limit ?? 24,
        total: response.data?.total ?? 0,
        estimatedTotal: response.data?.estimatedTotal ?? 0,
        pages: response.data?.pagination?.pages ?? 1,
        hasMore: response.data?.hasMore ?? false,
      })
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCriteriaChange = (field, value) => {
    const newCriteria = { ...criteria, [field]: value }
    setCriteria(newCriteria)
    
    // Reset page to 1 on filter change
    setPagination(prev => ({ ...prev, page: 1 }))

    // Update URL params
    const newSearchParams = new URLSearchParams()
    Object.entries(newCriteria).forEach(([key, val]) => {
      if (val) newSearchParams.set(key, val)
    })
    setSearchParams(newSearchParams)
  }

  const clearCriteria = () => {
    const cleared = {
      nights: "",
      destination: "",
      tags: "",
      budget: "",
      country: "",
      region: "",
      season: "",
      q: "",
    }
    setCriteria(cleared)
    setPagination(prev => ({ ...prev, page: 1 }))
    setSearchParams({})
  }

  const handleDestinationClick = (destinationName) => {
    handleCriteriaChange("destination", destinationName)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }))
      window.scrollTo({ top: 300, behavior: "smooth" })
    }
  }

  const hasActiveFilters = Object.values(criteria).some(val => val !== "")

  return (
    <div className="form-page py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-[#172033] mb-4">
            Discover Travel Possibilities
          </h1>
          <p className="text-lg text-[#596273] max-w-3xl mx-auto">
            Search our dynamic engine offering millions of combinations. Find matched itineraries or virtual escapes to customize.
          </p>
        </div>

        {/* Criteria Form */}
        <div className="form-card mb-8 space-y-5 bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="space-y-1">
              <label className="form-label-inline">
                <Calendar className="h-4 w-4 text-[#596273]" />
                Number of Nights
              </label>
              <select
                value={criteria.nights}
                onChange={(e) => handleCriteriaChange("nights", e.target.value)}
                className="form-select"
              >
                <option value="">Any duration</option>
                <option value="2">2 nights</option>
                <option value="3">3 nights</option>
                <option value="4">4 nights</option>
                <option value="5">5 nights</option>
                <option value="7">7 nights</option>
                <option value="10">10+ nights</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="form-label-inline">
                <MapPin className="h-4 w-4 text-[#596273]" />
                Destination
              </label>
              <input
                type="text"
                value={criteria.destination}
                onChange={(e) => handleCriteriaChange("destination", e.target.value)}
                placeholder="e.g. Goa, Tokyo, Zurich"
                className="form-input"
              />
            </div>

            <div className="space-y-1">
              <label className="form-label-inline">
                <Tag className="h-4 w-4 text-[#596273]" />
                Travel Style
              </label>
              <select
                value={criteria.tags}
                onChange={(e) => handleCriteriaChange("tags", e.target.value)}
                className="form-select"
              >
                <option value="">Any style</option>
                {tagOptions.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="form-label">Budget (USD)</label>
              <input
                type="number"
                value={criteria.budget}
                onChange={(e) => handleCriteriaChange("budget", e.target.value)}
                placeholder="Max budget"
                className="form-input"
              />
            </div>
          </div>

          {/* Advanced Filters Toggle & Drawer */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-4 border-t border-border/50 animate-fadeIn">
              <div className="space-y-1">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  value={criteria.country}
                  onChange={(e) => handleCriteriaChange("country", e.target.value)}
                  placeholder="e.g. India, France"
                  className="form-input"
                />
              </div>

              <div className="space-y-1">
                <label className="form-label">Region</label>
                <input
                  type="text"
                  value={criteria.region}
                  onChange={(e) => handleCriteriaChange("region", e.target.value)}
                  placeholder="e.g. Asia, Europe"
                  className="form-input"
                />
              </div>

              <div className="space-y-1">
                <label className="form-label">Season</label>
                <select
                  value={criteria.season}
                  onChange={(e) => handleCriteriaChange("season", e.target.value)}
                  className="form-select"
                >
                  <option value="">Any season</option>
                  <option value="winter">Winter</option>
                  <option value="spring">Spring</option>
                  <option value="summer">Summer</option>
                  <option value="autumn">Autumn</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="form-label">Keywords / Interests</label>
                <input
                  type="text"
                  value={criteria.q}
                  onChange={(e) => handleCriteriaChange("q", e.target.value)}
                  placeholder="e.g. temple, beach, museum"
                  className="form-input"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setShowAdvanced(prev => !prev)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>{showAdvanced ? "Hide Advanced Filters" : "Show Advanced Filters"}</span>
            </button>

            <div className="flex gap-3">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearCriteria}
                  className="bg-card border border-border text-[#596273] hover:bg-[#F0EEE8] px-5 py-2 rounded-lg font-medium transition-all text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Popular Destinations Quick Links */}
        {!hasActiveFilters && (
          <div className="mb-10">
            <h2 className="font-heading font-semibold text-2xl text-foreground mb-6 flex items-center gap-2">
              <Compass className="h-6 w-6 text-primary" />
              Popular Destinations
            </h2>
            {destinationsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-4 animate-pulse">
                    <div className="h-32 bg-muted rounded-t-lg mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2 w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {destinations.slice(0, 6).map((destination, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDestinationClick(destination.destination)}
                    className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 text-left group w-full relative"
                  >
                    <DestinationHeroImage
                      destination={destination.destination}
                      title={destination.title || destination.destination}
                      tags={destination.tags ?? []}
                      coverImage={destination.coverImage}
                      heightClass="h-40"
                      roundedClass="rounded-t-xl"
                      badge={
                        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-xs font-semibold shadow-md">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span>{destination.rating?.toFixed(1) || "4.6"}</span>
                        </div>
                      }
                    />
                    <div className="p-5">
                      <h3 className="font-heading font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors mb-1.5">
                        {destination.destination}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-3">
                        {destination.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(destination.tags ?? []).slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded-full border border-secondary/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-semibold text-2xl text-foreground">
              {hasActiveFilters ? "Search Results" : "Featured Discoveries"}
            </h2>
            {pagination.total > 0 && (
              <div className="flex flex-col items-end text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  Showing {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} combinations
                </span>
                {pagination.estimatedTotal > pagination.total && (
                  <span>Dynamic search universe: {pagination.estimatedTotal.toLocaleString()}+ possibilities</span>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
              <p className="text-muted-foreground font-medium text-sm">Searching the discovery universe...</p>
            </div>
          ) : recommendations.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {recommendations.map((itinerary) => (
                  <ItineraryCard key={itinerary._id} itinerary={itinerary} />
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="p-2 border border-border rounded-lg text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <span className="text-sm font-medium text-muted-foreground px-2">
                    Page <strong className="text-foreground">{pagination.page}</strong> of {pagination.pages}
                  </span>

                  <button
                    type="button"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasMore}
                    className="p-2 border border-border rounded-lg text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-xl">
              <Compass className="h-14 w-14 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-heading font-semibold text-lg text-foreground mb-1.5">No itineraries or destinations found</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-5">
                Try expanding your search parameters or check your spelling.
              </p>
              <button
                onClick={clearCriteria}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Recommendations
