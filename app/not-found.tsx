"use client"

import Link from "next/link"
import Image from "next/image"
import { useSiteConfig } from "@/lib/site-config"
import { motion, useReducedMotion } from "framer-motion"

export default function NotFound() {
  const { config } = useSiteConfig()
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-[#FAFAFA] font-sans">
      <div className="max-w-md w-full text-center p-12 rounded-[3rem] bg-[#0a0a0a] border border-white/5 backdrop-blur-xl shadow-3xl">
        <motion.div
          aria-hidden={shouldReduceMotion ? true : false}
          animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto w-24 h-24 relative mb-10"
        >
          {config.botLogo ? (
            <Image src={config.botLogo} alt={config.botName} fill className="object-contain" unoptimized />
          ) : (
            <div className="w-full h-full bg-white/5 rounded-full flex items-center justify-center text-4xl font-black">{config.botName?.[0]}</div>
          )}
        </motion.div>

        <div className="flex items-center justify-center mb-6 text-red-500/40">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h1 className="text-3xl font-black mb-3 tracking-tighter lowercase">404 — lost in space</h1>
        <p className="text-white/20 mb-10 lowercase font-medium">the page you are looking for has been moved or deleted.</p>

        <div className="flex gap-4 justify-center">
          <Link href="/" className="px-8 py-4 rounded-2xl bg-white text-black font-black text-[13px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
            go home
          </Link>
          <a
            href={config.inviteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[13px] uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            support
          </a>
        </div>
      </div>
    </div>
  )
}
