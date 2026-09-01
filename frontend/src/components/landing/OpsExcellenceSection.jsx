"use client"

/** OpsExcellenceSection — Redis, Docker, CI/CD, Playwright, Monitoring, S3 */
import { Database, Container, GitBranch, TestTube2, Activity, HardDrive, Server, Globe } from "lucide-react"
import { LandingSection, GlassCard } from "./LandingSection"
import { OPS_PILLARS } from "../../constants/landing"

const ICONS = { Database, Container, GitBranch, TestTube2, Activity, HardDrive, Server, Globe }

export default function OpsExcellenceSection() {
  return (
    <LandingSection
      id="performance"
      eyebrow="OPERATIONS"
      title="Quietly reliable when the details matter."
      lead="Our architectural choices mean your data is always safe and cached for lightning-fast responsiveness."
      className="bg-[#F7F5F0] border-t border-[#DDD9D0]"
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {OPS_PILLARS.map((item) => {
          const Icon = ICONS[item.icon] || Activity
          return (
            <li key={item.title}>
              <div className="h-full rounded-2xl border border-[#DDD9D0] bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#E86F3D]/10 text-[#E86F3D]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-heading text-base font-bold text-[#171717]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-[#596273] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </LandingSection>
  )
}
