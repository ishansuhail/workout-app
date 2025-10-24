import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    // Log the user's message to the console
    console.log("📨 User message:", message);

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

