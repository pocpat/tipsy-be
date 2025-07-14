
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '../../../../lib/db';
import Design from '../../../../models/DesignModel';

export async function GET(request: Request) {
  // The auth() helper gets the session details for the incoming request.
  // If the token is invalid or missing, the middleware would have already
  // responded, but we still get null here.
  const { userId } =  await auth();

  // CRITICAL: Always check for the userId in your protected routes.
  // This confirms the user is actually logged in.
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    await dbConnect();

    // Use the validated userId to securely fetch data for that user only.
    const designs = await Design.find({ userId: userId }).sort({ createdAt: -1 });

    return NextResponse.json(designs, { status: 200 });
  } catch (error) {
    console.error("Error fetching designs:", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import dbConnect from "../../../../lib/db";
// import Design from "../../../../models/DesignModel";

// export async function GET(request: Request) {
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     await dbConnect();

//     const designs = await Design.find({ userId });

//     return NextResponse.json({ success: true, data: designs });
//   } catch (error) {
//     console.error("[MY_DESIGNS_API_ERROR]", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }
