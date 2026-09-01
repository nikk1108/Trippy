"use client"

/** SecurityHighlights — JWT, RBAC, rate limiting, Helmet */
import { Shield, KeyRound, Gauge, Lock } from "lucide-react"
import { LandingSection, GlassCard } from "./LandingSection"
import { SECURITY_ITEMS } from "../../constants/landing"

const ICONS = [KeyRound, Shield, Gauge, Lock]

export default function SecurityHighlights() {
  return (
    <LandingSection
      id="security"
      eyebrow="SECURITY & ACCESS"
      title="Your plans belong to you."
      lead="Security and access controls are built into the platform instead of added as an afterthought."
      className="bg-[#F1ECE5] border-t border-[#DDD9D0]"
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SECURITY_ITEMS.map((item, i) => {
          const Icon = ICONS[i] || Shield
          return (
            <li key={item.title}>
              <div className="h-full rounded-2xl border border-[#DDD9D0] bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <span className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-heading text-base font-bold text-[#171717]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[#596273] leading-relaxed">
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
