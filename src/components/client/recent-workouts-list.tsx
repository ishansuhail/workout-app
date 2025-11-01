"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Item, ItemActions, ItemTitle, ItemContent, ItemDescription } from "../ui/item";
import { Loader2 } from "lucide-react";
import type { Workout, Exercise } from "@/db/schema";

type WorkoutWithExercises = Workout & {
  exercises: Exercise[];
};

interface RecentWorkoutsListProps {
  initialWorkouts: WorkoutWithExercises[];
  userId: string;
  hasMore: boolean;
  initialLimit: number;
}

export function RecentWorkoutsList({ 
  initialWorkouts, 
  userId, 
  hasMore: initialHasMore,
  initialLimit 
}: RecentWorkoutsListProps) {
  const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>(initialWorkouts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [offset, setOffset] = useState(initialLimit);

  const loadMore = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/workouts?userId=${userId}&offset=${offset}&limit=10`);
      const data = await response.json();
      
      if (data.success && data.workouts) {
        setWorkouts(prev => [...prev, ...data.workouts]);
        setOffset(prev => prev + 10);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Failed to load more workouts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {workouts.map((workout) => (
        <div key={workout.id} className="mt-4">
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>{workout.title}</ItemTitle>
              <ItemDescription>{new Date(workout.date).toLocaleDateString()}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Link href={`/workouts/${workout.id}`}>
                <Button variant="outline" size="sm">
                  Open
                </Button>
              </Link>
            </ItemActions>
          </Item>
        </div>
      ))}
      
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <Button 
            variant="outline" 
            onClick={loadMore} 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

