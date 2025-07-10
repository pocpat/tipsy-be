

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define the routes that you want to protect.
const isProtectedRoute = createRouteMatcher([
  '/api/(.*)', // This protects all routes under /api
]);

// This is now an async function
export default clerkMiddleware(async (auth, req) => {
  // Check if the route is a protected one.
  if (isProtectedRoute(req)) {
    try {
      // Await the auth() call to get the session object
      const session = await auth();

      // If there is no session.userId, the user is not authenticated.
      // We will protect the route.
      if (!session.userId) {
        // You can return a custom response for API routes
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
    } catch (e) {
      // Handle cases where the token is malformed or invalid
      return new NextResponse(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }
  }

  // Allow the request to proceed if it's not a protected route
  // or if the user is authenticated.
  return NextResponse.next();
});

export const config = {
  // This matcher ensures the middleware runs on all relevant requests.
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};