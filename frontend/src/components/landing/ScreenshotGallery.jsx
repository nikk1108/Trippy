"use client"

/**
 * ScreenshotGallery — responsive lazy-loaded image gallery (decorative product shots).
 */
import { useState } from "react"
import { LandingSection, GlassCard } from "./LandingSection"
import { SCREENSHOTS } from "../../constants/landing"

export default function ScreenshotGallery() {
  const [active, setActive] = useState(SCREENSHOTS[0]?.id)
  const current = SCREENSHOTS.find((s) => s.id === active) || SCREENSHOTS[0]

  return (
    <LandingSection
      id="screens"
      eyebrow="PRODUCT TOUR"
      title="See the journey before you take it."
      lead="From searching for inspiration to checking your final itinerary, Trippy keeps every part of the trip close at hand."
      className="bg-[#F0F1F2] border-t border-[#DDD9D0]"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Large Image Preview Panel */}
        <div className="bg-white border border-[#DDD9D0] rounded-3xl p-3 shadow-md">
          <figure className="rounded-2xl overflow-hidden bg-[#F7F5F0]">
            <img
              key={current.id}
              src={current.src}
              alt={current.alt}
              className="aspect-[16/10] w-full object-cover rounded-2xl"
              loading="lazy"
            />
            <figcaption className="p-6 border-t border-[#DDD9D0]/50">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E86F3D]">Active View</span>
              <h3 className="font-heading text-xl font-bold text-[#171717] mt-1">{current.title}</h3>
              <p className="text-sm text-[#596273] mt-1">{current.caption}</p>
            </figcaption>
          </figure>
        </div>

        {/* Thumbnail Selector list */}
        <ul className="flex gap-4 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible" aria-label="Gallery thumbnails">
          {SCREENSHOTS.map((shot) => {
            const selected = shot.id === active
            return (
              <li key={shot.id} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => setActive(shot.id)}
                  aria-pressed={selected}
                  className={`w-44 lg:w-full overflow-hidden rounded-2xl border text-left transition-all p-2 bg-white ${
                    selected
                      ? "border-[#E86F3D] ring-2 ring-[#E86F3D]/25"
                      : "border-[#DDD9D0] hover:border-[#E86F3D]/50"
                  }`}
                >
                  <img
                    src={`${shot.src}`}
                    alt=""
                    className="aspect-video w-full object-cover rounded-xl"
                    loading="lazy"
                  />
                  <span className="block truncate px-1 py-2 text-xs font-bold text-[#171717] tracking-wide">{shot.title}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </LandingSection>
  )
}
