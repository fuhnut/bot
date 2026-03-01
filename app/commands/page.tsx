"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import * as CustomIcons from "../components/CustomIcons"
import { ALL_COMMANDS } from "@/lib/commands"
import { CATEGORY_ICONS } from "@/lib/category-icons"
import { useSiteConfig } from "@/lib/site-config"

export default function Commands() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCommand, setSelectedCommand] = useState<any>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const { config } = useSiteConfig()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const categories = useMemo(() => {
    const cats = new Set(Object.values(ALL_COMMANDS).map((cmd) => cmd.category))
    return ["all", ...Array.from(cats)].sort()
  }, [])

  const filteredCommands = useMemo(() => {
    return Object.values(ALL_COMMANDS).filter((cmd) => {
      const matchesCategory = selectedCategory === "all" || cmd.category === selectedCategory
      const matchesSearch = !searchTerm ||
        cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.aliases.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))

      return matchesCategory && matchesSearch
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [searchTerm, selectedCategory])

  const [focusedIndex, setFocusedIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Meta + K or / for search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }

      if (document.activeElement === searchInputRef.current) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setFocusedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setFocusedIndex(prev => Math.max(prev - 1, 0))
      }
      if (e.key === "Enter" && focusedIndex !== -1) {
        setSelectedCommand(filteredCommands[focusedIndex])
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [filteredCommands, focusedIndex])

  if (!hasMounted) return <div className="min-h-screen bg-black" />

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans selection:bg-white/10 overflow-hidden">
      {/* Category Sidebar (Left) */}
      <div className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-8 bg-black/20 backdrop-blur-3xl z-50">
        <Link href="/" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all group">
          <div className="w-6 h-6 rounded-md overflow-hidden border border-white/10 group-hover:scale-110 transition-transform">
            {config?.botLogo ? <img src={config.botLogo} alt="logo" className="w-full h-full object-contain" /> : <div className="w-full h-full bg-white/10" />}
          </div>
        </Link>

        <div className="flex-1 flex flex-col gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                w-12 h-12 rounded-2xl flex items-center justify-center transition-all group relative
                ${selectedCategory === cat ? "bg-white/10 text-white border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]" : "text-white/20 hover:text-white/40 hover:bg-white/5"}
              `}
              title={cat}
            >
              {(() => {
                const iconKey = (CATEGORY_ICONS[cat.toLowerCase() as keyof typeof CATEGORY_ICONS] || "HashIcon") as keyof typeof CustomIcons;
                const Icon = (CustomIcons as any)[iconKey] || CustomIcons.HashIcon;
                return <Icon className="w-5 h-5 flex-shrink-0" />;
              })()}
              {selectedCategory === cat && (
                <motion.div layoutId="sidebar-active" className="absolute -left-4 w-1 h-6 bg-white rounded-r-full shadow-[0_0_10px_white]" />
              )}
            </button>
          ))}
        </div>

        <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-white/10 hover:text-white/30 transition-colors">
          <CustomIcons.ChevronDown className="w-5 h-5 -rotate-90" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Navigation Dropdown removed */}


        <main className="max-w-[1400px] mx-auto px-12 pb-24">
          {/* Hero Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-16">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 rounded-[2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-3xl">
                {(() => {
                  if (selectedCategory === "all") return <CustomIcons.CommandsIcon className="w-9 h-9 text-white/60" />;
                  const iconKey = (CATEGORY_ICONS[selectedCategory.toLowerCase() as keyof typeof CATEGORY_ICONS] || "HashIcon") as keyof typeof CustomIcons;
                  const Icon = (CustomIcons as any)[iconKey] || CustomIcons.HashIcon;
                  return <Icon className="w-9 h-9 text-white/60" />;
                })()}
              </div>
              <div className="space-y-1">
                <h1 className="text-6xl font-black tracking-tighter lowercase leading-none">
                  {selectedCategory === "all" ? "commands" : selectedCategory}
                </h1>
                <p className="text-xl text-white/20 lowercase font-medium">
                  {selectedCategory === "all"
                    ? `${filteredCommands.length} commands across ${categories.length - 1} modules`
                    : `${filteredCommands.length} commands in this module`
                  }
                </p>
              </div>
            </div>

            {/* Search Box */}
            <div className="relative group w-full md:w-[450px]">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-white transition-colors">
                <CustomIcons.SearchIcon className="w-4 h-4" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search commands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-16 pr-24 py-5 text-[15px] font-medium outline-none focus:border-white/10 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg">
                <span className="text-[10px] font-black opacity-40 lowercase">⌘K</span>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCommands.map((cmd, idx) => (
                <motion.div
                  key={cmd.name}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setSelectedCommand(cmd)}
                  className={`
                    group relative p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all duration-300
                    ${focusedIndex === idx ? "ring-2 ring-white/10 bg-white/[0.02]" : ""}
                    cursor-pointer
                  `}
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <h3 className="text-2xl font-black tracking-tight lowercase group-hover:text-white transition-colors">{cmd.name}</h3>
                  </div>
                  <p className="text-[14px] text-white/30 lowercase font-medium mb-10 leading-relaxed min-h-[44px] group-hover:text-white/40">
                    {cmd.description}
                  </p>

                  <div className="space-y-6 pt-6 border-t border-white/[0.02]">
                    <div className="space-y-3">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/10 block leading-none">Arguments</span>
                      <div className="flex flex-wrap gap-2">
                        {cmd.required_args.length > 0 || cmd.optional_args.length > 0 ? (
                          <>
                            {cmd.required_args.map((arg: any) => (
                              <span key={arg.name} className="px-5 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-[11px] font-black lowercase text-white/40">
                                {arg.name}
                              </span>
                            ))}
                            {cmd.optional_args.map((arg: any) => (
                              <span key={arg.name} className="px-5 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-[11px] font-black lowercase text-white/20">
                                [{arg.name}]
                              </span>
                            ))}
                          </>
                        ) : (
                          <span className="px-5 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-[11px] font-black lowercase text-white/10">none</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/10 block leading-none">Permissions</span>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-5 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-[11px] font-black lowercase text-white/40">
                          {cmd.permissions.length > 0 ? cmd.permissions.join(", ") : "everyone"}
                        </span>
                      </div>
                    </div>

                    {cmd.aliases.length > 0 && (
                      <div className="space-y-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/10 block leading-none">Aliases</span>
                        <div className="flex flex-wrap gap-2">
                          {cmd.aliases.map((alias: string) => (
                            <span key={alias} className="px-4 py-1.5 bg-white/[0.02] border border-white/5 rounded-lg text-[10px] font-black lowercase text-white/20">
                              {alias}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category & Slash Indicator (Top Right) */}
                  <div className="absolute top-8 right-8 flex items-center gap-3">
                    {cmd.has_slash && (
                      <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center" title="Slash Command">
                        <CustomIcons.SlashIcon className="w-4 h-4 text-white/40" />
                      </div>
                    )}
                    <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <CustomIcons.ChevronRight className="w-4 h-4 text-white/20" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Command Detail Overlay */}
      <AnimatePresence>
        {selectedCommand && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-3xl flex items-center justify-center p-6 md:p-12"
            onClick={() => setSelectedCommand(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#0a0a0a] border border-white/5 rounded-[4rem] p-12 md:p-16 relative overflow-hidden shadow-3xl"
            >
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <div className="w-24 h-24 bg-white/[0.03] border border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
                    {(() => {
                      const iconKey = (CATEGORY_ICONS[selectedCommand.category.toLowerCase() as keyof typeof CATEGORY_ICONS] || "HashIcon") as keyof typeof CustomIcons;
                      const Icon = (CustomIcons as any)[iconKey] || CustomIcons.HashIcon;
                      return <Icon className="w-10 h-10 text-white/40" />;
                    })()}
                  </div>
                  <button
                    onClick={() => setSelectedCommand(null)}
                    className="w-14 h-14 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all group"
                  >
                    <CustomIcons.XIcon className="w-6 h-6 opacity-20 group-hover:opacity-60 transition-opacity" />
                  </button>
                </div>

                <div className="space-y-4">
                  <h2 className="text-7xl font-black tracking-tighter lowercase leading-[0.8]">{selectedCommand.name}</h2>
                  <p className="text-2xl text-white/20 font-medium lowercase leading-tight">
                    {selectedCommand.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 block">Usage Structure</span>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl font-mono text-sm text-white/40 lowercase">
                      {config.prefix}{selectedCommand.name} {selectedCommand.required_args.map((a: any) => `<${a.name}>`).join(" ")} {selectedCommand.optional_args.map((a: any) => `[${a.name}]`).join(" ")}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 block">Module Category</span>
                    <div className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/5 rounded-2xl">
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                      <span className="text-[13px] font-black lowercase text-white/60">{selectedCommand.category}</span>
                    </div>
                  </div>
                  {selectedCommand.aliases.length > 0 && (
                    <div className="space-y-6 md:col-span-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 block">Available Aliases</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedCommand.aliases.map((alias: string) => (
                          <span key={alias} className="px-5 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-[11px] font-black lowercase text-white/40">
                            {alias}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <a
                  href={config?.inviteLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-6 bg-white text-black text-center rounded-[2rem] font-black text-[13px] uppercase tracking-[0.3em] hover:scale-[1.02] transition-all active:scale-95"
                >
                  Try this feature
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
