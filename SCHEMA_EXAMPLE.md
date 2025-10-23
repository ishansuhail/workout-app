# Workout Schema

## 📊 Database Structure

### Workouts Table (Workout Sessions)

Each row represents a workout session.

```
workouts
├── id (uuid)
├── userId (uuid) → references users
├── date (timestamp)
├── title (text) - optional: e.g., "Morning Workout", "Leg Day"
├── notes (text) - optional: overall workout notes
├── createdAt (timestamp)
└── updatedAt (timestamp)
```

### Exercises Table (Individual Exercises)

Each row represents an individual exercise within a workout session.

```
exercises
├── id (uuid)
├── workoutId (uuid) → references workouts
├── exerciseName (text) - e.g., "Bench Press", "Squats", "Running"
├── sets (integer) - optional
├── reps (integer) - optional
├── weight (integer) - optional (in lbs/kg)
├── duration (integer) - optional (in minutes, for cardio)
├── distance (integer) - optional (in miles/km)
├── caloriesBurned (integer) - optional
├── notes (text) - optional
└── createdAt (timestamp)
```

## 💡 Example Data

```typescript
// Create a workout session
const workout = {
  userId: "user-123",
  date: "2025-10-23",
  title: "Upper Body Day",
  notes: "Feeling strong today!",
};

// Add multiple exercises to that workout
const exercises = [
  {
    workoutId: workout.id,
    exerciseName: "Bench Press",
    sets: 3,
    reps: 10,
    weight: 185,
  },
  {
    workoutId: workout.id,
    exerciseName: "Overhead Press",
    sets: 3,
    reps: 8,
    weight: 95,
  },
  {
    workoutId: workout.id,
    exerciseName: "Pull-ups",
    sets: 3,
    reps: 12,
  },
];
```

## 🚀 Usage Examples

### Creating a Complete Workout

```tsx
import { createWorkout, createExercise } from "@/db/queries";

// Step 1: Create the workout session
const [workout] = await createWorkout({
  userId: "user-id-here",
  date: new Date(),
  title: "Upper Body Day",
});

// Step 2: Add exercises to the workout
await createExercise({
  workoutId: workout.id,
  exerciseName: "Bench Press",
  sets: 3,
  reps: 10,
  weight: 185,
});

await createExercise({
  workoutId: workout.id,
  exerciseName: "Pull-ups",
  sets: 3,
  reps: 12,
});
```

### Get All User Workouts (with exercises)

```tsx
import { getWorkoutsByUserId } from "@/db/queries";

const workouts = await getWorkoutsByUserId("user-id-here");
// Returns workouts with nested exercises
// [
//   {
//     id: "workout-1",
//     date: "2025-10-23",
//     title: "Upper Body Day",
//     exercises: [
//       { exerciseName: "Bench Press", sets: 3, reps: 10, ... },
//       { exerciseName: "Pull-ups", sets: 3, reps: 12, ... }
//     ]
//   }
// ]
```

### Get Exercise History (track progress)

```tsx
import { getExerciseHistory } from "@/db/queries";

const benchPressHistory = await getExerciseHistory(
  "user-id-here",
  "Bench Press"
);
// Returns all "Bench Press" exercises with workout dates
// Useful for tracking weight/rep progress over time
```

### Get Workout Stats

```tsx
import { getWorkoutStats } from "@/db/queries";

const stats = await getWorkoutStats("user-id-here");
// Returns:
// {
//   totalWorkouts: 45,
//   thisWeek: 3,
//   totalExercises: 200,
//   totalCaloriesBurned: 15000
// }
```

### Get Unique Exercises

```tsx
import { getUniqueExercises } from "@/db/queries";

const exercises = await getUniqueExercises("user-id-here");
// Returns: ["Bench Press", "Squats", "Deadlift", "Running", ...]
```

## 📅 Working with Workouts

Workouts are already grouped by session. Each workout can contain multiple exercises:

```tsx
import { getWorkoutsByUserId } from "@/db/queries";

const workouts = await getWorkoutsByUserId(userId);

// Already structured as:
// [
//   {
//     id: "workout-1",
//     date: "2025-10-23",
//     title: "Upper Body",
//     exercises: [
//       { exerciseName: "Bench Press", sets: 3, ... },
//       { exerciseName: "Pull-ups", sets: 3, ... }
//     ]
//   },
//   {
//     id: "workout-2",
//     date: "2025-10-22",
//     title: "Cardio",
//     exercises: [
//       { exerciseName: "Running", duration: 30, ... }
//     ]
//   }
// ]
```

## 🎯 Benefits of This Structure

✅ **Organized** - Workouts group exercises into sessions  
✅ **Flexible** - Works for strength training AND cardio  
✅ **Efficient** - Easy queries with Drizzle relations  
✅ **Scalable** - Can track workout-level and exercise-level data  
✅ **Historical** - Track progress on specific exercises over time

## 🔄 Next Steps

1. Add your DATABASE_URL to `.env.local`
2. Run `npm run db:push` to create the tables
3. Start logging workouts!

```bash
npm run db:push
npm run db:studio  # Visual database editor
```
