import { getExerciseHistory, getUserByClerkId } from "@/db/queries";
import { currentUser } from "@clerk/nextjs/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, TrendingUp, Award, Calendar, Dumbbell } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ExerciseStatsPage({ 
  params 
}: { 
  params: Promise<{ exerciseName: string }> 
}) {
  const { exerciseName: rawExerciseName } = await params;
  
  const exerciseName = decodeURIComponent(rawExerciseName);
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/auth/sign-in");
  }

  const dbUser = await getUserByClerkId(clerkUser.id);
  
  if (!dbUser) {
    redirect("/auth/sign-in");
  }

  const history = await getExerciseHistory(dbUser.id, exerciseName);

  // Calculate statistics
  const totalSessions = history.length;
  const maxWeight = history.reduce((max, ex) => Math.max(max, ex.weight || 0), 0);
  const maxReps = history.reduce((max, ex) => Math.max(max, ex.reps || 0), 0);
  const totalVolume = history.reduce((sum, ex) => {
    const sets = ex.sets || 0;
    const reps = ex.reps || 0;
    const weight = ex.weight || 0;
    return sum + (sets * reps * weight);
  }, 0);

  // Get most recent session
  const mostRecent = history[0];

  // Get personal records
  const prWeight = history.find(ex => ex.weight === maxWeight);
  const prReps = history.find(ex => ex.reps === maxReps);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold capitalize text-zinc-900 dark:text-white">
              {exerciseName}
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Complete exercise history and statistics
            </p>
          </div>
        </div>

        {history.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Dumbbell className="mb-4 h-16 w-16 text-zinc-300 dark:text-zinc-600" />
              <p className="text-lg font-medium text-zinc-900 dark:text-white">
                No history yet
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Start logging this exercise to see your stats!
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Total Sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                    {totalSessions}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Max Weight
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                    {maxWeight}
                    <span className="ml-1 text-base font-normal text-zinc-500 dark:text-zinc-400">
                      {prWeight?.weightUnit || "lb"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Max Reps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                    {maxReps}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4" />
                    Total Volume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                    {totalVolume.toLocaleString()}
                    <span className="ml-1 text-base font-normal text-zinc-500 dark:text-zinc-400">
                      {mostRecent?.weightUnit || "lb"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Personal Records */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Personal Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prWeight && (
                    <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">
                          Heaviest Weight
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {new Date(prWeight.workoutDate).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                          {prWeight.weight} {prWeight.weightUnit}
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {prWeight.sets}x{prWeight.reps}
                        </p>
                      </div>
                    </div>
                  )}

                  {prReps && (
                    <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">
                          Most Reps
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {new Date(prReps.workoutDate).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                          {prReps.reps}
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          @ {prReps.weight} {prReps.weightUnit}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Exercise History */}
            <Card>
              <CardHeader>
                <CardTitle>Exercise History</CardTitle>
                <CardDescription>
                  All {totalSessions} recorded sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {history.map((exercise, index) => (
                    <div key={exercise.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-medium text-zinc-900 dark:text-white">
                            {new Date(exercise.workoutDate).toLocaleDateString(undefined, {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                            {exercise.sets && (
                              <span>Sets: <span className="font-semibold">{exercise.sets}</span></span>
                            )}
                            {exercise.reps && (
                              <span>Reps: <span className="font-semibold">{exercise.reps}</span></span>
                            )}
                            {exercise.weight && (
                              <span>Weight: <span className="font-semibold">{exercise.weight} {exercise.weightUnit}</span></span>
                            )}
                          </div>
                          {exercise.notes && (
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              {exercise.notes}
                            </p>
                          )}
                        </div>
                        <div className="rounded-lg bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {exercise.sets && exercise.reps && exercise.weight
                            ? `${exercise.sets * exercise.reps * exercise.weight} ${exercise.weightUnit}`
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
