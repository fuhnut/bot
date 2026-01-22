"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Navigation from "./components/Navigation"
import FeatureCards from "./components/FeatureCards"
import Link from "next/link"
import Image from "next/image"
import { useSiteConfig } from "@/lib/site-config"
import * as Icons from "lucide-react"

export default function Home() {
  const { data: session } = useSession()
  const { config, loading: configLoading } = useSiteConfig()
  const [guilds, setGuilds] = useState<any[]>([])
  const [loadingGuilds, setLoadingGuilds] = useState(false)

  const [stats, setStats] = useState<any>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [topServers, setTopServers] = useState<any[]>([])

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

    // Fetch immediately
    fetchData()
    
    // Refresh stats every 5 seconds
    const interval = setInterval(fetchData, 5000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchTopServers = async () => {
      try {
        const res = await fetch("/api/top-servers")
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            setTopServers(data)
          } else if (data.servers && Array.isArray(data.servers)) {
            setTopServers(data.servers)
          }
        }
      } catch (err) {
        console.error("Failed to fetch top servers:", err)
      }
    }

    fetchTopServers()
    
    // Refresh top servers every 30 seconds
    const interval = setInterval(fetchTopServers, 30000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchGuilds = async () => {
      if (!session) return
      
      try {
        setLoadingGuilds(true)
        const guildsRes = await fetch("/api/guilds")
        if (guildsRes.ok) {
          const data = await guildsRes.json()
          if (Array.isArray(data)) {
            setGuilds(data)
          }
        }
      } catch (err) {
        console.error("Failed to fetch guilds:", err)
      } finally {
        setLoadingGuilds(false)
      }
    }

    fetchGuilds()
    
    return () => {}
  }, [session])

  const sitePages = [
    { href: "/commands", label: "Commands", description: "Browse all available bot commands", icon: Icons.Zap },
    { href: "/embed-builder", label: "Embed Builder", description: "Design beautiful embeds visually", icon: Icons.Palette },
    { href: "/status", label: "Status", description: "Check bot and system status", icon: Icons.CheckCircle },
    { href: "/faq", label: "FAQ", description: "Frequently asked questions", icon: Icons.HelpCircle },
    { href: "/discord", label: "Support", description: "Join our community server", icon: Icons.MessageCircle },
    { href: "/tos", label: "Terms", description: "Terms of service and usage", icon: Icons.FileText },
    { href: "/privacy", label: "Privacy", description: "Data protection and privacy", icon: Icons.ShieldAlert },
  ]

  const statsItems = [
    { label: "Servers", value: stats?.servers || "0", icon: Icons.Server },
    { label: "Users", value: stats?.users || "0", icon: Icons.Users },
    { label: "Status", value: stats?.status || "Offline", icon: Icons.Activity, color: stats?.status === "Online" ? "text-green-400" : "text-red-400" },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] selection:bg-[#FAFAFA] selection:text-[#0A0A0A]">
      <Navigation isDark={true} setIsDark={() => {}} />
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] md:w-[40%] h-[40%] bg-[#FAFAFA]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] md:w-[40%] h-[40%] bg-[#FAFAFA]/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 overflow-x-hidden">
        {/* Top Servers Banner */}
        {topServers.length > 0 && (
          <section className="w-full bg-gradient-to-r from-[#1B1B1B] to-[#0A0A0A] border-b border-[#FAFAFA]/10 py-4 overflow-hidden">
            <div className="relative flex items-center h-20">
              <motion.div
                animate={{ x: [0, -(topServers.length * 280)] }}
                transition={{ duration: topServers.length * 3, repeat: Infinity, ease: "linear" }}
                className="flex gap-4 whitespace-nowrap"
              >
                {/* Display servers twice for seamless loop */}
                {[...topServers, ...topServers].map((server, i) => (
                  <div
                    key={`${server.id}-${i}`}
                    className="flex items-center gap-3 px-6 py-2 rounded-full bg-[#1B1B1B]/50 border border-[#FAFAFA]/10 hover:border-[#FAFAFA]/30 transition-all flex-shrink-0 w-fit"
                  >
                    {server.icon && (
                      <Image
                        src={server.icon}
                        alt={server.name}
                        width={40}
                        height={40}
                        className="w-8 h-8 rounded-full"
                        unoptimized
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#FAFAFA] text-sm">{server.name}</span>
                      <span className="text-xs text-[#CECECE]/70">{server.members?.toLocaleString() || 0} members</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 md:pt-32 pb-16 md:pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-[#FAFAFA] to-[#A0A0A0] bg-clip-text text-transparent">
                {config.botName}
              </h1>
              
              <p className="text-lg md:text-xl text-[#CECECE] mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {config.tagline || "The ultimate multi-purpose Discord bot designed to elevate your server&apos;s experience with powerful automation and moderation."}
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  href={config.inviteLink}
                  className="px-8 py-4 rounded-2xl bg-[#FAFAFA] text-[#0A0A0A] font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  <Icons.Plus className="w-5 h-5" />
                  Add to Discord
                </Link>
                <Link
                  href="/commands"
                  className="px-8 py-4 rounded-2xl bg-[#1B1B1B] border border-[#FAFAFA]/10 text-[#FAFAFA] font-bold hover:bg-[#252525] transition-colors flex items-center justify-center gap-2"
                >
                  <Icons.Zap className="w-5 h-5" />
                  Explore Commands
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block group"
            >
              <div className="relative w-64 h-64 md:w-72 md:h-72 mx-auto cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAFA]/20 to-transparent rounded-3xl blur-2xl animate-pulse" />
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10 w-full h-full rounded-3xl p-1 bg-gradient-to-br from-[#FAFAFA]/30 to-[#FAFAFA]/5 backdrop-blur-xl border border-[#FAFAFA]/20 overflow-hidden shadow-2xl"
                >
                  <Image
                    src={config.botLogo}
                    alt="Bot Logo"
                    fill
                    className="object-cover rounded-2xl bg-[#1B1B1B]"
                    unoptimized
                  />
                </motion.div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 p-4 rounded-2xl bg-[#1B1B1B]/80 backdrop-blur-md border border-[#FAFAFA]/10 shadow-xl"
              >
                <Icons.Shield className="w-6 h-6 text-[#FAFAFA]" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 left-[-20px] p-4 rounded-2xl bg-[#1B1B1B]/80 backdrop-blur-md border border-[#FAFAFA]/10 shadow-xl"
              >
                <Icons.Zap className="w-6 h-6 text-[#FAFAFA]" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Quick Navigation Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-[#FAFAFA]/5">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Links</h2>
            <p className="text-[#CECECE]">Navigate through the site&apos;s main sections.</p>
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
                className="p-6 md:p-8 rounded-3xl bg-[#1B1B1B]/40 border border-[#FAFAFA]/5 backdrop-blur-sm flex items-center gap-6"
              >
                <div className="p-4 rounded-2xl bg-[#FAFAFA]/5">
                  <stat.icon className="w-6 h-6 text-[#FAFAFA]" />
                </div>
                <div>
                  <p className="text-sm text-[#CECECE] font-medium">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color || "text-[#FAFAFA]"}`}>{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-20">
          <FeatureCards isDark={true} />
        </section>

        {/* User Servers Section */}
        {session && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 border-t border-[#FAFAFA]/5">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold mb-2">Your Servers</h2>
                <p className="text-[#CECECE]">Manage {config.botName} in your communities.</p>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#1B1B1B]/40 border border-[#FAFAFA]/10">
                <Image src={session.user?.image || ""} alt={session.user?.name || 'User avatar'} width={40} height={40} className="rounded-full border border-[#FAFAFA]/20" unoptimized />
                <span className="font-medium">{session.user?.name}</span>
              </div>
            </div>

            {loadingGuilds ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FAFAFA]"></div>
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
                        {guild.name[0]}
                      </div>
                    )}
                    <span className="text-sm font-medium truncate w-full px-2">{guild.name}</span>
                    <button className="mt-4 px-4 py-2 rounded-xl bg-[#FAFAFA]/5 hover:bg-[#FAFAFA]/10 text-xs font-semibold sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      Manage
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-3xl bg-[#1B1B1B]/20 border border-dashed border-[#FAFAFA]/10 px-6">
                <p className="text-[#CECECE]">No mutual servers found.</p>
                <Link href={config.inviteLink} className="text-[#FAFAFA] text-sm font-medium hover:underline mt-2 inline-block">Invite the bot to your server</Link>
              </div>
            )}
          </section>
        )}

        {/* CTA Section */}
        {!session && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">
            <div className="relative p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-[#1B1B1B] to-[#0A0A0A] border border-[#FAFAFA]/10 overflow-hidden text-center">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
              <h2 className="text-3xl md:text-4xl font-bold mb-10">join plenty of other servers who trust and use {config.botName}.</h2>
              <Link
                href="/api/auth/signin"
                className="inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-2xl bg-[#FAFAFA] text-[#0A0A0A] font-bold hover:scale-105 transition-transform"
              >
                <Icons.LogIn className="w-5 h-5" />
                Get Started Now
              </Link>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-[#FAFAFA]/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image src={config.botLogo} alt={config.botName} width={32} height={32} className="rounded-lg" unoptimized />
              </motion.div>
              <span className="font-bold text-xl">{config.botName}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-[#CECECE]">
              <Link href="/tos" className="hover:text-[#FAFAFA] transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-[#FAFAFA] transition-colors">Privacy Policy</Link>
              <Link href="/faq" className="hover:text-[#FAFAFA] transition-colors">FAQ</Link>
              <Link href="/discord" className="hover:text-[#FAFAFA] transition-colors">Support</Link>
              <Link href="/status" className="hover:text-[#FAFAFA] transition-colors">Status</Link>
            </div>
            <p className="text-xs text-[#666] text-center md:text-right">© {new Date().getFullYear()} {config.botName}. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}