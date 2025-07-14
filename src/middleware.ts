import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Create a route matcher to determine which routes are protected.
// This matches all routes under /api/ except for the public webhook route.
const isProtectedRoute = createRouteMatcher([
  '/api/(.*)', // Protects all API routes by default
]);

export default clerkMiddleware((auth, req) => {
  // Check if the current request path matches a protected route
  if (isProtectedRoute(req)) {
    // If it's a protected route, enforce authentication.
    // The auth() function will throw an error if the user is not authenticated,
    // which the middleware will catch and handle appropriately (e.g., return a 401).
    auth.protect();
  }
});

export const config = {
  // The matcher defines which routes the middleware will run on.
  // This pattern is essential to ensure the middleware runs on API calls
  // but ignores static assets and internal Next.js routes.
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};


// import { clerkMiddleware } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';

// export default clerkMiddleware((auth, req) => {
//   // Protect all routes matched by the config.matcher
//   auth.protect();

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ['/((?!.*\..*|_next).*)', '/', '/(api|trpc)(.*)'],
// };