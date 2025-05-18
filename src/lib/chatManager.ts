import { NextResponse, type NextRequest } from "next/server";

export const runtime = "edge";

// Interface for message structure
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Handles chat requests using Groq API with deepseek-r1-distill-llama-70b model
 */
export async function sendChatRequest(messages: Message[]) {
  try {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured in environment variables");
    }

    // Add system message to instruct the model
    const systemMessage: Message = {
      role: 'system',
      content: 'You are EcoBuddy, a helpful assistant focused on environmental sustainability. Provide direct responses without showing your thinking process. Do not use <think> tags or similar formatting in your responses. Keep your answers concise and helpful. Strictly only reply to environmental related queries and basic greeting do not indugle in any other topic'
    };

    const payload = {
      model: "deepseek-r1-distill-llama-70b", // Using the specified model
      messages: [
        systemMessage,
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        }))
      ],
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    };

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error:", {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      throw new Error(`Groq API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    let reply = data?.choices?.[0]?.message?.content;
    
    if (!reply) {
      throw new Error("Invalid response format from Groq API");
    }

    // Clean up the response by removing any thinking process that might still appear
    reply = reply.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    
    return reply;
  } catch (error: any) {
    console.error("Chat request error:", error);
    throw error;
  }
}

/**
 * API route handler for chat requests
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // Prepare messages array for the API
    const messages: Message[] = [
      ...history,
      { role: "user", content: message }
    ];

    // Send request to Groq API
    const reply = await sendChatRequest(messages);

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
      },
      { status: error.status || 500 }
    );
  }
}