"use client"

import { motion } from "framer-motion"
import { useSiteConfig } from "@/lib/site-config"
import * as Icons from "lucide-react"
import DiscordEmbed from "@/app/components/DiscordEmbed"
import BotTag from "@/app/components/BotTag"

export default function AntiNukeShowcase() {
    const { config } = useSiteConfig()
    const botName = (config?.botName || "breed").toLowerCase()
    const botLogo = config?.botLogo || "https://i.ibb.co/rKjqv7hs/output-1.jpg"

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                    <Icons.ShieldAlert className="w-6 h-6 text-red-500/60" />
                </div>
                <div>
                    <h2 className="text-4xl font-black tracking-tight lowercase text-white">antinuke</h2>
                    <p className="text-white/40 text-lg lowercase">prevent unauthorized destructive actions and protect your community automatically</p>
                </div>
            </div>

            <div className="relative group">
                <div className="absolute inset-0 bg-red-500/5 blur-[100px] -z-10 group-hover:bg-red-500/10 transition-colors" />
                <div className="bg-[#313338] rounded-[2rem] border border-white/5 p-4 md:p-8 overflow-hidden shadow-2xl">
                    <div className="max-w-4xl mx-auto rounded-xl overflow-hidden border border-white/5 bg-[#313338] p-4 flex flex-col gap-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
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
                                        5:16 PM
                                    </span>
                                </div>
                                <DiscordEmbed embed={{
                                    color: "#ff0000",
                                    fields: [
                                        { name: "☢️ antinuke violation", value: "you violated antinuke rules in **6 7 s e r v e r**", inline: false },
                                        { name: "action taken", value: "member role update", inline: true },
                                        { name: "punishment applied", value: "ban", inline: true },
                                        { name: "what you did", value: "assigned dangerous roles to @cakedave: Mraow", inline: false }
                                    ],
                                    footer: {
                                        text: "Today at 5:16 PM"
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
