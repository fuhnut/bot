"use client"

import { useEffect } from "react"
import { useSiteConfig } from "@/lib/site-config"

export default function DiscordRedirect() {
  const { config } = useSiteConfig()

  useEffect(() => {
    // Redirect to Discord server from config
    if (config?.discordServerInvite) {
      window.location.href = config.discordServerInvite
    }
  }, [config])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">going to the serve</p>
      </div>
    </div>
  )
}
