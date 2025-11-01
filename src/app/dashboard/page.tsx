import { ChatInput } from "@/components/chat-input";
import { RecentWorkouts } from "@/components/recent-workouts";
import { TotalWorkouts } from "@/components/total-workouts";
import { WorkoutStreak } from "@/components/workout-streak";
import { WorkoutsThisWeek } from "@/components/workouts-this-week";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Welcome back, {user?.firstName || "User"}!
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Here's your workout overview
            </p>
          </div>
          <Link
            href="/workouts"
            className="flex h-12 items-center rounded-full bg-[#6c47ff] px-6 text-white transition-all hover:bg-[#5536cc] hover:shadow-lg"
          >
            View Workouts
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          <TotalWorkouts />

          <WorkoutStreak />

          <WorkoutsThisWeek />
          
        </div>

        <div className="mt-4">
            <ChatInput />
        </div>

        <RecentWorkouts numberOfWorkouts={3} />

      </div>
    </div>
  );
}

