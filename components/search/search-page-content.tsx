"use client"

import { useState } from "react"
import { SearchFiltersComponent, type SearchFilters } from "./search-filters"
import { SearchResultsList } from "./search-results-list"

interface SearchPageContentProps {
  userId: string
}

export interface FoundProfile {
  id: string
  name: string
  title?: string
  platform: string
  profileUrl?: string
  email?: string | null
  location?: string | null
  status: string
  profileData?: any // Full rich data from provider
}

export function SearchPageContent({ userId }: SearchPageContentProps) {
  const [results, setResults] = useState<FoundProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTitle, setSearchTitle] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (filters: SearchFilters) => {
    setIsLoading(true)
    setHasSearched(true)
    try {
      const response = await fetch("/api/searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: filters.keywords, // API expects "query" not "title" or "keywords"
          platforms: filters.platforms,
          countries: filters.countries,
          jobTitles: filters.jobTitles ? filters.jobTitles.split(",").map((j) => j.trim()) : [],
          experienceLevel: filters.experienceLevel,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erreur lors de la recherche")
      }

      const data = await response.json()
      console.log("[v0] Search results received:", data.results?.length || 0, "profiles")

      setResults(data.results || [])
      setSearchTitle(data.searchTitle)

      if (!data.results || data.results.length === 0) {
        alert("Aucun résultat trouvé. Vérifiez vos critères de recherche.")
      }
    } catch (error) {
      console.error("[v0] Search error:", error)
      alert(`Erreur lors de la recherche: ${error instanceof Error ? error.message : "erreur inconnue"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-8">
      <SearchFiltersComponent onSearch={handleSearch} isLoading={isLoading} />

      {hasSearched && <SearchResultsList results={results} isLoading={isLoading} searchTitle={searchTitle} />}
    </div>
  )
}
