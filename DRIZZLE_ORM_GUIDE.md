# Drizzle ORM Setup Guide

## 📋 Environment Variables

Add this to your `.env.local` file:

```env
# Supabase Database URL (PostgreSQL)
# Format: postgres://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
DATABASE_URL=your_postgres_connection_string

# OR if you want connection pooling (recommended for serverless):
# DATABASE_URL=your_postgres_pooling_connection_string
```

### Getting your DATABASE_URL from Supabase:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Database**
4. Find **Connection String** → **URI** (or **Connection Pooling** for production)
5. Copy and replace `[YOUR-PASSWORD]` with your actual password

---

## 🏗️ Project Structure

```
src/
├── db/
│   ├── schema.ts         # Database schema definitions
│   ├── index.ts          # Drizzle instance
│   └── queries.ts        # Reusable queries
drizzle.config.ts         # Drizzle configuration
drizzle/                  # Generated migrations
```

---

## 🚀 Quick Start

### 1. Push Schema to Database

```bash
npm run db:push
```

This will create all tables in your Supabase database based on `schema.ts`.

### 2. Open Drizzle Studio (Database GUI)

```bash
npm run db:studio
```

Opens a visual interface at `https://local.drizzle.studio` to view and edit your data.

---

## 📝 Usage Examples

### Server Component Example

```tsx
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export default async function WorkoutsPage() {
  const user = await currentUser();

  // Type-safe query with autocompletion!
  const userWorkouts = await db.query.workouts.findMany({
    where: eq(workouts.userId, user!.id),
    with: {
      exercises: true, // Include related exercises
    },
  });

  return (
    <div>
      {userWorkouts.map((workout) => (
        <div key={workout.id}>
          <h2>{workout.name}</h2>
          <p>{workout.description}</p>
          {workout.exercises.map((exercise) => (
            <div key={exercise.id}>{exercise.name}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Using Helper Queries

```tsx
import { getWorkoutsByUserId, createWorkout } from "@/db/queries";
import { currentUser } from "@clerk/nextjs/server";

export default async function WorkoutsPage() {
  const user = await currentUser();
  const workouts = await getWorkoutsByUserId(user!.id);

  return <div>{/* ... */}</div>;
}
```

### Server Action Example

```tsx
"use server";

import { db } from "@/db";
import { workouts } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function createWorkoutAction(formData: FormData) {
  const user = await currentUser();

  const result = await db
    .insert(workouts)
    .values({
      userId: user!.id,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      duration: parseInt(formData.get("duration") as string),
    })
    .returning();

  return { success: true, data: result };
}
```

### API Route Example

```tsx
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const allWorkouts = await db.select().from(workouts);
  return NextResponse.json(allWorkouts);
}

export async function POST(request: Request) {
  const body = await request.json();

  const newWorkout = await db.insert(workouts).values(body).returning();

  return NextResponse.json(newWorkout);
}
```

---

## 🔥 Common Queries

### Select All

```tsx
const allWorkouts = await db.select().from(workouts);
```

### Select with Conditions

```tsx
import { eq, and, or, gt, lt } from "drizzle-orm";

// Single condition
const myWorkouts = await db
  .select()
  .from(workouts)
  .where(eq(workouts.userId, userId));

// Multiple conditions (AND)
const recentWorkouts = await db
  .select()
  .from(workouts)
  .where(and(eq(workouts.userId, userId), gt(workouts.date, lastWeek)));
```

### Insert

```tsx
const result = await db
  .insert(workouts)
  .values({
    userId: "123",
    name: "Morning Run",
    duration: 30,
  })
  .returning();
```

### Update

```tsx
const updated = await db
  .update(workouts)
  .set({ name: "Evening Run" })
  .where(eq(workouts.id, workoutId))
  .returning();
```

### Delete

```tsx
await db.delete(workouts).where(eq(workouts.id, workoutId));
```

### Relations (Joins)

```tsx
// Automatic join using relations defined in schema
const workoutsWithExercises = await db.query.workouts.findMany({
  with: {
    exercises: true,
    user: true,
  },
});

// Manual join
import { exercises } from "@/db/schema";

const result = await db
  .select()
  .from(workouts)
  .leftJoin(exercises, eq(workouts.id, exercises.workoutId));
```

---

## 🎯 Drizzle Query API (Preferred)

Drizzle provides a nicer query API with better TypeScript support:

```tsx
import { db } from "@/db";
import { eq, desc } from "drizzle-orm";

// Find one
const workout = await db.query.workouts.findFirst({
  where: eq(workouts.id, id),
  with: {
    exercises: true,
  },
});

// Find many
const allWorkouts = await db.query.workouts.findMany({
  where: eq(workouts.userId, userId),
  orderBy: [desc(workouts.date)],
  limit: 10,
  offset: 0,
});
```

---

## 📊 TypeScript Types

Drizzle automatically generates types:

```tsx
import type { Workout, NewWorkout } from "@/db/schema";

// For SELECT (includes all fields with defaults)
const workout: Workout = {
  id: "uuid",
  userId: "uuid",
  name: "Morning Run",
  description: null,
  duration: 30,
  caloriesBurned: 300,
  date: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

// For INSERT (only required fields)
const newWorkout: NewWorkout = {
  userId: "uuid",
  name: "Morning Run",
  duration: 30,
};
```

---

## 🔧 Database Commands

```bash
# Push schema changes to database (dev)
npm run db:push

# Generate migrations (production)
npm run db:generate
npm run db:migrate

# Open Drizzle Studio
npm run db:studio
```

---

## 🆚 Drizzle vs Supabase Client

### Drizzle (Recommended)

✅ Type-safe with autocompletion  
✅ Better TypeScript inference  
✅ Compile-time type checking  
✅ Works with any PostgreSQL database  
✅ Lighter weight  
✅ SQL-like syntax (familiar)

```tsx
// Type-safe, autocomplete works!
const workouts = await db.query.workouts.findMany({
  where: eq(workouts.userId, userId),
});
```

### Supabase Client

✅ Real-time subscriptions  
✅ Built-in auth helpers  
✅ Row Level Security (RLS) integration  
✅ Storage and edge functions

```tsx
// Less type-safe, relies on string keys
const { data } = await supabase
  .from("workouts")
  .select("*")
  .eq("user_id", userId);
```

---

## 🎯 Best Practice

**Use Drizzle for most database operations, keep Supabase client for:**

- Real-time subscriptions
- Auth operations
- Storage (file uploads)
- If you need RLS

You can use both in the same project!

---

## 🔐 Integration with Clerk

Create a user in your database when they sign up with Clerk:

```tsx
// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { createUser } from "@/db/queries";

export async function POST(req: Request) {
  const payload = await req.json();
  const evt = payload.type;

  if (evt === "user.created") {
    await createUser({
      clerkUserId: payload.data.id,
      email: payload.data.email_addresses[0].email_address,
      firstName: payload.data.first_name,
      lastName: payload.data.last_name,
    });
  }

  return new Response("", { status: 200 });
}
```

---

## 📚 Learn More

- [Drizzle Documentation](https://orm.drizzle.team/)
- [Drizzle with Supabase](https://orm.drizzle.team/docs/get-started-postgresql#supabase)
- [SQL Operators](https://orm.drizzle.team/docs/operators)

