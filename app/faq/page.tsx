"use client"

import { useState } from "react"
import Navigation from "../components/Navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useSiteConfig } from "@/lib/site-config"
import * as Icons from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { config } = useSiteConfig()
  const botName = (config?.botName || "bot").toLowerCase()

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

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Navigation isDark={true} setIsDark={() => { }} />

      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <main className="max-w-4xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter lowercase leading-[0.8] mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            faq
          </h1>
          <p className="text-xl text-white/40 lowercase max-w-xl">
            answers to common questions about {botName} and its operations.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl bg-white/[0.03] border border-white/5 overflow-hidden transition-all hover:bg-white/[0.05]"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-8 text-left flex justify-between items-center group"
              >
                <span className="text-xl font-bold lowercase pr-8 group-hover:text-[#5865F2] transition-colors">{faq.question}</span>
                <div className={`p-2 rounded-xl bg-white/5 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                  <Icons.ChevronDown className="w-5 h-5 text-white/20" />
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-8 text-lg text-white/40 lowercase leading-relaxed">
                      {faq.answer.replace("{botName}", botName)}
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
          className="mt-32 p-16 rounded-[4rem] bg-gradient-to-br from-[#5865F2]/20 via-black to-black border border-white/5 text-center"
        >
          <h2 className="text-4xl font-black lowercase mb-6">still have questions?</h2>
          <p className="text-white/40 lowercase mb-12 text-lg">join our community for direct support and feature requests.</p>
          <Link
            href="/discord"
            className="px-12 py-5 bg-white text-black font-black rounded-2xl hover:bg-purple-400 transition-all lowercase inline-block"
          >
            join discord server
          </Link>
        </motion.div>
      </main>
    </div>
  )
}
