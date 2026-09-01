"use client"

/**
 * LandingHero — SaaS-first viewport: brand, one headline, support line, CTA group.
 * Full-bleed atmospheric background; no cards or stats in the hero.
 */
import { Link } from "react-router-dom"
import { ArrowRight, Github, Play } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import HeroBackground from "../home/HeroBackground"
import ThemeToggle from "./ThemeToggle"
import { DEMO_PATH, GITHUB_URL } from "../../constants/landing"

const GUARD_MESSAGE = "Please login to access this feature"

const guardLogin = (pathname, search = "") => ({
  pathname: "/login",
  state: { from: { pathname, search }, message: GUARD_MESSAGE },
})

export default function LandingHero() {
  const { isAuthenticated } = useAuth()
  const demoTo = isAuthenticated ? DEMO_PATH : guardLogin(DEMO_PATH)
  const startTo = isAuthenticated ? "/ai-itinerary" : guardLogin("/ai-itinerary")
  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative -mt-14 md:-mt-16 overflow-hidden bg-[#F1ECE5] min-h-[90vh] flex items-center py-12 md:py-20 border-b border-[#DDD9D0]">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="text-left flex flex-col justify-center">
              <span className="inline-flex text-[11px] font-bold uppercase tracking-[0.25em] text-[#E86F3D] mb-4">
                TRIPPY · YOUR TRAVEL COMPANION
              </span>

              <h1 className="type-display text-4xl sm:text-5xl lg:text-[4rem] leading-[1.08] mb-6 text-[#171717] font-semibold">
                Go further. Plan smarter.
                <span className="block mt-2 text-[#E86F3D] font-serif italic font-normal text-3xl sm:text-4xl lg:text-5xl">
                  Remember everything.
                </span>
              </h1>

              <p className="type-lead max-w-lg mb-8 text-[#596273] text-base sm:text-lg leading-relaxed">
                From the first idea to the journey home, Trippy brings your plans, places, bookings, budgets, and discoveries together in one calm travel workspace.
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  to={startTo}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E86F3D] px-7 py-4 text-sm font-semibold text-white shadow-md hover:bg-[#D05C2B] transition-colors"
                >
                  Plan my trip
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  to="/itineraries"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDD9D0] bg-white px-7 py-4 text-sm font-semibold text-[#171717] hover:bg-[#F0EEE8] transition-colors shadow-sm"
                >
                  Explore trips
                </Link>
              </div>
            </div>

            {/* Right Column: Contained photo and metadata outside the frame */}
            <div className="relative hidden lg:flex flex-col items-center">
              <div className="relative rounded-[2rem] overflow-hidden border border-[#DDD9D0] bg-white p-3 shadow-[0_12px_40px_rgba(23,32,51,0.06)]">
                <img
                  src="/trippy-hero.png"
                  alt="Cinematic mountaineering landscape"
                  className="rounded-[1.5rem] object-cover h-[26rem] w-[20rem] aspect-[3/4]"
                  loading="eager"
                />
              </div>

              {/* Contained metadata tags around/under the image container */}
              <div className="mt-4 flex flex-wrap justify-center gap-2.5 max-w-sm">
                <span className="px-3.5 py-1.5 bg-white border border-[#DDD9D0] text-xs font-semibold text-[#171717] rounded-full shadow-sm">
                  ⏱️ 7 days · Himachal
                </span>
                <span className="px-3.5 py-1.5 bg-white border border-[#DDD9D0] text-xs font-semibold text-[#E86F3D] rounded-full shadow-sm">
                  💳 ₹32,400 estimated
                </span>
                <span className="px-3.5 py-1.5 bg-white border border-[#DDD9D0] text-xs font-semibold text-[#171717] rounded-full shadow-sm">
                  📍 12 places saved
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED JOURNEY SECTION */}
      <section className="relative py-20 md:py-28 bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
            {/* Large Cinematic Travel Photo */}
            <div className="relative rounded-[2rem] overflow-hidden border border-[#DDD9D0] bg-white p-3 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1400&q=80"
                alt="Slow travel escape coastal view"
                className="rounded-[1.5rem] w-full h-[24rem] md:h-[28rem] object-cover"
                loading="lazy"
              />
              <span className="absolute top-6 left-6 inline-flex rounded-full bg-white/90 border border-[#DDD9D0] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#E86F3D] shadow-sm">
                Featured escape
              </span>
            </div>

            {/* Editorial Information Panel beside/below */}
            <div className="text-left bg-white border border-[#DDD9D0] rounded-[2rem] p-8 md:p-10 shadow-sm">
              <div className="flex flex-wrap gap-2.5 mb-6">
                <span className="px-3.5 py-1 bg-[#F1ECE5] border border-[#DDD9D0] text-[#171717] text-xs rounded-full font-bold uppercase tracking-wider">
                  Himachal · 6 days
                </span>
                <span className="px-3.5 py-1 bg-[#F5EAEA] border border-[#DDD9D0] text-[#E86F3D] text-xs rounded-full font-bold uppercase tracking-wider">
                  Slow travel
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl leading-tight mb-4 text-[#171717] font-semibold">
                Your next story starts somewhere.
              </h2>
              
              <p className="text-sm text-[#596273] leading-relaxed mb-6">
                Discover places worth slowing down for, then turn inspiration into a day-by-day plan.
              </p>

              <Link
                to={startTo}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#E86F3D] hover:text-[#D05C2B] uppercase tracking-widest border-b border-[#E86F3D]/30 pb-0.5"
              >
                Begin planning escape
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
