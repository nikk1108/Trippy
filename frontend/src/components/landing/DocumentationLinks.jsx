"use client"

import { BookOpen, ExternalLink } from "lucide-react"
import { resolveApiBaseUrl } from "../../apiBaseUrl.helper.js"
import { GITHUB_URL } from "../../constants/landing"

function swaggerHref() {
  const api = resolveApiBaseUrl(import.meta.env.VITE_API_URL, {
    isDev: import.meta.env.DEV,
  })
  return `${api.replace(/\/api\/?$/, "")}/docs`
}

export default function DocumentationLinks() {
  const links = [
    { title: "README", href: GITHUB_URL + "#readme" },
    { title: "Architecture", href: GITHUB_URL + "/blob/main/ARCHITECTURE.md" },
    { title: "Testing", href: GITHUB_URL + "/blob/main/TESTING.md" },
    { title: "Security", href: GITHUB_URL + "/blob/main/SECURITY.md" },
    { title: "Swagger", href: swaggerHref() },
  ]

  return (
    <section id="docs" className="bg-[#F0F1F2] py-8 border-t border-[#DDD9D0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#E86F3D]/10 text-[#E86F3D]">
              <BookOpen className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#171717]">
              SYSTEM RESOURCE STRIP
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-[#596273]">
            {links.map((link, idx) => (
              <span key={link.title} className="flex items-center gap-5">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E86F3D] transition-colors inline-flex items-center gap-1"
                >
                  {link.title}
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
                {idx < links.length - 1 && (
                  <span className="text-[#DDD9D0] font-normal" aria-hidden>·</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}
