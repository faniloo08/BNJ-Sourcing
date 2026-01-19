"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface FavoriteProfile {
  id: string
  profile_id: string
  found_profiles: {
    id: string
    name: string
    title: string
    platform: string
    profile_url: string
    created_at: string
  }
}

const PLATFORM_COLORS = {
  LinkedIn: "bg-[#C194E0] text-[#590293]",
  Facebook: "bg-[#C194E0] text-[#590293]",
  Twitter: "bg-[#C194E0] text-[#590293]",
  Indeed: "bg-[#C194E0] text-[#590293]",
  "Job Boards": "bg-[#C194E0] text-[#590293]",
  Autres: "bg-[#C194E0] text-[#590293]",
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("*, found_profiles(*)")
          .order("created_at", { ascending: false })

        if (error) throw error
        setFavorites(data || [])
      } catch (error) {
        console.error("[v0] Fetch favorites error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase.from("favorites").delete().eq("id", favoriteId)
      if (error) throw error
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId))
    } catch (error) {
      console.error("[v0] Remove favorite error:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
          <p className="text-muted-foreground">Chargement des favoris...</p>
        </div>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <p className="text-muted-foreground">Aucun favori sauvegardé</p>
            <Button onClick={() => router.push("/dashboard")}>Rechercher des profils</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Favoris</h1>
        <p className="text-muted-foreground mt-2">Vos profils sauvegardés</p>
      </div>

      <div className="grid gap-4">
        {favorites.map((favorite) => (
          <Card key={favorite.id} className="overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{favorite.found_profiles.name}</h3>
                  {favorite.found_profiles.title && (
                    <p className="text-sm text-muted-foreground mt-1">{favorite.found_profiles.title}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${PLATFORM_COLORS[favorite.found_profiles.platform as keyof typeof PLATFORM_COLORS] || "bg-gray-100 text-gray-800"}`}
                    >
                      {favorite.found_profiles.platform}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(favorite.found_profiles.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {favorite.found_profiles.profile_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(favorite.found_profiles.profile_url, "_blank")}
                    >
                      Voir le profil
                    </Button>
                  )}
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveFavorite(favorite.id)}>
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
