"use client"

import { motion } from "framer-motion"
import { useSiteConfig } from "@/lib/site-config"
import * as Icons from "lucide-react"
import DiscordEmbed from "@/app/components/DiscordEmbed"
import BotTag from "@/app/components/BotTag"

export default function ServerLogging() {
    const { config } = useSiteConfig()
    const botName = (config?.botName || "greed").toLowerCase()
    const botLogo = config?.botLogo || "https://cdn.discordapp.com/embed/avatars/0.png"

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex items-start gap-4 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                    <Icons.Plus className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-4xl font-black tracking-tight lowercase text-white">server logging</h2>
                    <p className="text-white/40 text-sm lowercase">track activity and changes in real-time</p>
                </div>
            </div>

            <div className="relative group flex-1">
                <div className="absolute inset-0 bg-white/5 blur-[100px] -z-10 group-hover:bg-white/10 transition-colors" />
                <div className="bg-[#313338] rounded-[2rem] border border-white/5 p-4 md:p-8 overflow-hidden shadow-2xl h-full">
                    <div className="max-w-4xl mx-auto rounded-xl overflow-hidden border border-white/5 bg-[#313338] p-4 flex flex-col gap-4">
                        {/* Member Left Log */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex gap-4"
                        >
                            <img src={botLogo} alt="Bot Avatar" className="w-10 h-10 rounded-full mt-0.5" />
                            <div className="flex flex-col w-full">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-white hover:underline cursor-pointer">
                                        {botName}
                                    </span>
                                    <BotTag />
                                    <span className="text-xs text-[#949BA4] ml-1">
                                        Today at 4:36 PM
                                    </span>
                                </div>
                                <DiscordEmbed embed={{
                                    color: "#f04747",
                                    author: {
                                        name: "cakedave",
                                        iconUrl: "https://i.ibb.co/60cfnM6V/9ff98475d00c1a056b3a869ecb5f8add.webp"
                                    },
                                    description: "**MEMBER LEFT**",
                                    fields: [
                                        { name: "joined server", value: "saturday, 6 july 2024 (2 years ago)", inline: true },
                                        { name: "roles", value: "@member, @supporter", inline: true }
                                    ],
                                    footer: {
                                        text: "member id: 521723267762094111"
                                    }
                                }} />
                            </div>
                        </motion.div>

                        {/* Member Joined Log */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="flex gap-4"
                        >
                            <img src={botLogo} alt="Bot Avatar" className="w-10 h-10 rounded-full mt-0.5" />
                            <div className="flex flex-col w-full">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-white hover:underline cursor-pointer">
                                        {botName}
                                    </span>
                                    <BotTag />
                                    <span className="text-xs text-[#949BA4] ml-1">
                                        Today at 4:41 PM
                                    </span>
                                </div>
                                <DiscordEmbed embed={{
                                    color: "#43b581",
                                    author: {
                                        name: "cakedave",
                                        iconUrl: "https://i.ibb.co/60cfnM6V/9ff98475d00c1a056b3a869ecb5f8add.webp"
                                    },
                                    description: "**MEMBER JOINED**",
                                    fields: [
                                        { name: "joined discord", value: "monday, 10 december 2018 (7 years ago)", inline: true },
                                        { name: "account age", value: "7 years", inline: true }
                                    ],
                                    footer: {
                                        text: "member id: 521723267762094111"
                                    }
                                }} />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
