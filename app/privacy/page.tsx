"use client"


import { motion } from "framer-motion"
import Link from "next/link"
import { useSiteConfig } from "@/lib/site-config"
import * as CustomIcons from "../components/CustomIcons"

export default function PrivacyPage() {
  const { config } = useSiteConfig()
  const botName = (config?.botName || "bot").toLowerCase()

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#5865F2]/30 p-8 md:p-20">


      <main className="max-w-4xl mx-auto py-12">
        <div className="flex flex-col gap-4 mb-20">
          <div className="flex items-center gap-3 text-blue-400">
            <CustomIcons.ShieldIcon className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Privacy</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-7xl md:text-9xl font-black tracking-tighter lowercase leading-[0.8] mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
          >
            privacy
          </motion.h1>
          <p className="text-xl text-white/30 lowercase max-w-xl font-medium">
            last updated: january 2026. how we secure your data.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <section className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] transition-all hover:border-white/10 group shadow-2xl">
            <div className="flex items-center gap-4 mb-6 text-white/20 group-hover:text-white/40 transition-colors">
              <CustomIcons.MoreVerticalIcon className="w-5 h-5 rotate-90" />
              <h2 className="text-2xl font-black lowercase tracking-tighter">1. collection</h2>
            </div>
            <p className="text-white/30 lowercase text-lg leading-relaxed mb-6 font-medium">we collect only what's minimum for {botName} to function effectively:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "server and user identifiers",
                "command execution metadata",
                "custom server configurations",
                "temporary moderation records"
              ].map(item => (
                <li key={item} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-[14px] font-black text-white/20 hover:text-white/40 transition-all lowercase">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] transition-all hover:border-white/10 group shadow-2xl">
            <div className="flex items-center gap-4 mb-6 text-white/20 group-hover:text-white/40 transition-colors">
              <CustomIcons.UserIcon className="w-5 h-5" />
              <h2 className="text-2xl font-black lowercase tracking-tighter">2. usage</h2>
            </div>
            <p className="text-white/30 lowercase text-lg leading-relaxed font-medium">
              your data is used exclusively to provide the bot's features. we do not sell, trade, or share your server information with third parties outside of discord's own infrastructure.
            </p>
          </section>

          <section className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] transition-all hover:border-white/10 group shadow-2xl">
            <div className="flex items-center gap-4 mb-6 text-white/20 group-hover:text-white/40 transition-colors">
              <CustomIcons.ShieldIcon className="w-5 h-5" />
              <h2 className="text-2xl font-black lowercase tracking-tighter">3. security</h2>
            </div>
            <p className="text-white/30 lowercase text-lg leading-relaxed font-medium">
              all data is stored in encrypted environments with restricted access. temporary data (like snipes) is automatically purged from memory after short intervals.
            </p>
          </section>

          <section className="pt-20 border-t border-white/5 text-center">
            <p className="text-white/10 font-black uppercase tracking-[0.3em] text-[10px]">
              Review our{" "}
              <Link href="/tos" className="text-[#5865F2] hover:text-white transition-colors border-b border-[#5865F2]/20 hover:border-white pb-1 ml-2">terms of service</Link>
            </p>
          </section>
        </motion.div>
      </main>
    </div>
  )
}
