import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Dumbbell } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <main className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-8 flex items-center gap-3">
          <Dumbbell className="h-12 w-12 text-[#6c47ff]" />
          <h1 className="text-5xl font-bold text-white">Workout App</h1>
        </div>
        
        <p className="mb-12 max-w-2xl text-xl text-zinc-300">
          Track your fitness journey, log your workouts, and achieve your goals.
          Join thousands of others building better habits.
        </p>

        <SignedOut>
          <div className="flex flex-col gap-4 sm:flex-row">
            <SignUpButton mode="modal">
              <button className="flex h-14 items-center justify-center rounded-full bg-[#6c47ff] px-8 text-lg font-semibold text-white transition-all hover:bg-[#5536cc] hover:shadow-lg">
                Get Started
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="flex h-14 items-center justify-center rounded-full border-2 border-zinc-400 px-8 text-lg font-semibold text-white transition-all hover:border-white hover:bg-zinc-800">
                Sign In
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <Link 
            href="/dashboard"
            className="flex h-14 items-center justify-center rounded-full bg-[#6c47ff] px-8 text-lg font-semibold text-white transition-all hover:bg-[#5536cc] hover:shadow-lg"
          >
            Go to Dashboard
          </Link>
        </SignedIn>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div className="rounded-lg bg-zinc-800/50 p-6 backdrop-blur-sm">
            <h3 className="mb-2 text-xl font-semibold text-white">Track Workouts</h3>
            <p className="text-zinc-400">Log your exercises and monitor your progress over time</p>
          </div>
          <div className="rounded-lg bg-zinc-800/50 p-6 backdrop-blur-sm">
            <h3 className="mb-2 text-xl font-semibold text-white">Set Goals</h3>
            <p className="text-zinc-400">Define and achieve your fitness milestones</p>
          </div>
          <div className="rounded-lg bg-zinc-800/50 p-6 backdrop-blur-sm">
            <h3 className="mb-2 text-xl font-semibold text-white">Stay Consistent</h3>
            <p className="text-zinc-400">Build lasting habits with streak tracking</p>
          </div>
        </div>
      </main>
    </div>
  );
}
