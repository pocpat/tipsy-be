import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { put } from '@vercel/blob';
import Design from '@/models/DesignModel';
import { checkStorageLimit } from '@/utils/rateLimiter';
import dbConnect from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { imageUrl, shape, length, style, colors } = body;

    if (!imageUrl) {
      return new NextResponse('Image URL is required', { status: 400 });
    }

    const { limitReached, message } = await checkStorageLimit(userId);
    if (limitReached) {
      return new NextResponse(message, { status: 429 });
    }

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const imageBuffer = await response.arrayBuffer();

    const blob = await put(
      `designs/${userId}/${Date.now()}.png`,
      imageBuffer,
      {
        access: 'public',
        contentType: 'image/png',
      }
    );

    await dbConnect();

    const newDesign = new Design({
      userId,
      shape,
      length,
      style,
      colors,
      modelResults: [blob.url], // Save the permanent URL
      createdAt: new Date(),
    });

    await newDesign.save();

    return NextResponse.json({ success: true, design: newDesign });
  } catch (error) {
    console.error('[SAVE_DESIGN_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}