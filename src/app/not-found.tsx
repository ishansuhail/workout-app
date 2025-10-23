import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="flex flex-col items-center justify-center px-6 text-center">
        <FileQuestion className="mb-6 h-24 w-24 text-zinc-500" />
        <h1 className="mb-4 text-6xl font-bold text-white">404</h1>
        <h2 className="mb-4 text-3xl font-semibold text-zinc-300">Page Not Found</h2>
        <p className="mb-8 max-w-md text-lg text-zinc-400">
          The page you're looking for doesn't exist or you don't have permission to access it.
        </p>
        <Link
          href="/"
          className="flex h-12 items-center justify-center rounded-full bg-[#6c47ff] px-8 text-base font-semibold text-white transition-all hover:bg-[#5536cc] hover:shadow-lg"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

