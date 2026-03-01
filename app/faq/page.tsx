"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useSiteConfig } from "@/lib/site-config"
import * as CustomIcons from "../components/CustomIcons"

interface FAQItem {
  question: string
  answer: string
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const { config } = useSiteConfig()
  const botName = (config?.botName || "bot").toLowerCase()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const faqs: FAQItem[] = [
    {
      question: "how many commands does the bot have?",
      answer: "the bot features hundreds of commands across 30+ core modules including moderation, leveling, giveaways, and automation - all available as both slash commands and prefix commands.",
    },
    {
      question: "what are the main features?",
      answer: "the bot is packed with features like antinuke (raid protection), automod (spam/invite filtering), leveling system with custom cards, giveaways, and advanced server analytics.",
    },
    {
      question: "is the bot open source?",
      answer: "no, the bot is private property. however, the dashboard and website are designed for high transparency and community feedback.",
    },
    {
      question: "why isn't the bot responding?",
      answer: "ensure the bot has proper permissions (administrator recommended) and that you're using the correct prefix. use /help to verify active commands.",
    },
    {
      question: "does the bot store my messages?",
      answer: "we store minimal data necessary for functionality: moderation logs, server settings, and leveling stats. we do not store message content long-term.",
    },
    {
      question: "how do i set up antinuke?",
      answer: "use /antinuke logchannel to set a log channel, then configure specific modules like role or channel protection. always whitelist your trusted admins first.",
    }
  ]

  if (!hasMounted) return <div className="min-h-screen bg-black" />

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#5865F2]/30 p-8 md:p-20">


      <main className="max-w-4xl mx-auto py-12">
        <div className="flex flex-col gap-4 mb-20">
          <div className="flex items-center gap-3 text-purple-400">
            <CustomIcons.FaqIcon className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">knowledge base</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-7xl md:text-9xl font-black tracking-tighter lowercase leading-[0.8] mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
          >
            faq
          </motion.h1>
          <p className="text-xl text-white/30 lowercase max-w-xl font-medium">
            answers to common questions about {botName}.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden
                ${openIndex === index ? "bg-[#111] border-white/10 shadow-2xl" : "bg-[#0a0a0a] border-white/5 hover:border-white/10"}
              `}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-10 text-left flex justify-between items-center group"
              >
                <span className={`text-xl font-black tracking-tight lowercase transition-colors
                  ${openIndex === index ? "text-white" : "text-white/40 group-hover:text-white/60"}
                `}>{faq.question}</span>
                <div className={`p-3 rounded-2xl bg-white/[0.03] border border-white/5 transition-all duration-500 ${openIndex === index ? 'rotate-180 bg-[#5865F2]/10 border-[#5865F2]/20' : ''}`}>
                  <CustomIcons.ChevronDown className={`w-4 h-4 ${openIndex === index ? 'text-[#5865F2]' : 'text-white/10'}`} />
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="px-10 pb-10 text-lg text-white/30 lowercase leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 p-16 rounded-[4rem] bg-[#111] border border-white/10 text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-[#5865F2]/10 rounded-3xl border border-[#5865F2]/20">
                <CustomIcons.SupportIcon className="w-8 h-8 text-[#5865F2]" />
              </div>
            </div>
            <h2 className="text-4xl font-black tracking-tighter lowercase mb-6">still have questions?</h2>
            <p className="text-white/20 lowercase mb-12 text-lg font-medium">join our community for direct support and feature requests.</p>
            <Link
              href="/discord"
              className="px-12 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all lowercase inline-block shadow-2xl"
            >
              join discord server
            </Link>
          </div>
          <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
            <CustomIcons.SparklesIcon className="w-32 h-32 rotate-12" />
          </div>
        </motion.div>
      </main>
    </div>
  )
}
