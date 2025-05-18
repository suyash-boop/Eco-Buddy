import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";
import { sendChatRequest } from "../../../lib/chatManager";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Format messages for Groq API
    const messages = [
      ...history,
      { role: "user", content: message }
    ];

    // Use the imported function
    const reply = await sendChatRequest(messages);
    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message || String(error) },
      { status: 500 }
    );
  }
}