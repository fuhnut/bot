"use client"


import { motion } from "framer-motion"
import Link from "next/link"
import { useSiteConfig } from "@/lib/site-config"
import * as CustomIcons from "../components/CustomIcons"

export default function TOSPage() {
  const { config } = useSiteConfig()
  const botName = (config?.botName || "bot").toLowerCase()

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#5865F2]/30 p-8 md:p-20">


      <main className="max-w-4xl mx-auto py-12">
        <div className="flex flex-col gap-4 mb-20">
          <div className="flex items-center gap-3 text-red-400">
            <CustomIcons.LegalIcon className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">tos</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-7xl md:text-9xl font-black tracking-tighter lowercase leading-[0.8] mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
          >
            terms
          </motion.h1>
          <p className="text-xl text-white/30 lowercase max-w-xl font-medium">
            last updated: january 2026. please read our conditions carefully.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <section className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] transition-all hover:border-white/10 group shadow-2xl">
            <div className="flex items-center gap-4 mb-6 text-white/20 group-hover:text-white/40 transition-colors">
              <CustomIcons.CheckIcon className="w-5 h-5" />
              <h2 className="text-2xl font-black lowercase tracking-tighter">1. acceptance</h2>
            </div>
            <p className="text-white/30 lowercase text-lg leading-relaxed font-medium">
              by inviting or using {botName}, you agree to these terms bindingly. if you do not agree, remove the bot immediately.
            </p>
          </section>

          <section className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] transition-all hover:border-white/10 group shadow-2xl">
            <div className="flex items-center gap-4 mb-6 text-white/20 group-hover:text-white/40 transition-colors">
              <CustomIcons.AlertCircleIcon className="w-5 h-5" />
              <h2 className="text-2xl font-black lowercase tracking-tighter">2. service use</h2>
            </div>
            <p className="text-white/30 lowercase text-lg leading-relaxed font-medium">
              {botName} provides moderation and automation tools. we provide this service "as-is". we are not liable for any damages, strikes, or data loss resulting from bot usage within your server.
            </p>
          </section>

          <section className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] transition-all hover:border-white/10 group shadow-2xl">
            <div className="flex items-center gap-4 mb-6 text-white/20 group-hover:text-white/40 transition-colors">
              <CustomIcons.LogOutIcon className="w-5 h-5" />
              <h2 className="text-2xl font-black lowercase tracking-tighter">3. responsibilities</h2>
            </div>
            <p className="text-white/30 lowercase text-lg leading-relaxed mb-6 font-medium">you strictly must not use the bot to:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "harass or harm community members",
                "violate discord terms of service",
                "exploit or damage bot systems",
                "distribute malicious content"
              ].map(item => (
                <li key={item} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-[14px] font-black text-white/20 hover:text-white/40 transition-all lowercase">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="pt-20 border-t border-white/5 text-center">
            <p className="text-white/10 font-black uppercase tracking-[0.3em] text-[10px]">
              Explore our{" "}
              <Link href="/privacy" className="text-blue-400 hover:text-white transition-colors border-b border-blue-400/20 hover:border-white pb-1 ml-2">privacy policy</Link>
            </p>
          </section>
        </motion.div>
      </main>
    </div>
  )
}
