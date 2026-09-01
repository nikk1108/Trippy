export const BUDGET_HEALTH_LABELS = {
  excellent: "Excellent",
  good: "Good",
  average: "Average",
  poor: "Poor",
}

export const CATEGORY_LABELS = {
  hotel: "Hotel",
  transport: "Transport",
  food: "Food",
  activity: "Activities",
  flight: "Flights",
  shopping: "Shopping",
  misc: "Misc",
}

export const DIFFICULTY_LABELS = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
}

export function healthColor(score = 0) {
  if (score >= 85) return "text-[#3F8F68]"
  if (score >= 70) return "text-[#E86F3D]"
  if (score >= 50) return "text-[#C58A32]"
  return "text-[#C6534B]"
}

export function impactBadgeClass(impact) {
  if (impact === "high") return "bg-[#C6534B]/10 text-[#C6534B] border-[#C6534B]/20"
  if (impact === "medium") return "bg-[#C58A32]/10 text-[#C58A32] border-[#C58A32]/20"
  return "bg-[#FBF9F5] text-[#596273] border-border"
}
