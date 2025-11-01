import { getUserByClerkId, getWorkoutStats } from "@/db/queries";
import { currentUser } from "@clerk/nextjs/server";
import { Calendar } from "lucide-react";
import { redirect } from "next/navigation";



export async function WorkoutsThisWeek() {

    const clerkUser = await currentUser();
    if (!clerkUser) {
        redirect("/auth/sign-in");
    }

    const dbUser = await getUserByClerkId(clerkUser.id);
    if (!dbUser) {
        redirect("/auth/sign-in");
    }


    const stats = await getWorkoutStats(dbUser.id);
  
    return (
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  This Week
                </p>
                <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">
                  {stats.thisWeek}
                </p>
              </div>
              <Calendar className="h-10 w-10 text-blue-500" />
            </div>
          </div>
    );
}