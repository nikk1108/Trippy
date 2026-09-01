export const RISK_SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
export const RISK_STATUSES = ["OPEN", "RESOLVED", "IGNORED"]

export const RISK_TYPE_LABELS = {
  heavy_rain: "Heavy Rain",
  storm: "Storm",
  extreme_heat: "Extreme Heat",
  snow: "Snow",
  cyclone: "Cyclone",
  flood: "Flood",
  museum_closed: "Museum Closed",
  public_holiday: "Public Holiday",
  flight_delay: "Flight Delay",
  flight_cancellation: "Flight Cancellation",
  hotel_checkin_conflict: "Hotel Check-in Conflict",
  overlapping_activities: "Overlapping Activities",
  long_travel_time: "Long Travel Time",
  traffic_congestion: "Traffic Congestion",
  budget_exceeded: "Budget Exceeded",
  passport_expiring: "Passport Expiring",
  visa_expiring: "Visa Expiring",
  missing_documents: "Missing Documents",
  late_night_travel: "Late Night Travel",
  unsafe_area: "Unsafe Area",
  schedule_conflict: "Schedule Conflict",
  restaurant_overlap: "Restaurant Overlap",
  missing_transport: "Missing Transport",
  general: "General Risk",
}

export function riskTypeLabel(type) {
  return RISK_TYPE_LABELS[type] || "Risk"
}

export function severityColor(severity) {
  switch (String(severity).toUpperCase()) {
    case "CRITICAL":
      return "bg-[#C6534B] text-white font-semibold"
    case "HIGH":
      return "bg-[#E86F3D] text-white font-semibold"
    case "MEDIUM":
      return "bg-[#C58A32] text-[#F7F5F0] font-semibold"
    default:
      return "bg-[#FBF9F5] text-[#596273] border border-border"
  }
}

export function healthColor(score) {
  if (score >= 85) return "text-[#3F8F68]"
  if (score >= 70) return "text-[#E86F3D]"
  if (score >= 50) return "text-[#C58A32]"
  return "text-[#C6534B]"
}
