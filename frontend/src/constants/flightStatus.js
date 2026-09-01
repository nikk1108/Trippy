export const FLIGHT_STATUSES = ["Scheduled", "Delayed", "Boarding", "In Air", "Landed", "Cancelled"]

export function statusBadgeClass(status) {
  switch (status) {
    case "Delayed":
      return "bg-[#C58A32] text-[#F7F5F0] font-semibold"
    case "Boarding":
      return "bg-[#E86F3D] text-white font-semibold"
    case "In Air":
      return "bg-[#E86F3D] text-white font-semibold"
    case "Landed":
      return "bg-[#3F8F68] text-[#F7F5F0] font-semibold"
    case "Cancelled":
      return "bg-[#C6534B] text-white font-semibold"
    default:
      return "bg-[#FBF9F5] text-[#596273] font-semibold"
  }
}

export function formatCountdown(minutes) {
  if (minutes == null) return "—"
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}
