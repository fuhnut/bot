"use client";

import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { motion } from "framer-motion";
import { useSiteConfig } from "@/lib/site-config";
import { formatTime } from "@/lib/utils";
import * as Icons from "lucide-react";

interface Stats {
  servers: number;
  users: number;
  uptime: string;
  latency?: string;
  status: string;
}

export default function Status() {
  const { config } = useSiteConfig();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setStats(data);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = stats ? [
    { label: "servers", value: stats.servers.toLocaleString(), icon: Icons.Server },
    { label: "users", value: stats.users.toLocaleString(), icon: Icons.Users },
    { label: "uptime", value: stats.uptime, icon: Icons.Clock },
    { label: "status", value: stats.status, icon: Icons.Activity }
  ] : [];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Navigation isDark={true} setIsDark={() => { }} />

      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#5865F2]/5 rounded-full blur-[120px]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter lowercase leading-[0.8] mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            status
          </h1>
          <p className="text-xl text-white/40 lowercase max-w-xl">
            real-time statistics and health information for {(config?.botName || "the bot").toLowerCase()}.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20"></div>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="group relative p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all overflow-hidden flex flex-col justify-between h-full"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                    <card.icon className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                  </div>
                  {card.label === "status" && (
                    <div className={`w-3 h-3 rounded-full ${stats.status === "Online" ? "bg-green-500" : "bg-red-500"} animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]`} />
                  )}
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-white/20 mb-1">{card.label}</p>
                  <p className="text-4xl font-black tracking-tighter text-white lowercase">
                    {card.value}
                  </p>
                </div>

                {/* Hover Detail Glow */}
                <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
            <h2 className="text-2xl font-black lowercase text-white/20">unable to fetch data</h2>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-24 p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-4xl font-black tracking-tighter lowercase mb-4">about {config?.botName || "bot"} system</h2>
            <p className="text-xl text-white/30 leading-relaxed lowercase max-w-4xl">
              the statistics above are pulled directly from our distributed cluster. uptime tracks the continuous operational period of the primary shards. monitoring is updated every 30 seconds to ensure high reliability for over {stats?.servers.toLocaleString()} servers.
            </p>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/[0.01] blur-3xl -z-10" />
        </motion.div>
      </main>
    </div>
  );
}
