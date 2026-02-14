"use client"

import { motion } from "framer-motion"
import * as Icons from "lucide-react"
import { useSiteConfig } from "@/lib/site-config"
import DiscordEmbed from "@/app/components/DiscordEmbed"
import BotTag from "@/app/components/BotTag"

const FEATURES = [
  {
    title: "autoresponders",
    description: "reply with messages or embeds on keyword triggers with variables.",
    icon: Icons.MessageSquare
  },
  {
    title: "customization",
    description: "customize {botName}'s look and feel to match your server's identity.",
    icon: Icons.Palette
  },
  {
    title: "moderation",
    description: "keep your server safe with advanced auto-moderation and logging system.",
    icon: Icons.Shield
  },
]

export default function FeatureCards({ isDark }: { isDark: boolean }) {
  const { config } = useSiteConfig()
  const botName = (config?.botName || "bot").toLowerCase()
  const botLogo = config?.botLogo || "https://cdn.discordapp.com/embed/avatars/0.png"

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-32 overflow-hidden">
      <div className="text-center mb-24">
        <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter lowercase leading-[0.9]">
          features that stay <span className="text-[#5865F2] drop-shadow-[0_0_30px_rgba(88,101,242,0.4)]">highly</span> customizable
        </h2>
        <p className="text-xl text-white/40 lowercase max-w-2xl mx-auto leading-relaxed">
          every feature of <span className="text-white font-bold">{botName}</span> is designed to be as customizable as possible
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-24 items-center">
        {/* Left: Authentic Discord Mockups */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-[#313338] rounded-xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative z-20 border border-white/5 max-w-lg p-4 flex flex-col gap-4 font-sans"
          >
            {/* User Message */}
            <div className="flex gap-4 group hover:bg-[#2e3035] -mx-4 px-4 py-1 transition-colors">
              <img src="https://files.catbox.moe/bkstbg.webp" alt="User Avatar" className="w-10 h-10 rounded-full mt-0.5 cursor-pointer hover:opacity-80 transition-opacity" />
              <div className="flex flex-col w-full">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#b490f0] hover:underline cursor-pointer">
                    cakedave
                  </span>
                  <span className="text-xs text-[#949BA4] ml-1">
                    Today at 9:37 PM
                  </span>
                </div>
                <div className="text-[#dbdee1] whitespace-pre-wrap">
                  67
                </div>
              </div>
            </div>

            {/* Bot Response */}
            <div className="flex gap-4 group hover:bg-[#2e3035] -mx-4 px-4 py-1 transition-colors mt-0">
              <img src={botLogo} alt="Bot Avatar" className="w-10 h-10 rounded-full mt-0.5 cursor-pointer hover:opacity-80 transition-opacity" />
              <div className="flex flex-col w-full">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white hover:underline cursor-pointer">
                    {botName}
                  </span>
                  <BotTag />
                  <span className="text-xs text-[#949BA4] ml-1">
                    Today at 9:37 PM
                  </span>
                </div>

                {/* Reply Context */}
                <div className="flex items-center gap-2 text-[#b5bac1] text-xs mb-1 group-hover:text-white transition-colors">
                  <div className="w-8 border-t-2 border-l-2 border-[#4f545c] rounded-tl-md h-2 -ml-9 mt-2 absolute border-b-0 border-r-0" />
                  <img src="https://files.catbox.moe/bkstbg.webp" className="w-4 h-4 rounded-full" alt="" />
                  <span className="font-bold text-[#b490f0] hover:underline cursor-pointer">@cakedave</span>
                  <span className="hover:text-white text-[#b5bac1] cursor-pointer truncate max-w-[200px]">67</span>
                </div>

                <div className="text-[#dbdee1] whitespace-pre-wrap mb-1">
                  <span className="bg-[#3e404f] text-[#c9cdfb] rounded px-1 hover:bg-[#5865F2] hover:text-white transition-colors cursor-pointer font-medium">@cakedave</span>
                </div>

                <div className="mt-1">
                  <DiscordEmbed embed={{
                    color: "#5865F2",
                    author: {
                      name: `${botName} autoresponder`,
                      iconUrl: botLogo
                    },
                    description: `**trigger detected:** "67"\n\nyeah 67 is better than 41! 😂👉🏾👉🏾`,
                    footer: {
                      text: `${botName} • today at 9:37 pm`
                    },
                    fields: []
                  }} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[#5865F2]/10 blur-[150px] z-0" />
        </div>

        {/* Right: Feature List */}
        <div className="flex flex-col gap-16">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex gap-8 group"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-[#5865F2]/10 group-hover:border-[#5865F2]/20 transition-all shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <feature.icon className="w-8 h-8 text-white/40 group-hover:text-[#5865F2] transition-colors relative z-10" />
              </div>
              <div className="flex-grow pb-16 border-b border-white/5 last:border-0">
                <h3 className="text-3xl font-black mb-4 group-hover:text-[#5865F2] transition-colors tracking-tight lowercase">
                  {feature.title.replace("{botName}", botName)}
                </h3>
                <p className="text-white/30 leading-relaxed text-xl lowercase">
                  {feature.description.replace("{botName}", botName)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
