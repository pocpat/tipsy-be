import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isApiRoute = createRouteMatcher(['/api/(.*)']);

export default clerkMiddleware((auth, req) => {
  // For API routes, add CORS headers
  if (isApiRoute(req)) {
    // The `auth()` object can be used here if you need to protect routes
    // in the middleware, but for now we just let the request pass through
    // to be handled by the API route itself.
  }

  // Get the default response from Clerk
  const response = NextResponse.next();

  // Add your CORS headers to the response
  response.headers.set('Access-Control-Allow-Origin', '*'); // In production, lock this down to your frontend's domain
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};