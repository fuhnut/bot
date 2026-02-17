"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import Navigation from "./components/Navigation"
import FeatureCards from "./components/FeatureCards"
import ServerLogging from "./components/ServerLogging"
import AntiNukeShowcase from "./components/AntiNukeShowcase"
import SocialShowcase from "./components/SocialShowcase"
import Link from "next/link"
import Image from "next/image"
import { useSiteConfig } from "@/lib/site-config"
import * as Icons from "lucide-react"
import SvgDiscord from "@/app/components/icons/DiscordIcon"

export default function Home() {
  const { data: session } = useSession()
  const { config, loading: configLoading } = useSiteConfig()
  const [imageError, setImageError] = useState(false)
  const [guilds, setGuilds] = useState<any[]>([])
  const [loadingGuilds, setLoadingGuilds] = useState(false)

  const [stats, setStats] = useState<any>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [topServers, setTopServers] = useState<any[]>([])
  const [guildsError, setGuildsError] = useState<string | null>(null)
  const marqueeRef = useRef<HTMLDivElement | null>(null)
  const marqueeInnerRef = useRef<HTMLDivElement | null>(null)
  const [marqueeDistance, setMarqueeDistance] = useState<number>(0)
  const MARQUEE_SPEED = 120 // px per second
  const marqueeDuration = marqueeDistance > 0 ? Math.max(6, Math.min(40, marqueeDistance / MARQUEE_SPEED)) : 10

  // Fetch stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingStats(true)
        const statsRes = await fetch("/api/stats")
        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats(data)
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err)
      } finally {
        setLoadingStats(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  // Fetch top servers
  useEffect(() => {
    const fetchTopServers = async () => {
      try {
        const res = await fetch("/api/top-servers")
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) setTopServers(data)
          else if (data.servers && Array.isArray(data.servers)) setTopServers(data.servers)
          else if (Array.isArray(data.mutualGuilds)) setTopServers(data.mutualGuilds)
          else setTopServers([])
        }
      } catch (err) {
        console.error("Failed to fetch top servers:", err)
      }
    }

    fetchTopServers()
    const interval = setInterval(fetchTopServers, 30000)
    return () => clearInterval(interval)
  }, [])

  // Measure marquee distance
  useEffect(() => {
    let ro: ResizeObserver | null = null
    const update = () => {
      if (marqueeInnerRef.current && marqueeRef.current) {
        const innerWidth = marqueeInnerRef.current.scrollWidth
        const containerWidth = marqueeRef.current.clientWidth || 0
        const computed = Math.floor(innerWidth / 2) || containerWidth
        setMarqueeDistance(computed)
      }
    }

    update()
    if (marqueeInnerRef.current && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update)
      ro.observe(marqueeInnerRef.current)
    }
    window.addEventListener("resize", update)

    return () => {
      if (ro) ro.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [topServers])

  // Fetch user mutual guilds
  useEffect(() => {
    const fetchGuilds = async () => {
      if (!session) return

      try {
        setLoadingGuilds(true)
        setGuildsError(null)

        const res = await fetch('/api/guilds')
        const text = await res.text()
        let data: any = null
        try { data = JSON.parse(text) } catch { data = text }

        if (!res.ok) {
          if (res.status === 401) setGuildsError('Not authenticated. Please sign in again.')
          else if (res.status === 403) setGuildsError('Missing guilds permission. Re-login and grant the guilds permission.')
          else setGuildsError(typeof data === 'string' ? data : (data?.error ?? 'Failed to fetch servers'))
          setGuilds([])
          return
        }

        if (Array.isArray(data)) setGuilds(data)
        else if (Array.isArray(data.mutualGuilds)) {
          setGuilds(data.mutualGuilds)
          if ((data.botGuildCount ?? 0) === 0) setGuildsError('Bot is not reporting its server list or is offline. Invite the bot or enable stats reporting.')
        } else setGuilds([])
      } catch (err) {
        console.error('Failed to fetch guilds:', err)
        setGuildsError('Unexpected error fetching servers')
      } finally {
        setLoadingGuilds(false)
      }
    }

    fetchGuilds()
  }, [session])

  const sitePages = [
    { href: "/commands", label: "Commands", description: "Browse all available bot commands", icon: Icons.Zap },
    { href: "/embed-builder", label: "Embed Builder", description: "Design beautiful embeds visually", icon: Icons.Palette },
    { href: "/status", label: "Status", description: "Check bot and system status", icon: Icons.CheckCircle },
    { href: "/faq", label: "FAQ", description: "Frequently asked questions", icon: Icons.HelpCircle },
    { href: "/discord", label: "Support", description: "Join our community server", icon: Icons.MessageCircle },
    { href: "/tos", label: "Terms", description: "Terms of service", icon: Icons.FileText },
    { href: "/privacy", label: "Privacy", description: "Data protection and privacy", icon: Icons.ShieldAlert },
  ]

  const statsItems = [
    { label: "Servers", value: stats?.servers || "0", icon: Icons.Server },
    { label: "Users", value: stats?.users || "0", icon: Icons.Users },
    { label: "Status", value: stats?.status || "Offline", icon: Icons.Activity, color: stats?.status === "Online" ? "text-green-400" : "text-red-400" },
  ]

  // Server card component for marquee - simple version
  const ServerCard = ({ server }: { server: any }) => (
    <div className="flex items-center gap-2.5 px-3 py-1 flex-shrink-0 w-fit">
      {server.icon ? (
        <Image
          src={server.icon}
          alt={server.name}
          width={32}
          height={32}
          className="w-6 h-6 rounded-full"
          unoptimized
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold">
          {server.name?.[0] ?? "?"}
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-bold text-[#FAFAFA] text-[11px] leading-tight lowercase">
          {server.name}
        </span>
        <span className="text-[9px] text-white/30 lowercase leading-tight">
          {server.members?.toLocaleString() || 0} members
        </span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-purple-500/30 selection:text-white">
      <Navigation isDark={true} setIsDark={() => { }} />

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] md:w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] md:w-[40%] h-[40%] bg-red-900/20 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 overflow-x-hidden">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-40 pb-20 md:pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent lowercase leading-[0.8] pb-4">
                {config?.botName ?? "bot"}
              </h1>

              <p className="text-xl md:text-2xl text-white/40 mb-12 leading-relaxed max-w-xl mx-auto lg:mx-0 lowercase font-medium">
                {config?.tagline ?? "the ultimate multi-purpose discord bot designed to elevate your server's experience with powerful automation and moderation."}
              </p>

              <div className="flex flex-col gap-8 justify-center lg:justify-start">
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center">
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link
                      href={config?.inviteLink ?? "#"}
                      className="px-10 py-5 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-black transition-all flex items-center justify-center gap-3 lowercase shadow-[0_15px_40px_rgba(88,101,242,0.3)] hover:scale-[1.02] active:scale-95 text-lg"
                    >
                      <SvgDiscord className="w-5 h-5" />
                      add to discord
                    </Link>
                    <Link
                      href="/commands"
                      className="px-10 py-5 rounded-2xl bg-[#4E5058] hover:bg-[#6D6F78] text-white font-black transition-all flex items-center justify-center gap-3 lowercase hover:scale-[1.02] active:scale-95 text-lg"
                    >
                      <Icons.Terminal className="w-5 h-5" />
                      view commands
                    </Link>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-sm animate-in fade-in slide-in-from-left-4 duration-1000">
                    <p className="text-[11px] font-bold text-white/40 lowercase tracking-tight">
                      powering <span className="text-white">{stats?.servers || "0"}</span> communities with <span className="text-white">{stats?.users || "0"}</span> users.
                    </p>
                  </div>
                </div>

                {/* Top Servers Marquee - Moved Here */}
                {topServers.length > 0 && (
                  <div className="relative w-full max-w-xl overflow-hidden group/marquee">
                    <div ref={marqueeRef} className="relative flex items-center h-12">
                      <motion.div
                        ref={marqueeInnerRef}
                        initial={{ x: 0 }}
                        animate={marqueeDistance > 0 ? { x: [0, -marqueeDistance] } : { x: 0 }}
                        transition={{ duration: marqueeDuration, repeat: Infinity, repeatType: 'loop', ease: "linear" }}
                        style={{ display: 'flex' }}
                        className="flex gap-8 whitespace-nowrap will-change-transform"
                      >
                        {[...topServers, ...topServers].map((server, i) => (
                          <ServerCard key={`${server.id}-${i}`} server={server} />
                        ))}
                      </motion.div>
                    </div>
                    {/* Fades */}
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#050505] to-transparent z-10" />
                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#050505] to-transparent z-10" />
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative hidden lg:block group"
            >
              <div className="relative w-96 h-96 mx-auto">
                {/* Modern Brand Showcase */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#5865F2] to-[#7289da] rounded-[4rem] blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />

                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10 w-full h-full rounded-[4rem] p-4 bg-transparent border border-white/5 overflow-hidden shadow-lg flex items-center justify-center transition-all duration-500 group-hover:border-[#5865F2]/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                  <div className="relative w-full h-full rounded-[3.5rem] overflow-hidden">
                    {config?.botLogo && !imageError ? (
                      <img
                        src={config.botLogo}
                        alt="bot logo"
                        className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#5865F2] to-purple-600 flex items-center justify-center font-black text-6xl">
                        {config?.botName?.[0] || "B"}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Status Indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -bottom-4 -right-4 p-4 bg-[#23a55a] rounded-full border-[8px] border-[#0A0A0A] z-20 shadow-2xl"
                >
                  <div className="w-6 h-6 bg-white rounded-full opacity-20 animate-ping absolute inset-0" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Navigation Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-[#FAFAFA]/5">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Links</h2>
            <p className="text-[#CECECE]">Navigate through the site's main sections.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sitePages.map((page, i) => (
              <motion.div
                key={page.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={page.href}
                  className="group flex flex-col p-6 rounded-3xl bg-[#1B1B1B]/40 border border-[#FAFAFA]/5 hover:border-[#FAFAFA]/20 transition-all h-full"
                >
                  <div className="p-3 rounded-2xl bg-[#FAFAFA]/5 w-fit mb-4 group-hover:bg-[#FAFAFA]/10 transition-colors">
                    <page.icon className="w-6 h-6 text-[#FAFAFA]" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{page.label}</h3>
                  <p className="text-sm text-[#CECECE] leading-relaxed">{page.description}</p>
                  <div className="mt-auto pt-4 flex items-center text-xs font-semibold text-[#FAFAFA]/50 group-hover:text-[#FAFAFA] transition-colors">
                    Visit Page <Icons.ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statsItems.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 backdrop-blur-3xl flex items-center gap-8 hover:bg-white/[0.05] transition-colors"
              >
                <div className="p-5 rounded-2xl bg-white/5 group-hover:bg-purple-500/10 transition-colors">
                  <stat.icon className="w-8 h-8 text-white/40" />
                </div>
                <div>
                  <p className="text-sm text-white/30 font-bold lowercase mb-1">{stat.label}</p>
                  <p className={`text-4xl font-black tracking-tighter ${stat.color || "text-white"}`}>{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* Features Section */}
        <section className="py-16 md:py-20">
          <FeatureCards isDark={true} />
        </section>

        {/* Showcase Grid Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            <ServerLogging />
            <AntiNukeShowcase />
            <div className="lg:col-span-2">
              <SocialShowcase />
            </div>
          </div>
        </section>

        {/* User Servers Section */}
        {session && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-white/5">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-8">
              <div className="text-center sm:text-left">
                <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tighter lowercase">your servers</h2>
                <p className="text-white/40 text-lg lowercase leading-relaxed">manage <span className="text-white font-bold">{config?.botName ?? "the bot"}</span> in your communities.</p>
              </div>
              <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 shadow-xl">
                <Image src={session.user?.image || ""} alt={session.user?.name || 'user avatar'} width={44} height={44} className="rounded-full border-2 border-white/10" unoptimized />
                <span className="font-bold lowercase">{session.user?.name}</span>
              </div>
            </div>

            {loadingGuilds ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
              </div>
            ) : guildsError ? (
              <div className="text-center py-20 rounded-[2.5rem] bg-white/[0.02] border border-dashed border-white/10 px-8">
                <p className="text-white/40 mb-6 lowercase">{guildsError}</p>
                <div className="flex gap-4 justify-center">
                  <Link href="/api/auth/signin" className="px-6 py-3 rounded-xl bg-white text-black font-black lowercase transition-all hover:bg-purple-400">sign in</Link>
                  <Link href={config?.inviteLink ?? "#"} className="px-6 py-3 rounded-xl bg-black border border-white/10 text-white font-black lowercase transition-all hover:bg-white hover:text-black">invite {config?.botName ?? "bot"}</Link>
                </div>
              </div>
            ) : guilds.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {guilds.map((guild) => (
                  <motion.div
                    key={guild.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group relative p-4 rounded-3xl bg-[#1B1B1B]/40 border border-[#FAFAFA]/5 hover:border-[#FAFAFA]/20 transition-all flex flex-col items-center text-center"
                  >
                    {guild.icon ? (
                      <Image
                        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`}
                        alt={guild.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-2xl mb-3 shadow-lg group-hover:shadow-[#FAFAFA]/5 transition-shadow"
                        unoptimized
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-[#252525] flex items-center justify-center text-xl font-bold mb-3">
                        {guild.name?.[0] ?? "?"}
                      </div>
                    )}
                    <span className="text-sm font-medium truncate w-full px-2 lowercase">{guild.name}</span>
                    <button className="mt-4 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold sm:opacity-0 sm:group-hover:opacity-100 transition-opacity lowercase">
                      manage
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-3xl bg-white/[0.02] border border-dashed border-white/10 px-6">
                <p className="text-white/40 lowercase">no mutual servers found.</p>
                <Link href={config?.inviteLink ?? "#"} className="text-white text-sm font-bold hover:underline mt-2 inline-block lowercase">invite the bot to your server</Link>
              </div>
            )}
          </section>
        )}

        {/* CTA Section */}
        {!session && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 pb-32">
            <div className="relative p-12 md:p-24 rounded-[3rem] bg-gradient-to-br from-purple-900/20 via-black to-red-900/20 border border-white/5 overflow-hidden text-center">
              <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
              <h2 className="text-4xl md:text-6xl font-black mb-12 tracking-tighter lowercase">join plenty of other servers who trust and use {config?.botName ?? "the bot"}.</h2>
              <Link
                href="/api/auth/signin"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-black font-black hover:bg-purple-400 transition-all lowercase"
              >
                get started now
              </Link>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image src={config?.botLogo ?? ""} alt={config?.botName ?? "bot"} width={32} height={32} className="rounded-lg" unoptimized />
              </motion.div>
              <span className="font-black text-xl lowercase">{config?.botName ?? "bot"}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-white/40">
              <Link href="/tos" className="hover:text-purple-400 transition-colors lowercase">terms of service</Link>
              <Link href="/privacy" className="hover:text-purple-400 transition-colors lowercase">privacy policy</Link>
              <Link href="/faq" className="hover:text-purple-400 transition-colors lowercase">faq</Link>
              <Link href="/discord" className="hover:text-purple-400 transition-colors lowercase">support</Link>
              <Link href="/status" className="hover:text-purple-400 transition-colors lowercase">status</Link>
            </div>
            <p className="text-xs text-white/20 text-center md:text-right lowercase">© {new Date().getFullYear()} {config?.botName ?? "bot"}. all rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
