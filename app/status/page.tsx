"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteConfig } from "@/lib/site-config";
import * as CustomIcons from "../components/CustomIcons";

interface Stats {
  servers: number;
  users: number;
  uptime: string;
  websocket_latency?: number;
  cpu_usage?: number;
  ram_usage?: number;
  net_speed?: number;
  status: string;
  history?: {
    latency: number[];
    cpu: number[];
    ram: number[];
    net: number[];
  };
}

const Sparkline = ({ data, color, height = 40 }: { data: number[], color: string, height?: number }) => {
  if (!data || data.length < 2) return <div style={{ height }} />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;

  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: height - ((val - min) / range) * height
  }));

  // Cubic Bezier smoothing
  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const mx = (curr.x + next.x) / 2;
    path += ` C ${mx},${curr.y} ${mx},${next.y} ${next.x},${next.y}`;
  }

  const fillPath = `${path} L 100,${height} L 0,${height} Z`;

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={fillPath}
        fill={`url(#gradient-${color.replace('#', '')})`}
      />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
      />
    </svg>
  );
};

export default function Status() {
  const { config } = useSiteConfig();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // 10s for more "live" feel
    return () => clearInterval(interval);
  }, [hasMounted]);

  if (!hasMounted) return <div className="min-h-screen bg-black" />;

  const metrics = [
    { label: "latency", value: `${stats?.websocket_latency ?? 0}ms`, history: stats?.history?.latency || [], color: "#5865F2" },
    { label: "cpu", value: `${stats?.cpu_usage ?? 0}%`, history: stats?.history?.cpu || [], color: "#3498DB" },
    { label: "memory", value: `${Math.round(stats?.ram_usage ?? 0)} mb`, history: stats?.history?.ram || [], color: "#E91E63" },
    { label: "network", value: `${stats?.net_speed ?? 0} mb/s`, history: stats?.history?.net || [], color: "#1ABC9C" }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/10 p-8 md:p-20">
      <main className="max-w-7xl mx-auto space-y-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-white/30">
              <CustomIcons.ActivityIcon className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">status</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter lowercase leading-[0.8] mb-4">
              status
            </h1>
          </motion.div>

          <div className="flex items-center gap-6">
            <div className="px-6 py-3 bg-[#111] border border-white/5 rounded-2xl flex items-center gap-4 shadow-xl">
              <div className="flex gap-1.5">
                <div className={`w-2 h-2 rounded-full ${stats?.status === "Online" ? "bg-white shadow-[0_0_10px_white]" : "bg-white/10"}`} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                {stats?.status === "Online" ? "awake!" : "Dead"}
              </span>
            </div>
          </div>
        </div>

        {/* Live Metrics */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-[180px] bg-[#0a0a0a] border border-white/5 rounded-[2rem] animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {metrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className="relative p-8 bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden group hover:bg-white/[0.03] transition-all duration-500"
                >
                  {/* Subtle Grid Background */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                  <div className="flex justify-between items-start mb-10 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{metric.label}</span>
                    <span className="text-3xl font-black text-white tracking-tighter">{metric.value}</span>
                  </div>
                  <div className="h-20 w-full mt-auto opacity-40 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-[1.02] relative z-10">
                    <Sparkline data={metric.history} color={metric.color} height={60} />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </main >
    </div >
  );
}
