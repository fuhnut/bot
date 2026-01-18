"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signIn, signOut, useSession } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import { useSiteConfig } from "@/lib/siteConfig"
import { Menu, X, Moon, Sun, Zap, Palette, HelpCircle, Activity, MessageCircle } from "lucide-react"

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
  const siteConfig = useSiteConfig()

  const links = [
    { href: "/commands", label: "Commands", icon: Zap },
    { href: "/embed-builder", label: "Embed Builder", icon: Palette },
    { href: "/status", label: "Status", icon: Activity },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
    { href: "/discord", label: "Support", icon: MessageCircle },
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
      className="backdrop-blur-md sticky top-0 z-40 bg-[#1B1B1B]/80 border-[#CECECE]/10 border-b rim-light"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-[#FAFAFA] hover:text-[#CECECE] transition-colors flex-shrink-0"
          >
            <img src={siteConfig.botLogo} alt={siteConfig.botName} className="w-7 h-7 sm:w-8 sm:h-8" />
            <span className="hidden sm:inline">{siteConfig.botName}</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                  pathname === link.href
                    ? "bg-[#CECECE]/15 text-[#FAFAFA] font-semibold"
                    : "text-[#CECECE] hover:text-[#FAFAFA] hover:bg-[#CECECE]/5"
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex gap-2 items-center">
            {/* Invite Button */}
            <a
              href={siteConfig.inviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline px-4 py-2 bg-gradient-to-r from-[#FAFAFA] to-[#CECECE] text-[#000000] rounded-lg font-semibold hover:from-[#CECECE] hover:to-[#FAFAFA] transition-all duration-200 text-sm rim-light"
            >
              Invite Bot
            </a>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-[#CECECE]/10 transition-all duration-200 text-[#FAFAFA]"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-[#CECECE]/10 transition-all duration-200 text-[#FAFAFA]"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#CECECE]/20 hover:border-[#CECECE]/50 transition-all duration-200"
                >
                  <img
                    src={
                      (session.user as any)?.image ||
                      `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5) || "/placeholder.svg"}.png`
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </button>
                {showDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-[#1B1B1B] border-[#CECECE]/10 border overflow-hidden rim-light"
                  >
                    <div className="px-4 py-3 border-b border-[#CECECE]/10">
                      <p className="text-sm font-medium text-[#FAFAFA]">
                        {(session.user as any)?.name || "User"}
                      </p>
                      <p className="text-xs text-[#CECECE]/70">
                        {(session.user as any)?.email || ""}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        setShowDropdown(false)
                        // Handle both old and new session types
                        try {
                          // Clear local auth state
                          await signOut({ callbackUrl: "/" })
                        } catch (error) {
                          // Fallback: direct navigation after logout
                          await fetch("/api/auth/signout", { method: "POST" })
                          window.location.href = "/"
                        }
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-semibold bg-red-600/80 text-[#FAFAFA] hover:bg-red-600 transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn("discord")}
                className="px-5 py-2 bg-gradient-to-r from-[#FAFAFA] to-[#CECECE] text-[#000000] hover:from-[#CECECE] hover:to-[#FAFAFA] rounded-lg transition-all duration-200 text-sm font-medium rim-light"
              >
                Login with Discord
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-[#CECECE]/10 bg-[#1B1B1B]/50 mt-4 pt-4 pb-4">
          <div className="lg:hidden border-t border-[#CECECE]/10 bg-[#1B1B1B]/50 mt-4 pt-4 pb-6 space-y-4">
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    pathname === link.href
                      ? "bg-[#CECECE]/15 text-[#FAFAFA] font-semibold"
                      : "text-[#CECECE] hover:text-[#FAFAFA] hover:bg-[#CECECE]/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="px-4 pt-4 border-t border-[#CECECE]/10">
              <a
                href={siteConfig.inviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-[#FAFAFA] text-[#0A0A0A] rounded-xl font-bold transition-all duration-200"
              >
                Invite Bot
              </a>
            </div>
          </div>
          </div>
        )}
      </div>
    </nav>
  )
}
