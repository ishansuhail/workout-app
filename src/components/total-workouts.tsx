import { getUserByClerkId, getWorkoutsByUserId } from "@/db/queries";
import { currentUser } from "@clerk/nextjs/server";
import { Dumbbell } from "lucide-react";
import { redirect } from "next/navigation";


export async function TotalWorkouts() {
    const clerkUser = await currentUser();
    if (!clerkUser) {
        redirect("/auth/sign-in");
    }

    const dbUser = await getUserByClerkId(clerkUser.id);
    if (!dbUser) {
        redirect("/auth/sign-in");
    }

    const workouts = await getWorkoutsByUserId(dbUser.id);

    return (
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Total Workouts
                </p>
                <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">
                  {workouts.length}
                </p>
              </div>
              <Dumbbell className="h-10 w-10 text-[#6c47ff]" />
            </div>
        </div>
    );
}