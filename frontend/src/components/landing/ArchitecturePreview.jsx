"use client"

/**
 * ArchitecturePreview — lightweight HTML/CSS diagram (no app logic) linking to ARCHITECTURE.md on GitHub.
 */
import { ExternalLink } from "lucide-react"
import { LandingSection, GlassCard } from "./LandingSection"
import { GITHUB_URL } from "../../constants/landing"

const NODES = [
  { id: "spa", label: "React SPA", sub: "Vite · PWA", x: "8%", y: "28%" },
  { id: "api", label: "Express API", sub: "JWT · RBAC · Events", x: "38%", y: "28%" },
  { id: "mongo", label: "MongoDB", sub: "Atlas / local", x: "70%", y: "12%" },
  { id: "redis", label: "Redis", sub: "Cache · BullMQ · Socket", x: "70%", y: "48%" },
  { id: "s3", label: "AWS S3", sub: "Document vault", x: "70%", y: "78%" },
  { id: "ext", label: "AI · Maps · Weather", sub: "Providers", x: "38%", y: "72%" },
]

export default function ArchitecturePreview() {
  return (
    <LandingSection
      id="architecture"
      eyebrow="SYSTEM DESIGN"
      title="Everything connected behind the scenes."
      lead="Your trip may feel simple. A lot happens underneath to keep it that way."
      className="bg-[#F5EAEA] border-t border-[#DDD9D0]"
    >
      <div className="relative max-w-5xl mx-auto">
        <div className="bg-white border border-[#DDD9D0] rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
          
          <div className="flex flex-col items-center">
            {/* Node 1: Trippy App */}
            <div className="w-full max-w-xs rounded-2xl border-2 border-[#E86F3D] bg-[#F1ECE5] p-5 shadow-sm text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E86F3D]">Client View</span>
              <h4 className="text-lg font-bold text-[#171717] mt-1">TRIPPY APP</h4>
              <p className="text-xs text-[#596273] mt-1">React · Vite · PWA</p>
            </div>

            {/* Vertical Flow Line */}
            <div className="h-10 w-0.5 bg-[#E86F3D] relative my-2">
              <div className="absolute -bottom-1 -left-1 text-[#E86F3D] text-xs">▼</div>
            </div>

            {/* Node 2: Express API */}
            <div className="w-full max-w-xs rounded-2xl border border-[#DDD9D0] bg-[#F7F5F0] p-5 shadow-sm text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#596273]">Application Router</span>
              <h4 className="text-lg font-bold text-[#171717] mt-1">EXPRESS API</h4>
              <p className="text-xs text-[#596273] mt-1">JWT · RBAC · Events</p>
            </div>

            {/* Vertical Split Connector */}
            <div className="h-8 w-0.5 bg-[#DDD9D0] relative my-2">
              <div className="absolute -bottom-1 -left-1 text-[#596273] text-xs">▼</div>
            </div>

            {/* Bottom Row - Connected Components Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full mt-2">
              
              {/* MongoDB */}
              <div className="rounded-xl border border-[#DDD9D0] bg-white p-4 shadow-sm text-center">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#E86F3D]">Primary Database</span>
                <h5 className="text-sm font-bold text-[#171717] mt-1">MONGODB</h5>
                <p className="text-[11px] text-[#596273] mt-0.5">Trips · Users · Bookings</p>
              </div>

              {/* Redis */}
              <div className="rounded-xl border border-[#DDD9D0] bg-white p-4 shadow-sm text-center">
                <span className="text-[9px] font-bold uppercase tracking-widest text-blue-600">Cache & Queue</span>
                <h5 className="text-sm font-bold text-[#171717] mt-1">REDIS</h5>
                <p className="text-[11px] text-[#596273] mt-0.5">Cache · BullMQ · Realtime</p>
              </div>

              {/* AWS S3 */}
              <div className="rounded-xl border border-[#DDD9D0] bg-white p-4 shadow-sm text-center">
                <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600">Storage</span>
                <h5 className="text-sm font-bold text-[#171717] mt-1">AWS S3</h5>
                <p className="text-[11px] text-[#596273] mt-0.5">Travel documents</p>
              </div>

              {/* AI & Services */}
              <div className="rounded-xl border border-[#DDD9D0] bg-white p-4 shadow-sm text-center">
                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">APIs</span>
                <h5 className="text-sm font-bold text-[#171717] mt-1">INTELLIGENCE</h5>
                <p className="text-[11px] text-[#596273] mt-0.5">AI · Maps · Weather</p>
              </div>

            </div>

          </div>

        </div>

        {/* Footer Link section */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#DDD9D0] px-5 py-4 mt-6">
          <p className="text-sm text-[#596273]">System overview details are documented and kept in the repository.</p>
          <a
            href={`${GITHUB_URL}/blob/main/ARCHITECTURE.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E86F3D] hover:underline"
          >
            Open ARCHITECTURE.md
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </LandingSection>
  )
}
