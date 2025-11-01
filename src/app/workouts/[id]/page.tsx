import { getWorkoutById } from "@/db/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExerciseCard } from "@/components/client/exercise-card";
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
                  <ExerciseCard 
                    key={exercise.id}
                    exercise={exercise}
                    showSeparator={index > 0}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

