"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signIn, signOut, useSession } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import { useSiteConfig } from "@/lib/site-config"
import Image from "next/image"
import * as CustomIcons from "../components/CustomIcons"
import { motion, AnimatePresence } from "framer-motion"
import SvgDiscord from "@/app/components/icons/DiscordIcon"

interface NavigationProps {
  isDark: boolean
  setIsDark: (value: boolean) => void
}

export default function Navigation({ isDark, setIsDark }: NavigationProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { config: siteConfig } = useSiteConfig()

  const links = [
    { href: "/commands", label: "cmds" },
    { href: "/embed-builder", label: "embeds" },
    { href: "/status", label: "status" },
    { href: "/faq", label: "faq" },
    { href: "/discord", label: "support" },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <nav className="sticky top-0 z-[100] bg-black/50 backdrop-blur-2xl border-b border-white/[0.03]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-8 h-8"
            >
              <div className="absolute inset-0 bg-[#5865F2] rounded-lg blur-lg opacity-0 group-hover:opacity-20 transition-opacity" />
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/10 bg-[#111]">
                {siteConfig.botLogo ? (
                  <img src={siteConfig.botLogo} alt="logo" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-white/[0.05] flex items-center justify-center font-black text-[10px]">{siteConfig.botName?.[0]}</div>
                )}
              </div>
            </motion.div>
            <span className="text-lg font-black tracking-tighter lowercase text-white/90 group-hover:text-white transition-colors">{siteConfig.botName}</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-2xl">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-5 py-2 rounded-xl text-[12px] font-black lowercase tracking-tight transition-all
                  ${pathname === link.href ? "bg-white/[0.07] text-white shadow-xl" : "text-white/25 hover:text-white/50"}
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all"
                >
                  <Image
                    src={(session.user as any)?.image || `https://cdn.discordapp.com/embed/avatars/0.png`}
                    alt="profile"
                    width={36}
                    height={36}
                    unoptimized
                  />
                </button>
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 shadow-3xl z-[200]"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/10 mb-1">signed in as</p>
                        <p className="text-[13px] font-black text-white/80">{(session.user as any)?.name}</p>
                      </div>
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-3 text-[12px] font-black text-red-400 hover:bg-red-400/5 rounded-xl transition-all lowercase flex items-center gap-2"
                      >
                        <CustomIcons.LogOutIcon className="w-3.5 h-3.5" /> logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => signIn("discord")}
                className="px-6 py-2.5 bg-white text-black text-[12px] font-black rounded-xl hover:scale-105 transition-all lowercase shadow-xl"
              >
                login
              </button>
            )}

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-all"
            >
              {showMobileMenu ? <CustomIcons.XIcon className="w-5 h-5" /> : <CustomIcons.MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-[#050505] overflow-hidden"
          >
            <div className="p-6 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center p-4 rounded-2xl font-black lowercase text-lg transition-all ${pathname === link.href ? "bg-white/[0.05] text-white" : "text-white/20"}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
