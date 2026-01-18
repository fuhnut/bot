import { NextResponse } from "next/server";
import { getTranscript } from "@/lib/transcript-storage";

export const revalidate = 3600; // Cache for 1 hour

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const transcriptId = params.id;
    const transcript = getTranscript(transcriptId);

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json(transcript);
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200');
    
    return response;
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json(
      { error: "Failed to fetch transcript" },
      { status: 500 }
    );
  }
}
