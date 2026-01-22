import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  const session = await getServerSession(authOptions) as any;

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // 1️⃣ Fetch user's guilds
    const userResponse = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.text();
      console.error("Discord API error:", userResponse.status, errorData);
      return NextResponse.json(
        {
          error: "Need to re-login to access servers",
          reason: "Missing guilds permission",
        },
        { status: 403 }
      );
    }

    const userGuilds = await userResponse.json();

    // 2️⃣ Fetch bot's guild IDs from your stats endpoint or pre-saved JSON
    let botGuildIds: string[] = [];
    try {
      // Attempt to fetch the bot's reported guild IDs from the same deployment (robust fallback)
      const base = process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3000}`
      const statsUrl = `${base.replace(/\/$/, "")}/api/stats`

      const statsResponse = await fetch(statsUrl, { signal: AbortSignal.timeout(5000) });
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        botGuildIds = stats.guild_ids || [];
      }
    } catch (statsError) {
      console.warn("Stats endpoint unavailable", statsError);
    }

    // 3️⃣ Compute mutual guilds (where both user and bot are members)
    const mutualGuilds =
      botGuildIds.length > 0
        ? userGuilds.filter((guild: any) => botGuildIds.includes(guild.id))
        : [];

    console.log(
      `User has ${userGuilds.length} servers, bot has ${botGuildIds.length}, mutual: ${mutualGuilds.length}`
    );

    // 4️⃣ Return mutual guilds plus bot guild count for better client handling
    const payload = {
      mutualGuilds,
      botGuildCount: botGuildIds.length,
    };

    const response = NextResponse.json(payload);
    response.headers.set(
      "Cache-Control",
      "private, max-age=300, s-maxage=300, stale-while-revalidate=600"
    );

    return response;
  } catch (error) {
    console.error("Guilds endpoint error:", error);
    return NextResponse.json({ error: "Failed to fetch guilds" }, { status: 500 });
  }
}