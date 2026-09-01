"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { MapPin, Calendar, Tag, Sparkles, Loader2, Star, ArrowLeft, Hotel, Utensils, Compass } from "lucide-react"
import { recommendationAPI } from "../services/api"
import DestinationHeroImage from "../components/DestinationHeroImage"

export default function DestinationDetail() {
  const { name } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [destination, setDestination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("attractions")

  // Load URL query parameters if navigated from a virtual card
  const urlNights = Number(searchParams.get("nights")) || 3
  const urlStyle = searchParams.get("style") || "cultural"
  const urlBudget = Number(searchParams.get("budget")) || 1000

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await recommendationAPI.getByName(name)
        setDestination(response.data?.data || null)
      } catch (err) {
        console.error("Error loading destination details:", err)
        setError("Could not load destination details. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
  }, [name])

  const handleCreateItinerary = () => {
    if (!destination) return
    // Navigate to AI Itinerary creation page with pre-filled preferences in state
    navigate("/ai-itinerary", {
      state: {
        prefilledState: {
          destination: destination.name,
          numberOfNights: urlNights,
          travelStyle: urlStyle,
          budgetMin: Math.max(100, Math.round(urlBudget * 0.6)),
          budgetMax: urlBudget,
          interests: destination.tags || [],
        },
      },
    })
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-24">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Resolving destination details from Google Places...</p>
      </div>
    )
  }

  if (error || !destination) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Compass className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-60" />
        <h2 className="font-heading text-2xl font-bold mb-2">Destination Not Found</h2>
        <p className="text-muted-foreground mb-6">{error || "The destination details could not be resolved."}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-lg font-medium transition-all"
        >
          Go Back
        </button>
      </div>
    )
  }

  const tabClass = (tab) =>
    `flex-1 py-3 text-center border-b-2 font-medium text-sm transition-all ${
      activeTab === tab
        ? "border-primary text-primary"
        : "border-transparent text-muted-foreground hover:text-foreground"
    }`

  const tags = destination.tags || []
  const activities = destination.activities || []
  const hotels = destination.hotels || []
  const restaurants = destination.restaurants || []

  return (
    <div className="form-page py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Discover
        </button>

        {/* Hero Section */}
        <div className="relative mb-8 rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
          <DestinationHeroImage
            destination={destination.name}
            title={destination.name}
            tags={tags}
            coverImage={destination.image}
            heightClass="h-72 sm:h-96"
            roundedClass="rounded-t-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
            <div className="p-6 sm:p-8 text-white w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <span className="inline-flex items-center gap-1 bg-primary/90 text-primary-foreground text-xs px-2.5 py-1 rounded-full font-semibold mb-2">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span>{destination.rating?.toFixed(1) || "4.5"} Rating</span>
                </span>
                <h1 className="font-heading font-bold text-3xl sm:text-4xl leading-tight mb-2">
                  {destination.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {destination.country || "Global"}
                  </span>
                  {destination.region && (
                    <span>· {destination.region}</span>
                  )}
                  <span>· Recommended: {destination.recommendedDuration || 3} Nights</span>
                </div>
              </div>
              <button
                onClick={handleCreateItinerary}
                className="button-primary bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0"
              >
                <Sparkles className="h-5 w-5" />
                <span>Create Itinerary with AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Details) */}
          <div className="space-y-6">
            <div className="form-card bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
              <h2 className="font-heading font-semibold text-xl text-card-foreground">About the Destination</h2>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {destination.description}
              </p>
            </div>

            <div className="form-card bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
              <h3 className="font-heading font-semibold text-lg text-card-foreground">Travel Insights</h3>
              
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-muted-foreground">Recommended Nights</span>
                  <span className="font-semibold text-foreground">{destination.recommendedDuration || 3} Nights</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-muted-foreground">Estimated Budget</span>
                  <span className="font-semibold text-foreground">
                    ${destination.estimatedBudget?.min || 200} - ${destination.estimatedBudget?.max || 800} USD
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-muted-foreground">Best Time to Visit</span>
                  <span className="font-semibold text-foreground">{destination.bestTimeToVisit || "November - February"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Popularity Score</span>
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>{destination.popularity || 75}%</span>
                  </div>
                </div>
              </div>
            </div>

            {tags.length > 0 && (
              <div className="form-card bg-card border border-border p-6 rounded-xl shadow-sm space-y-3">
                <h3 className="font-heading font-semibold text-lg text-card-foreground">Travel Styles</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (POIs/Tabs) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="flex border-b border-border bg-muted/20">
                <button onClick={() => setActiveTab("attractions")} className={tabClass("attractions")}>
                  <Compass className="h-4 w-4 inline mr-1.5" />
                  Attractions ({activities.length})
                </button>
                <button onClick={() => setActiveTab("hotels")} className={tabClass("hotels")}>
                  <Hotel className="h-4 w-4 inline mr-1.5" />
                  Hotels ({hotels.length})
                </button>
                <button onClick={() => setActiveTab("restaurants")} className={tabClass("restaurants")}>
                  <Utensils className="h-4 w-4 inline mr-1.5" />
                  Restaurants ({restaurants.length})
                </button>
              </div>

              <div className="p-6">
                {activeTab === "attractions" && (
                  <div className="space-y-4">
                    <h3 className="font-heading font-semibold text-lg mb-3">Popular Attractions</h3>
                    {activities.length > 0 ? (
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activities.map((item, idx) => (
                          <li key={idx} className="flex gap-3 items-start p-3 border border-border rounded-lg bg-muted/10 hover:bg-muted/20 transition-all duration-300">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="font-semibold text-sm text-foreground">{item}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">Sightseeing & Exploration</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm">No attractions found. Generate itinerary with AI to discover places.</p>
                    )}
                  </div>
                )}

                {activeTab === "hotels" && (
                  <div className="space-y-4">
                    <h3 className="font-heading font-semibold text-lg mb-3">Recommended Places to Stay</h3>
                    {hotels.length > 0 ? (
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hotels.map((item, idx) => (
                          <li key={idx} className="flex gap-3 items-start p-3 border border-border rounded-lg bg-muted/10 hover:bg-muted/20 transition-all duration-300">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                              🏨
                            </span>
                            <div>
                              <p className="font-semibold text-sm text-foreground">{item}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">Hotel / Resort住宿</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm">No hotel recommendations found yet.</p>
                    )}
                  </div>
                )}

                {activeTab === "restaurants" && (
                  <div className="space-y-4">
                    <h3 className="font-heading font-semibold text-lg mb-3">Local Dining & Street Food</h3>
                    {restaurants.length > 0 ? (
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {restaurants.map((item, idx) => (
                          <li key={idx} className="flex gap-3 items-start p-3 border border-border rounded-lg bg-muted/10 hover:bg-muted/20 transition-all duration-300">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                              🍽️
                            </span>
                            <div>
                              <p className="font-semibold text-sm text-foreground">{item}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">Gastronomy / Culinary</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm">No dining recommendations found yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
