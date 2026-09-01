"use client"

/** TechStackSection — technology chips with accessible color accents */
import { LandingSection, GlassCard } from "./LandingSection"
import { TECH_STACK } from "../../constants/landing"

export default function TechStackSection() {
  const categories = [
    {
      title: "Frontend",
      techs: ["React", "Vite", "PWA"],
      desc: "Responsive and lightweight SPA client layers.",
      bg: "bg-white",
    },
    {
      title: "Backend",
      techs: ["Node.js", "Express", "JWT", "RBAC"],
      desc: "Secure API controller and route logic.",
      bg: "bg-white",
    },
    {
      title: "Data",
      techs: ["MongoDB", "Redis"],
      desc: "Durable caching and object database.",
      bg: "bg-[#F5EAEA]/60",
    },
    {
      title: "Realtime & Jobs",
      techs: ["Socket.IO", "BullMQ"],
      desc: "Background tasks and realtime pushes.",
      bg: "bg-white",
    },
    {
      title: "Infrastructure",
      techs: ["Docker", "GitHub Actions", "AWS S3"],
      desc: "Reproducible containers and storage vaults.",
      bg: "bg-[#F0F1F2]/60",
    },
    {
      title: "Intelligence",
      techs: ["AI", "Maps", "Weather"],
      desc: "Context-aware external API integrations.",
      bg: "bg-[#F1ECE5]/80",
    },
  ]

  return (
    <LandingSection
      id="stack"
      eyebrow="TECHNOLOGY"
      title="Built for real journeys."
      lead="Under the calm interface is a production-ready stack designed to keep your trips responsive, connected, and reliable."
      className="bg-[#F1ECE5] border-t border-[#DDD9D0]"
    >
      <div className="relative">
        {/* Horizontal connector lines inside the grid */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#DDD9D0]/50 hidden lg:block -translate-y-1/2 pointer-events-none" />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
          {categories.map((cat, index) => (
            <div
              key={cat.title}
              className={`rounded-2xl border border-[#DDD9D0] p-6 shadow-sm hover:shadow-md transition-all duration-300 ${cat.bg} relative flex flex-col justify-between`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E86F3D]">
                  0{index + 1} · {cat.title}
                </span>
                <h3 className="text-xl font-semibold text-[#171717] mt-1.5 mb-1">
                  {cat.title} stack
                </h3>
                <p className="text-xs text-[#596273] mb-4">{cat.desc}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {cat.techs.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-white border border-[#DDD9D0] text-xs font-semibold text-[#171717] rounded-lg shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Decorative connector indicator */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-8 w-px bg-[#E86F3D]/30 hidden sm:block pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </LandingSection>
  )
}
