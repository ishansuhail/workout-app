import { NextResponse } from "next/server";
import { aiClient } from "@/lib/llm";



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    // Log the user's message to the console
    console.log("📨 User message:", message);

    const response = await aiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: message }],
    });

    console.log("📩 AI response:", response.choices[0].message.content);

    // You can add AI processing here later
    // For now, just return a simple response
    return NextResponse.json({
      success: true,
      message: "Message received",
      userMessage: message,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process message" },
      { status: 500 }
    );
  }
}

