import { createClient } from "@/lib/supabase/server"
import { ApifyClient } from "apify-client"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { query, platforms: rawPlatforms, countries, jobTitles, experienceLevel, keywords, fetchCount } = body

    // Normalize platforms to lowercase to handle "LinkedIn" vs "linkedin"
    const platforms = rawPlatforms.map((p: string) => p.toLowerCase())

    console.log("[v0] Received search request:", { query, platforms, countries, jobTitles, experienceLevel, fetchCount })

    // Ensure user profile exists
    const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

    if (!profile) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          email: user.email,
        },
      ])

      if (profileError) {
        console.error("[v0] Failed to create user profile:", profileError)
      }
    }

    const { data: search, error: searchError } = await supabase
      .from("searches")
      .insert([
        {
          user_id: user.id,
          title: query,
          keywords: keywords || [query], // Store secondary keywords
          platforms,
          countries,
          job_titles: jobTitles || [],
          experience_level: experienceLevel,
        },
      ])
      .select()
      .single()

    if (searchError) {
      console.error("[v0] Search save error:", searchError)
      return NextResponse.json({ error: "Failed to save search" }, { status: 500 })
    }

    let allResults: any[] = []

    if (platforms.includes("linkedin")) {
      try {
        const count = fetchCount || 100
        console.log(`[v0] Fetching from Apify with fetch_count: ${count}`)

        const apifyClient = new ApifyClient({
          token: process.env.APIFY_API_TOKEN,
        })

        // Map French country names to English for Apify
        const countryMap: Record<string, string> = {
          "Sénégal": "Senegal",
          "Côte d'Ivoire": "côte d'ivoire",
          "Cameroun": "Cameroon",
          "Congo RDC": "Democratic Republic of the Congo",
          "Burkina Faso": "Burkina Faso",
          "Mali": "Mali",
          "Benin": "Benin",
          "Togo": "Togo",
          "Guinea": "Equatorial Guinea",
          "Rwanda": "Rwanda",
          "Kenya": "Kenya",
          "Tanzanie": "Tanzania",
          "Ouganda": "Uganda",
          "Madagascar": "Madagascar",
          "Maroc": "Morocco",
          "Tunisie": "Tunisia",
          "Égypte": "Egypt",
        }

        const mappedCountries = countries.map((c: string) => (countryMap[c] || c).toLowerCase())

        console.log("[v0] Mapped countries:", mappedCountries)

        // Prepare company keywords: combine experience level and any secondary keywords
        const companyKeywords = [
          ...(experienceLevel ? [experienceLevel] : []),
          ...(keywords ? keywords : [])
        ]

        const run = await apifyClient.actor("code_crafter/leads-finder").call(
          {
            contact_job_title: jobTitles || [query], // Use specific job titles array
            contact_location: mappedCountries,
            fetch_count: count,
            email_status: ["validated", "not_validated", "unknown"], // Relax email filter
            company_keywords: companyKeywords, // Add experience level and other keywords to company keywords
          },
          {
            timeout: 120000, // 2 minutes timeout
          },
        )

        console.log("[v0] Apify run ID:", run.id)

        // Get results from Apify dataset
        const { items: leadsData } = await apifyClient.dataset(run.defaultDatasetId).listItems({
          limit: count,
        })

        console.log("[v0] Apify returned", leadsData.length, "leads")

        // Prepare profiles for DB insert - ONLY including columns that exist in found_profiles table
        const linkedinProfiles = leadsData.map((lead: any) => ({
          search_id: search.id,
          name: lead.full_name || lead.name || "Unknown",
          title: lead.job_title || lead.title || query, // Add title
          platform: "LinkedIn", // Store as capitalized for nicer display if DB allows, checks use lowercase
          profile_url: lead.linkedin || null,
          status: "found",
          profile_data: lead, // Full data stored here (includes email, location, etc)
        }))

        if (linkedinProfiles.length > 0) {
          const { data: insertedProfiles, error: insertError } = await supabase
            .from("found_profiles")
            .insert(linkedinProfiles)
            .select() // Select back to get IDs

          if (insertError) {
            console.error("[v0] Error inserting profiles:", insertError)
          } else {
            console.log("[v0] Saved", insertedProfiles.length, "profiles to Supabase")
            allResults = [...allResults, ...insertedProfiles]
          }
        }
      } catch (error) {
        console.error("[v0] Apify error:", error)
        // Log detailed error but don't fail the whole request
      }
    }

    const finalResults = allResults.slice(0, fetchCount || 50)

    const formattedResults = finalResults.map((profile) => {
      // Extract data from profile_data if not directly on profile
      const data = profile.profile_data || {}
      return {
        id: profile.id,
        name: profile.name,
        title: profile.title || data.job_title || data.title,
        platform: profile.platform,
        profileUrl: profile.profile_url,
        email: data.email || data.personal_email || null,
        location: `${data.city || ""} ${data.country || ""}`.trim() || null,
        status: profile.status,
        profileData: data, // Include full rich data
      }
    })

    console.log("[v0] Returning", formattedResults.length, "formatted results to frontend")

    return NextResponse.json({
      searchTitle: query,
      results: formattedResults,
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
