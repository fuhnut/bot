"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useSiteConfig } from "@/lib/site-config"
import * as CustomIcons from "./components/CustomIcons"
import SvgDiscord from "@/app/components/icons/DiscordIcon"

const formatMembers = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "m"
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k"
  return num.toString()
}

const ServerCard = ({ server }: { server: any }) => (
  <div className="flex items-center gap-3.5 px-6 py-2 flex-shrink-0 mx-4">
    <div className="relative w-11 h-11 flex-shrink-0">
      {server.icon ? (
        <Image
          src={server.icon}
          alt={server.name}
          width={44}
          height={44}
          className="rounded-full ring-1 ring-white/5"
          unoptimized
        />
      ) : (
        <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-xs font-black text-white/30">
          {server.name?.[0]?.toUpperCase() ?? "?"}
        </div>
      )}
    </div>
    <div className="flex flex-col">
      <span className="text-[15px] font-black text-white tracking-tight leading-tight lowercase">
        {server?.name || "Unknown Server"}
      </span>
      <span className="text-[11px] text-white/30 font-bold lowercase tracking-wide">
        {formatMembers(server.members || 0)} members
      </span>
    </div>
  </div>
);

const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let totalDuration = 2000;
    let incrementTime = (totalDuration / end) > 10 ? (totalDuration / end) : 10;

    let timer = setInterval(() => {
      start += Math.ceil(end / (totalDuration / incrementTime));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
};

export default function Home() {
  const { config } = useSiteConfig()
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const [topServers, setTopServers] = useState<any[]>([])
  const [stats, setStats] = useState({ servers: 0, users: 0, status: "Offline" })
  const [hasMounted, setHasMounted] = useState(false)
  const marqueeRef = useRef<HTMLDivElement>(null)

  const menuItems = [
    {
      label: "cmds",
      description: "Browse all features",
      href: "/commands",
      icon: CustomIcons.CommandsIcon
    },
    {
      label: "embeds",
      description: "Design beautiful embeds",
      href: "/embed-builder",
      icon: CustomIcons.EmbedIcon
    },
    {
      label: "status",
      description: "bot stats",
      href: "/status",
      icon: CustomIcons.StatusIcon
    },
    {
      label: "faq",
      description: "Common questions",
      href: "/faq",
      icon: CustomIcons.FaqIcon
    },
    {
      label: "support",
      description: "Join the community",
      href: "/discord",
      icon: CustomIcons.SupportIcon
    }
  ]

  useEffect(() => {
    setHasMounted(true)
    fetch("/api/stats").then(res => res.json()).then(data => {
      setStats(data)
      if (data.top_servers) setTopServers(data.top_servers)
    }).catch(console.error)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex(prev => (prev + 1) % menuItems.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex(prev => (prev - 1 + menuItems.length) % menuItems.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        router.push(menuItems[activeIndex].href)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeIndex, menuItems, router])

  if (!hasMounted) {
    return <div className="min-h-screen bg-black" />
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans scroll-smooth">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center p-8 pt-32 lg:pt-8 relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(20,20,20,1)_0%,_rgba(0,0,0,1)_100%)]" />
        </div>

        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-24 items-center relative z-10">
          {/* Left Column: Vertical Menu */}
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onMouseEnter={() => setActiveIndex(index)}
                className={`
                  block group relative transition-all duration-300
                  ${activeIndex === index ? "translate-x-2" : "opacity-40 hover:opacity-100"}
                `}
              >
                <div className={`
                  flex items-center gap-6 p-6 rounded-[2rem] border transition-all duration-300
                  ${activeIndex === index ? "bg-white/[0.03] border-white/10" : "bg-transparent border-transparent"}
                `}>
                  <div className={`
                    w-14 h-14 rounded-[1.2rem] flex items-center justify-center transition-all duration-300
                    ${activeIndex === index ? "bg-white text-black shadow-2xl" : "bg-white/5 text-white/40"}
                  `}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black tracking-tighter lowercase">{item.label}</span>
                    <span className="text-[13px] font-medium text-white/30 lowercase mt-0.5">{item.description}</span>
                  </div>
                  {activeIndex === index && (
                    <div className="ml-auto opacity-20">
                      <CustomIcons.ChevronRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </Link>
            ))}

            {/* Navigation Hints */}
            <div className="pt-8 px-6 flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/10">
              <span className="flex items-center gap-2">
                <div className="w-4 h-px bg-white/10" /> navigate with arrows
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-px bg-white/10" /> enter to select
              </span>
            </div>
          </div>

          {/* Right Column: Visual Info */}
          <div className="flex flex-col justify-center items-center lg:items-end text-right">
            <motion.div
              layoutId="bot-profile"
              className="relative mb-12"
            >
              {config.botLogo ? (
                <div className="relative group">
                  <Image
                    src={config.botLogo}
                    alt="Bot Logo"
                    width={220}
                    height={220}
                    className="relative z-10 rounded-full transition-all duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-white/5 blur-[100px] rounded-full scale-125 -z-10 animate-pulse" />
                </div>
              ) : (
                <div className="w-56 h-56 rounded-full bg-white/5 flex items-center justify-center text-9xl font-black text-white/10">
                  {config.botName?.[0]}
                </div>
              )}
            </motion.div>

            <motion.div
              key={activeIndex + "identity"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 text-center lg:text-right"
            >
              <h1 className="text-8xl md:text-9xl font-black tracking-tighter lowercase leading-[0.7] opacity-80">
                {config.botName}
              </h1>
              <p className="text-xl text-white/20 lowercase mt-6 max-w-md lg:ml-auto font-medium">
                {config.tagline}
              </p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-end gap-4 mt-16"
            >
              <a
                href={config.inviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 bg-white text-black font-black rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all lowercase text-[15px] shadow-2xl flex items-center gap-3"
              >
                <SvgDiscord className="w-5 h-5" /> invite {config.botName}
              </a>
              <Link
                href="/commands"
                className="px-10 py-5 bg-white/[0.05] border border-white/5 text-white font-black rounded-[1.5rem] hover:bg-white/[0.1] active:scale-95 transition-all lowercase text-[15px] flex items-center gap-3"
              >
                commands
              </Link>
            </motion.div>

            <div className="mt-8 text-[11px] font-bold text-white/10 lowercase tracking-[0.1em] text-center lg:text-right">
              powering <span className="text-white/30"><AnimatedCounter value={stats.servers} /></span> communities with <span className="text-white/30"><AnimatedCounter value={stats.users} /></span> users
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar / Top Servers Marquee */}
      {topServers.length > 0 && (
        <section className="py-12 border-y border-white/[0.02] bg-[#050505] overflow-hidden relative z-10">
          <div className="max-w-7xl mx-auto px-8 mb-8 flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 mb-2">trusted by leading communities</span>
          </div>
          <div className="relative w-full overflow-hidden">
            <div ref={marqueeRef} className="flex items-center h-16">
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: "-50%" }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="flex whitespace-nowrap"
              >
                {[...topServers, ...topServers].map((server, i) => (
                  <ServerCard key={`${server.id}-${i}`} server={server} />
                ))}
              </motion.div>
            </div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] via-[#050505]/90 to-transparent z-10" />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-32 px-8 border-t border-white/[0.02] relative z-10 bg-[#050505]">
        <div className="max-w-6xl mx-auto space-y-24">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-3 text-white/30">
              <CustomIcons.BotHeadIcon className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">capabilities</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter lowercase leading-[0.8]">
              engineered for scale
            </h2>
            <p className="text-xl text-white/20 lowercase max-w-xl font-medium">
              professional tools built for high-velocity communities.
              everything you need to govern and grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "identity",
                desc: "make the bot yours. personalize name, avatar, banner, and profile status with ease.",
                icon: CustomIcons.PaletteIcon,
                index: "01"
              },
              {
                title: "security",
                desc: "advanced antinuke that detects and prevents raids, mass bans, and unauthorized changes.",
                icon: CustomIcons.ShieldIcon,
                index: "02"
              },
              {
                title: "voicemaster",
                desc: "dynamic join-to-create voice channels with full control over permissions and access.",
                icon: CustomIcons.MicIcon,
                index: "03"
              },
              {
                title: "interactions",
                desc: "full support for discord components v2 and slash commands across all modules.",
                icon: CustomIcons.TerminalIcon,
                index: "04"
              },
              {
                title: "vanity mgmt",
                desc: "reward your members for advertising your server in their status.",
                icon: CustomIcons.LinkIcon,
                index: "05"
              },
              {
                title: "booster roles",
                desc: "automated custom roles for your server boosters. unique icons, colors, and rewards.",
                icon: CustomIcons.SparklesIcon,
                index: "06"
              }
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="group relative p-8 bg-[#0a0a0a]/50 border border-white/5 hover:border-red-500/30 rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_0_50px_rgba(239,68,68,0.1)] overflow-hidden flex flex-row items-center gap-6 h-full"
              >
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.03] border border-white/5 group-hover:border-red-500/20 group-hover:bg-red-500/[0.02] flex items-center justify-center text-white/20 group-hover:text-red-500/60 transition-all duration-500">
                    <feat.icon className="w-8 h-8" />
                  </div>
                </div>

                <div className="space-y-1 flex-grow relative z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black tracking-tighter group-hover:text-white transition-colors">{feat.title}</h3>
                    <span className="text-[10px] font-black tracking-widest text-white/5 group-hover:text-red-500/10 transition-colors duration-500">{feat.index}</span>
                  </div>
                  <p className="text-[13px] text-white/20 font-medium leading-tight lowercase max-w-[200px]">
                    {feat.desc}
                  </p>
                </div>

                <Link
                  href="/commands"
                  className="mt-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/10 group-hover:text-red-500/40 transition-colors cursor-pointer relative z-10"
                >
                  Learn more <CustomIcons.ChevronRight className="w-3 h-3" />
                </Link>

                {/* Subtle Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </motion.div>
            ))}
          </div>

          {/* Bento Showcase Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Filters / Automod Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative p-10 bg-[#0a0a0a]/50 border border-white/5 rounded-[3rem] overflow-hidden min-h-[450px] flex flex-col justify-between"
            >
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3 text-white/30 mb-2">
                  <CustomIcons.FilterIcon className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">automation</span>
                </div>
                <h3 className="text-4xl font-black tracking-tighter">Filters</h3>
                <p className="text-[15px] text-white/20 font-medium leading-relaxed max-w-xs lowercase">
                  keep any chat clean with our many automated filtering options.
                </p>
              </div>

              {/* Visual Graph Area */}
              <div className="absolute inset-0 flex items-center justify-center p-12 mt-20">
                <div className="relative w-full h-full">
                  {/* Nodes and Connecting Lines */}
                  <div className="absolute top-[20%] left-[10%] px-4 py-2 bg-white/5 border border-white/5 rounded-full flex items-center gap-2 group-hover:bg-white/10 transition-colors">
                    <CustomIcons.LinkIcon className="w-4 h-4 text-white/40" />
                    <span className="text-[11px] font-black tracking-widest text-white/20">Links</span>
                  </div>

                  <div className="absolute top-[40%] right-[10%] px-4 py-2 bg-white/5 border border-white/5 rounded-full flex items-center gap-2 group-hover:bg-white/10 transition-colors">
                    <CustomIcons.MentionIcon className="w-4 h-4 text-white/40" />
                    <span className="text-[11px] font-black tracking-widest text-white/20">@ Mass Mentions</span>
                  </div>

                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <motion.path
                      d="M 120 120 L 300 180"
                      fill="none"
                      stroke="white"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                    />
                    <path d="M 120 120 L 120 400" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
                    <path d="M 300 180 L 300 400" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
                  </svg>
                </div>
              </div>

              {/* Grid Background Overlay */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </motion.div>

            {/* Anti-Nuke Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative p-10 bg-[#0a0a0a]/50 border border-white/5 rounded-[3rem] overflow-hidden min-h-[450px] flex flex-col justify-end"
            >
              {/* Radar Visual */}
              <div className="absolute top-0 right-0 w-[120%] h-[120%] -translate-y-1/2 translate-x-1/2 pointer-events-none select-none">
                <svg viewBox="0 0 500 500" className="w-full h-full opacity-[0.05]">
                  <circle cx="250" cy="250" r="100" fill="none" stroke="white" strokeWidth="1" />
                  <circle cx="250" cy="250" r="150" fill="none" stroke="white" strokeWidth="1" />
                  <circle cx="250" cy="250" r="200" fill="none" stroke="white" strokeWidth="1" />
                  <circle cx="250" cy="250" r="250" fill="none" stroke="white" strokeWidth="1" />

                  {/* Scanning sweep */}
                  <motion.path
                    d="M 250 250 L 250 0 A 250 250 0 0 1 500 250 Z"
                    fill="url(#radarGradient)"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "250px 250px" }}
                  />
                  <defs>
                    <radialGradient id="radarGradient" cx="250" cy="250" r="250" fx="250" fy="250" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="white" stopOpacity="0" />
                      <stop offset="100%" stopColor="white" stopOpacity="0.1" />
                    </radialGradient>
                  </defs>

                  {/* Threat Dots */}
                  <circle cx="150" cy="180" r="4" fill="white" className="animate-pulse" />
                  <circle cx="350" cy="220" r="4" fill="white" className="animate-pulse opacity-50" />
                  <circle cx="220" cy="120" r="4" fill="white" className="animate-pulse opacity-30" />
                </svg>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3 text-white/30 mb-2">
                  <CustomIcons.ShieldIcon className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">security</span>
                </div>
                <h3 className="text-4xl font-black tracking-tighter">Anti-Nuke</h3>
                <p className="text-[15px] text-white/20 font-medium leading-relaxed max-w-xs lowercase">
                  easily prevent your server from malicious attacks and griefing.
                </p>
              </div>
            </motion.div>

            {/* Vanity Management Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative p-10 bg-[#0a0a0a]/50 border border-white/5 rounded-[3rem] overflow-hidden min-h-[450px] flex flex-col justify-between md:col-span-2"
            >
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3 text-white/30 mb-2">
                  <CustomIcons.PriceTagIcon className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">tag rewards</span>
                </div>
                <h3 className="text-4xl font-black tracking-tighter lowercase">badge system</h3>
                <p className="text-[15px] text-white/20 font-medium leading-relaxed max-w-sm lowercase">
                  manage roles for people with the server tag. automated tag notifications and custom messages for server tag advertising.
                </p>
              </div>

              {/* Server Tag Visual Showcase */}
              <div className="absolute inset-x-0 bottom-0 top-32 flex items-center justify-center pointer-events-none p-12 overflow-hidden">
                <div className="relative w-full max-w-md group-hover:scale-110 transition-transform duration-1000">
                  {/* Status Bubble Container */}
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-[#111214]/90 border border-white/5 p-5 rounded-[1.25rem] shadow-2xl backdrop-blur-md relative z-10 mx-auto w-fit min-w-[280px] flex flex-col gap-4"
                  >
                    {/* Discord Profile Inner Layout */}
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-12 h-12 rounded-full relative flex-shrink-0">
                        {config.botLogo ? (
                          <Image src={config.botLogo} alt="User" fill className="rounded-full object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full bg-[#5865F2] rounded-full" />
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2">
                          <span className="text-[17px] font-bold text-[#ff9f69]">{config.botName}</span>
                          <div className="flex items-center bg-[#2b2d31] rounded-[8px] shadow-inner border border-white/5 px-0.5 py-0 gap-0">
                            {config.serverTagIcon ? (
                              <Image
                                src={config.serverTagIcon}
                                alt="Tag Icon"
                                width={100}
                                height={100}
                                className="w-10 h-10 object-contain"
                                unoptimized
                              />
                            ) : (
                              <CustomIcons.PriceTagIcon className="w-10 h-10 text-white/50" />
                            )}
                            <span className="text-[19px] font-black text-[#f2f3f5] pr-2 tracking-tighter">67</span>
                          </div>
                        </div>
                        <div className="text-[15px] font-medium text-[#4da9ff]">check out my tag!</div>
                      </div>
                    </div>

                    {/* Badge / Role Reward Animation */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-3 p-3 bg-[#4da9ff]/[0.05] border border-[#4da9ff]/10 rounded-xl w-full"
                    >
                      <div className="p-2 bg-[#4da9ff]/10 rounded-lg">
                        <CustomIcons.ShieldIcon className="w-4 h-4 text-[#4da9ff]" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#4da9ff]/80 block leading-none">role assigned</span>
                        <span className="text-[11px] font-bold text-white/80 tracking-tighter shrink-0 lowercase whitespace-nowrap overflow-hidden block">exclusive supporter</span>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-12 -right-8 w-24 h-24 bg-red-500/10 blur-[60px] rounded-full animate-pulse" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/5 blur-[80px] rounded-full" />
                </div>
              </div>

              {/* Grid Background */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </motion.div>
          </div>

          {/* Modern / Engine Section */}
          <div className="pt-24">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="p-16 bg-white/[0.01] border border-white/5 rounded-[3rem] relative overflow-hidden"
            >
              <div className="max-w-2xl space-y-8 relative z-10">
                <div className="flex items-center gap-3 text-white/20">
                  <CustomIcons.TerminalIcon className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">engine architecture</span>
                </div>
                <h3 className="text-5xl font-black tracking-tighter leading-tight">
                  built for the <span className="text-white/40">modern discord experience.</span>
                </h3>
                <ul className="space-y-6">
                  <li className="flex gap-4 group">
                    <div className="mt-1 w-5 h-5 rounded bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    </div>
                    <div>
                      <p className="text-[15px] font-black tracking-widest uppercase text-white/60 mb-1">components v2</p>
                      <p className="text-[14px] text-white/20 font-medium leading-relaxed lowercase">utilises discords latest interactable components and structures.</p>
                    </div>
                  </li>
                  <li className="flex gap-4 group">
                    <div className="mt-1 w-5 h-5 rounded bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    </div>
                    <div>
                      <p className="text-[15px] font-black tracking-widest uppercase text-white/60 mb-1">slash commands</p>
                      <p className="text-[14px] text-white/20 font-medium leading-relaxed lowercase">full native support for slash commands across all bot modules.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Decorative Code Background */}
              <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none hidden lg:block">
                <pre className="text-[10px] font-mono leading-relaxed">
                  {`import { Bot } from 'eris';\n\nconst client = new Bot({\n  intents: ['GUILDS', 'MESSAGES'],\n  components: true,\n  slashCommands: true\n});\n\nclient.on('ready', () => {\n  console.log('Engine online');\n});`}
                </pre>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-24 px-8 border-t border-white/[0.02] relative z-10 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24">
          <div className="col-span-1 md:col-span-2 space-y-6">
            {config.botLogo && (
              <Image
                src={config.botLogo}
                alt="Bot Logo"
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            <p className="text-[13px] text-white/20 leading-relaxed max-w-xs font-medium lowercase">
              {config.tagline}
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">bot</h4>
            <ul className="space-y-4 text-[13px] font-medium text-white/20 lowercase">
              <li>
                <a href={config.inviteLink} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">invite</a>
              </li>
              <li>
                <Link href="/commands" className="hover:text-white transition-colors">commands</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">legal</h4>
            <ul className="space-y-4 text-[13px] font-medium text-white/20 lowercase">
              <li>
                <Link href="/tos" className="hover:text-white transition-colors">terms of service</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">privacy policy</Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Modern Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
    </div>
  )
}