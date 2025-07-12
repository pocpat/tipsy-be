import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { del } from '@vercel/blob';
import dbConnect from '../../../../../../lib/db';
import Design from '../../../../../../models/DesignModel';

interface RouteContext {
  params: {
    designId: string;
  };
}

// PATCH: Toggle favorite
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { designId } = context.params;
    await dbConnect();

    const design = await Design.findById(designId);
    if (!design) {
      return new NextResponse('Design not found', { status: 404 });
    }

    if (design.userId.toString() !== userId) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    design.isFavorite = !design.isFavorite;
    await design.save();

    return NextResponse.json({ success: true, design });
  } catch (error) {
    console.error('[DESIGN_FAVORITE_PATCH_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE: Delete a design
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { designId } = context.params;
    await dbConnect();

    const design = await Design.findById(designId);
    if (!design) {
      return new NextResponse('Design not found', { status: 404 });
    }

    if (design.userId.toString() !== userId) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Before deleting the DB record, delete the image from Vercel Blob storage
    if (design.imageUrl) {
      await del(design.imageUrl);
    }

    await Design.findByIdAndDelete(designId);

    return NextResponse.json({ success: true, message: 'Design deleted' });
  } catch (error) {
    console.error('[DESIGN_DELETE_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}