import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function Header() {
 const { userId } = await auth();
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-gray-100">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-lg font-bold">
          Tipsy
        </Link>
      </div>
      <div>
        {userId ? (
          <UserButton />
        ) : (
          <Link href="/sign-in" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}