"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              {/* <div className="w-11 h-7 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                BNJ
              </div> */}
              <img src="/logo-removebg-preview.png" alt="Logo" className="w-15 h-12" />
              <span className="font-bold text-foreground">BNJ Sourcing</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Accueil
              </Link>
              <Link href="/dashboard/history" className="text-sm font-medium hover:text-primary transition-colors">
                Historique
              </Link>
              <Link href="/dashboard/favorites" className="text-sm font-medium hover:text-primary transition-colors">
                Favoris
              </Link>
              <Link href="/dashboard/settings" className="text-sm font-medium hover:text-primary transition-colors">
                Paramètres
              </Link>
            </nav>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
