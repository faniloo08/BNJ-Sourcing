"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface SearchFilters {
  keywords: string
  platforms: string[]
  countries: string[]
  jobTitles: string
  experienceLevel: string
}

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => Promise<void>
  isLoading?: boolean
}

const PLATFORMS = ["LinkedIn", "Facebook", "Twitter", "Indeed", "Job Boards", "Autres"]
const AFRICAN_COUNTRIES = [
  "Sénégal",
  "Côte d'Ivoire",
  "Cameroun",
  "Congo RDC",
  "Burkina Faso",
  "Mali",
  "Benin",
  "Togo",
  "Guinea",
  "Rwanda",
  "Kenya",
  "Tanzanie",
  "Ouganda",
  "Madagascar",
  "Maroc",
  "Tunisie",
  "Égypte",
]

const EXPERIENCE_LEVELS = ["Débutant", "Junior", "Intermédiaire", "Senior", "Expert"]

export function SearchFiltersComponent({ onSearch, isLoading = false }: SearchFiltersProps) {
  const [keywords, setKeywords] = useState("")
  const [jobTitles, setJobTitles] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
  }

  const handleCountryToggle = (country: string) => {
    setSelectedCountries((prev) => (prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!keywords.trim() || selectedPlatforms.length === 0 || selectedCountries.length === 0) {
      alert("Veuillez remplir les champs requis")
      return
    }

    await onSearch({
      keywords,
      platforms: selectedPlatforms,
      countries: selectedCountries,
      jobTitles,
      experienceLevel,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recherche Multi-Plateforme</CardTitle>
        <CardDescription>Définissez vos critères de recherche pour trouver les meilleurs talents</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Keywords Section */}
          <div className="grid gap-4">
            <Label htmlFor="keywords">Mots-clés *</Label>
            <Input
              id="keywords"
              placeholder="Ex: Python, Data Science, DevOps..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Entrez les compétences ou domaines de recherche</p>
          </div>

          {/* Platforms Section */}
          <div className="grid gap-4">
            <Label>Plateformes *</Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PLATFORMS.map((platform) => {
                const isLinkedIn = platform === "LinkedIn"
                const isDisabled = !isLinkedIn

                return (
                  <div key={platform} className="flex items-center space-x-2">
                    {isDisabled ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
                              <Checkbox
                                id={`platform-${platform}`}
                                checked={selectedPlatforms.includes(platform)}
                                onCheckedChange={() => handlePlatformToggle(platform)}
                                disabled={true}
                              />
                              <label
                                htmlFor={`platform-${platform}`}
                                className="text-sm font-medium leading-none cursor-not-allowed"
                              >
                                {platform}
                              </label>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Fonctionnalité disponible prochainement</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <>
                        <Checkbox
                          id={`platform-${platform}`}
                          checked={selectedPlatforms.includes(platform)}
                          onCheckedChange={() => handlePlatformToggle(platform)}
                        />
                        <label
                          htmlFor={`platform-${platform}`}
                          className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {platform}
                        </label>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Countries Section */}
          <div className="grid gap-4">
            <Label>Pays *</Label>
            <div className="grid max-h-64 gap-3 overflow-y-auto grid-cols-2 sm:grid-cols-3">
              {AFRICAN_COUNTRIES.map((country) => (
                <div key={country} className="flex items-center space-x-2">
                  <Checkbox
                    id={`country-${country}`}
                    checked={selectedCountries.includes(country)}
                    onCheckedChange={() => handleCountryToggle(country)}
                  />
                  <label
                    htmlFor={`country-${country}`}
                    className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {country}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-primary hover:underline"
          >
            {showAdvanced ? "Masquer les filtres avancés" : "Afficher les filtres avancés"}
          </button>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid gap-4">
                <Label htmlFor="jobTitles">Titres de poste</Label>
                <Input
                  id="jobTitles"
                  placeholder="Ex: Data Engineer, Product Manager..."
                  value={jobTitles}
                  onChange={(e) => setJobTitles(e.target.value)}
                />
              </div>

              <div className="grid gap-4">
                <Label htmlFor="experience">Niveau d'expérience</Label>
                <select
                  id="experience"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Tous les niveaux</option>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Recherche en cours..." : "Lancer la recherche"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
