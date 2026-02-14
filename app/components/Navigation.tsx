"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signIn, signOut, useSession } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import { useSiteConfig } from "@/lib/site-config"
import Image from "next/image"
import * as Icons from "lucide-react"
import { motion } from "framer-motion"
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
    { href: "/commands", label: "commands", icon: Icons.Zap },
    { href: "/embed-builder", label: "embed builder", icon: Icons.Palette },
    { href: "/status", label: "status", icon: Icons.Activity },
    { href: "/faq", label: "faq", icon: Icons.HelpCircle },
    { href: "/discord", label: "support", icon: Icons.MessageCircle },
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
    <nav
      className="backdrop-blur-xl sticky top-0 z-50 bg-black/40 border-white/5 border-b"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex justify-between items-center">
          {/* Logo - Modern Tech Branding */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#5865F2] to-[#7289da] rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-full h-full bg-[#111214] border border-white/10 rounded-xl flex items-center justify-center overflow-hidden shadow-2xl group-hover:border-[#5865F2]/50 transition-colors">
                {siteConfig.botLogo ? (
                  <img
                    src={siteConfig.botLogo}
                    alt={siteConfig.botName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = "w-full h-full bg-gradient-to-br from-purple-500 to-red-500 flex items-center justify-center font-bold text-xs";
                        fallback.innerText = siteConfig.botName?.[0] || "B";
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-red-500 flex items-center justify-center font-bold text-xs">
                    {siteConfig.botName?.[0] || "B"}
                  </div>
                )}
              </div>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-white lowercase tracking-tighter leading-none">{siteConfig.botName}</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-1 items-center bg-white/5 p-1 rounded-2xl border border-white/5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 text-[13px] font-bold lowercase ${pathname === link.href
                  ? "bg-white/10 text-white shadow-lg"
                  : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex gap-3 items-center">
            {/* Invite Button */}
            <a
              href={siteConfig.inviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex px-6 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-black transition-all duration-300 text-sm lowercase shadow-[0_8px_20px_rgba(88,101,242,0.2)] hover:scale-[1.02] active:scale-95 items-center gap-2"
            >
              <SvgDiscord className="w-4 h-4" />
              invite {siteConfig.botName}
            </a>

            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 hover:border-[#5865F2] transition-all duration-300 shadow-lg"
                >
                  <Image
                    src={
                      (session.user as any)?.image ||
                      `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5) || "/placeholder.svg"}.png`
                    }
                    alt={(session.user as any)?.name || "profile"}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </button>
                {showDropdown && (
                  <div
                    className="absolute right-0 mt-3 w-56 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#0A0A0A] border-white/10 border overflow-hidden p-2 z-50 backdrop-blur-3xl"
                  >
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <p className="text-xs text-white/40 lowercase mb-1">signed in as</p>
                      <p className="text-sm font-black text-white lowercase">
                        {(session.user as any)?.name || "user"}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        setShowDropdown(false)
                        try {
                          await signOut({ callbackUrl: "/" })
                        } catch (error) {
                          await fetch("/api/auth/signout", { method: "POST" })
                          window.location.href = "/"
                        }
                      }}
                      className="w-full text-left px-4 py-3 text-[13px] font-bold text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200 lowercase flex items-center gap-2"
                    >
                      <Icons.LogOut className="w-4 h-4" />
                      logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn("discord")}
                className="px-6 py-2.5 bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black rounded-xl transition-all duration-300 text-sm font-bold lowercase shadow-xl"
              >
                login
              </button>
            )}

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2.5 rounded-xl hover:bg-white/5 text-white transition-colors"
            >
              {showMobileMenu ? <Icons.X className="w-6 h-6" /> : <Icons.Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-6 pt-6 pb-8 space-y-4 border-t border-white/5">
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 text-base font-bold lowercase ${pathname === link.href
                    ? "bg-white/10 text-white shadow-xl"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <link.icon className="w-5 h-5 opacity-40" />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="px-2 pt-6">
              <a
                href={siteConfig.inviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-5 bg-[#5865F2] text-white rounded-2xl font-black transition-all duration-300 shadow-2xl lowercase"
              >
                <SvgDiscord className="w-5 h-5" />
                invite {siteConfig.botName}
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
