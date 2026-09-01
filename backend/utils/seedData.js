import dotenv from "dotenv"
import connectDB from "../config/db.js"
import Itinerary from "../models/Itinerary.js"
import Day from "../models/Day.js"
import Activity from "../models/Activity.js"
import { getTripCoverImage } from "../services/tripImageService.js"

dotenv.config()

const DESTINATION_LOOKUP = {
  "Goa, India": {
    hotels: [
      { name: "Taj Exotica Resort & Spa", location: "Benaulim, South Goa", rating: 5 },
      { name: "Goa Marriott Resort", location: "Panaji, North Goa", rating: 5 }
    ],
    activities: [
      { name: "Baga Beach Water Sports", description: "Enjoy parasailing, jet skiing, and relaxing on the golden sands of Baga Beach.", category: "adventure", location: "Baga Beach, North Goa" },
      { name: "Old Goa Heritage Walk", description: "Visit the historical Basilica of Bom Jesus and Se Cathedral, showcasing rich Portuguese architecture.", category: "cultural", location: "Old Goa" },
      { name: "Dudhsagar Waterfalls Hike", description: "A scenic trek through the Bhagwan Mahavir Wildlife Sanctuary to witness the majestic milk-like cascade.", category: "adventure", location: "Sonaulim, East Goa" },
      { name: "Anjuna Beach Flea Market", description: "Browse traditional handicrafts, clothing, spices, and unique souvenirs at the bustling market.", category: "shopping", location: "Anjuna Beach" }
    ]
  },
  "Ujjain, India": {
    hotels: [
      { name: "Hotel Shipra Residency", location: "Madhav Nagar, Ujjain", rating: 4 },
      { name: "Anjushree Ujjain", location: "Indore Road, Ujjain", rating: 5 }
    ],
    activities: [
      { name: "Mahakaleshwar Temple Darshan", description: "Attend the sacred Bhasma Aarti at the historic Mahakal temple, one of the 12 Jyotirlingas.", category: "cultural", location: "Mahakal Marg, Ujjain" },
      { name: "Ram Ghat Evening Prayers", description: "Experience the tranquil evening Ganga-style aarti along the banks of the Shipra River.", category: "cultural", location: "Ram Ghat, Ujjain" },
      { name: "Kal Bhairav Temple Visit", description: "Observe the unique religious customs and rituals at the famous temple of Kal Bhairav.", category: "cultural", location: "Kharakuwa, Ujjain" }
    ]
  },
  "Delhi, India": {
    hotels: [
      { name: "The Taj Mahal Hotel New Delhi", location: "Mansingh Road, New Delhi", rating: 5 },
      { name: "The Lalit New Delhi", location: "Barakhamba Avenue, Connaught Place", rating: 5 }
    ],
    activities: [
      { name: "Red Fort & Chandni Chowk Tour", description: "Walk through the iconic Mughal-era fort and explore the bustling streets of Chandni Chowk.", category: "sightseeing", location: "Old Delhi" },
      { name: "Qutub Minar Architectural Walk", description: "Admire the towering 73-meter minaret and historic ruins built in the 12th century.", category: "sightseeing", location: "Mehrauli, New Delhi" },
      { name: "Humayun's Tomb Excursion", description: "Explore the magnificent garden tomb, a precursor to the architectural style of the Taj Mahal.", category: "sightseeing", location: "Nizamuddin, New Delhi" }
    ]
  },
  "Manali, India": {
    hotels: [
      { name: "Solang Valley Resort", location: "Solang Valley, Manali", rating: 4 },
      { name: "Span Resort & Spa", location: "Kullu-Manali Highway", rating: 5 }
    ],
    activities: [
      { name: "Solang Valley Paragliding", description: "Soar above beautiful pine forests and enjoy panoramic views of snow-capped Himalayan peaks.", category: "adventure", location: "Solang Valley, Manali" },
      { name: "Hadimba Temple Forest Stroll", description: "Visit the historic wooden temple dedicated to Hidimba Devi, built in the middle of a cedar forest.", category: "cultural", location: "Dhungri Forest, Manali" },
      { name: "Jogini Waterfall Forest Trek", description: "A rewarding pine tree hike leading to a magnificent mountain waterfall cascade.", category: "adventure", location: "Vashisht Village, Manali" }
    ]
  },
  "Jaipur, India": {
    hotels: [
      { name: "Rambagh Palace Jaipur", location: "Bhawani Singh Road, Jaipur", rating: 5 },
      { name: "Jai Mahal Palace", location: "Civil Lines, Jaipur", rating: 5 }
    ],
    activities: [
      { name: "Amber Fort Majestic Tour", description: "Ascend the hilltop fort and admire the spectacular Sheesh Mahal (Mirror Palace).", category: "sightseeing", location: "Amer, Jaipur" },
      { name: "City Palace & Hawa Mahal Walk", description: "See the Palace of Winds facade and explore the royal courtyards and weapons museum.", category: "sightseeing", location: "City Center, Jaipur" },
      { name: "Johari Bazaar Handicraft Shopping", description: "Shop for traditional block-print textiles, blue pottery, and beautiful gemstones.", category: "shopping", location: "Johari Bazaar, Jaipur" }
    ]
  },
  "Mumbai, India": {
    hotels: [
      { name: "The Taj Mahal Palace Mumbai", location: "Apollo Bandar, Colaba", rating: 5 },
      { name: "Trident Nariman Point", location: "Marine Drive, Nariman Point", rating: 5 }
    ],
    activities: [
      { name: "Gateway of India & Colaba Stroll", description: "See the iconic arch monument overlooking the harbour and explore historical lanes.", category: "sightseeing", location: "Colaba, Mumbai" },
      { name: "Marine Drive Sunset Walk", description: "Enjoy the cooling sea breeze along the curved Queen's Necklace promenade.", category: "relaxation", location: "Marine Drive, Nariman Point" },
      { name: "Elephanta Caves Boat Tour", description: "Take a scenic ferry ride to the island and explore ancient rock-cut Shiva cave temples.", category: "cultural", location: "Elephanta Island" }
    ]
  },
  "Kerala, India": {
    hotels: [
      { name: "Kumarakom Lake Resort", location: "Kumarakom, Kottayam", rating: 5 },
      { name: "Brunton Boatyard", location: "Fort Kochi, Cochin", rating: 5 }
    ],
    activities: [
      { name: "Kumarakom Houseboat Cruise", description: "Glide past peaceful palm-fringed canals, quiet villages, and coconut groves.", category: "relaxation", location: "Vembanad Lake Backwaters" },
      { name: "Fort Kochi Cultural Walk", description: "See the Chinese Fishing Nets, historic Dutch Palace, and catch a Kathakali performance.", category: "cultural", location: "Fort Kochi" },
      { name: "Munnar Tea Valley Stroll", description: "Walk through rolling green tea hills and learn about tea manufacturing at the museum.", category: "sightseeing", location: "Munnar, Idukki" }
    ]
  },
  "Kashmir, India": {
    hotels: [
      { name: "The Khyber Himalayan Resort", location: "Gulmarg, Jammu & Kashmir", rating: 5 },
      { name: "The Lalit Grand Palace Srinagar", location: "Gupkar Road, Srinagar", rating: 5 }
    ],
    activities: [
      { name: "Dal Lake Shikara Cruise", description: "Relax in a decorated wooden boat gliding past floating gardens and shops.", category: "relaxation", location: "Dal Lake, Srinagar" },
      { name: "Gulmarg Gondola Mountain Ride", description: "Ride the cable car to Kongdoori Mountain for stunning panoramic snow views.", category: "adventure", location: "Gulmarg resort" },
      { name: "Shalimar Bagh Mughal Gardens", description: "Explore the beautiful terraced water channels, fountains, and Chinar trees.", category: "sightseeing", location: "Srinagar" }
    ]
  },
  "Varanasi, India": {
    hotels: [
      { name: "BrijRama Palace Varanasi", location: "Darbhanga Ghat, Varanasi", rating: 5 },
      { name: "Taj Ganges Varanasi", location: "Nadesar Palace Grounds", rating: 5 }
    ],
    activities: [
      { name: "Ganga Aarti Devotional Ceremony", description: "Witness the magnificent fire worship prayers on the banks of the sacred river Ganges.", category: "cultural", location: "Dashashwamedh Ghat" },
      { name: "Sarnath Deer Park Excursion", description: "Explore the ancient ruins and Dhamek Stupa where Buddha delivered his first sermon.", category: "cultural", location: "Sarnath, Varanasi" },
      { name: "Kashi Vishwanath Temple Darshan", description: "Visit the iconic golden-spire temple dedicated to Lord Shiva.", category: "cultural", location: "Vishwanath Gali" }
    ]
  },
  "Agra, India": {
    hotels: [
      { name: "The Oberoi Amarvilas Agra", location: "Taj East Gate Road", rating: 5 },
      { name: "ITC Mughal Agra", location: "Fatehabad Road, Agra", rating: 5 }
    ],
    activities: [
      { name: "Taj Mahal Sunrise Tour", description: "Marvel at the world-famous white marble mausoleum in the quiet morning light.", category: "sightseeing", location: "Agra, Uttar Pradesh" },
      { name: "Agra Fort Royal Walk", description: "Explore the massive red sandstone fort, the main residence of the Mughal emperors.", category: "sightseeing", location: "Agra" }
    ]
  },
  "Rishikesh, India": {
    hotels: [
      { name: "Aloha on the Ganges", location: "Tapovan, Rishikesh", rating: 4 },
      { name: "Ananda in the Himalayas", location: "Narendra Nagar, Tehri Garhwal", rating: 5 }
    ],
    activities: [
      { name: "Ganga White-water Rafting", description: "Navigate the thrilling rapids and cold mountain waters of the Ganges.", category: "adventure", location: "Shivpuri, Rishikesh" },
      { name: "Beatles Ashram Exploration", description: "Explore the quiet, graffiti-covered ruins where the Beatles composed the White Album.", category: "cultural", location: "Swarg Ashram, Rishikesh" }
    ]
  },
  "Darjeeling, India": {
    hotels: [
      { name: "Mayfair Darjeeling Hotel", location: "The Mall, Darjeeling", rating: 4 },
      { name: "Windamere Hotel", location: "Observatory Hill, Darjeeling", rating: 4 }
    ],
    activities: [
      { name: "Tiger Hill Sunrise Watch", description: "Witness the morning sun illuminate the snow peaks of Mount Kanchenjunga.", category: "sightseeing", location: "Tiger Hill, Darjeeling" },
      { name: "Himalayan Railway Ride", description: "Enjoy a nostalgic ride on the UNESCO-listed steam Toy Train.", category: "sightseeing", location: "Darjeeling Station" }
    ]
  },
  "Andaman, India": {
    hotels: [
      { name: "Taj Exotica Resort & Spa Havelock", location: "Radhanagar Beach, Havelock", rating: 5 },
      { name: "Barefoot at Havelock Resort", location: "Havelock Island, Andamans", rating: 4 }
    ],
    activities: [
      { name: "Radhanagar Beach Sunset Stroll", description: "Swim and relax on the pristine, turquoise-water beach, ranked among Asia's best.", category: "relaxation", location: "Havelock Island" },
      { name: "Elephant Beach Snorkeling", description: "Swim over colorful coral reefs and observe vibrant exotic marine life.", category: "adventure", location: "Elephant Beach" }
    ]
  },
  "Paris, France": {
    hotels: [
      { name: "The Peninsula Paris", location: "Kléber Avenue, Paris", rating: 5 },
      { name: "Hotel Regina Louvre", location: "Place des Pyramides, Paris", rating: 5 }
    ],
    activities: [
      { name: "Eiffel Tower Ascent", description: "Enjoy sweeping panoramic views of the city from the top deck observatory.", category: "sightseeing", location: "Champ de Mars, Paris" },
      { name: "Louvre Museum Art Tour", description: "See world-famous treasures including the Mona Lisa and Venus de Milo with a guide.", category: "cultural", location: "Louvre Palace, Paris" }
    ]
  },
  "London, UK": {
    hotels: [
      { name: "The Savoy London", location: "Strand, London", rating: 5 },
      { name: "The Landmark London", location: "Marylebone Road, London", rating: 5 }
    ],
    activities: [
      { name: "British Museum Highlights Walk", description: "See iconic historical treasures including the Rosetta Stone and Egyptian mummies.", category: "cultural", location: "Bloomsbury, London" },
      { name: "London Eye Flight", description: "Take a scenic flight on the giant Ferris wheel overlooking the River Thames.", category: "sightseeing", location: "South Bank, London" }
    ]
  },
  "New York, USA": {
    hotels: [
      { name: "The Plaza Hotel NY", location: "Fifth Avenue, New York City", rating: 5 },
      { name: "The Knickerbocker", location: "Times Square, New York City", rating: 5 }
    ],
    activities: [
      { name: "Empire State Building Observatory", description: "Admire spectacular 360-degree views of the Manhattan skyline from the 86th floor.", category: "sightseeing", location: "Midtown Manhattan" },
      { name: "Central Park Bike Tour", description: "Ride through scenic pathways, past Bethesda Fountain and Strawberry Fields.", category: "relaxation", location: "Central Park" }
    ]
  },
  "Tokyo, Japan": {
    hotels: [
      { name: "Park Hyatt Tokyo", location: "Nishi-Shinjuku, Shinjuku", rating: 5 },
      { name: "Shibuya Stream Hotel", location: "Shibuya, Tokyo", rating: 4 }
    ],
    activities: [
      { name: "Asakusa Sensō-ji Temple Walk", description: "Explore Tokyo's oldest and most iconic Buddhist temple and market streets.", category: "cultural", location: "Asakusa, Tokyo" },
      { name: "Shibuya Crossing Panoramic View", description: "Experience crossing the world's busiest pedestrian intersection.", category: "sightseeing", location: "Shibuya, Tokyo" }
    ]
  },
  "Dubai, UAE": {
    hotels: [
      { name: "Burj Al Arab Jumeirah", location: "Jumeirah Beach Road, Dubai", rating: 5 },
      { name: "Atlantis The Palm", location: "Crescent Road, Palm Jumeirah", rating: 5 }
    ],
    activities: [
      { name: "Burj Khalifa Observation Deck", description: "Stand on the 148th floor of the world's tallest building for desert views.", category: "sightseeing", location: "Downtown Dubai" },
      { name: "Desert Safari Dunes Ride", description: "Enjoy dune bashing in 4x4 vehicles, camel riding, and a barbecue dinner.", category: "adventure", location: "Dubai Desert" }
    ]
  },
  "Singapore": {
    hotels: [
      { name: "Marina Bay Sands Singapore", location: "Bayfront Avenue, Singapore", rating: 5 },
      { name: "Raffles Hotel Singapore", location: "Beach Road, Singapore", rating: 5 }
    ],
    activities: [
      { name: "Gardens by the Bay Supertrees", description: "Walk the skyway between the giant steel Supertrees and visit the Cloud Forest.", category: "sightseeing", location: "Marina Gardens Drive" },
      { name: "Universal Studios Sentosa", description: "Spend a thrilling day enjoying movies-themed rides and performances.", category: "adventure", location: "Sentosa Island, Singapore" }
    ]
  },
  "Bali, Indonesia": {
    hotels: [
      { name: "Mandapa, A Ritz-Carlton Reserve", location: "Kedewatan, Ubud, Bali", rating: 5 },
      { name: "Alila Villas Uluwatu", location: "Pecatu, Kuta, Bali", rating: 5 }
    ],
    activities: [
      { name: "Tegallalang Terraced Rice Fields", description: "Walk through lush green terraced fields and enjoy the jungle swings.", category: "sightseeing", location: "Ubud, Bali" },
      { name: "Uluwatu Cliff Temple Sunset", description: "Watch the spectacular sunset and traditional Kecak dance on a cliff edge.", category: "cultural", location: "Uluwatu, Bali" }
    ]
  },
  "Rome, Italy": {
    hotels: [
      { name: "Hotel de Russie Rome", location: "Via del Babuino, Rome", rating: 5 },
      { name: "Singer Palace Hotel", location: "Via Alessandro Specchi, Rome", rating: 5 }
    ],
    activities: [
      { name: "Colosseum & Roman Forum Walk", description: "Step back in time inside the massive ancient amphitheater and ruins.", category: "sightseeing", location: "Colosseum Square" },
      { name: "Vatican Museums Artistic Tour", description: "Marvel at the spectacular Sistine Chapel and St. Peter's Basilica.", category: "cultural", location: "Vatican City" }
    ]
  },
  "Barcelona, Spain": {
    hotels: [
      { name: "W Barcelona Hotel", location: "Plaça de la Rosa dels Vents", rating: 5 },
      { name: "Hotel Majestic Passeig de Gràcia", location: "Passeig de Gràcia, Barcelona", rating: 5 }
    ],
    activities: [
      { name: "Sagrada Família Guided Tour", description: "Explore Antoni Gaudí's unfinished cathedral and modern mosaic windows.", category: "cultural", location: "Eixample, Barcelona" },
      { name: "Park Güell Artistic Stroll", description: "Walk through Gaudí's whimsical colorful park overlooking the city.", category: "sightseeing", location: "Gràcia, Barcelona" }
    ]
  },
  "Switzerland": {
    hotels: [
      { name: "Victoria-Jungfrau Grand Hotel", location: "Interlaken, Switzerland", rating: 5 },
      { name: "The Dolder Grand Zurich", location: "Kurhausstrasse, Zurich", rating: 5 }
    ],
    activities: [
      { name: "Jungfraujoch Peak Excursion", description: "Ride the cogwheel train to the top of Europe snow observatory.", category: "adventure", location: "Grindelwald, Switzerland" },
      { name: "Lake Zurich Steamboat Cruise", description: "Relax on a cruise past beautiful historic villages and vineyards.", category: "relaxation", location: "Zurich Harbour" }
    ]
  },
  "Bangkok, Thailand": {
    hotels: [
      { name: "Mandarin Oriental Bangkok", location: "Soi Charoenkrung, Bangkok", rating: 5 },
      { name: "The Siam Hotel Bangkok", location: "Khao Road, Dusit", rating: 5 }
    ],
    activities: [
      { name: "Grand Palace & Emerald Buddha", description: "Tour the royal palace complex and see the revered jade Buddha statue.", category: "cultural", location: "Phra Nakhon, Bangkok" },
      { name: "Chatuchak Market Weekend Shopping", description: "Explore thousands of stalls selling food, clothes, art, and handicrafts.", category: "shopping", location: "Chatuchak, Bangkok" }
    ]
  },
  "Istanbul, Turkey": {
    hotels: [
      { name: "Four Seasons Hotel Sultanahmet", location: "Tevkifhane Street, Istanbul", rating: 5 },
      { name: "Çırağan Palace Kempinski", location: "Çırağan Street, Beşiktaş", rating: 5 }
    ],
    activities: [
      { name: "Hagia Sophia History Tour", description: "Explore the iconic structure that served as a cathedral and imperial mosque.", category: "cultural", location: "Sultanahmet, Istanbul" },
      { name: "Bosphorus Evening Dinner Cruise", description: "Dine on Turkish food while sailing between the shores of Europe and Asia.", category: "dining", location: "Bosphorus Strait" }
    ]
  },
  "Sydney, Australia": {
    hotels: [
      { name: "Park Hyatt Sydney Hotel", location: "Hickson Road, The Rocks", rating: 5 },
      { name: "The Langham Sydney", location: "Kent Street, Millers Point", rating: 5 }
    ],
    activities: [
      { name: "Sydney Opera House Tour", description: "Go behind the scenes at the world-famous sail-shaped performing arts center.", category: "cultural", location: "Bennelong Point, Sydney" },
      { name: "Bondi to Coogee Coastal Walk", description: "Walk along cliffs and sandy beaches overlooking the Pacific Ocean.", category: "sightseeing", location: "Bondi Beach" }
    ]
  },
  "Munich, Germany": {
    hotels: [
      { name: "Hotel Bayerischer Hof Munich", location: "Promenadeplatz, Munich", rating: 5 },
      { name: "Rocco Forte The Charles Hotel", location: "Sophienstrasse, Munich", rating: 5 }
    ],
    activities: [
      { name: "Marienplatz Glockenspiel Show", description: "Watch the historic clock tower figures perform historical events.", category: "sightseeing", location: "Marienplatz, Munich" },
      { name: "English Garden Surfers Watch", description: "Stroll the park and watch surfers tackle the Eisbach river waves.", category: "relaxation", location: "English Garden, Munich" }
    ]
  },
  "Cape Town, South Africa": {
    hotels: [
      { name: "The Silo Hotel Cape Town", location: "V&A Waterfront, Cape Town", rating: 5 },
      { name: "One&Only Cape Town Resort", location: "Victoria & Alfred Waterfront", rating: 5 }
    ],
    activities: [
      { name: "Table Mountain Aerial Cableway", description: "Enjoy the rotating cable car ride to the flat peak for coastal views.", category: "sightseeing", location: "Table Mountain Road" },
      { name: "Boulders Beach African Penguins", description: "Observe the endangered colony of penguins roaming freely on the beach.", category: "sightseeing", location: "Simon's Town" }
    ]
  },
  "Cairo, Egypt": {
    hotels: [
      { name: "Marriott Mena House Cairo", location: "Al Haram, Giza, Cairo", rating: 5 },
      { name: "Four Seasons Hotel Nile Plaza", location: "Kornish El Nile, Garden City", rating: 5 }
    ],
    activities: [
      { name: "Giza Pyramids & Great Sphinx", description: "Discover the iconic tombs and monument on the Giza plateau.", category: "sightseeing", location: "Giza Plateau" },
      { name: "Egyptian Museum Treasures Tour", description: "Examine gold artifacts, mummies, and the treasures of Tutankhamun.", category: "cultural", location: "Tahrir Square, Cairo" }
    ]
  },
  "Reykjavik, Iceland": {
    hotels: [
      { name: "The Reykjavik Edition", location: "Austurbakki, Reykjavik", rating: 5 },
      { name: "Hotel Borg", location: "Posthusstraeti, Reykjavik", rating: 4 }
    ],
    activities: [
      { name: "Golden Circle Geysers & Falls", description: "Witness active geysers, Gullfoss waterfall, and Þingvellir park rift.", category: "sightseeing", location: "Golden Circle Route" },
      { name: "Blue Lagoon Mineral Soak", description: "Soak in the relaxing, mineral-rich geothermal pool in a lava field.", category: "relaxation", location: "Grindavík, Iceland" }
    ]
  }
}

const ITINERARIES_LIST = [
  {
    title: "Goa Beach & Spice Plantation Getaway",
    destination: "Goa, India",
    numberOfNights: 3,
    description: "Relax on the sandy shores of Goa, enjoy exciting water sports, explore historic old churches, and tour a traditional spice plantation.",
    budget: { min: 180, max: 450, currency: "USD" },
    bestTimeToVisit: "November - February",
    highlights: ["Relax on Baga Beach", "Old Goa Portuguese Churches Walk", "Water Sports at Baga Beach", "Dudhsagar Waterfall Hikes"],
    tags: ["beach", "budget", "nature"],
  },
  {
    title: "Goa Luxury Honeymoon & Beach Retreat",
    destination: "Goa, India",
    numberOfNights: 5,
    description: "A private, luxurious beach getaway in South Goa, featuring private cabanas, candlelight beachside dinners, and relaxing spa sessions.",
    budget: { min: 1000, max: 3200, currency: "USD" },
    bestTimeToVisit: "November - March",
    highlights: ["Private Candlelight Beach Dinner", "South Goa Quiet Beaches Stroll", "Luxury Resort Wellness Spa", "Old Goa Heritage Walk"],
    tags: ["beach", "luxury", "romantic"],
  },
  {
    title: "Ujjain Sacred Temple Devotional Tour",
    destination: "Ujjain, India",
    numberOfNights: 2,
    description: "A peaceful spiritual journey to one of India's holiest cities, featuring Mahakaleshwar Jyotirlinga darshan and evening Shipra prayers.",
    budget: { min: 80, max: 220, currency: "USD" },
    bestTimeToVisit: "October - March",
    highlights: ["Mahakaleshwar Bhasma Aarti", "Ram Ghat River Evening Prayers", "Harsiddhi Temple Shaktipeeth Visit", "Kal Bhairav Customary Offerings"],
    tags: ["spiritual", "cultural", "budget"],
  },
  {
    title: "Delhi Mughal History & Street Food Tour",
    destination: "Delhi, India",
    numberOfNights: 3,
    description: "Immerse yourself in Delhi's rich Mughal history and taste legendary street foods in Old Delhi's bustling markets.",
    budget: { min: 150, max: 450, currency: "USD" },
    bestTimeToVisit: "October - March",
    highlights: ["Red Fort Historical Walk", "Chandni Chowk Paranthe Wali Gali Food", "Qutub Minar Architectural Tour", "Humayun's Tomb Garden Walk"],
    tags: ["cultural", "history", "food"],
  },
  {
    title: "Manali Mountain Adventure & Pine Forests",
    destination: "Manali, India",
    numberOfNights: 4,
    description: "Escape to the hills for paragliding, waterfall treks, and cultural walks through dense cedar forests and wooden temples.",
    budget: { min: 200, max: 650, currency: "USD" },
    bestTimeToVisit: "September - June",
    highlights: ["Solang Valley Mountain Adventure", "Hadimba Temple Cedar Walk", "Jogini Waterfall Pine Trek", "Explore Vashisht Hot Springs"],
    tags: ["mountain", "adventure", "nature"],
  },
  {
    title: "Jaipur Historic Forts & Bazar Shopping",
    destination: "Jaipur, India",
    numberOfNights: 3,
    description: "Discover the Pink City's spectacular hilltop forts, historic royal palaces, and shop for gems and hand-printed textiles.",
    budget: { min: 200, max: 750, currency: "USD" },
    bestTimeToVisit: "November - February",
    highlights: ["Amber Fort Sheesh Mahal Tour", "City Palace Weapons Museum", "Hawa Mahal Palace of Winds Photo Stop", "Johari Bazaar Gem Shopping"],
    tags: ["cultural", "history", "budget"],
  },
  {
    title: "Jaipur Royal Palace & Heritage Retreat",
    destination: "Jaipur, India",
    numberOfNights: 5,
    description: "Stay in a royal palace heritage resort, experience royal hospitality, private dining, and guided historical excursions.",
    budget: { min: 1200, max: 4000, currency: "USD" },
    bestTimeToVisit: "November - February",
    highlights: ["Royal Palace Heritage Stay", "Amber Fort Private Tour", "Private Royal Court Dinner", "Johari Bazaar Luxury Shopping"],
    tags: ["luxury", "cultural", "romantic"],
  },
  {
    title: "Mumbai City Discovery & Elephanta Boat Tour",
    destination: "Mumbai, India",
    numberOfNights: 3,
    description: "Explore the city that never sleeps. See the Gateway of India, walk the sea face, and take a boat to historic caves.",
    budget: { min: 180, max: 600, currency: "USD" },
    bestTimeToVisit: "October - March",
    highlights: ["Gateway of India Harbour Walk", "Marine Drive Sea Face Sunset", "Elephanta Caves Rock-cut Shrines", "Colaba Causeway Street Shopping"],
    tags: ["cultural", "family", "adventure"],
  },
  {
    title: "Kerala Serene Houseboats & Tea Valleys",
    destination: "Kerala, India",
    numberOfNights: 5,
    description: "Cruise the palm-fringed backwaters of Kumarakom in a houseboat and explore the rolling tea plantations of Munnar.",
    budget: { min: 400, max: 1400, currency: "USD" },
    bestTimeToVisit: "September - March",
    highlights: ["Kumarakom Backwaters Houseboat", "Fort Kochi Chinese Fishing Nets", "Munnar Tea Valley Stroll", "Kathakali Cultural Performance"],
    tags: ["nature", "nature", "family"],
  },
  {
    title: "Kashmir Dal Lake Houseboat & Mountain Gondola",
    destination: "Kashmir, India",
    numberOfNights: 6,
    description: "Experience paradise on earth. Stay in a luxury wooden Dal Lake houseboat, ride the Gulmarg gondola, and explore royal gardens.",
    budget: { min: 500, max: 1800, currency: "USD" },
    bestTimeToVisit: "April - October",
    highlights: ["Dal Lake Houseboat Stay", "Gulmarg Mountain Gondola Ride", "Shalimar Bagh Terraced Gardens", "Pahalgam Valley Pine Walk"],
    tags: ["mountain", "nature", "romantic"],
  },
  {
    title: "Varanasi Ganges Spiritual Experience",
    destination: "Varanasi, India",
    numberOfNights: 2,
    description: "Embark on a profound spiritual tour of Varanasi. Observe fire worship aarti on the river and visit the ancient ruins of Sarnath.",
    budget: { min: 100, max: 300, currency: "USD" },
    bestTimeToVisit: "October - March",
    highlights: ["Dashashwamedh Ghat Ganga Aarti", "Sarnath Stupa Archaeological Walk", "Kashi Vishwanath Golden Temple", "Ganges Sunrise Boat Cruise"],
    tags: ["spiritual", "cultural", "history"],
  },
  {
    title: "Agra Taj Mahal & Historical Fort Day Tour",
    destination: "Agra, India",
    numberOfNights: 1,
    description: "See the world-famous Taj Mahal at sunrise, explore the imperial Agra Fort, and visit the ghost city of Fatehpur Sikri.",
    budget: { min: 80, max: 250, currency: "USD" },
    bestTimeToVisit: "October - March",
    highlights: ["Taj Mahal Sunrise Observation", "Agra Fort Royal Chambers", "Fatehpur Sikri Mughal Palace", "Mehtab Bagh Garden Views"],
    tags: ["history", "family", "cultural"],
  },
  {
    title: "Rishikesh Ganges Rafting & Ashram Retreat",
    destination: "Rishikesh, India",
    numberOfNights: 3,
    description: "A perfect mix of adrenaline-pumping white water rafting and peaceful yoga practice at a historic ashram.",
    budget: { min: 120, max: 350, currency: "USD" },
    bestTimeToVisit: "September - April",
    highlights: ["White-water Ganges Rapids Rafting", "Beatles Swarg Ashram Walk", "Triveni Ghat Evening Aarti", "Himalayan Foothills Nature Hike"],
    tags: ["adventure", "spiritual", "mountain"],
  },
  {
    title: "Darjeeling Mountain Views & UNESCO Toy Train",
    destination: "Darjeeling, India",
    numberOfNights: 3,
    description: "Catch a spectacular sunrise over Mount Kanchenjunga, ride the vintage steam Toy Train, and stroll through emerald tea estates.",
    budget: { min: 150, max: 500, currency: "USD" },
    bestTimeToVisit: "March - May, October - December",
    highlights: ["Tiger Hill Snowy Peak Sunrise", "Darjeeling Toy Train Ride", "Happy Valley Tea Estate Tour", "Visit Ghoom Monastery"],
    tags: ["mountain", "nature", "adventure"],
  },
  {
    title: "Andaman Islands Beach Escapade & Snorkeling",
    destination: "Andaman, India",
    numberOfNights: 5,
    description: "Escape to Havelock Island for snorkeling, relaxing under coconut palms, and exploring historic ruins at Ross Island.",
    budget: { min: 500, max: 1600, currency: "USD" },
    bestTimeToVisit: "October - May",
    highlights: ["Radhanagar Turquoise Beach Sunset", "Elephant Beach Coral Snorkeling", "Port Blair Cellular Jail Light Show", "Scuba Diving Experience"],
    tags: ["beach", "adventure", "nature"],
  },
  {
    title: "Paris Romantic Art & Gastronomy Escape",
    destination: "Paris, France",
    numberOfNights: 4,
    description: "Experience the romance of Paris. Climb the Eiffel Tower, view classical masterpieces at the Louvre, and cruise the Seine River.",
    budget: { min: 900, max: 2800, currency: "USD" },
    bestTimeToVisit: "April - October",
    highlights: ["Eiffel Tower Top Deck Views", "Louvre Museum Art Tour", "Seine River Evening Cruise", "Montmartre Artist Quarter Stroll"],
    tags: ["romantic", "cultural", "luxury"],
  },
  {
    title: "London Historic Highlights & Palace Tour",
    destination: "London, UK",
    numberOfNights: 5,
    description: "Discover London's rich history, explore the grand British Museum, fly on the London Eye, and walk past Buckingham Palace.",
    budget: { min: 700, max: 2200, currency: "USD" },
    bestTimeToVisit: "May - September",
    highlights: ["British Museum Historical Walk", "London Eye Flight over Thames", "Tower of London Crown Jewels", "Westminster Abbey Landmark Walk"],
    tags: ["cultural", "history", "family"],
  },
  {
    title: "New York Big Apple City & Central Park Tour",
    destination: "New York, USA",
    numberOfNights: 4,
    description: "Explore the bustling streets of Manhattan. Walk through Times Square, climb the Empire State Building, and bike through Central Park.",
    budget: { min: 1100, max: 3800, currency: "USD" },
    bestTimeToVisit: "September - November, April - June",
    highlights: ["Empire State Skyline Observatory", "Central Park Guided Bike Tour", "Times Square Theater District Stroll", "Statue of Liberty Ferry Tour"],
    tags: ["cultural", "luxury", "budget"],
  },
  {
    title: "Tokyo Neons, Ancient Shrines & Ramen Tour",
    destination: "Tokyo, Japan",
    numberOfNights: 6,
    description: "Discover the amazing contrast of Tokyo's neon skyscrapers in Shinjuku and the quiet ancient temples of Asakusa.",
    budget: { min: 1000, max: 3200, currency: "USD" },
    bestTimeToVisit: "March - May, September - November",
    highlights: ["Asakusa Sensō-ji Temple Walk", "Shibuya Crossing Walking Experience", "Meiji Shrine Forest Walk", "Shinjuku Street Food Tour"],
    tags: ["cultural", "food", "history"],
  },
  {
    title: "Dubai Desert Safari & Burj Khalifa Heights",
    destination: "Dubai, UAE",
    numberOfNights: 4,
    description: "Experience modern luxury. Climb the world's tallest building, go dune bashing in the desert, and enjoy luxury beach resorts.",
    budget: { min: 900, max: 3200, currency: "USD" },
    bestTimeToVisit: "November - March",
    highlights: ["Burj Khalifa Observation Deck", "Desert Safari Dunes Dune Bashing", "Dubai Mall Aquarium & Fountains", "Jumeirah Beach Club Relaxation"],
    tags: ["luxury", "adventure", "family"],
  },
  {
    title: "Singapore Futuristic Gardens & Theme Parks",
    destination: "Singapore",
    numberOfNights: 3,
    description: "Visit the spectacular Gardens by the Bay, walk the skyway between Supertrees, and spend a fun day at Sentosa Island theme parks.",
    budget: { min: 500, max: 1600, currency: "USD" },
    bestTimeToVisit: "Year-round",
    highlights: ["Gardens by the Bay Supertrees Walk", "Universal Studios Sentosa Island", "Marina Bay Waterfront Stroll", "Chinatown Heritage & Food Walk"],
    tags: ["family", "nature", "adventure"],
  },
  {
    title: "Bali Tropical Rice Terraces & Sunset Cliff Temples",
    destination: "Bali, Indonesia",
    numberOfNights: 6,
    description: "Relax in Ubud's lush rice fields, walk the Monkey Forest sanctuary, and watch spectacular cliff edge sunsets at Uluwatu Temple.",
    budget: { min: 450, max: 1600, currency: "USD" },
    bestTimeToVisit: "April - October",
    highlights: ["Tegallalang Terraced Rice Fields Walk", "Uluwatu Temple Cliff Sunset", "Ubud Sacred Monkey Forest Visit", "Seminyak Beach Sunset Club"],
    tags: ["beach", "nature", "spiritual"],
  },
  {
    title: "Rome Imperial Colosseum & Vatican Treasures",
    destination: "Rome, Italy",
    numberOfNights: 4,
    description: "Explore the ancient Roman Empire ruins, visit the historic Vatican museums, and toss a coin in the beautiful Trevi Fountain.",
    budget: { min: 550, max: 2000, currency: "USD" },
    bestTimeToVisit: "April - June, September - October",
    highlights: ["Colosseum & Roman Forum Walk", "Vatican Museum & Sistine Chapel", "Trevi Fountain Coin Toss", "Piazza Navona Gelato Stroll"],
    tags: ["history", "cultural", "food"],
  },
  {
    title: "Barcelona Gaudí Masterpieces & Coastal Walk",
    destination: "Barcelona, Spain",
    numberOfNights: 3,
    description: "Marvel at Antoni Gaudí's spectacular unfinished Sagrada Família, walk Park Güell, and enjoy seafood along Barceloneta beach.",
    budget: { min: 400, max: 1300, currency: "USD" },
    bestTimeToVisit: "May - October",
    highlights: ["Sagrada Família Cathedral Interior", "Park Güell Whimsical Mosaics Walk", "Gothic Quarter Historical Stroll", "Barceloneta Beach Tapas Dinner"],
    tags: ["beach", "cultural", "food"],
  },
  {
    title: "Switzerland Top of Europe Alps & Lakes Tour",
    destination: "Switzerland",
    numberOfNights: 5,
    description: "Ride the cogwheel train to the top of Europe in Interlaken, walk through beautiful snow valleys, and cruise Lake Zurich.",
    budget: { min: 1100, max: 4500, currency: "USD" },
    bestTimeToVisit: "December - April, June - September",
    highlights: ["Jungfraujoch Snow Peak Observatory", "Lake Zurich Steamboat Cruise", "Interlaken Valley Panoramic Walks", "Lucerne Historic Chapel Bridge"],
    tags: ["mountain", "nature", "luxury"],
  },
  {
    title: "Bangkok Golden Temples & Street Markets",
    destination: "Bangkok, Thailand",
    numberOfNights: 3,
    description: "Discover Bangkok's magnificent royal palaces, take a boat down the Chao Phraya River, and shop at the massive Chatuchak weekend market.",
    budget: { min: 250, max: 900, currency: "USD" },
    bestTimeToVisit: "November - February",
    highlights: ["Grand Palace & Emerald Buddha", "Chatuchak Market Weekend Shopping", "Wat Arun Riverside Temple Visit", "Chinatown Street Food Walk"],
    tags: ["cultural", "budget", "food"],
  },
  {
    title: "Istanbul Bosphorus & Hagia Sophia Historic Tour",
    destination: "Istanbul, Turkey",
    numberOfNights: 4,
    description: "Explore the fascinating melting pot of Europe and Asia. Visit Hagia Sophia, cruise the Bosphorus Strait, and shop at the Grand Bazaar.",
    budget: { min: 400, max: 1300, currency: "USD" },
    bestTimeToVisit: "April - June, September - November",
    highlights: ["Hagia Sophia Imperial Dome Tour", "Bosphorus Evening Dinner Cruise", "Grand Bazaar Spice & Carpet Shopping", "Topkapi Palace Royal Treasury"],
    tags: ["cultural", "history", "food"],
  },
  {
    title: "Sydney Opera House & Bondi Coastal Trail",
    destination: "Sydney, Australia",
    numberOfNights: 5,
    description: "Tour the sail-shaped Opera House, walk past breathtaking coastal cliffs to Bondi Beach, and cruise the beautiful Sydney Harbour.",
    budget: { min: 900, max: 3000, currency: "USD" },
    bestTimeToVisit: "September - November, March - May",
    highlights: ["Sydney Opera House Architecture Tour", "Bondi to Coogee Scenic Coastal Walk", "Sydney Harbour Bridge Ferry Cruise", "Stroll through Royal Botanic Gardens"],
    tags: ["beach", "nature", "solo"],
  },
  {
    title: "Munich Bavarian Castles & English Garden",
    destination: "Munich, Germany",
    numberOfNights: 3,
    description: "Discover Munich's Marienplatz historical clock, stroll through the massive English Garden, and take a day trip to fairytale Neuschwanstein Castle.",
    budget: { min: 350, max: 1200, currency: "USD" },
    bestTimeToVisit: "May - October, December",
    highlights: ["Marienplatz Glockenspiel Show", "English Garden Eisbach Surfers Watch", "Neuschwanstein Castle Fairytale Excursion", "Bavarian Food & Beer Hall Evening"],
    tags: ["cultural", "history", "adventure"],
  },
  {
    title: "Cape Town Coastline & Table Mountain Explorer",
    destination: "Cape Town, South Africa",
    numberOfNights: 5,
    description: "Ride the cable car to Table Mountain peak, see the wild African penguins at Boulders Beach, and enjoy the active Victoria & Alfred Waterfront.",
    budget: { min: 550, max: 2000, currency: "USD" },
    bestTimeToVisit: "November - March",
    highlights: ["Table Mountain Cableway Ride", "Boulders Beach Wild Penguins Watch", "Cape of Good Hope Peninsula Drive", "V&A Waterfront Shopping & Dining"],
    tags: ["nature", "adventure", "beach"],
  },
  {
    title: "Cairo Pyramids, Sphinx & Nile Cruise",
    destination: "Cairo, Egypt",
    numberOfNights: 4,
    description: "See the spectacular ancient Giza Pyramids, take a guided tour of the mummies and treasures at the Egyptian Museum, and sail the Nile.",
    budget: { min: 350, max: 1100, currency: "USD" },
    bestTimeToVisit: "October - April",
    highlights: ["Giza Pyramids & Sphinx Discovery", "Egyptian Museum Tutankhamun Treasures", "Khan el-Khalili Ancient Bazar Shopping", "Nile River Traditional Felucca Sail"],
    tags: ["history", "cultural", "adventure"],
  },
  {
    title: "Reykjavik Geysers, Waterfalls & Blue Lagoon",
    destination: "Reykjavik, Iceland",
    numberOfNights: 4,
    description: "Tour the famous Golden Circle waterfalls and geysers, soak in the relaxing warm mineral waters of the Blue Lagoon, and spot Northern Lights.",
    budget: { min: 900, max: 2800, currency: "USD" },
    bestTimeToVisit: "September - April, June - August",
    highlights: ["Golden Circle Gullfoss & Geysers", "Blue Lagoon Geothermal Mineral Soak", "Þingvellir National Park Continental Rift", "Northern Lights Hunt Excursion"],
    tags: ["nature", "adventure", "nature"],
  },
  {
    title: "Delhi, Agra & Jaipur Golden Triangle Tour",
    destination: "Delhi, India",
    numberOfNights: 4,
    description: "The classic Northern India tour. Discover historic monuments in Delhi, the Taj Mahal in Agra, and Amber Fort in Jaipur.",
    budget: { min: 300, max: 1000, currency: "USD" },
    bestTimeToVisit: "October - March",
    highlights: ["Taj Mahal Sunrise Tour (Agra)", "Amber Fort Hilltop Excursion (Jaipur)", "Red Fort & Humayun's Tomb (Delhi)", "Jaipur Palace & Bazar Stroll"],
    tags: ["history", "cultural", "family"],
  },
  {
    title: "Bali Luxury Villa Wellness & Beach Honeymoon",
    destination: "Bali, Indonesia",
    numberOfNights: 5,
    description: "Enjoy private pool villa accommodation in Ubud, relax with holistic wellness therapies, and watch spectacular coastal sunsets.",
    budget: { min: 900, max: 2800, currency: "USD" },
    bestTimeToVisit: "April - October",
    highlights: ["Ubud Private Pool Villa Stay", "Tegallalang Terraced Fields Tour", "Uluwatu Sunset Cliff Temple Dance", "Wellness Massage & Flower Bath"],
    tags: ["romantic", "beach", "luxury"],
  },
  {
    title: "Kashmir Peak Season Winter Snow Escape",
    destination: "Kashmir, India",
    numberOfNights: 4,
    description: "Enjoy a winter wonderland stay. Experience snow skiing in Gulmarg, dal lake shikara boat ride, and frozen waterfalls in Pahalgam.",
    budget: { min: 350, max: 1200, currency: "USD" },
    bestTimeToVisit: "December - February",
    highlights: ["Gulmarg Snow Gondola Ride", "Dal Lake Houseboat Winter Stay", "Pahalgam Valley Pine Snow Walk", "Srinagar Mugal Gardens Views"],
    tags: ["snowfall", "mountain", "family"],
  }
]

const seedData = async () => {
  try {
    await connectDB()

    // Clear existing database collections
    console.log("Clearing existing activities, days, and itineraries...")
    await Activity.deleteMany({})
    await Day.deleteMany({})
    await Itinerary.deleteMany({})

    console.log("Database cleared. Generating fresh original itineraries...")

    const usedCoverStems = new Set()

    for (const itineraryData of ITINERARIES_LIST) {
      console.log(`Processing itinerary: ${itineraryData.title}`)

      const destInfo = DESTINATION_LOOKUP[itineraryData.destination]
      if (!destInfo) {
        throw new Error(`Destination details mapping missing for: ${itineraryData.destination}`)
      }

      const totalDays = itineraryData.numberOfNights + 1
      const createdDays = []

      for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
        const hotel = destInfo.hotels[dayNum % destInfo.hotels.length]
        const createdActivities = []

        // Day 1 has 2 activities, intermediate days have 3 activities, last day has 1-2 activities
        const activityCount = dayNum === 1 ? 2 : dayNum === totalDays ? 1 : 3

        for (let aIdx = 0; aIdx < activityCount; aIdx++) {
          const rawAct = destInfo.activities[(dayNum * 2 + aIdx) % destInfo.activities.length]

          const time = aIdx === 0 ? "10:00 AM" : aIdx === 1 ? "03:00 PM" : "07:30 PM"
          const activity = await Activity.create({
            name: `${rawAct.name}`,
            description: rawAct.description,
            time,
            location: rawAct.location,
            category: rawAct.category || "sightseeing",
            duration: "2-3 hours",
            cost: Math.round((itineraryData.budget.max / totalDays / 3) * (0.6 + aIdx * 0.3)),
          })
          createdActivities.push(activity._id)
        }

        const day = await Day.create({
          dayNumber: dayNum,
          dayLabel: dayNum === 1 ? "Arrival & Welcome" : dayNum === totalDays ? "Farewell & Departure" : `Exploring ${itineraryData.destination.split(',')[0]}`,
          hotel: {
            name: hotel.name,
            location: hotel.location,
            rating: hotel.rating,
          },
          activities: createdActivities,
        })
        createdDays.push(day._id)
      }

      // Fetch cover image using tripImageService helper
      const coverImage = await getTripCoverImage(
        { ...itineraryData, days: itineraryData.days },
        { excludeStems: usedCoverStems },
      )
      if (coverImage?.url) {
        const stem = coverImage.url.split("?")[0].toLowerCase()
        usedCoverStems.add(stem)
      }

      await Itinerary.create({
        ...itineraryData,
        days: createdDays,
        coverImage,
        createdBy: "System",
        isRecommended: true,
      })
    }

    console.log("✅ New itineraries seeded successfully!")
    console.log(`Created ${ITINERARIES_LIST.length} itineraries with complete days and activities database references.`)
    process.exit(0)
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  }
}

seedData()
