import { NextRequest, NextResponse } from 'next/server';

interface ServerData {
  id: string;
  name: string;
  members: number;
  icon: string | null;
}

// In-memory storage for top servers (in production, use a database)
let topServers: ServerData[] = [];
let lastUpdated: Date | null = null;

const SYNC_SECRET = process.env.SYNC_SECRET || '69420';

export async function POST(request: NextRequest) {
  try {
    // Verify authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== SYNC_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const servers: ServerData[] = await request.json();

    // Validate the data structure
    if (!Array.isArray(servers)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected array.' },
        { status: 400 }
      );
    }

    // Validate each server object
    for (const server of servers) {
      if (
        typeof server.id !== 'string' ||
        typeof server.name !== 'string' ||
        typeof server.members !== 'number' ||
        (server.icon !== null && typeof server.icon !== 'string')
      ) {
        return NextResponse.json(
          { error: 'Invalid server data format' },
          { status: 400 }
        );
      }
    }

    // Store the data
    topServers = servers;
    lastUpdated = new Date();

    console.log(`✓ Updated top servers: ${servers.length} servers`);

    return NextResponse.json(
      { 
        message: 'Top servers updated successfully',
        count: servers.length,
        timestamp: lastUpdated.toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating top servers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return the current top servers data
    return NextResponse.json({
      servers: topServers,
      count: topServers.length,
      lastUpdated: lastUpdated?.toISOString() || null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching top servers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}