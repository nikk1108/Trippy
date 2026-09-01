"use client"

import { useEffect, useState } from "react"
import { Radio, AlertTriangle, Zap } from "lucide-react"
import { adminAPI } from "../../services/api"

export default function AdminEvents() {
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = () =>
      adminAPI
        .events()
        .then((res) => {
          if (!cancelled) setData(res.data?.data)
        })
        .catch((err) => {
          if (!cancelled) setError(err.response?.data?.message || err.message)
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })

    load()
    const id = setInterval(load, 8000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  if (loading && !data) return <p className="text-sm text-[#596273]">Loading events…</p>
  if (error && !data) return <p className="text-sm text-red-600">{error}</p>

  const totals = data?.totals || {}
  const top = data?.topEventTypes || []
  const recent = data?.recentEvents || []
  const failed = data?.failedEvents || []
  const maxPub = Math.max(1, ...top.map((t) => t.published || 0))

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-serif text-3xl text-[#172033]">Domain Events</h2>
        <p className="mt-1 text-sm text-[#596273]">Live EventBus throughput, failures, and recent publishes</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Published" value={totals.published} icon={Zap} />
        <Stat label="Events / min" value={data?.eventsPerMinute} icon={Radio} />
        <Stat label="Failed" value={totals.failures} icon={AlertTriangle} accent="amber" />
        <Stat label="Duplicates skipped" value={totals.duplicates} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#172033]">Top event types</h3>
          <ul className="mt-4 space-y-3">
            {top.length === 0 ? (
              <li className="text-sm text-[#596273]">No events yet — use the app to generate traffic</li>
            ) : (
              top.map((row) => (
                <li key={row.eventName}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-[#172033]">{row.eventName}</span>
                    <span className="tabular-nums text-[#596273]">{row.published}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#FBF9F5] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#E86F3D] transition-all duration-500"
                      style={{ width: `${((row.published || 0) / maxPub) * 100}%` }}
                    />
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#172033]">Failed events</h3>
          <ul className="mt-4 space-y-3 max-h-72 overflow-auto">
            {failed.length === 0 ? (
              <li className="text-sm text-[#596273]">No subscriber failures</li>
            ) : (
              failed.map((row, i) => (
                <li key={`${row.eventId}-${i}`} className="border-b border-border pb-2 last:border-0">
                  <p className="text-sm font-medium text-[#172033]">
                    {row.eventName} · {row.subscriber}
                  </p>
                  <p className="text-xs text-red-600/90 break-all">{row.message}</p>
                  <p className="text-[10px] text-[#596273] mt-0.5">{row.at}</p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[#172033]">Recent events</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-[#596273] border-b border-border">
              <tr>
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Event</th>
                <th className="py-2 pr-4">Source</th>
                <th className="py-2 pr-4">User</th>
                <th className="py-2">ms</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-[#596273]">
                    Waiting for publishes…
                  </td>
                </tr>
              ) : (
                recent.map((row) => (
                  <tr key={row.eventId} className="border-b border-slate-50">
                    <td className="py-2 pr-4 text-xs text-[#596273] whitespace-nowrap">
                      {row.publishedAt ? new Date(row.publishedAt).toLocaleTimeString() : "—"}
                    </td>
                    <td className="py-2 pr-4 font-medium">{row.eventName}</td>
                    <td className="py-2 pr-4 text-xs text-[#596273]">{row.source || "—"}</td>
                    <td className="py-2 pr-4 text-xs font-mono text-[#596273] truncate max-w-[8rem]">
                      {row.userId || "—"}
                    </td>
                    <td className="py-2 tabular-nums text-[#596273]">{row.ms ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value, icon: Icon, accent }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-[#596273]">{label}</p>
          <p
            className={`mt-2 text-3xl font-semibold tabular-nums ${
              accent === "amber" ? "text-amber-700" : "text-[#172033]"
            }`}
          >
            {value ?? 0}
          </p>
        </div>
        {Icon ? (
          <span className="rounded-xl bg-[#FBF9F5] p-2.5 text-[#596273]">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </div>
    </div>
  )
}
