import { getWorkoutById } from "@/db/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Dumbbell } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function WorkoutDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  // Fetch workout details
  const workout = await getWorkoutById(id);

  if (!workout) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="mb-6 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              {workout.title}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(workout.date).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Workout Notes */}
        {workout.notes && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-700 dark:text-zinc-300">{workout.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Exercises Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Exercises
            </CardTitle>
            <CardDescription>
              {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""} completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {workout.exercises.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Dumbbell className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                <p className="text-zinc-600 dark:text-zinc-400">
                  No exercises recorded for this workout.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {workout.exercises.map((exercise, index) => (
                  <div key={exercise.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                          {exercise.exerciseName}
                        </h3>
                        <div className="text-right text-sm text-zinc-500 dark:text-zinc-400">
                          {new Date(exercise.createdAt).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>

                      {/* Exercise Details Grid */}
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {exercise.sets !== null && (
                          <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              Sets
                            </p>
                            <p className="mt-1 text-xl font-semibold text-zinc-900 dark:text-white">
                              {exercise.sets}
                            </p>
                          </div>
                        )}

                        {exercise.reps !== null && (
                          <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              Reps
                            </p>
                            <p className="mt-1 text-xl font-semibold text-zinc-900 dark:text-white">
                              {exercise.reps}
                            </p>
                          </div>
                        )}

                        {exercise.weight !== null && (
                          <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              Weight
                            </p>
                            <p className="mt-1 flex items-baseline gap-1 text-xl font-semibold text-zinc-900 dark:text-white">
                              {exercise.weight}
                              <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                                {exercise.weightUnit}
                              </span>
                            </p>
                          </div>
                        )}

                        {exercise.duration !== null && (
                          <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              Duration
                            </p>
                            <p className="mt-1 flex items-baseline gap-1 text-xl font-semibold text-zinc-900 dark:text-white">
                              {exercise.duration}
                              <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                                min
                              </span>
                            </p>
                          </div>
                        )}

                        {exercise.distance !== null && (
                          <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              Distance
                            </p>
                            <p className="mt-1 flex items-baseline gap-1 text-xl font-semibold text-zinc-900 dark:text-white">
                              {exercise.distance}
                              <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                                mi
                              </span>
                            </p>
                          </div>
                        )}

                        {exercise.caloriesBurned !== null && (
                          <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              Calories
                            </p>
                            <p className="mt-1 text-xl font-semibold text-zinc-900 dark:text-white">
                              {exercise.caloriesBurned}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Exercise Notes */}
                      {exercise.notes && (
                        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {exercise.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

