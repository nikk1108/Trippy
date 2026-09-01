/** High-resolution fallback cover image served when remote destination image loading fails. */
export const DESTINATION_IMAGE_FALLBACK = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop&q=80&auto=format"

const THEME_LOCAL_FALLBACKS = {
  spiritual: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop&q=80&auto=format",
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop&q=80&auto=format",
  mountain: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&q=80&auto=format",
  adventure: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop&q=80&auto=format",
  snowfall: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=800&fit=crop&q=80&auto=format",
  cultural: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=800&fit=crop&q=80&auto=format",
  history: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&h=800&fit=crop&q=80&auto=format",
}

const DESTINATION_LOCAL_FALLBACKS = [
  { pattern: /agra|taj mahal/i, src: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&h=800&fit=crop&q=80&auto=format" },
  { pattern: /bali|ubud/i, src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=800&fit=crop&q=80&auto=format" },
  { pattern: /kyoto|japan temple/i, src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=800&fit=crop&q=80&auto=format" },
  { pattern: /tokyo|shibuya|shinjuku/i, src: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&h=800&fit=crop&q=80&auto=format" },
  { pattern: /paris|eiffel/i, src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=800&fit=crop&q=80&auto=format" },
  { pattern: /goa|baga|calangute/i, src: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&h=800&fit=crop&q=80&auto=format" },
  { pattern: /ujjain|mahakal/i, src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Mahakaleshwar_Temple%2C_Ujjain.jpg/1280px-Mahakaleshwar_Temple%2C_Ujjain.jpg" },
  { pattern: /madurai|meenakshi|tirupati|rameswaram|temple|pilgrimage/i, src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Meenakshi_Temple%2C_Madurai%2C_India.jpg/1280px-Meenakshi_Temple%2C_Madurai%2C_India.jpg" },
  { pattern: /darjeeling|kashmir|gulmarg|pahalgam|mountain|hill|corbett|wildlife|national park/i, src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&q=80&auto=format" },
  { pattern: /phuket|krabi|beach|island/i, src: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&h=800&fit=crop&q=80&auto=format" },
  { pattern: /delhi|mumbai|jaipur|udaipur|rajasthan|city/i, src: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&h=800&fit=crop&q=80&auto=format" },
]

/**
 * Resolve persisted cover image URL from trip document (backend-selected).
 */
export function resolveTripCoverUrl(itinerary) {
  if (!itinerary) return null
  return (
    itinerary.coverImage?.url ||
    itinerary.imageUrl ||
    itinerary.image ||
    itinerary.thumbnail ||
    itinerary.heroImage ||
    null
  )
}

export function resolveTripCoverAlt(itinerary) {
  if (!itinerary) return "Travel destination"
  return (
    itinerary.coverImage?.alt ||
    `${itinerary.title || itinerary.destination || "Trip"} travel destination`
  )
}

/**
 * Last-resort local themed fallback (no API keys, no random picsum).
 */
export function resolveLocalThemedFallback(itinerary) {
  const blob = [
    itinerary?.title,
    itinerary?.destination,
    ...(itinerary?.tags || []),
    itinerary?.coverImage?.query,
  ]
    .filter(Boolean)
    .join(" ")

  for (const entry of DESTINATION_LOCAL_FALLBACKS) {
    if (entry.pattern.test(blob)) return entry.src
  }

  for (const tag of itinerary?.tags || []) {
    if (THEME_LOCAL_FALLBACKS[tag]) return THEME_LOCAL_FALLBACKS[tag]
  }

  return DESTINATION_IMAGE_FALLBACK
}

/** @deprecated Use resolveTripCoverUrl from API — kept for legacy callers */
export function buildDestinationImageUrl(destination) {
  void destination
  return DESTINATION_IMAGE_FALLBACK
}

export function destinationImageSeed(destination) {
  const raw = (destination && String(destination).trim()) || "travel"
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "travel"
}
