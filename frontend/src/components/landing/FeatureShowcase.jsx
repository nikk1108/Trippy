"use client"

/**
 * FeatureShowcase — grid of product capabilities with glass cards + lazy icons.
 */
import { Link } from "react-router-dom"
import {
  Sparkles,
  Bot,
  Wallet,
  Ticket,
  Plane,
  Map,
  CloudSun,
  FileLock2,
  Bell,
  BarChart3,
  ArrowUpRight,
} from "lucide-react"
import { LandingSection, GlassCard } from "./LandingSection"
import { LANDING_FEATURES } from "../../constants/landing"
import { useAuth } from "../../context/AuthContext"

const ICONS = {
  Sparkles,
  Bot,
  Wallet,
  Ticket,
  Plane,
  Map,
  CloudSun,
  FileLock2,
  Bell,
  BarChart3,
}

const GUARD_MESSAGE = "Please login to access this feature"
const guardLogin = (pathname) => ({
  pathname: "/login",
  state: { from: { pathname }, message: GUARD_MESSAGE },
})

export default function FeatureShowcase() {
  const { isAuthenticated } = useAuth()

  const guardLogin = (pathname) => ({
    pathname: "/login",
    state: { from: { pathname }, message: GUARD_MESSAGE },
  })

  return (
    <LandingSection
      id="features"
      eyebrow="PRODUCT FEATURES"
      title="Everything your trip needs."
      lead="From the first idea to the journey home, keep the important parts of your trip in one place."
      className="bg-[#F7F5F0] border-t border-[#DDD9D0]"
    >
      <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {LANDING_FEATURES.map((f, i) => {
          const Icon = ICONS[f.icon] || Sparkles
          const to = isAuthenticated ? f.to : guardLogin(f.to)

          return (
            <li
              key={f.id}
              className="landing-rise rounded-2xl border border-[#DDD9D0] bg-white p-6 shadow-sm hover:shadow-md hover:border-[#E86F3D]/30 transition-all duration-300 flex flex-col justify-between h-full"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <Link
                to={to}
                className="group flex flex-col h-full justify-between focus:outline-none"
              >
                <div>
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#E86F3D]/10 text-[#E86F3D]">
                    <Icon className="h-5.5 w-5.5" aria-hidden />
                  </span>
                  <h3 className="flex items-center gap-1.5 font-heading text-base font-bold text-[#171717]">
                    {f.title}
                    <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 text-[#E86F3D]" aria-hidden />
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#596273]">
                    {f.description}
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </LandingSection>
  )
}
