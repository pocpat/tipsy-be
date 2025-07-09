import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const { userId } = auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        {userId ? (
          <div>
            <p>Welcome, user!</p>
            <Link href="/dashboard">Go to Dashboard</Link>
          </div>
        ) : (
          <div>
            <p>Please sign in to continue.</p>
            <Link href="/sign-in">Sign In</Link>
          </div>
        )}
      </div>
    </main>
  );
}
