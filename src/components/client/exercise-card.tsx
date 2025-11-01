"use client";

import { Separator } from "@/components/ui/separator";
import type { Exercise } from "@/db/schema";
import Link from "next/link";

interface ExerciseCardProps {
  exercise: Exercise;
  showSeparator?: boolean;
}

export function ExerciseCard({ exercise, showSeparator = false }: ExerciseCardProps) {
  return (
    <div>
      {showSeparator && <Separator className="my-4" />}
      <Link href={`/exercise-stats/${exercise.exerciseName}`} className="block">
        <div className="space-y-3 cursor-pointer hover:opacity-80 transition-opacity">
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
      </Link>
    </div>
  );
}

