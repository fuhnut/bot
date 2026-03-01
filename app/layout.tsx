import { Suspense } from "react"
import "./globals.css"
import type React from "react"
import type { Metadata, Viewport } from "next"
import { Providers } from "./providers"
import DynamicFavicon from "./components/DynamicFavicon"
import { getMetadataConfig } from "@/lib/metadata-config"
import Header from "./components/Header"

const config = getMetadataConfig()

export const metadata: Metadata = {
  title: `${config.botName}`,
  description: config.description,
  icons: {
    icon: [
      { url: config.favicon, type: "image/png" },
      { url: config.botLogo, type: "image/png", sizes: "512x512" },
    ],
    apple: config.botLogo,
  },
  openGraph: {
    title: `${config.botName}`,
    description: config.description,
    type: "website",
    url: config.discordServerInvite,
    images: [
      {
        url: config.image,
        width: 256,
        height: 256,
        alt: config.botName,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${config.botName}`,
    description: config.description,
    images: [config.image],
    creator: "@discord",
  },
  generator: '69'
}

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#050505]">
        <DynamicFavicon />
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-20 relative">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
