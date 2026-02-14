"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { CATEGORY_ICONS, CATEGORY_COLORS, CATEGORY_DESCRIPTIONS } from "@/lib/category-icons";

interface CommandCategoryCardProps {
  category: string;
  commandCount: number;
  isDark: boolean;
  onClick?: () => void;
}

export default function CommandCategoryCard({
  category,
  commandCount,
  isDark,
  onClick,
}: CommandCategoryCardProps) {
  const iconName = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || "Package";
  const colorGradient = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || "from-gray-500 to-gray-600";
  const description = CATEGORY_DESCRIPTIONS[category as keyof typeof CATEGORY_DESCRIPTIONS] || category;

  const IconComponent = (Icons as any)[iconName];

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className={`cursor-pointer group relative overflow-hidden rounded-[2rem] p-8 ${isDark ? "bg-white/[0.03] border border-white/5" : "bg-gray-50 border border-black/5"
        } transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-white/[0.05]`}
    >
      {/* Glow Effect */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorGradient} blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

      {/* Icon Area */}
      <div className={`mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br ${colorGradient} shadow-lg relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        {IconComponent ? (
          <IconComponent className="w-7 h-7 text-white relative z-10" />
        ) : (
          <Icons.Package className="w-7 h-7 text-white relative z-10" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className={`text-xl font-black mb-2 lowercase tracking-tight ${isDark ? "text-white" : "text-black"}`}>
          {category}
        </h3>
        <p className={`text-sm mb-6 leading-relaxed lowercase ${isDark ? "text-white/40" : "text-black/60"}`}>
          {description}
        </p>
        <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[12px] font-bold lowercase ${isDark ? "bg-white/5 text-white/60 border border-white/5" : "bg-black/5 text-black/60 border border-black/5"
          }`}>
          {commandCount} command{commandCount !== 1 ? "s" : ""}
        </div>
      </div>
    </motion.div>
  );
}
