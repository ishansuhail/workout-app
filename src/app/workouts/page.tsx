import { currentUser } from "@clerk/nextjs/server";
import { Dumbbell, Plus } from "lucide-react";
import Link from "next/link";

export default async function WorkoutsPage() {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              My Workouts
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Track and manage your workout sessions
            </p>
          </div>
          <button className="flex h-12 items-center gap-2 rounded-full bg-[#6c47ff] px-6 text-white transition-all hover:bg-[#5536cc] hover:shadow-lg">
            <Plus className="h-5 w-5" />
            New Workout
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Empty state */}
          <div className="col-span-full rounded-lg bg-white p-12 text-center shadow-sm dark:bg-zinc-800">
            <Dumbbell className="mx-auto mb-4 h-16 w-16 text-zinc-300 dark:text-zinc-600" />
            <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
              No workouts yet
            </h3>
            <p className="mb-6 text-zinc-600 dark:text-zinc-400">
              Start tracking your first workout session
            </p>
            <button className="flex h-12 items-center gap-2 rounded-full bg-[#6c47ff] px-6 text-white transition-all hover:bg-[#5536cc] hover:shadow-lg mx-auto">
              <Plus className="h-5 w-5" />
              Create Workout
            </button>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href="/dashboard"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

