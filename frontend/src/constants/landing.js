/** Shared constants for the public product landing page (no backend calls). */

export const GITHUB_URL =
  import.meta.env.VITE_GITHUB_URL ||
  "https://github.com/example/trippy"

export const LINKEDIN_URL =
  import.meta.env.VITE_LINKEDIN_URL || "https://www.linkedin.com/"

export const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL || "hello@trippy.app"

export const DEMO_PATH = "/itineraries"

export const LANDING_FEATURES = [
  {
    id: "ai-planner",
    title: "AI Planner",
    description: "Turn a destination into a practical day-by-day plan.",
    icon: "Sparkles",
    to: "/ai-itinerary",
  },
  {
    id: "copilot",
    title: "Travel Copilot",
    description: "Ask, discover and refine your trip with AI.",
    icon: "Bot",
    to: "/chat",
  },
  {
    id: "expenses",
    title: "Trip Workspace",
    description: "Keep plans, bookings, expenses and documents together.",
    icon: "Wallet",
    to: "/itineraries",
  },
  {
    id: "bookings",
    title: "Smart Bookings",
    description: "Keep every reservation connected to your journey.",
    icon: "Ticket",
    to: "/bookings",
  },
  {
    id: "flights",
    title: "Live Updates",
    description: "Stay aware of changes that matter.",
    icon: "Plane",
    to: "/bookings",
  },
  {
    id: "maps",
    title: "Maps & Places",
    description: "See destinations, routes and activities together.",
    icon: "Map",
    to: "/map-demo",
  },
  {
    id: "weather",
    title: "Weather",
    description: "Know the conditions before you head out.",
    icon: "CloudSun",
    to: "/recommendations",
  },
  {
    id: "vault",
    title: "Document Vault",
    description: "Keep important travel documents close.",
    icon: "FileLock2",
    to: "/documents",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Never miss an important trip reminder.",
    icon: "Bell",
    to: "/notifications",
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Understand your travel and spending at a glance.",
    icon: "BarChart3",
    to: "/analytics",
  },
]

export const TECH_STACK = [
  { name: "MongoDB", color: "#47A248" },
  { name: "Express", color: "#000000" },
  { name: "React", color: "#61DAFB" },
  { name: "Node.js", color: "#339933" },
  { name: "Redis", color: "#DC382D" },
  { name: "BullMQ", color: "#FF4757" },
  { name: "Socket.IO", color: "#010101" },
  { name: "JWT", color: "#000000" },
  { name: "Docker", color: "#2496ED" },
  { name: "GitHub Actions", color: "#2088FF" },
  { name: "AWS S3", color: "#FF9900" },
  { name: "OpenAI / Gemini", color: "#10A37F" },
  { name: "Google Maps", color: "#4285F4" },
  { name: "OpenWeather", color: "#EB6E4B" },
  { name: "Playwright", color: "#2EAD33" },
  { name: "OpenAPI", color: "#6BA539" },
]

export const OPS_PILLARS = [
  {
    title: "Redis",
    description: "Cache-aside, rate limits, Socket.IO adapter, and BullMQ backend.",
    icon: "Database",
  },
  {
    title: "Docker",
    description: "Containerized stack for local development parity.",
    icon: "Container",
  },
  {
    title: "CI/CD",
    description: "GitHub Actions quality testing and pipelines.",
    icon: "GitBranch",
  },
  {
    title: "Playwright",
    description: "End-to-end user-flow validation scripts.",
    icon: "TestTube2",
  },
  {
    title: "Monitoring",
    description: "Realtime latency, cache ratio, and timing stats.",
    icon: "Activity",
  },
  {
    title: "AWS S3",
    description: "Private signed-URL document storage vault.",
    icon: "HardDrive",
  },
  {
    title: "Render",
    description: "Scalable API hosting and health integrations.",
    icon: "Server",
  },
  {
    title: "Vercel",
    description: "Edge-routed frontend SPA static deployment.",
    icon: "Globe",
  },
  {
    title: "MongoDB Atlas",
    description: "Cloud-hosted database for user itineraries.",
    icon: "Database",
  },
]

export const SECURITY_ITEMS = [
  { title: "JWT", description: "Access/refresh rotation tokens and sessions." },
  { title: "RBAC", description: "Role-based permissions from Guest to Super Admin." },
  { title: "Rate limiting", description: "Redis-backed abuse protection bounds." },
  { title: "Helmet", description: "Secure CSP policy and HSTS headers." },
]

export const CLOUD_ITEMS = [
  { title: "Render", description: "API hosting with health checks and Redis attachments.", icon: "Server" },
  { title: "Vercel", description: "SPA deploy with environment-scoped API base URL.", icon: "Globe" },
  { title: "MongoDB Atlas", description: "Managed database for production itineraries and users.", icon: "Database" },
  { title: "AWS S3", description: "Object storage for the travel document vault.", icon: "Cloud" },
]

export const DOC_LINKS = [
  { title: "README", description: "Product overview, install, and deploy", href: GITHUB_URL + "#readme", external: true },
  { title: "Swagger", description: "Interactive OpenAPI explorer", href: "/docs", external: true, apiRelative: true },
  {
    title: "Engineering Handbook",
    description: "Internal developer portal",
    href: GITHUB_URL + "/blob/main/docs/engineering/ENGINEERING.md",
    external: true,
  },
  {
    title: "Architecture",
    description: "Mermaid diagrams and system design",
    href: GITHUB_URL + "/blob/main/ARCHITECTURE.md",
    external: true,
  },
  {
    title: "Testing",
    description: "Playwright and CI quality gates",
    href: GITHUB_URL + "/blob/main/TESTING.md",
    external: true,
  },
  {
    title: "Security",
    description: "JWT, RBAC, hardening guide",
    href: GITHUB_URL + "/blob/main/SECURITY.md",
    external: true,
  },
]

export const SCREENSHOTS = [
  {
    id: "trips",
    title: "Browse itineraries",
    caption: "Search and filter community and workspace trips.",
    src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=70",
    alt: "Travel planning workspace aesthetic",
  },
  {
    id: "maps",
    title: "Maps & places",
    caption: "Visualize days with Google Maps or Leaflet.",
    src: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=70",
    alt: "Map of a coastal destination",
  },
  {
    id: "docs",
    title: "Document vault",
    caption: "Keep tickets and IDs organized securely.",
    src: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=70",
    alt: "Organized travel documents on a desk",
  },
  {
    id: "analytics",
    title: "Travel analytics",
    caption: "Understand spend and trip patterns over time.",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=70",
    alt: "Analytics charts on a desk",
  },
]
