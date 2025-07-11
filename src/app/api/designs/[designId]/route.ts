import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { del } from '@vercel/blob';
import dbConnect from '@/lib/db';
import Design from '@/models/DesignModel';

export async function DELETE(
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

    // The permanent URL is stored in modelResults[0]
    const blobUrl = design.modelResults[0];
    if (blobUrl) {
      await del(blobUrl);
    }

    await Design.findByIdAndDelete(designId);

    return NextResponse.json({ success: true, message: 'Design deleted' });
  } catch (error) {
    console.error('[DESIGN_DELETE_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
