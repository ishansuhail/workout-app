# Supabase Setup Guide

## 📋 Environment Variables

Make sure your `.env.local` file contains the following Supabase keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key (optional, for admin operations)
```

You can find these keys in your Supabase Dashboard:

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon/public key

## 🏗️ Project Structure

```
src/
├── lib/
│   └── supabase/
│       ├── client.ts         # Client-side Supabase client (use in 'use client' components)
│       ├── server.ts         # Server-side Supabase client (use in Server Components & API routes)
│       └── middleware.ts     # Supabase middleware utilities
├── components/
│   └── example-supabase-usage.tsx  # Example usage patterns
└── app/
    └── api/
        └── workouts/
            └── route.ts      # Example API route
```

## 🎯 Usage Examples

### 1. Client Component (Browser)

Use this in components with `'use client'` directive:

```tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function MyComponent() {
  const [data, setData] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("your_table").select("*");

      if (data) setData(data);
    }
    fetchData();
  }, []);

  return <div>{/* Your UI */}</div>;
}
```

### 2. Server Component

Use this in Server Components (default in Next.js 14+):

```tsx
import { createClient } from "@/lib/supabase/server";

export default async function MyPage() {
  const supabase = await createClient();

  const { data } = await supabase.from("your_table").select("*");

  return <div>{/* Your UI */}</div>;
}
```

### 3. API Routes

Use this in `/app/api/**/route.ts` files:

```tsx
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("your_table").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
```

### 4. Server Actions

Use this in Server Actions:

```tsx
"use server";

import { createClient } from "@/lib/supabase/server";

export async function createWorkout(formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("workouts").insert([
    {
      name: formData.get("name"),
      // ... other fields
    },
  ]);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
```

## 🔥 Common Operations

### Insert Data

```tsx
const { data, error } = await supabase
  .from("table_name")
  .insert([{ column: "value" }])
  .select();
```

### Read Data

```tsx
const { data, error } = await supabase
  .from("table_name")
  .select("*")
  .eq("id", userId);
```

### Update Data

```tsx
const { data, error } = await supabase
  .from("table_name")
  .update({ column: "new_value" })
  .eq("id", id);
```

### Delete Data

```tsx
const { error } = await supabase.from("table_name").delete().eq("id", id);
```

### Real-time Subscriptions

```tsx
const channel = supabase
  .channel("table_changes")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "table_name" },
    (payload) => console.log("Change:", payload)
  )
  .subscribe();

// Don't forget to unsubscribe
supabase.removeChannel(channel);
```

## 🔐 Row Level Security (RLS)

Make sure to enable RLS on your Supabase tables for security:

```sql
-- Enable RLS
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Example policy: Users can only see their own data
CREATE POLICY "Users can view their own data"
ON your_table
FOR SELECT
USING (auth.uid() = user_id);

-- Example policy: Users can insert their own data
CREATE POLICY "Users can insert their own data"
ON your_table
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

## 📚 Next Steps

1. Create your database tables in Supabase Dashboard
2. Set up RLS policies for security
3. Replace the example table names with your actual table names
4. Check out the examples in `src/components/example-supabase-usage.tsx`
5. Visit [Supabase Documentation](https://supabase.com/docs) for more advanced features

## ⚡ Integration with Clerk

Since you're using Clerk for authentication, you can sync Clerk user IDs with Supabase:

1. Use Clerk webhooks to create Supabase records when users sign up
2. Store Clerk's user ID in your Supabase tables
3. Use the Clerk user ID to filter data in Supabase queries

Example:

```tsx
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export default async function MyPage() {
  const user = await currentUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("workouts")
    .select("*")
    .eq("clerk_user_id", user?.id); // Filter by Clerk user ID

  return <div>{/* Your UI */}</div>;
}
```

