import { getWorkoutsByUserId, getUserByClerkId } from "@/db/queries";
import { currentUser } from "@clerk/nextjs/server";
import { Dumbbell } from "lucide-react";
import { redirect } from "next/navigation";
import { RecentWorkoutsList } from "./client/recent-workouts-list";

export async function RecentWorkouts({ numberOfWorkouts = 10 }: { numberOfWorkouts?: number } = {}) {
    const clerkUser = await currentUser();

    if (!clerkUser) {
        redirect("/auth/sign-in");
    }

    
    const dbUser = await getUserByClerkId(clerkUser.id);
    
    if (!dbUser) {
        
        redirect("/auth/sign-in");
    }

    // Fetch one extra to check if there are more
    const workouts = await getWorkoutsByUserId(dbUser.id, numberOfWorkouts + 1);
    const hasMore = workouts.length > numberOfWorkouts;
    const displayWorkouts = hasMore ? workouts.slice(0, numberOfWorkouts) : workouts;
    if (workouts.length === 0) {
        return (
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
        );
    }
  return (
    <div className="mt-8 rounded-lg bg-white p-8 shadow-sm dark:bg-zinc-800">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
        Recent Workouts
      </h2>
      <RecentWorkoutsList 
        initialWorkouts={displayWorkouts}
        userId={dbUser.id}
        hasMore={hasMore}
        initialLimit={numberOfWorkouts}
      />
    </div>
  );
}

