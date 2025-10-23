import { Textarea } from "@/components/ui/textarea";
import { currentUser } from "@clerk/nextjs/server";
import { Dumbbell, TrendingUp, Calendar, Award } from "lucide-react";
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
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Total Workouts
                </p>
                <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">
                  0
                </p>
              </div>
              <Dumbbell className="h-10 w-10 text-[#6c47ff]" />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Current Streak
                </p>
                <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">
                  0 days
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  This Week
                </p>
                <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">
                  0
                </p>
              </div>
              <Calendar className="h-10 w-10 text-blue-500" />
            </div>
          </div>
        </div>


        <Textarea className="w-full mt-4" placeholder="Enter you workout here..." />

        <div className="mt-8 rounded-lg bg-white p-8 shadow-sm dark:bg-zinc-800">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            Recent Workouts
          </h2>
          <div className="flex flex-col items-center justify-center py-12">
            <Dumbbell className="mb-4 h-16 w-16 text-zinc-300 dark:text-zinc-600" />
            <p className="text-zinc-600 dark:text-zinc-400">
              No workouts yet. Start your fitness journey today!
            </p>
          </div>
        </div>

        
      </div>
    </div>
  );
}

