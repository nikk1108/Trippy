"use client"

export default function TestimonialsSection() {
  const testimonials = [
    {
      headline: "A trip that felt effortless",
      quote: "We usually spend more time planning than travelling. Trippy helped us turn a rough idea into an itinerary we could actually follow.",
      author: "Ananya",
      location: "Jaipur",
    },
    {
      headline: "Found places we would've missed",
      quote: "The best part wasn't the itinerary itself. It was discovering smaller places and experiences we wouldn't have found while planning on our own.",
      author: "Arjun",
      location: "Mumbai",
    },
    {
      headline: "Everything finally in one place",
      quote: "Flights, stays, activities and our daily plan were scattered everywhere before. Having everything around one trip made travelling with friends so much easier.",
      author: "Kavya",
      location: "Bengaluru",
    },
    {
      headline: "Changed plans without starting over",
      quote: "Our plans changed twice during the trip. Instead of rebuilding everything, we just adjusted the itinerary and kept going.",
      author: "Rohan",
      location: "Delhi",
    },
    {
      headline: "Planning became part of the fun",
      quote: "I started with only a destination in mind. Within a few minutes I had places to explore, things to do, and a trip that actually felt like mine.",
      author: "Sara",
      location: "Goa",
    },
  ]

  return (
    <section className="bg-[#F5EAEA] py-20 md:py-28 border-t border-[#DDD9D0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
          
          {/* Left Column: Sticky Headings */}
          <div className="lg:sticky lg:top-24 text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#E86F3D]">TESTIMONIALS</span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#171717] mt-3 leading-tight">
              A different way of traveling.
            </h2>
            <p className="text-[#596273] mt-5 text-sm sm:text-base leading-relaxed max-w-sm">
              How Trippy helps travelers shape their plans, discover new paths, and travel with absolute peace of mind.
            </p>
          </div>

          {/* Right Column: Editorial Quote List */}
          <div className="space-y-8">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#DDD9D0] rounded-3xl p-6 sm:p-8 text-left shadow-sm hover:shadow-md transition-all duration-300"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E86F3D] block mb-2">
                  Voice {idx + 1}
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#171717] mb-3">
                  "{item.headline}"
                </h3>
                <blockquote className="text-sm sm:text-base text-[#596273] leading-relaxed mb-4 italic">
                  "{item.quote}"
                </blockquote>
                <cite className="not-italic text-xs font-semibold text-[#171717] block">
                  — {item.author}, {item.location}
                </cite>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
