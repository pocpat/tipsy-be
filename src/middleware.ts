import { NextResponse } from 'next/server';

export function middleware(req: Request) {
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

  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}
