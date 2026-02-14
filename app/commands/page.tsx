"use client";

import { useState, useMemo } from "react";
import Navigation from "../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_COMMANDS, Command } from "@/lib/commands";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/category-icons";
import * as Icons from "lucide-react";

export default function Commands() {
  const [isDark, setIsDark] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const getFullCommandPath = (cmd: Command): string => {
    return cmd.name;
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    Object.values(ALL_COMMANDS).forEach(cmd => {
      if (cmd.category) {
        cats.add(cmd.category);
      }
    });
    return Array.from(cats).sort();
  }, []);

  const filteredCommands = useMemo(() => {
    return Object.values(ALL_COMMANDS).filter((cmd) => {
      if (selectedCategory !== "all" && cmd.category !== selectedCategory) {
        return false;
      }

      if (searchTerm) {
        const fullPath = getFullCommandPath(cmd);
        const matchesSearch =
          fullPath.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmd.aliases.some(alias => alias.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });
  }, [searchTerm, selectedCategory]);

  const totalCommands = Object.values(ALL_COMMANDS).length;

  const formatPermissions = (permissions: string[] = []) => {
    if (!permissions || permissions.length === 0) return "none";
    return permissions.map(p => p.replace(/_/g, " ").toLowerCase()).join(", ");
  };

  const getCategoryIcon = (category: string) => {
    const iconName = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || "Package";
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Package;
  };

  const getCategoryColor = (category: string) => {
    // Return a solid color or gradient for the icon badge
    return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || "from-gray-500 to-gray-600";
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Navigation isDark={isDark} setIsDark={setIsDark} />

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#5865F2]/5 rounded-full blur-[120px]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tighter lowercase leading-[0.8] mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
            >
              commands
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/40 lowercase max-w-xl"
            >
              browse {totalCommands} powerful commands across {categories.length} core modules. everything you need to manage your community.
            </motion.p>
          </div>

          <div className="flex flex-col gap-4 min-w-[300px]">
            <div className="relative group">
              <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="search everything..."
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all lowercase text-lg font-medium"
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all lowercase flex items-center gap-2 border ${selectedCategory === "all"
              ? "bg-white text-black border-white"
              : "bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white"
              }`}
          >
            <Icons.LayoutGrid className="w-4 h-4" />
            all
          </button>
          {categories.map(cat => {
            const Icon = getCategoryIcon(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all lowercase flex items-center gap-2 border ${selectedCategory === cat
                  ? "bg-[#5865F2] text-white border-[#5865F2]"
                  : "bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {cat}
              </button>
            )
          })}
        </div>

        {/* Commands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredCommands.map((cmd, idx) => (
              <motion.div
                layout
                key={cmd.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.02 }}
                className="group relative"
              >
                {/* Visual Accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-7 rounded-[1.5rem] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all flex flex-col h-full overflow-hidden">

                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${getCategoryColor(cmd.category)} shadow-lg`}>
                      {(() => {
                        const Icon = getCategoryIcon(cmd.category);
                        return <Icon className="w-4 h-4 text-white" />
                      })()}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-white/40 transition-colors border border-white/5 px-2 py-0.5 rounded-full">
                      {cmd.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2 tracking-tighter lowercase">
                    {cmd.name}
                  </h3>

                  <p className="text-[#CECECE] text-sm leading-relaxed mb-8 flex-1 lowercase">
                    {cmd.description}
                  </p>

                  <div className="space-y-4 pt-4 border-t border-white/5 mt-auto">
                    {cmd.aliases && cmd.aliases.length > 0 && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-white/20 lowercase">aliases</span>
                        <div className="flex flex-wrap gap-2">
                          {cmd.aliases.map(a => (
                            <span key={a} className="px-2 py-1 rounded-md bg-white/[0.05] text-[10px] font-bold text-white/40 lowercase">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-white/20 lowercase">perms</span>
                      <span className="text-xs font-medium text-white/40 lowercase italic">
                        {formatPermissions(cmd.permissions)}
                      </span>
                    </div>

                    {/* Arguments Summary */}
                    {(cmd.required_args?.length > 0 || cmd.optional_args?.length > 0) && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {cmd.required_args?.map(arg => (
                          <div key={arg.name} className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] font-bold text-red-400 lowercase whitespace-normal text-center">
                            {arg.name}*
                          </div>
                        ))}
                        {cmd.optional_args?.map(arg => (
                          <div key={arg.name} className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold text-blue-400 lowercase whitespace-normal text-center">
                            {arg.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hover Detail Glow */}
                  <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredCommands.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-40"
          >
            <div className="inline-flex p-8 rounded-full bg-white/5 mb-8">
              <Icons.SearchX className="w-12 h-12 text-white/20" />
            </div>
            <h2 className="text-2xl font-black lowercase mb-2">no commands found</h2>
            <p className="text-white/40 lowercase">try checking another category or refining your search.</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
