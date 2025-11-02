"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface ExerciseData {
  id: string;
  exerciseName: string;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  weightUnit: string | null;
  workoutDate: Date;
}

interface ExerciseProgressChartProps {
  history: ExerciseData[];
  exerciseName: string;
}

export function ExerciseProgressChart({ history, exerciseName }: ExerciseProgressChartProps) {
  // Prepare data for chart (reverse to show oldest to newest)
  const chartData = [...history]
    .reverse()
    .map((ex) => ({
      date: new Date(ex.workoutDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      weight: ex.weight || 0,
      volume: (ex.sets || 0) * (ex.reps || 0) * (ex.weight || 0),
      reps: ex.reps || 0,
    }));

  const weightUnit = history[0]?.weightUnit || "lb";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Over Time</CardTitle>
        <CardDescription>
          Track your strength gains for {exerciseName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Weight Progress */}
          <div>
            <h3 className="mb-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Weight Progress ({weightUnit})
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs text-zinc-600 dark:text-zinc-400"
                  tick={{ fill: "currentColor" }}
                />
                <YAxis 
                  className="text-xs text-zinc-600 dark:text-zinc-400"
                  tick={{ fill: "currentColor" }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#6c47ff" 
                  strokeWidth={2}
                  dot={{ fill: "#6c47ff", r: 4 }}
                  activeDot={{ r: 6 }}
                  name={`Weight (${weightUnit})`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Volume Progress */}
          <div>
            <h3 className="mb-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Total Volume ({weightUnit})
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs text-zinc-600 dark:text-zinc-400"
                  tick={{ fill: "currentColor" }}
                />
                <YAxis 
                  className="text-xs text-zinc-600 dark:text-zinc-400"
                  tick={{ fill: "currentColor" }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", r: 4 }}
                  activeDot={{ r: 6 }}
                  name={`Volume (${weightUnit})`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

