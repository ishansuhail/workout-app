import { getWorkoutsByUserId, getUserByClerkId } from "@/db/queries";
import { currentUser } from "@clerk/nextjs/server";
import { Dumbbell } from "lucide-react";
import { redirect } from "next/navigation";
import { Item, ItemActions, ItemTitle, ItemContent, ItemDescription } from "./ui/item";
import { Button } from "./ui/button";

export async function RecentWorkouts({ numberOfWorkouts }: {numberOfWorkouts: number}) {
    const clerkUser = await currentUser();

    if (!clerkUser) {
        redirect("/auth/sign-in");
    }

    
    const dbUser = await getUserByClerkId(clerkUser.id);
    
    if (!dbUser) {
        
        redirect("/auth/sign-in");
    }

    const workouts = await getWorkoutsByUserId(dbUser.id, numberOfWorkouts);
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
      {workouts.map((workout) => (
        <div key={workout.id} className="mt-4">
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>{workout.title}</ItemTitle>
              <ItemDescription>{workout.date.toLocaleDateString()}</ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button variant="outline" size="sm">
                    Open
                </Button>
            </ItemActions>
          </Item>
        </div>
      ))}
    </div>
  );
}

