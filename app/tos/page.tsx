"use client"

import { useState } from "react"
import Navigation from "../components/Navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { useSiteConfig } from "@/lib/site-config"

export default function TOSPage() {
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
            terms
          </h1>
          <p className="text-xl text-white/40 lowercase max-w-xl">
            last updated: january 2026. please read our conditions carefully.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <section>
            <h2 className="text-2xl font-black lowercase mb-4 tracking-tight">1. acceptance</h2>
            <p className="text-white/40 lowercase text-lg leading-relaxed">
              by inviting or using {botName}, you agree to these terms. if you do not agree, remove the bot immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black lowercase mb-4 tracking-tight">2. service use</h2>
            <p className="text-white/40 lowercase text-lg leading-relaxed">
              {botName} provides moderation and automation. we provide this service "as-is". we are not liable for any damages or data loss resulting from bot usage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black lowercase mb-4 tracking-tight">3. responsibilities</h2>
            <p className="text-white/40 lowercase text-lg leading-relaxed mb-4">you must not use the bot to:</p>
            <ul className="space-y-2 text-white/30 lowercase text-lg list-disc pl-6">
              <li>harass or harm others</li>
              <li>violate discord's terms of service</li>
              <li>exploit or damage bot functionality</li>
              <li>distribute malicious content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black lowercase mb-4 tracking-tight">4. termination</h2>
            <p className="text-white/40 lowercase text-lg leading-relaxed">
              we reserve the right to blacklist any server or user from using {botName} at our discretion, without prior notice.
            </p>
          </section>

          <section className="pt-16 border-t border-white/5 text-center">
            <p className="text-white/20 lowercase">
              for further info, visit our{" "}
              <Link href="/privacy" className="text-white hover:text-[#5865F2] transition-colors">privacy policy</Link>
            </p>
          </section>
        </motion.div>
      </main>
    </div>
  )
}
