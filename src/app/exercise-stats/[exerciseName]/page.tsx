export default async function ExerciseStatsPage({ 
  params 
}: { 
  params: Promise<{ exerciseName: string }> 
}) {
  const { exerciseName } = await params;
  
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Exercise Stats for {exerciseName}
        </h1>
      </div>
    </div>
  );
}

