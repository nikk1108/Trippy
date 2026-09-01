"use client"

import { lazy, Suspense, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MapPin, Plus, Star, ArrowRight } from "lucide-react"
import { recommendationAPI } from "../services/api"
import { useAuth } from "../context/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import DestinationHeroImage from "../components/DestinationHeroImage"
import { SeoHead, LandingHero } from "../components/landing"

const FeatureShowcase = lazy(() => import("../components/landing/FeatureShowcase"))
const TechStackSection = lazy(() => import("../components/landing/TechStackSection"))
const ArchitecturePreview = lazy(() => import("../components/landing/ArchitecturePreview"))
const ScreenshotGallery = lazy(() => import("../components/landing/ScreenshotGallery"))
const OpsExcellenceSection = lazy(() => import("../components/landing/OpsExcellenceSection"))
const SecurityHighlights = lazy(() => import("../components/landing/SecurityHighlights"))
const DocumentationLinks = lazy(() => import("../components/landing/DocumentationLinks"))
const HowItWorksSection = lazy(() => import("../components/home/HowItWorksSection"))
const MemoriesMadeSection = lazy(() => import("../components/MemoriesMadeSection"))
const TestimonialsSection = lazy(() => import("../components/TestimonialsSection"))
const FaqSection = lazy(() => import("../components/FaqSection"))

const GUARD_MESSAGE = "Please login to access this feature"

const guardLogin = (pathname, search = "") => ({
  pathname: "/login",
  state: {
    from: { pathname, search },
    message: GUARD_MESSAGE,
  },
})

function SectionFallback() {
  return (
    <div className="flex justify-center py-16 text-sm text-muted-foreground" aria-hidden>
      Loading…
    </div>
  )
}

const Home = () => {
  const { isAuthenticated } = useAuth()
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDestinations = async () => {
    try {
      setError(null)
      const response = await recommendationAPI.getDestinations()
      setDestinations(response.data.data.slice(0, 6))
    } catch (err) {
      console.error("Error fetching destinations:", err)
      setError("Failed to load destinations. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDestinations()
  }, [])

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <SeoHead />
      <LandingHero />

      <Suspense fallback={<SectionFallback />}>
        <FeatureShowcase />
      </Suspense>

      {/* 4. TRAVEL EXPERIENCES */}
      <section className="relative py-20 md:py-28 bg-[#F5EAEA] border-t border-[#DDD9D0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#E86F3D]">EXPERIENCES</span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#171717] mt-3">
              Travel looks different for everyone.
            </h2>
            <p className="text-[#596273] mt-4 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Maybe it's a quiet beach, a crowded old city, a road through the mountains, or a table you found by accident. Trippy helps you plan around the way you actually want to travel.
            </p>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-start">
            {[
              { label: "Mountains", img: "photo-1506905925346-21bda4d32df4", aspect: "aspect-[3/4]" },
              { label: "Beaches", img: "photo-1512343879784-a960bf40e7f2", aspect: "aspect-[2/3] lg:mt-8" },
              { label: "Cities", img: "photo-1558618666-fcd25c85cd64", aspect: "aspect-[4/5]" },
              { label: "Food", img: "photo-1570168007204-dfb528c6958f", aspect: "aspect-[3/4] lg:mt-4" },
              { label: "Wildlife", img: "photo-1470071459604-3b5ec3a7fe05", aspect: "aspect-[2/3]" },
              { label: "History", img: "photo-1626621341517-bbf3d9990a23", aspect: "aspect-[4/5] lg:mt-6" }
            ].map((exp, idx) => (
              <div key={idx} className={`group relative rounded-2xl overflow-hidden border border-[#DDD9D0] bg-white p-2 shadow-sm hover:shadow-md transition-all duration-300 ${exp.aspect}`}>
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <img
                    src={`https://images.unsplash.com/${exp.img}?auto=format&fit=crop&w=400&q=80`}
                    alt={exp.label}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/90 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-4 left-4 text-sm font-semibold text-white tracking-wide">
                    {exp.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<SectionFallback />}>
        <TechStackSection />
        <ArchitecturePreview />
        <ScreenshotGallery />
        <OpsExcellenceSection />
        <SecurityHighlights />
        <DocumentationLinks />
        <HowItWorksSection />
        <MemoriesMadeSection />
      </Suspense>

      {/* 12. POPULAR DESTINATIONS */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-[#F0F1F2] border-t border-[#DDD9D0]">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#E86F3D]">POPULAR DESTINATIONS</span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#171717] mt-3">
              Places worth going out of your way for
            </h2>
            <p className="text-[#596273] mt-4 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Find inspiration for your next escape, from quiet mountain towns to sun-soaked coastlines.
            </p>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" text="Loading destinations..." />
          ) : error ? (
            <ErrorMessage title="Failed to load destinations" message={error} onRetry={fetchDestinations} />
          ) : destinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((destination, index) => (
                <div
                  key={index}
                  className="bg-white border border-[#DDD9D0] rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 animate-slide-up group p-2.5"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative rounded-xl overflow-hidden">
                    <DestinationHeroImage
                      destination={destination.destination}
                      title={destination.title || destination.destination}
                      tags={destination.tags ?? []}
                      coverImage={destination.coverImage}
                      heightClass="h-48"
                      roundedClass="rounded-xl"
                      badge={
                        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/95 border border-[#DDD9D0] text-[#171717] px-3 py-1 text-xs font-semibold shadow-sm">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{destination.itineraryCount}</span>
                        </div>
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/60 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="p-5">
                    <h3 className="font-heading font-bold text-xl text-[#171717] mb-2">
                      {destination.destination}
                    </h3>
                    <div className="mb-5">
                      <p className="text-sm text-[#596273] mb-3">
                        {destination.nightRange.min} - {destination.nightRange.max} nights available
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(destination.tags ?? []).slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2.5 py-1 bg-[#F1ECE5] text-[#171717] text-xs rounded-full border border-[#DDD9D0]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      to={
                        isAuthenticated
                          ? `/recommendations?destination=${encodeURIComponent(destination.destination)}`
                          : guardLogin(
                              "/recommendations",
                              `?destination=${encodeURIComponent(destination.destination)}`,
                            )
                      }
                      className="text-[#E86F3D] hover:text-[#D05C2B] font-bold text-sm flex items-center group uppercase tracking-wider"
                    >
                      View Itineraries
                      <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white border border-[#DDD9D0] rounded-2xl max-w-lg mx-auto p-8 shadow-sm">
              <MapPin className="h-12 w-12 text-[#E86F3D] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#171717] mb-2">Your next destination is waiting.</h3>
              <p className="type-body text-[#596273] text-sm">Explore curated travel ideas and turn the one that catches your eye into a plan.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to={isAuthenticated ? "/recommendations" : guardLogin("/recommendations")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#171717] hover:bg-[#171717]/90 px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-colors"
            >
              View All Destinations
              <ArrowRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      <Suspense fallback={<SectionFallback />}>
        <TestimonialsSection />
        <FaqSection />
      </Suspense>

      {/* 15. FINAL CTA */}
      <section className="relative py-28 md:py-36 overflow-hidden flex items-center justify-center isolate border-t border-[#DDD9D0]">
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=80"
            alt="Scenic travel landscape map"
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        </div>
        <div aria-hidden className="absolute inset-0 z-[1] bg-[#172033]/70" />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6 text-white leading-tight">
            Your next adventure is closer than it looks.
          </h2>
          <p className="text-lg mb-10 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Choose a place. Tell Trippy how you like to travel. We'll help you turn the idea into a plan.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/create" : guardLogin("/create")}
              className="bg-[#E86F3D] text-white hover:bg-[#D05C2B] px-8 py-4 rounded-xl font-semibold transition-all duration-200 inline-flex items-center shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Start planning
            </Link>
            <Link
              to="/itineraries"
              className="bg-white text-[#172033] hover:bg-[#F0EEE8] px-8 py-4 rounded-xl font-semibold transition-all duration-200 inline-flex items-center shadow-lg"
            >
              Explore destinations
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
