"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Sparkles, ArrowRight, MapPin, Star } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import HeroBackground from "./HeroBackground"

const GUARD_MESSAGE = "Please login to access this feature"

const guardLogin = (pathname, search = "") => ({
  pathname: "/login",
  state: { from: { pathname, search }, message: GUARD_MESSAGE },
})

const FLOATING_DESTINATIONS = [
  { place: "Goa", nights: "5 nights", rating: "4.8" },
  { place: "Manali", nights: "4 nights", rating: "4.9" },
  { place: "Jaipur", nights: "3 nights", rating: "4.7" },
]

function FloatingCard({ place, nights, rating, className = "", style }) {
  return (
    <div
      style={style}
      className={`rounded-2xl border border-white/80 bg-card/95 backdrop-blur-md px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-card/90 ${className}`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MapPin className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{place}</p>
          <p className="text-xs text-muted-foreground">{nights}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
        {rating}
      </div>
    </div>
  )
}

export default function HomeHero() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")

  const submitSearch = (e) => {
    e?.preventDefault()
    const q = query.trim()
    if (!q) return
    if (!isAuthenticated) {
      navigate(guardLogin("/itineraries", `?search=${encodeURIComponent(q)}`))
      return
    }
    navigate(`/itineraries?search=${encodeURIComponent(q)}`)
  }

  return (
    <section className="relative -mt-14 md:-mt-16 overflow-hidden bg-[#F1ECE5] min-h-[90vh] flex items-center py-12 md:py-20">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
          {/* Left Column: Branding, Typography, Search Form */}
          <div className="text-left flex flex-col justify-center">
            <span
              className="hero-enter-fade inline-flex text-xs uppercase tracking-[0.25em] text-[#E86F3D] font-bold mb-4"
              style={{ animationDelay: "0.05s" }}
            >
              Trippy Travel Companion
            </span>

            <h1
              className="hero-enter-fade type-display text-4xl sm:text-5xl lg:text-[3.85rem] leading-[1.1] mb-6 text-[#172033]"
              style={{ animationDelay: "0.12s" }}
            >
              Go somewhere worth remembering.
              <span className="block mt-2 text-[#E86F3D] font-serif italic font-normal text-3xl sm:text-4xl lg:text-5xl">
                Plan less. Experience more.
              </span>
            </h1>

            <p
              className="hero-enter-fade type-lead max-w-lg mb-8 text-[#596273] text-base leading-relaxed"
              style={{ animationDelay: "0.2s" }}
            >
              Trippy brings inspiring destinations directly to you, making it simple to create calm, structured day-by-day itineraries tailored to your rhythm.
            </p>

            <div className="hero-enter-slide max-w-lg" style={{ animationDelay: "0.28s" }}>
              <form
                onSubmit={submitSearch}
                className="ui-pill-field bg-white border border-[#DDD9D0] p-1.5 shadow-[0_8px_30px_rgba(23,32,51,0.06)]"
                role="search"
              >
                <div className="flex flex-1 items-center gap-2 pl-3 min-w-0">
                  <Search className="h-4 w-4 text-[#596273] shrink-0" aria-hidden />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Where do you want to go next?"
                    className="ui-pill-input py-2 bg-transparent text-[#172033] placeholder:text-[#596273]"
                    aria-label="Search destinations and itineraries"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 shrink-0 rounded-full bg-[#172033] hover:bg-[#172033]/90 px-6 py-2.5 text-sm font-semibold text-white transition-colors"
                >
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            <p
              className="hero-enter-fade mt-5 text-sm text-[#596273]"
              style={{ animationDelay: "0.36s" }}
            >
              {isAuthenticated ? (
                <>
                  <Link to="/ai-itinerary" className="text-[#E86F3D] hover:underline font-semibold">
                    Plan with AI
                  </Link>
                  <span className="mx-2 text-[#DDD9D0]">·</span>
                  <Link to="/itineraries" className="text-[#E86F3D] hover:underline font-semibold">
                    Browse trips
                  </Link>
                </>
              ) : (
                <>
                  <Link to={guardLogin("/ai-itinerary")} className="text-[#E86F3D] hover:underline font-semibold">
                    Plan with AI
                  </Link>
                  <span className="mx-2 text-[#DDD9D0]">·</span>
                  <Link to={guardLogin("/itineraries")} className="text-[#E86F3D] hover:underline font-semibold">
                    Browse trips
                  </Link>
                </>
              )}
            </p>
          </div>

          {/* Right Column: Premium Travel Image */}
          <div className="relative hidden lg:flex justify-end items-center h-full">
            <div className="relative rounded-[2.5rem] overflow-hidden border border-[#DDD9D0] bg-[#FFFFFF] p-3 shadow-[0_20px_50px_rgba(23,32,51,0.08)]">
              <img
                src="/trippy-hero.png"
                alt="Scenic travel photograph featuring nature trails and vintage details"
                className="rounded-[2rem] object-cover h-[28rem] xl:h-[32rem] w-full max-w-sm aspect-[3/4]"
                loading="eager"
              />
              <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-white/95 border border-[#DDD9D0]/50 p-4 shadow-lg backdrop-blur">
                <p className="text-[10px] font-bold text-[#E86F3D] uppercase tracking-widest">Aspirational Stays</p>
                <p className="text-sm font-semibold text-[#172033] mt-0.5">Mindful Alpine Escapes</p>
                <p className="text-xs text-[#596273] mt-0.5">Voted top destination experience this season.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
