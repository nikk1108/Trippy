"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertTriangle, RefreshCw, Shield, Users, Ban, Activity } from "lucide-react"
import { adminAPI } from "../../services/api"

export default function AdminSecurity() {
  const [data, setData] = useState(null)
  const [sessions, setSessions] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async ({ soft = false } = {}) => {
    if (soft) setRefreshing(true)
    else setLoading(true)
    setError("")
    try {
      const [sec, sess] = await Promise.all([
        adminAPI.security(),
        adminAPI.securitySessions({ limit: 40 }),
      ])
      setData(sec.data?.data ?? null)
      setSessions(sess.data?.data?.sessions || [])
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(() => load({ soft: true }), 15000)
    return () => clearInterval(id)
  }, [load])

  if (loading && !data) return <p className="text-sm text-[#596273]">Loading security…</p>
  if (error && !data) return <p className="text-sm text-red-600">{error}</p>

  const summary = data?.summary || {}

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl text-[#172033]">Security</h2>
          <p className="mt-1 text-sm text-[#596273]">
            Failed logins, blocked requests, suspicious activity, and active sessions
          </p>
          {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
        </div>
        <button
          type="button"
          disabled={refreshing}
          onClick={() => load({ soft: true })}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card icon={AlertTriangle} label="Failed logins (24h)" value={summary.failedLogins24h} />
        <Card icon={Ban} label="Permission denied (24h)" value={summary.permissionDenied24h} />
        <Card icon={Users} label="Active sessions" value={summary.activeSessions} />
        <Card icon={Shield} label="Blocked (1h)" value={summary.blockedRequests1h} />
        <Card icon={Activity} label="Suspicious (1h)" value={summary.suspicious1h} />
        <Card icon={Ban} label="Rate limited (total)" value={summary.rateLimited} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm">
          <h3 className="font-semibold text-[#172033]">Recent failed logins</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(data?.recentFailedLogins || []).length === 0 ? (
              <li className="text-[#596273]">None in recent audits</li>
            ) : (
              data.recentFailedLogins.map((r) => (
                <li key={r.id} className="flex justify-between gap-2 border-b border-slate-50 pb-2">
                  <span className="truncate text-[#596273]">{r.email || "unknown"}</span>
                  <span className="shrink-0 text-xs text-[#596273]">
                    {r.ip} · {r.at ? new Date(r.at).toLocaleString() : ""}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm">
          <h3 className="font-semibold text-[#172033]">Permission denied</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(data?.recentPermissionDenied || []).length === 0 ? (
              <li className="text-[#596273]">None recently</li>
            ) : (
              data.recentPermissionDenied.map((r) => (
                <li key={r.id} className="border-b border-slate-50 pb-2">
                  <p className="text-[#172033]">{r.actor || "anonymous"}</p>
                  <p className="text-xs text-[#596273] truncate">
                    {r.path} — {r.message}
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm overflow-x-auto">
        <h3 className="font-semibold text-[#172033] mb-3">Active sessions</h3>
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-[#596273] border-b border-border">
            <tr>
              <th className="py-2 pr-3">User</th>
              <th className="py-2 pr-3">Device</th>
              <th className="py-2 pr-3">IP</th>
              <th className="py-2">Last used</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="border-b border-slate-50">
                <td className="py-2 pr-3">
                  <div className="font-medium">{s.user?.name || "—"}</div>
                  <div className="text-xs text-[#596273]">{s.user?.email}</div>
                </td>
                <td className="py-2 pr-3 text-xs">{s.deviceName || s.deviceId}</td>
                <td className="py-2 pr-3 font-mono text-xs">{s.ip || "—"}</td>
                <td className="py-2 text-xs text-[#596273]">
                  {s.lastUsedAt ? new Date(s.lastUsedAt).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
            {!sessions.length ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-[#596273]">
                  No active sessions
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  )
}

function Card({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border/80 bg-card/90 px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2 text-xs text-[#596273]">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1 font-serif text-2xl text-[#172033]">{value ?? "—"}</p>
    </div>
  )
}
