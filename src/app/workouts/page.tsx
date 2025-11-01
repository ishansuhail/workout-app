import { RecentWorkouts } from "@/components/recent-workouts";
import { getUserByClerkId, getWorkoutsByUserId } from "@/db/queries";
import { currentUser } from "@clerk/nextjs/server";
import { Dumbbell, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function WorkoutsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }
  const dbUser = await getUserByClerkId(user.id);
  if (!dbUser) {
    redirect("/auth/sign-in");
  }

  const workouts = await getWorkoutsByUserId(dbUser.id);

  if (workouts.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                My Workouts

                No workouts yet. Start your fitness journey today!
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <RecentWorkouts />
    </div>
  );
}

