import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import Design from "../../../../models/DesignModel";

export async function GET(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const designs = await Design.find({ userId });

    return NextResponse.json({ success: true, data: designs });
  } catch (error) {
    console.error("[MY_DESIGNS_API_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
