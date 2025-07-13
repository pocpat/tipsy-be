import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/api/generate']);

export default clerkMiddleware((auth, req) => {
  // Handle CORS preflight requests by responding immediately.
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204, // No Content
      headers: {
        'Access-Control-Allow-Origin': '*', // In production, lock this down to your frontend's domain
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Protect the admin route. If the user is not authenticated, this will redirect them.
  if (isProtectedRoute(req)) {
    auth.protect();
  }

  // For all other requests, allow them to proceed and add CORS headers to the response.
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
});