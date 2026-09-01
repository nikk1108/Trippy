/** @typedef {'sunny' | 'cloudy' | 'rain'} WeatherCondition */

export const OUTDOOR_CATEGORIES = ["sightseeing", "adventure", "relaxation"]
export const INDOOR_CATEGORIES = ["cultural", "dining", "shopping"]

/**
 * @param {WeatherCondition} condition
 * @param {string} category
 */
export function suggestActivityFit(condition, category) {
  const cat = String(category || "").toLowerCase()
  const isOutdoor = OUTDOOR_CATEGORIES.includes(cat)
  const isIndoor = INDOOR_CATEGORIES.includes(cat)

  if (condition === "rain") {
    if (isOutdoor) return { fit: "swap", message: "Consider an indoor alternative if rain is heavy." }
    if (isIndoor) return { fit: "good", message: "Well suited for rainy weather." }
    return { fit: "fair", message: "Flexible — check conditions before heading out." }
  }
  if (condition === "sunny") {
    if (isOutdoor) return { fit: "good", message: "Ideal for outdoor plans today." }
    if (isIndoor) return { fit: "fair", message: "Fine anytime — save outdoor sights for sunnier hours." }
    return { fit: "good", message: "Good conditions for being outside." }
  }
  if (isOutdoor) return { fit: "fair", message: "Usually fine outdoors; bring a light jacket." }
  return { fit: "good", message: "Comfortable for indoor or flexible plans." }
}

/**
 * @param {WeatherCondition} condition
 * @param {Array<{ category?: string, name?: string }>} activities
 */
export function buildDayActivitySuggestions(condition, activities = []) {
  const perActivity = (activities || []).map((a) => ({
    name: a.name,
    category: a.category,
    ...suggestActivityFit(condition, a.category),
  }))
  return { activities: perActivity }
}

/**
 * @param {WeatherCondition} condition
 */
export function tripTip(condition) {
  if (condition === "rain") {
    return "Rain expected — prioritize museums, covered markets, and indoor dining."
  }
  if (condition === "sunny") {
    return "Clear skies — great for beaches, viewpoints, and outdoor adventures."
  }
  return "Mixed clouds — flexible day; keep a light layer for changing conditions."
}

/**
 * @param {WeatherCondition} condition
 */
export function weatherBadgeClasses(condition) {
  if (condition === "sunny") {
    return "bg-[#C58A32]/10 text-[#C58A32] border-[#C58A32]/20"
  }
  if (condition === "rain") {
    return "bg-[#E86F3D]/10 text-[#E86F3D] border-[#E86F3D]/20"
  }
  return "bg-[#FBF9F5] text-[#172033] border-border"
}

/**
 * @param {WeatherCondition} condition
 */
export function weatherIcon(condition) {
  if (condition === "sunny") return "☀️"
  if (condition === "rain") return "🌧️"
  return "☁️"
}

/**
 * @param {{ temp?: { min?: number | null, max?: number | null, avg?: number | null } }} day
 */
export function formatTempRange(day) {
  const { min, max, avg } = day?.temp || {}
  if (min != null && max != null && min !== max) return `${min}°–${max}°C`
  if (avg != null) return `${avg}°C`
  if (max != null) return `${max}°C`
  if (min != null) return `${min}°C`
  return ""
}

/**
 * @param {'good' | 'fair' | 'swap'} fit
 */
export function activityFitClasses(fit) {
  if (fit === "good") {
    return "bg-[#3F8F68]/10 text-[#3F8F68] border-[#3F8F68]/20"
  }
  if (fit === "swap") {
    return "bg-[#C6534B]/10 text-[#C6534B] border-[#C6534B]/20"
  }
  return "bg-[#FBF9F5] text-[#596273] border-border"
}

/**
 * Build per-day weather map from forecast API response.
 * @param {{ forecast?: Array<Record<string, unknown>> }} payload
 */
export function forecastByDayNumber(payload) {
  const map = new Map()
  ;(payload?.forecast || []).forEach((day, index) => {
    map.set(index + 1, day)
  })
  return map
}
