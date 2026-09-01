"use client"

/**
 * SeoHead — sets document title + meta/OG/Twitter/JSON-LD for the landing route.
 * No react-helmet dependency; cleans up on unmount by restoring prior title.
 */
import { useEffect } from "react"
import { GITHUB_URL } from "../../constants/landing"

const SITE = {
  title: "Trippy — AI Travel Management Platform",
  description:
    "Plan trips with AI itineraries, Copilot, bookings, expenses, flight tracking, maps, weather, and a secure document vault. Built with MERN, Redis, BullMQ, and Docker.",
  url: typeof window !== "undefined" ? window.location.origin : "https://trippy.app",
  image:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
}

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute("content", content)
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement("link")
    el.setAttribute("rel", rel)
    document.head.appendChild(el)
  }
  el.setAttribute("href", href)
}

export default function SeoHead({
  title = SITE.title,
  description = SITE.description,
  path = "/",
} = {}) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title
    const pageUrl = `${SITE.url}${path}`

    upsertMeta("name", "description", description)
    upsertMeta("name", "theme-color", "#E86F3D")
    upsertLink("canonical", pageUrl)

    upsertMeta("property", "og:type", "website")
    upsertMeta("property", "og:site_name", "Trippy")
    upsertMeta("property", "og:title", title)
    upsertMeta("property", "og:description", description)
    upsertMeta("property", "og:url", pageUrl)
    upsertMeta("property", "og:image", SITE.image)

    upsertMeta("name", "twitter:card", "summary_large_image")
    upsertMeta("name", "twitter:title", title)
    upsertMeta("name", "twitter:description", description)
    upsertMeta("name", "twitter:image", SITE.image)

    const ldId = "trippy-jsonld"
    let script = document.getElementById(ldId)
    if (!script) {
      script = document.createElement("script")
      script.id = ldId
      script.type = "application/ld+json"
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Trippy",
      applicationCategory: "TravelApplication",
      operatingSystem: "Web",
      description,
      url: pageUrl,
      codeRepository: GITHUB_URL,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    })

    return () => {
      document.title = prevTitle
    }
  }, [title, description, path])

  return null
}
