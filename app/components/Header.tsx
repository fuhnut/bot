"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signIn, signOut, useSession } from "next-auth/react"
import { useState } from "react"
import { useSiteConfig } from "@/lib/site-config"
import * as CustomIcons from "./CustomIcons"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const { config: siteConfig } = useSiteConfig()
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const menuItems = [
        { label: "home", href: "/", icon: CustomIcons.HashIcon },
        { label: "cmds", href: "/commands", icon: CustomIcons.CommandsIcon },
        { label: "embeds", href: "/embed-builder", icon: CustomIcons.EmbedIcon },
        { label: "status", href: "/status", icon: CustomIcons.StatusIcon },
        { label: "faq", href: "/faq", icon: CustomIcons.FaqIcon },
        { label: "support", href: "/discord", icon: CustomIcons.SupportIcon },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/[0.05] bg-black/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 bg-[#111] flex items-center justify-center">
                        {siteConfig.botLogo ? (
                            <img src={siteConfig.botLogo} alt="logo" className="w-full h-full object-contain" />
                        ) : (
                            <span className="font-black text-[10px]">{siteConfig.botName?.[0]}</span>
                        )}
                    </div>
                    <span className="text-[14px] font-black tracking-tighter lowercase">{siteConfig.botName}</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-1 bg-white/[0.02] border border-white/5 p-1 rounded-2xl">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                px-5 py-2 rounded-xl text-[12px] font-black lowercase tracking-tight transition-all
                ${pathname === item.href ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white/60 hover:bg-white/5"}
              `}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* User / Auth */}
                <div className="flex items-center gap-3">
                    {session ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex flex-col items-end min-w-0">
                                <span className="text-[11px] font-black truncate lowercase tracking-tight">{(session.user as any)?.name}</span>
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">Verified</span>
                            </div>
                            <img src={(session.user as any)?.image} className="w-8 h-8 rounded-lg border border-white/10" alt="user" />
                            <button
                                onClick={() => signOut()}
                                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                            >
                                <CustomIcons.LogOutIcon className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn("discord")}
                            className="px-6 py-2.5 bg-white text-black rounded-xl font-black text-[11px] uppercase tracking-widest hover:scale-[1.02] transition-all active:scale-95"
                        >
                            Sign in
                        </button>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="md:hidden p-2.5 bg-white/5 border border-white/5 rounded-lg"
                    >
                        {isMobileOpen ? <CustomIcons.XIcon className="w-4 h-4" /> : <CustomIcons.MenuIcon className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-20 left-0 right-0 bg-black border-b border-white/5 p-6 flex flex-col gap-2"
                    >
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={`
                  flex items-center gap-4 p-4 rounded-xl transition-all
                  ${pathname === item.href ? "bg-white/5 text-white" : "text-white/30"}
                `}
                            >
                                <item.icon className="w-4 h-4" />
                                <span className="text-[13px] font-black lowercase">{item.label}</span>
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
