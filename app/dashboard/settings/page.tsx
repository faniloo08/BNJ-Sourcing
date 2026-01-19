"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UserProfile {
  full_name: string
  company: string
  email: string
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    full_name: "",
    company: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()

          if (data) {
            setProfile({
              full_name: data.full_name || "",
              company: data.company || "",
              email: user.email || "",
            })
          } else {
            setProfile((prev) => ({
              ...prev,
              email: user.email || "",
            }))
          }
        }
      } catch (error) {
        console.error("[v0] Fetch profile error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase.from("profiles").upsert({
        full_name: profile.full_name,
        company: profile.company,
      })

      if (error) throw error
      alert("Profil mis à jour avec succès")
    } catch (error) {
      console.error("[v0] Save profile error:", error)
      alert("Erreur lors de la sauvegarde")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
          <p className="text-muted-foreground">Chargement des paramètres...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-2">Gérez votre profil et vos préférences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du profil</CardTitle>
          <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={profile.email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Votre email ne peut pas être modifié</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              type="text"
              value={profile.full_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setProfile((prev) => ({ ...prev, full_name: e.target.value }))
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="company">Entreprise</Label>
            <Input
              id="company"
              type="text"
              value={profile.company}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setProfile((prev) => ({ ...prev, company: e.target.value }))
              }
            />
          </div>

          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Sauvegarde en cours..." : "Sauvegarder les modifications"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
