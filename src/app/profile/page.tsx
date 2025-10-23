import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/db/queries";
import { Card } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  // Get the authenticated user from Clerk
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/");
  }

  // Find the user in our Supabase database using their Clerk ID
  const dbUser = await getUserByClerkId(clerkUser.id);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Profile - How Clerk & Supabase Connect
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Clerk Data */}
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-[#6c47ff]">
              🔐 Clerk (Authentication)
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Clerk User ID:</strong>
                <br />
                <code className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
                  {clerkUser.id}
                </code>
              </p>
              <p>
                <strong>Email:</strong>
                <br />
                {clerkUser.emailAddresses[0].emailAddress}
              </p>
              <p>
                <strong>Name:</strong>
                <br />
                {clerkUser.firstName} {clerkUser.lastName}
              </p>
              <p className="pt-2 text-zinc-600 dark:text-zinc-400">
                ℹ️ This data comes from Clerk's servers
              </p>
            </div>
          </Card>

          {/* Supabase Data */}
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-green-600">
              🗄️ Supabase (Your Database)
            </h2>
            {dbUser ? (
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Database User ID:</strong>
                  <br />
                  <code className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
                    {dbUser.id}
                  </code>
                </p>
                <p>
                  <strong>Linked Clerk ID:</strong>
                  <br />
                  <code className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
                    {dbUser.clerkUserId}
                  </code>
                </p>
                <p>
                  <strong>Email:</strong>
                  <br />
                  {dbUser.email}
                </p>
                <p>
                  <strong>Created:</strong>
                  <br />
                  {new Date(dbUser.createdAt).toLocaleDateString()}
                </p>
                <p className="pt-2 text-zinc-600 dark:text-zinc-400">
                  ℹ️ This data is stored in your Supabase database
                </p>
              </div>
            ) : (
              <div className="rounded bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ User not found in database yet. The webhook might still be processing,
                  or you need to set it up.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Connection Explanation */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">🔗 How They're Connected</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <strong>You sign up</strong>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Clerk creates your account and assigns you a unique ID:{" "}
                  <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
                    {clerkUser.id}
                  </code>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <strong>Webhook fires</strong>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Clerk sends your info to <code>/api/webhooks/clerk</code>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <strong>Database record created</strong>
                <p className="text-zinc-600 dark:text-zinc-400">
                  A user is created in Supabase with your Clerk ID stored in the{" "}
                  <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
                    clerkUserId
                  </code>{" "}
                  field
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">4️⃣</span>
              <div>
                <strong>Workouts link to you</strong>
                <p className="text-zinc-600 dark:text-zinc-400">
                  When you create workouts, they reference your Supabase user ID, which links
                  back to your Clerk account
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Code Example */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">💻 Code Example</h2>
          <pre className="overflow-x-auto rounded bg-zinc-900 p-4 text-xs text-zinc-100">
{`// Get current user from Clerk
const clerkUser = await currentUser();

// Find them in Supabase using Clerk ID
const dbUser = await getUserByClerkId(clerkUser.id);

// Get their workouts
const workouts = await getWorkoutsByUserId(dbUser.id);

// The connection:
// Clerk ID → Supabase User → Workouts`}
          </pre>
        </Card>
      </div>
    </div>
  );
}

