import { ApifyClient } from "apify-client"

const apifyToken = process.env.APIFY_API_TOKEN
if (!apifyToken) {
  throw new Error("APIFY_API_TOKEN environment variable is required")
}

export const apifyClient = new ApifyClient({ token: apifyToken })