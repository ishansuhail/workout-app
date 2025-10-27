import { NextResponse } from "next/server";
import { aiClient } from "@/lib/llm";
import { NewExercise, NewWorkout, Workout } from "@/db/schema";

const SYSTEM = `
You are an information extractor for workout entries.
Input: casual gym text like "4 by 10 bench 185", "bench press 3x5 @ 100kg", etc.
Output: STRICT JSON with EXACT keys: exerciseName, sets, reps, weight, weightUnit.
Rules:
- If any field is missing/unknown, set it to null. If weight is present but unit is missing, set weightUnit to null (the caller may default it to "lb").
- Normalize obvious movement names (e.g., "bench" -> "bench press"; "ohp" -> "overhead press").
- No commentary. Return ONLY the JSON object.
`;

// JSON Schema for strict structured outputs - aligned with NewExercise type
const ExerciseSchema = {
  name: "Exercise",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      exerciseName: { type: ["string", "null"] },
      sets: { type: ["integer", "null"], minimum: 1 },
      reps: { type: ["integer", "null"], minimum: 1 },
      weight: { type: ["number", "null"], minimum: 0 },
      // allow null; we'll default to "lb" downstream if it's missing and weight exists
      weightUnit: { type: ["string", "null"], enum: ["lb", "kg", null] }
    },
    required: ["exerciseName", "sets", "reps", "weight", "weightUnit"]
  },
  strict: true
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    console.log("📨 User message:", message);

    const response = await aiClient.chat.completions.create({
      model: "gpt-4o-mini", // or your preferred OpenAI model
      response_format: { type: "json_schema", json_schema: ExerciseSchema },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: message }
      ],
      temperature: 0.1
    });

    const raw = response.choices[0]?.message?.content || "{}";
    // console.log("📩 AI raw output_text:", raw);

    // Guaranteed to match schema; still wrap in try/catch for safety
    const parsed = JSON.parse(raw) as NewExercise;

    if (parsed.weight != null && parsed.weightUnit == null) {
      parsed.weightUnit = "lb";
    }

    console.log("📩 AI parsed output:", parsed);

    return NextResponse.json({
      success: true,
      data: parsed
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process message" },
      { status: 500 }
    );
  }
}
