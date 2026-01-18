import { NextResponse } from "next/server";

let cachedStats = {
  servers: 0,
  users: 0,
  uptime: "Offline",
  status: "Offline",
  guild_ids: [] as string[],
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
    cachedStats = {
      ...data,
      guild_ids: data.guild_ids || [],
      lastUpdate: Date.now()
    };
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
