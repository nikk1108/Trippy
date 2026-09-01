export const TRAVEL_SCORE_LABELS = {
  excellent: "Excellent",
  veryGood: "Very Good",
  good: "Good",
  needsImprovement: "Needs Improvement",
}

export function travelScoreColor(score = 0) {
  if (score >= 90) return "text-[#3F8F68]"
  if (score >= 75) return "text-[#E86F3D]"
  if (score >= 60) return "text-[#C58A32]"
  return "text-[#C6534B]"
}
