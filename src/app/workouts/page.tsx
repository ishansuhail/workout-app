import { RecentWorkouts } from "@/components/recent-workouts";
import { getUserByClerkId, getWorkoutsByUserId } from "@/db/queries";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, ArrowLeft } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              My Workouts
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              View and manage all your workout sessions
            </p>
          </div>
        </div>

        {workouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Dumbbell className="mb-4 h-16 w-16 text-zinc-300 dark:text-zinc-600" />
              <p className="text-lg font-medium text-zinc-900 dark:text-white">
                No workouts yet
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Start your fitness journey today!
              </p>
              <Link href="/dashboard">
                <Button className="mt-6">
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <RecentWorkouts />
        )}
      </div>
    </div>
  );
}

