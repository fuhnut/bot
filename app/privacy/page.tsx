"use client"

import Navigation from "../components/Navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { useSiteConfig } from "@/lib/site-config"

export default function PrivacyPage() {
  const { config } = useSiteConfig()
  const botName = (config?.botName || "bot").toLowerCase()

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Navigation isDark={true} setIsDark={() => { }} />

      <main className="max-w-4xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter lowercase leading-[0.8] mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            privacy
          </h1>
          <p className="text-xl text-white/40 lowercase max-w-xl">
            last updated: january 2026. how we handle your data.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <section>
            <h2 className="text-2xl font-black lowercase mb-4 tracking-tight">1. collection</h2>
            <p className="text-white/40 lowercase text-lg leading-relaxed mb-4">we collect only what's needed for {botName} to function:</p>
            <ul className="space-y-2 text-white/30 lowercase text-lg list-disc pl-6">
              <li>server and user ids</li>
              <li>command execution logs</li>
              <li>custom server configurations</li>
              <li>temporary moderation data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black lowercase mb-4 tracking-tight">2. usage</h2>
            <p className="text-white/40 lowercase text-lg leading-relaxed">
              your data is used exclusively to provide the bot's features. we do not sell, trade, or share your server information with third parties outside of discord's own infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black lowercase mb-4 tracking-tight">3. security</h2>
            <p className="text-white/40 lowercase text-lg leading-relaxed">
              all data is stored in encrypted databases with restricted access. temporary data (like snipes) is automatically purged after short intervals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black lowercase mb-4 tracking-tight">4. your rights</h2>
            <p className="text-white/40 lowercase text-lg leading-relaxed">
              you can request data deletion by removing {botName} from your server, or by contacting our support team via discord.
            </p>
          </section>

          <section className="pt-16 border-t border-white/5 text-center">
            <p className="text-white/20 lowercase">
              return to our{" "}
              <Link href="/tos" className="text-white hover:text-[#5865F2] transition-colors">terms of service</Link>
            </p>
          </section>
        </motion.div>
      </main>
    </div>
  )
}
