"use client"

import { motion } from "framer-motion"
import { useSiteConfig } from "@/lib/site-config"
import * as Icons from "lucide-react"
import DiscordEmbed from "@/app/components/DiscordEmbed"
import BotTag from "@/app/components/BotTag"

export default function SocialShowcase() {
    const { config } = useSiteConfig()
    const botName = (config?.botName || "breed").toLowerCase()
    const botLogo = config?.botLogo || "https://i.ibb.co/rKjqv7hs/output-1.jpg"

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                    <Icons.Share2 className="w-6 h-6 text-blue-500/60" />
                </div>
                <div>
                    <h2 className="text-4xl font-black tracking-tight lowercase text-white">social</h2>
                    <p className="text-white/40 text-lg lowercase">lookup tiktok, roblox, and more profiles directly from your server</p>
                </div>
            </div>

            <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/5 blur-[100px] -z-10 group-hover:bg-blue-500/10 transition-colors" />
                <div className="bg-[#313338] rounded-[2rem] border border-white/5 p-4 md:p-8 overflow-hidden shadow-2xl">
                    <div className="max-w-4xl mx-auto rounded-xl overflow-hidden border border-white/5 bg-[#313338] p-4 flex flex-col gap-4">
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
                                        6:42 PM
                                    </span>
                                </div>
                                <div className="mt-2 text-[#dbdee1] text-[15px] leading-tight">
                                    # broer677 (@sshrel)
                                    <br />
                                    <span className="text-green-400">● online</span>
                                    <br /><br />
                                    **id:** 67
                                    <br />
                                    **created:** September 5, 2020
                                </div>
                                <DiscordEmbed embed={{
                                    color: "#00a2ff",
                                    fields: [
                                        { name: "ℹ️ bio", value: "ok", inline: false },
                                        { name: "📊 statistics", value: "👥 **followers:** 67\n👤 **following:** 41\n👥 **friends:** 21", inline: false }
                                    ],
                                    thumbnail: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-2FBB014DB1BB51DB245D5A704E7D192C-Png/150/150/AvatarHeadshot/Webp/noFilter",
                                    footer: {
                                        text: "Roblox Profile Lookup"
                                    },
                                    author: { name: "", iconUrl: "" }
                                }} />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
