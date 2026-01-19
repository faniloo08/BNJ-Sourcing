import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { FoundProfile } from "./search-page-content"
import { ProfileDetailsDialog } from "./profile-details-dialog"

interface SearchResultsListProps {
  results: FoundProfile[]
  isLoading: boolean
  searchTitle: string
}

const PLATFORM_COLORS = {
  LinkedIn: "bg-[#0077B5] text-white", // Update to official LinkedIn color for better recognition
  Facebook: "bg-[#1877F2] text-white",
  Twitter: "bg-[#1DA1F2] text-white",
  Indeed: "bg-[#2164f3] text-white",
  "Job Boards": "bg-gray-100 text-gray-800",
  Autres: "bg-gray-100 text-gray-800",
}

export function SearchResultsList({ results, isLoading, searchTitle }: SearchResultsListProps) {
  const [savedProfiles, setSavedProfiles] = useState<Set<string>>(new Set())
  const [selectedProfile, setSelectedProfile] = useState<FoundProfile | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const handleSaveProfile = (profileId: string) => {
    setSavedProfiles((prev) => {
      const next = new Set(prev)
      if (next.has(profileId)) {
        next.delete(profileId)
      } else {
        next.add(profileId)
      }
      return next
    })
  }

  const handleViewProfile = (profile: FoundProfile) => {
    if (profile.profileData) {
      setSelectedProfile(profile)
      setDetailsOpen(true)
    } else if (profile.profileUrl) {
      window.open(profile.profileUrl, "_blank")
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
              <p className="text-muted-foreground">Recherche en cours...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Aucun résultat trouvé</p>
              <p className="text-sm text-muted-foreground">Essayez d'ajuster vos critères de recherche</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{searchTitle}</span>
            <span className="text-base font-normal text-muted-foreground">{results.length} résultats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((profile) => (
              <div key={profile.id} className="border rounded-lg p-4 hover:bg-card/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{profile.name}</h3>
                    {profile.title && <p className="text-sm text-muted-foreground mt-1">{profile.title}</p>}
                    <div className="flex items-center gap-2 mt-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${PLATFORM_COLORS[profile.platform as keyof typeof PLATFORM_COLORS] || "bg-gray-100 text-gray-800"}`}
                      >
                        {profile.platform}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {profile.status === "found" ? "Trouvé" : "Contacté"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewProfile(profile)}>
                      Voir le profil
                    </Button>
                    <Button
                      variant={savedProfiles.has(profile.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSaveProfile(profile.id)}
                    >
                      {savedProfiles.has(profile.id) ? "✓ Sauvegardé" : "Sauvegarder"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ProfileDetailsDialog
        profile={selectedProfile}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  )
}
