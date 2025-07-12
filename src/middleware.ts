import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/api/(.*)', '/admin/(.*)']);

// 'async' is here, so we check manually.
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth(); // Await the auth() call
    if (!userId) {
      // Manually protect the route
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
  }

  const response = NextResponse.next();
  // CORS Headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 });
  }

  return response;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};