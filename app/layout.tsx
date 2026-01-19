import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BNJ Sourcing - Trouvez les meilleurs talents en Afrique",
  description: "Plateforme de sourcing multi-canaux pour recruter en Afrique francophone",
  generator: "v0.app",
  icons: {
    icon: "/logo.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`font-sans antialiased`}>
        {children}
        {/* Analytics component removed as per updates */}
      </body>
    </html>
  )
}
