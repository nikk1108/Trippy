"use client"

import { Cloud, CloudOff, Loader2, AlertCircle, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import { useOffline } from "../../context/OfflineContext"
import { SYNC_STATUS } from "../../offline/constants"

export default function SyncBadge({ compact = false, className = "" }) {
  const { syncStatus, queuedCount, online } = useOffline()

  let Icon = Cloud
  let label = "Online"
  let tone = "text-[#3F8F68] bg-[#3F8F68]/10 border-[#3F8F68]/20"

  if (!online || syncStatus === SYNC_STATUS.OFFLINE) {
    Icon = CloudOff
    label = "Offline"
    tone = "text-[#C58A32] bg-[#C58A32]/10 border-[#C58A32]/20"
  } else if (syncStatus === SYNC_STATUS.SYNCING) {
    Icon = Loader2
    label = "Syncing"
    tone = "text-[#E86F3D] bg-[#E86F3D]/10 border-[#E86F3D]/20"
  } else if (syncStatus === SYNC_STATUS.QUEUED || queuedCount > 0) {
    Icon = Clock
    label = compact ? String(queuedCount) : `Queued ${queuedCount}`
    tone = "text-[#E86F3D] bg-[#E86F3D]/10 border-[#E86F3D]/20"
  } else if (syncStatus === SYNC_STATUS.ERROR) {
    Icon = AlertCircle
    label = compact ? "!" : "Sync error"
    tone = "text-[#C6534B] bg-[#C6534B]/10 border-[#C6534B]/20"
  }

  const spinning = syncStatus === SYNC_STATUS.SYNCING

  if (compact) {
    return (
      <Link
        to="/offline-settings"
        className={`relative flex h-9 w-9 items-center justify-center rounded-lg border ${tone} transition-colors hover:opacity-90 ${className}`}
        title={label}
        aria-label={`Sync status: ${label}`}
      >
        <Icon className={`h-4 w-4 ${spinning ? "animate-spin" : ""}`} />
        {queuedCount > 0 && online ? (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
            {queuedCount > 9 ? "9+" : queuedCount}
          </span>
        ) : null}
      </Link>
    )
  }

  return (
    <Link
      to="/offline-settings"
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors hover:opacity-90 ${tone} ${className}`}
      title={label}
    >
      <Icon className={`h-3 w-3 ${spinning ? "animate-spin" : ""}`} />
      {label}
    </Link>
  )
}
