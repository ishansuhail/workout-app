import { eq, desc, and, gte } from "drizzle-orm";
import { db } from "./index";
import { users, workouts, exercises } from "./schema";
import type { NewWorkout, NewUser, NewExercise } from "./schema";

// User queries
export async function getUserByClerkId(clerkUserId: string) {
  return db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });
}

export async function createUser(data: NewUser) {
  return db.insert(users).values(data).returning();
}

// Workout queries
export async function getWorkoutsByUserId(userId: string, limit?: number) {
  return db.query.workouts.findMany({
    where: eq(workouts.userId, userId),
    orderBy: [desc(workouts.date)],
    limit: limit,
    with: {
      exercises: true,
    },
  });
}

export async function getWorkoutById(id: string) {
  return db.query.workouts.findFirst({
    where: eq(workouts.id, id),
    with: {
      exercises: true,
    },
  });
}

export async function createWorkout(data: NewWorkout) {
  return db.insert(workouts).values(data).returning();
}

// Get or create workout - returns existing workout if it exists, creates new one if not
export async function getOrCreateWorkout(data: NewWorkout) {
  // First, try to get the workout by ID
  const existing = await getWorkoutById(data.id!);
  
  if (existing) {
    // Update the updatedAt timestamp
    return db
      .update(workouts)
      .set({ updatedAt: new Date() })
      .where(eq(workouts.id, data.id!))
      .returning();
  }
  
  // If it doesn't exist, create it
  return db.insert(workouts).values(data).returning();
}

export async function updateWorkout(id: string, data: Partial<NewWorkout>) {
  return db.update(workouts).set(data).where(eq(workouts.id, id)).returning();
}

export async function deleteWorkout(id: string) {
  return db.delete(workouts).where(eq(workouts.id, id)).returning();
}

// Get workouts by date range
export async function getWorkoutsByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  return db.query.workouts.findMany({
    where: and(eq(workouts.userId, userId), gte(workouts.date, startDate)),
    orderBy: [desc(workouts.date)],
    with: {
      exercises: true,
    },
  });
}

// Exercise queries
export async function getExercisesByWorkoutId(workoutId: string) {
  return db.query.exercises.findMany({
    where: eq(exercises.workoutId, workoutId),
  });
}

export async function createExercise(data: NewExercise) {
  return db.insert(exercises).values(data).returning();
}

export async function updateExercise(id: string, data: Partial<NewExercise>) {
  return db.update(exercises).set(data).where(eq(exercises.id, id)).returning();
}

export async function deleteExercise(id: string) {
  return db.delete(exercises).where(eq(exercises.id, id)).returning();
}

// Get all exercises for a user (across all workouts)
export async function getAllExercisesByUserId(userId: string) {
  const userWorkouts = await db.query.workouts.findMany({
    where: eq(workouts.userId, userId),
    with: {
      exercises: true,
    },
  });

  return userWorkouts.flatMap((workout) => workout.exercises);
}

// Stats queries
export async function getWorkoutStats(userId: string) {
  const allWorkouts = await db.query.workouts.findMany({
    where: eq(workouts.userId, userId),
    with: {
      exercises: true,
    },
  });

  const now = new Date();
  const startOfWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay()
  );

  const thisWeekWorkouts = allWorkouts.filter(
    (w) => new Date(w.date) >= startOfWeek
  );

  const allExercises = allWorkouts.flatMap((w) => w.exercises);

  return {
    totalWorkouts: allWorkouts.length,
    thisWeek: thisWeekWorkouts.length,
    totalExercises: allExercises.length,
    totalCaloriesBurned: allExercises.reduce(
      (sum, e) => sum + (e.caloriesBurned || 0),
      0
    ),
  };
}

// Calculate current workout streak (consecutive days with workouts)
export async function getWorkoutStreak(userId: string) {
  const allWorkouts = await getWorkoutsByUserId(userId);
  
  if (allWorkouts.length === 0) {
    return 0;
  }

  // Get unique workout dates (normalize to start of day)
  const workoutDates = allWorkouts
    .map(w => {
      const date = new Date(w.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
    .sort((a, b) => b - a); // Sort descending (most recent first)

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayTime = yesterday.getTime();

  // Check if the most recent workout was today or yesterday
  const mostRecentWorkout = workoutDates[0];
  if (mostRecentWorkout !== todayTime && mostRecentWorkout !== yesterdayTime) {
    // Streak is broken (no workout today or yesterday)
    return 0;
  }

  // Count consecutive days
  let streak = 0;
  let currentDate = new Date(mostRecentWorkout);
  
  for (const workoutTime of workoutDates) {
    const expectedTime = currentDate.getTime();
    
    if (workoutTime === expectedTime) {
      streak++;
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // Gap found, streak ends
      break;
    }
  }

  return streak;
}

// Get unique exercise names for a user
export async function getUniqueExercises(userId: string) {
  const allExercises = await getAllExercisesByUserId(userId);
  const uniqueExercises = [...new Set(allExercises.map((e) => e.exerciseName))];
  return uniqueExercises;
}

// Get exercise history (all instances of a specific exercise)
export async function getExerciseHistory(userId: string, exerciseName: string) {
  const userWorkouts = await db.query.workouts.findMany({
    where: eq(workouts.userId, userId),
    orderBy: [desc(workouts.date)],
    with: {
      exercises: true,
    },
  });

  const exerciseHistory = userWorkouts
    .flatMap((workout) =>
      workout.exercises
        .filter((ex) => ex.exerciseName === exerciseName)
        .map((ex) => ({
          ...ex,
          workoutDate: workout.date,
        }))
    );

  return exerciseHistory;
}

