"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signIn, signOut, useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useSiteConfig } from "@/lib/site-config"
import Image from "next/image"
import * as CustomIcons from "./CustomIcons"
import { motion, AnimatePresence } from "framer-motion"

export default function Sidebar() {
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
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-6 left-6 z-[200] p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl"
            >
                {isMobileOpen ? <CustomIcons.XIcon className="w-5 h-5" /> : <CustomIcons.MenuIcon className="w-5 h-5" />}
            </button>

            {/* Sidebar Content */}
            <div
                className={`
          fixed inset-y-0 left-0 z-[150] w-72 bg-[#050505] border-r border-white/5 p-8 transition-transform duration-500 lg:translate-x-0
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-4 mb-20 group">
                        <div className="relative w-10 h-10">
                            <div className="absolute inset-0 bg-white/5 rounded-xl blur-lg group-hover:bg-white/10 transition-colors" />
                            <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10 bg-[#111] flex items-center justify-center">
                                {siteConfig.botLogo ? (
                                    <img src={siteConfig.botLogo} alt="logo" className="w-full h-full object-contain" />
                                ) : (
                                    <span className="font-black text-xs">{siteConfig.botName?.[0]}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[15px] font-black tracking-tighter lowercase leading-none">{siteConfig.botName}</span>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mt-1">Management</span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={`
                  flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group
                  ${pathname === item.href ? "bg-white/[0.04] text-white shadow-xl" : "text-white/20 hover:text-white/40 hover:bg-white/[0.02]"}
                `}
                            >
                                <div className={`p-2.5 rounded-xl transition-all ${pathname === item.href ? "bg-white text-black" : "bg-white/5 group-hover:bg-white/10"}`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <span className="text-[13px] font-black lowercase tracking-tight">{item.label}</span>
                                {pathname === item.href && (
                                    <motion.div layoutId="active-indicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* User Section */}
                    <div className="mt-auto pt-8 border-t border-white/5">
                        {session ? (
                            <div className="flex items-center justify-between gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5">
                                <div className="flex items-center gap-3 min-w-0">
                                    <img src={(session.user as any)?.image} className="w-8 h-8 rounded-xl border border-white/10" alt="user" />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[11px] font-black truncate lowercase tracking-tight">{(session.user as any)?.name}</span>
                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">Verified</span>
                                    </div>
                                </div>
                                <button onClick={() => signOut()} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/20 hover:text-red-400">
                                    <CustomIcons.LogOutIcon className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => signIn("discord")}
                                className="w-full py-4 bg-white text-black rounded-2xl font-black text-[12px] uppercase tracking-widest hover:scale-[1.02] transition-all active:scale-95 shadow-2xl"
                            >
                                Sign in
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 z-[140] bg-black/60 backdrop-blur-md lg:hidden"
                    />
                )}
            </AnimatePresence>
        </>
    )
}
