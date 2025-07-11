import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import Design from '@/models/DesignModel';

export async function PATCH(
  request: Request,
  { params }: { params: { designId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { designId } = params;

    await dbConnect();

    const design = await Design.findById(designId);

    if (!design) {
      return new NextResponse('Design not found', { status: 404 });
    }

    if (design.userId !== userId) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Flip the boolean value of isFavorite
    design.isFavorite = !design.isFavorite;

    await design.save();

    return NextResponse.json({ success: true, design });
  } catch (error) {
    console.error('[DESIGN_FAVORITE_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
