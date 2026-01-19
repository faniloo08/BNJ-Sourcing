import { apifyClient } from "./client"

interface LeadsFinderInput {
  search: string
  countries?: string[]
  company?: string
  limit?: number
  includeEmails?: boolean
}

interface Lead {
  name?: string
  title?: string
  email?: string
  linkedinProfileUrl?: string
  company?: string
  location?: string
}

export async function searchLinkedInLeads(input: LeadsFinderInput): Promise<Lead[]> {
  try {
    console.log("[v0] Starting Apify Leads Finder with input:", input)

    // Call the Apify Actor
    const run = await apifyClient.actor("code_crafter/leads-finder").call({
      search: input.search,
      searchType: "linkedIn", // Search LinkedIn specifically
      countries: input.countries || [],
      companyName: input.company,
      maxResults: input.limit || 50,
      includeEmails: input.includeEmails !== false, // Default to true
      proxyConfiguration: {
        useApifyProxy: true,
      },
    })

    console.log("[v0] Apify run completed, fetching dataset...")

    // Get the results from the dataset
    const dataset = await apifyClient.dataset(run.defaultDatasetId).listItems()
    console.log("[v0] Retrieved", dataset.items.length, "leads from Apify")

    return dataset.items as Lead[]
  } catch (error) {
    console.error("[v0] Apify error:", error)
    throw new Error(`Failed to fetch leads from Apify: ${error instanceof Error ? error.message : String(error)}`)
  }
}
