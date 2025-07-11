import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import Design from "../../../../models/DesignModel";
import { checkAndIncrementTotalStorage } from '@/utils/rateLimiter';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check total storage limit
    if (!checkAndIncrementTotalStorage(userId)) {
      return new NextResponse("Total storage limit exceeded.", { status: 429 });
    }

    await dbConnect();

    const designData = await request.json();

    const newDesign = new Design({
      userId,
      ...designData,
    });

    await newDesign.save();

    return NextResponse.json({ success: true, data: newDesign });
  } catch (error) {
    console.error("[SAVE_DESIGN_API_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
