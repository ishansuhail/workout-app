import { NextResponse } from "next/server";
import { getWorkoutsByUserId } from "@/db/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const offset = parseInt(searchParams.get("offset") || "0");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch one extra to check if there are more
    const allWorkouts = await getWorkoutsByUserId(userId);
    const workouts = allWorkouts.slice(offset, offset + limit);
    const hasMore = allWorkouts.length > offset + limit;

    return NextResponse.json({
      success: true,
      workouts,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch workouts" },
      { status: 500 }
    );
  }
}

