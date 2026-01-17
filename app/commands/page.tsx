
"use client";

import { useState, useMemo } from "react";
import Navigation from "../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
<<<<<<< HEAD
import { ALL_COMMANDS, Command } from "@/lib/commands-data";
=======
import { ALL_COMMANDS, Command } from "@/lib/commands";
>>>>>>> 7d27ad4 (67676767)
import { getCommandParent } from "@/lib/command-hierarchy";
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
      const fullA = getFullCommandPath(a);
      const fullB = getFullCommandPath(b);
      return fullA.localeCompare(fullB);
    });
  }, [searchTerm, selectedCategory]);

  const totalCommands = Object.values(ALL_COMMANDS).length;

  const formatPermissions = (permissions: string[] = []) => {
    if (!permissions || permissions.length === 0) return "None";
    return permissions.map(p => 
      p.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    ).join(', ');
  };

  const formatArguments = (required: any[] = [], optional: any[] = []) => {
    const total = required.length + optional.length;
    if (total === 0) return { summary: "None", details: [] };
    
    const details: Array<{name: string, type: string, required: boolean}> = [];
    
    required.forEach(arg => {
      if (arg.name) {
        details.push({
          name: arg.name,
          type: arg.type || 'text',
          required: true
        });
      }
    });
    
    optional.forEach(arg => {
      if (arg.name) {
        details.push({
          name: arg.name,
          type: arg.type || 'text',
          required: false
        });
      }
    });
    
    const parts = [];
    if (required.length > 0) parts.push(`${required.length} required`);
    if (optional.length > 0) parts.push(`${optional.length} optional`);
    
    return { summary: parts.join(', '), details };
  };

  const getCategoryIcon = (category: string) => {
    const iconName = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || "Package";
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Package;
  };

  const getCategoryColor = (category: string) => {
    return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || "from-gray-500 to-gray-600";
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      {/* Minimal background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${isDark ? "bg-white" : "bg-black"}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <Navigation isDark={isDark} setIsDark={setIsDark} />

      <main className="relative max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mb-8">
            <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${isDark ? "text-white" : "text-black"}`}>
              Command Reference
            </h1>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Browse all {totalCommands} commands across {categories.length} categories
            </p>
          </div>

          {/* Category Tabs */}
          <div className="mb-8">
            <div className={`flex gap-2 overflow-x-auto pb-2 scrollbar-thin ${isDark ? "scrollbar-thumb-white/20" : "scrollbar-thumb-black/20"}`}>
              {/* All Tab */}
              <motion.button
                onClick={() => setSelectedCategory("all")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === "all"
                    ? isDark 
                      ? "bg-white/10 text-white border border-white/30" 
                      : "bg-black/10 text-black border border-black/30"
                    : isDark 
                      ? "bg-gray-900/50 text-gray-400 border border-white/10 hover:border-white/30" 
                      : "bg-gray-100/50 text-gray-600 border border-black/10 hover:border-black/30"
                }`}
              >
                <Icons.Grid3x3 className="w-4 h-4" />
                <span>All Commands</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedCategory === "all"
                    ? isDark ? "bg-white/20" : "bg-black/20"
                    : isDark ? "bg-white/10" : "bg-black/10"
                }`}>
                  {totalCommands}
                </span>
              </motion.button>

              {/* Category Tabs */}
              {categories.map(cat => {
                const IconComponent = getCategoryIcon(cat);
                const colorGradient = getCategoryColor(cat);
                const catCount = Object.values(ALL_COMMANDS).filter(c => c.category === cat).length;
                
                return (
                  <motion.button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? isDark 
                          ? "bg-white/10 text-white border border-white/30" 
                          : "bg-black/10 text-black border border-black/30"
                        : isDark 
                          ? "bg-gray-900/50 text-gray-400 border border-white/10 hover:border-white/30" 
                          : "bg-gray-100/50 text-gray-600 border border-black/10 hover:border-black/30"
                    }`}
                  >
                    <div className={`p-1 rounded bg-gradient-to-br ${colorGradient}`}>
                      <IconComponent className="w-3 h-3 text-white" />
                    </div>
                    <span className="capitalize">{cat}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      selectedCategory === cat
                        ? isDark ? "bg-white/20" : "bg-black/20"
                        : isDark ? "bg-white/10" : "bg-black/10"
                    }`}>
                      {catCount}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="text"
                placeholder="Search commands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-6 py-4 rounded-xl ${isDark ? "bg-gradient-to-r from-gray-900/90 to-black/90 border-white/10 text-white placeholder-gray-500" : "bg-gradient-to-r from-gray-100/90 to-white/90 border-black/10 text-black placeholder-gray-500"} border focus:outline-none transition-all duration-300`}
              />
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredCommands.map((cmd, index) => {
              const fullPath = getFullCommandPath(cmd);
              
              return (
                <motion.div
                  key={`${cmd.category}:${cmd.name}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  whileHover={{ 
                    scale: 1.03,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className={`group relative p-5 rounded-xl ${isDark ? "bg-gradient-to-br from-gray-900/80 to-black/80 border-white/10 hover:border-white/30" : "bg-gradient-to-br from-gray-100/80 to-white/80 border-black/10 hover:border-black/30"} border transition-all duration-300 cursor-pointer overflow-hidden`}
                >
                  <motion.div
                    className={`absolute inset-0 ${isDark ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-black/5 to-transparent"} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className={`text-lg font-bold ${isDark ? "text-white group-hover:text-gray-200" : "text-black group-hover:text-gray-800"} transition-colors`}>
                        {fullPath}
                      </h3>
                    </div>

                    <div className="mb-3">
                      <span className={`text-xs px-2 py-1 rounded-md ${isDark ? "bg-purple-500/20 border-purple-500/30 text-purple-300" : "bg-purple-500/20 border-purple-500/30 text-purple-700"} border`}>
                        {cmd.category}
                      </span>
                    </div>

                    {cmd.aliases && cmd.aliases.length > 0 && (
                      <motion.div 
                        className="flex flex-wrap gap-2 mb-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>Aliases:</span>
                        {cmd.aliases.map((alias, aliasIndex) => (
                          <motion.span
                            key={alias}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.02 + aliasIndex * 0.05 }}
                            className={`text-xs px-2 py-1 rounded-md ${isDark ? "bg-white/5 border-white/10 text-gray-400" : "bg-black/5 border-black/10 text-gray-600"} border`}
                            whileHover={{ scale: 1.1 }}
                          >
                            {alias}
                          </motion.span>
                        ))}
                      </motion.div>
                    )}

                    <div className="mb-3">
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} leading-relaxed`}>
                        {cmd.description}
                      </p>
                    </div>

                    <motion.div 
                      className={`flex items-center gap-2 text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span>Arguments</span>
                      <div className={`flex-1 h-px ${isDark ? "bg-white/10" : "bg-black/10"}`} />
                    </motion.div>
                    <motion.div className="mt-2">
                      {(() => {
                        const argData = formatArguments(cmd.required_args, cmd.optional_args);
                        if (argData.details.length === 0) {
                          return (
                            <span className={`text-xs ${isDark ? "text-gray-600" : "text-gray-500"}`}>
                              {argData.summary}
                            </span>
                          );
                        }
                        return (
                          <div className="space-y-1">
                            {argData.details.map((arg, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  arg.required 
                                    ? isDark ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-red-500/20 text-red-700 border border-red-500/30"
                                    : isDark ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-blue-500/20 text-blue-700 border border-blue-500/30"
                                }`}>
                                  {arg.required ? 'required' : 'optional'}
                                </span>
                                <span className={`text-xs font-mono ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                  {arg.name}
                                </span>
                                <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>
                                  ({arg.type})
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </motion.div>

                    <motion.div 
                      className={`mt-3 flex items-center gap-2 text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 }}
                    >
                      <span>Permissions</span>
                      <div className={`flex-1 h-px ${isDark ? "bg-white/10" : "bg-black/10"}`} />
                    </motion.div>
                    <motion.div 
                      className="mt-2"
                    >
                      <span className={`text-xs px-3 py-1 rounded-full ${isDark ? "bg-white/10 text-gray-400 border-white/20" : "bg-black/10 text-gray-600 border-black/20"} border`}>
                        {formatPermissions(cmd.permissions)}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filteredCommands.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              No commands found matching your search
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
