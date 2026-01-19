"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Search {
  id: string
  title: string
  keywords: string[]
  platforms: string[]
  countries: string[]
  created_at: string
}

export function HistoryContent() {
  const [searches, setSearches] = useState<Search[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchSearches = async () => {
      try {
        const { data, error } = await supabase.from("searches").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setSearches(data || [])
      } catch (error) {
        console.error("[v0] Fetch searches error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSearches()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
          <p className="text-muted-foreground">Chargement de l'historique...</p>
        </div>
      </div>
    )
  }

  if (searches.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <p className="text-muted-foreground">Aucune recherche précédente</p>
            <Button onClick={() => router.push("/dashboard")}>Effectuer une nouvelle recherche</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Historique des recherches</h1>
        <p className="text-muted-foreground mt-2">Consultez toutes vos recherches précédentes</p>
      </div>

      <div className="space-y-4">
        {searches.map((search) => (
          <Card key={search.id} className="hover:bg-card/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{search.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {new Date(search.created_at).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/search/${search.id}`)}>
                  Voir les résultats
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mots-clés</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {search.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Plateformes</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {search.platforms.map((platform) => (
                      <span key={platform} className="text-xs text-muted-foreground">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pays</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {search.countries.map((country) => (
                      <span key={country} className="text-xs text-muted-foreground">
                        {country}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
