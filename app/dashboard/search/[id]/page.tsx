"use client"

import { useEffect, useState, use } from "react"
import { createClient } from "@/lib/supabase/client"
import { SearchResultsList } from "@/components/search/search-results-list"
import type { FoundProfile } from "@/components/search/search-page-content"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

interface SearchDetailsPageProps {
    params: Promise<{
        id: string
    }>
}

export default function SearchDetailsPage({ params }: SearchDetailsPageProps) {
    const { id } = use(params)
    const [results, setResults] = useState<FoundProfile[]>([])
    const [searchTitle, setSearchTitle] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch search details
                const { data: search, error: searchError } = await supabase
                    .from("searches")
                    .select("title")
                    .eq("id", id)
                    .single()

                if (searchError) throw searchError
                setSearchTitle(search.title)

                // Fetch profiles
                const { data: profiles, error: profilesError } = await supabase
                    .from("found_profiles")
                    .select("*")
                    .eq("search_id", id)

                if (profilesError) throw profilesError

                // Map DB profiles to frontend shape
                const formattedResults: FoundProfile[] = (profiles || []).map((profile) => {
                    const data = profile.profile_data || {}
                    return {
                        id: profile.id,
                        name: profile.name,
                        title: profile.title,
                        platform: profile.platform,
                        profileUrl: profile.profile_url,
                        email: data.email || data.personal_email || null,
                        location: `${data.city || ""} ${data.country || ""}`.trim() || null,
                        status: profile.status,
                        profileData: data,
                    }
                })

                setResults(formattedResults)
            } catch (error) {
                console.error("Error fetching search details:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [id])

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Résultats de recherche</h1>
                    <p className="text-muted-foreground">
                        {searchTitle ? `Pour "${searchTitle}"` : "Chargement..."}
                    </p>
                </div>
            </div>

            <SearchResultsList
                results={results}
                isLoading={isLoading}
                searchTitle={searchTitle || "Résultats"}
            />
        </div>
    )
}
