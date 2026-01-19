import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { SearchPageContent } from "@/components/search/search-page-content"

async function DashboardContent({ userId }: { userId: string }) {
  return <SearchPageContent userId={userId} />
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">BNJ Sourcing</h1>
              <p className="mt-1 text-sm text-muted-foreground">Trouvez les meilleurs talents en Afrique</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <DashboardContent userId={user.id} />
        </Suspense>
      </main>
    </div>
  )
}
