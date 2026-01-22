"use client"

import Link from "next/link"
import Image from "next/image"
import { useSiteConfig } from "@/lib/site-config"
import { AlertTriangle } from "lucide-react"

export default function NotFound() {
  const { config, loading } = useSiteConfig()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-[#FAFAFA]">
      <div className="max-w-md w-full text-center p-8 rounded-3xl bg-[#1B1B1B]/40 border border-[#FAFAFA]/5 backdrop-blur-sm">
        <div className="mx-auto w-28 h-28 relative mb-4">
          <Image src={config.botLogo} alt={config.botName} fill className="object-contain rounded-full" unoptimized />
        </div>

        <div className="flex items-center justify-center mb-4 text-yellow-400">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold mb-2">404 — Page not found</h1>
        <p className="text-[#CECECE] mb-6">Want to request this page to be added? Join our server.</p>

        <div className="flex gap-3 justify-center">
          <a
            href={config.inviteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-2xl bg-[#FAFAFA] text-[#0A0A0A] font-semibold"
          >
            Join Support Server
          </a>
          <Link href="/" className="px-4 py-2 rounded-2xl border border-[#FAFAFA]/10 text-[#FAFAFA]">
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
