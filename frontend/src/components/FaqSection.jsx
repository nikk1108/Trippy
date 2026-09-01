"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

const FAQ_ITEMS = [
  {
    q: "How do I start planning a trip with Trippy?",
    a: "Create a free account, open Create Itinerary, and add your destination, nights, and days. Fill hotels and activities—or use AI to suggest activities and enrich descriptions. Save when you are happy; you can browse and refine later from your itineraries list.",
  },
  {
    q: "Can Trippy build an itinerary for me?",
    a: "Yes! With our AI Planner, you can specify your destination, dates, and preferences, and it will instantly build a custom, day-by-day itinerary with activities and descriptions to kickstart your journey.",
  },
  {
    q: "Can I change my itinerary after saving it?",
    a: "Absolutely. You can edit any part of your saved itinerary at any time, adding days, rearranging activities, editing descriptions, or changing lodging details as your trip takes shape.",
  },
  {
    q: "Can I track bookings and expenses in the same trip?",
    a: "Yes, every trip has a built-in Finance tab to track your budget, log expenses in various currencies, and link flight, stay, and transit bookings directly to the trip workspace.",
  },
  {
    q: "Can Trippy help me discover where to go?",
    a: "Yes, you can browse popular recommendations and itineraries built by the community to get inspiration, explore routes, and save them directly to your personal workspace.",
  },
  {
    q: "What happens if my plans change?",
    a: "Since Trippy is a planning tool, you can easily rearrange days, drag and drop activities, and update details as your travel plans evolve. You have full edit access at all times.",
  },
  {
    q: "Does Trippy handle flights, hotels, and activities?",
    a: "Trippy helps you coordinate and organize details for flights, stays, and activities in one place, but you must complete bookings directly with the third-party providers.",
  },
  {
    q: "Are there any hidden charges?",
    a: "No, Trippy is free to use for planning. There are no hidden charges or fees inside the editor itself.",
  },
]

function FaqSection() {
  const [open, setOpen] = useState(0)

  const toggle = (i) => {
    setOpen((prev) => (prev === i ? -1 : i))
  }

  return (
    <section className="bg-[#F0F1F2] py-20 md:py-28 border-t border-[#DDD9D0]">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#E86F3D]">COMMON INQUIRIES</span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#171717] mt-3">
            Questions before you go?
          </h2>
          <p className="text-[#596273] mt-4 text-base sm:text-lg">
            Planning should feel simpler. Here are the answers to the things travelers usually want to know.
          </p>
        </div>

        {/* Blush Editorial Accordion Container */}
        <div className="rounded-3xl border border-[#DDD9D0] bg-[#F5EAEA] p-4 sm:p-6 md:p-8 shadow-sm">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className="border-b border-[#DDD9D0]/65 last:border-0">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex w-full items-start justify-between gap-6 py-5 text-left transition sm:gap-8 sm:py-6"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-trigger-${i}`}
                >
                  <span className="font-heading text-base sm:text-lg font-bold text-[#171717]">
                    {item.q}
                  </span>
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#DDD9D0] bg-white text-[#171717] shadow-sm">
                    {isOpen ? <Minus className="h-4 w-4" strokeWidth={2.5} aria-hidden /> : <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />}
                  </span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  className={`grid min-h-0 transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="text-sm text-[#596273] pb-6 leading-relaxed max-w-3xl">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FaqSection
