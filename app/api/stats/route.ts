import { NextResponse } from "next/server";

let cachedStats = {
  servers: 0,
  users: 0,
  uptime: "Offline",
  status: "Offline",
  guild_ids: [] as string[],
  websocket_latency: 0,
  cpu_usage: 0,
  ram_usage: 0,
  net_speed: 0,
  history: {
    latency: [] as number[],
    cpu: [] as number[],
    ram: [] as number[],
    net: [] as number[]
  },
  lastUpdate: 0
};

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  const now = Date.now();
  const timeSinceUpdate = now - cachedStats.lastUpdate;

  const response = NextResponse.json({
    ...(cachedStats.lastUpdate > 0 && timeSinceUpdate < 120000 ? cachedStats : { ...cachedStats, status: "Offline" }),
    status: cachedStats.lastUpdate > 0 && timeSinceUpdate < 120000 ? "Online" : "Offline"
  });

  response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=120');

  return response;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Update history
    const MAX_HISTORY = 40;
    const history = cachedStats.history;

    if (data.websocket_latency !== undefined) {
      history.latency.push(data.websocket_latency);
      if (history.latency.length > MAX_HISTORY) history.latency.shift();
    }
    if (data.cpu_usage !== undefined) {
      history.cpu.push(data.cpu_usage);
      if (history.cpu.length > MAX_HISTORY) history.cpu.shift();
    }
    if (data.ram_usage !== undefined) {
      history.ram.push(data.ram_usage);
      if (history.ram.length > MAX_HISTORY) history.ram.shift();
    }
    if (data.net_speed !== undefined) {
      history.net.push(data.net_speed);
      if (history.net.length > MAX_HISTORY) history.net.shift();
    }

    cachedStats = {
      ...data,
      guild_ids: data.guild_ids || [],
      history: history,
      lastUpdate: Date.now()
    };
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
