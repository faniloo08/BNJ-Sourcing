"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }
    checkAuth()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">BNJ Sourcing</h1>
            <div className="flex gap-2">
              {isLoggedIn ? (
                <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="outline">Se connecter</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button>S'inscrire</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h2 className="text-5xl font-bold text-foreground">Trouvez les meilleurs talents en Afrique</h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Recherchez sur LinkedIn, Facebook, et d'autres plateformes francophones africaines en quelques clics.
            </p>
            <div className="flex gap-4 justify-center">
              {!isLoggedIn && (
                <>
                  <Link href="/auth/signup">
                    <Button size="lg">Commencer gratuitement</Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button size="lg" variant="outline">
                      Se connecter
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Multi-Plateforme",
                description: "Recherchez sur LinkedIn, Facebook, Indeed et autres plateformes",
              },
              {
                title: "Filtres Avancés",
                description: "Filtrez par compétences, expérience, localisation et bien plus",
              },
              {
                title: "Sauvegarde Simple",
                description: "Enregistrez et organisez les profils trouvés facilement",
              },
            ].map((feature, i) => (
              <div key={i} className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
