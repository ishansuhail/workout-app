import { NextResponse } from "next/server";
import { aiClient } from "@/lib/llm";
import { NewExercise, NewWorkout, Workout } from "@/db/schema";
import { getWorkoutId } from "@/lib/getWorkoutid";
import { createExercise, getOrCreateWorkout, getUserByClerkId } from "@/db/queries";

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

type Message = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const body = await request.json();
    const { message, history = [] } = body as { message: string; history?: Message[] };

    console.log("📨 User ID:", userId);
    console.log("📨 User message:", message);
    console.log("📨 History length:", history.length);

    // Build messages array with history
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: SYSTEM },
      ...history, // Include conversation history
      { role: "user", content: message }
    ];

    const response = await aiClient.chat.completions.create({
      model: "gpt-4o-mini", // or your preferred OpenAI model
      response_format: { type: "json_schema", json_schema: ExerciseSchema },
      messages,
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

    // Check for null fields and return them in the error
    const nullFields: string[] = [];
    if (parsed.exerciseName == null) nullFields.push("exerciseName");
    if (parsed.sets == null) nullFields.push("sets");
    if (parsed.reps == null) nullFields.push("reps");
    if (parsed.weight == null) nullFields.push("weight");
    
    if (nullFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: "Invalid exercise data",
        missingFields: nullFields,
        data: parsed
      }, { status: 400 });
    }
    else {
      try { 
        // Get the user's internal database UUID from their Clerk ID
        const user = await getUserByClerkId(userId);
        
        if (!user) {
          return NextResponse.json({
            success: false,
            error: "User not found"
          }, { status: 404 });
        }
        
        const workoutId = getWorkoutId(userId, new Date());

        // Get or create today's workout (won't error if it already exists)
        await getOrCreateWorkout({
          id: workoutId,
          userId: user.id, // Use the internal UUID, not the Clerk ID
          date: new Date(),
          title: new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
          notes: null
        });

        // Add the exercise to the workout
        await createExercise({
          workoutId: workoutId,
          exerciseName: parsed.exerciseName,
          sets: parsed.sets,
          reps: parsed.reps,
          weight: parsed.weight,
          weightUnit: parsed.weightUnit
        });

        
        return NextResponse.json({
          success: true,
          data: parsed,
          aiResponse: raw // Include the AI response for conversation history
        }, { status: 200 });
      } catch (error) {
        console.error("Error in getting workout ID:", error);
        return NextResponse.json({
          success: false,
          error: "Failed to log exercise. Please try again."
        }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process message" },
      { status: 500 }
    );
  }
}
