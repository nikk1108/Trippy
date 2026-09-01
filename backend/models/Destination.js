import mongoose from "mongoose"
import { CURRENCY_CODES, DEFAULT_CURRENCY } from "../constants/currencies.js"

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Destination name is required"],
      unique: true,
      trim: true,
      index: true,
    },
    normalizedName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    country: {
      type: String,
      trim: true,
    },
    region: {
      type: String,
      trim: true,
    },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    image: {
      url: { type: String, trim: true },
      alt: { type: String, trim: true },
    },
    description: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    activities: [
      {
        type: String,
        trim: true,
      },
    ],
    hotels: [
      {
        type: String,
        trim: true,
      },
    ],
    restaurants: [
      {
        type: String,
        trim: true,
      },
    ],
    recommendedDuration: {
      type: Number,
      default: 3,
      min: 1,
    },
    estimatedBudget: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: {
        type: String,
        enum: CURRENCY_CODES,
        default: DEFAULT_CURRENCY,
      },
    },
    popularity: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },
    source: {
      type: String,
      enum: ["static", "google-places", "nominatim", "ai"],
      default: "static",
    },
    externalPlaceId: {
      type: String,
      trim: true,
      sparse: true,
      index: true,
    },
    cachedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

const Destination = mongoose.model("Destination", destinationSchema)
export default Destination
