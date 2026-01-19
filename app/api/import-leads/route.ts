import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

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
    const { searchId } = body

    if (!searchId) {
      return NextResponse.json({ error: "Missing searchId" }, { status: 400 })
    }

    // Verify the search belongs to the user
    const { data: search } = await supabase
      .from("searches")
      .select("id, user_id")
      .eq("id", searchId)
      .eq("user_id", user.id)
      .single()

    if (!search) {
      return NextResponse.json({ error: "Search not found" }, { status: 404 })
    }

    let allLeads: any[] = []

    try {
      // Read batch 1
      const batch1Path = join(process.cwd(), "public/leads/leads-batch-1.json")
      const batch1Data = await readFile(batch1Path, "utf-8")
      const batch1Leads = JSON.parse(batch1Data)
      allLeads = [...allLeads, ...batch1Leads]
      console.log("[v0] Loaded", batch1Leads.length, "leads from batch 1")
    } catch (error) {
      console.warn("[v0] Could not load batch 1:", error)
    }

    try {
      // Read batch 2
      const batch2Path = join(process.cwd(), "public/leads/leads-batch-2.json")
      const batch2Data = await readFile(batch2Path, "utf-8")
      const batch2Leads = JSON.parse(batch2Data)
      allLeads = [...allLeads, ...batch2Leads]
      console.log("[v0] Loaded", batch2Leads.length, "leads from batch 2")
    } catch (error) {
      console.warn("[v0] Could not load batch 2:", error)
    }

    if (allLeads.length === 0) {
      return NextResponse.json({ error: "No leads found in import files" }, { status: 400 })
    }

    // Transform leads data for database insertion
    const profilesData = allLeads.map((lead: any) => ({
      search_id: searchId,
      name: lead.full_name || `${lead.first_name || ""} ${lead.last_name || ""}`.trim() || "Unknown",
      title: lead.job_title || null,
      platform: "linkedin",
      profile_url: lead.linkedin || null,
      profile_data: {
        first_name: lead.first_name,
        last_name: lead.last_name,
        email: lead.email,
        personal_email: lead.personal_email,
        company_name: lead.company_name,
        company_website: lead.company_website,
        linkedin: lead.linkedin,
        job_title: lead.job_title,
        industry: lead.industry,
        seniority_level: lead.seniority_level,
        city: lead.city,
        state: lead.state,
        country: lead.country,
        company_description: lead.company_description,
        company_size: lead.company_size,
        company_annual_revenue: lead.company_annual_revenue,
        company_technologies: lead.company_technologies,
        keywords: lead.keywords,
      },
      status: "found",
    }))

    // Insert into database
    const { data: inserted, error: insertError } = await supabase.from("found_profiles").insert(profilesData).select()

    if (insertError) {
      console.error("[v0] Insert error:", insertError)
      return NextResponse.json({ error: "Failed to insert leads" }, { status: 500 })
    }

    console.log("[v0] Successfully imported", inserted?.length || 0, "leads")

    return NextResponse.json({
      success: true,
      imported: inserted?.length || 0,
      total: allLeads.length,
    })
  } catch (error) {
    console.error("[v0] Import error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
