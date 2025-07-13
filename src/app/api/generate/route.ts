import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkDailyGenerationLimit } from '@/utils/rateLimiter';
import { generateImage } from '@/utils/imageRouter';

export async function POST(request: Request) {
  console.log("[GENERATE_API] Received request");
  try {
    console.log("[GENERATE_API] Authenticating user...");
    const { userId } = await auth();
    console.log(`[GENERATE_API] User authenticated: ${userId}`);

    if (!userId) {
      console.log("[GENERATE_API] Unauthorized: No user ID found");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("[GENERATE_API] Checking daily generation limit...");
    const limitOk = checkDailyGenerationLimit(userId);
    console.log(`[GENERATE_API] Daily generation limit check result: ${limitOk}`)
    if (!limitOk) {
      console.log("[GENERATE_API] Daily generation limit exceeded");
      return new NextResponse("Daily generation limit exceeded.", { status: 429 });
    }

    console.log("[GENERATE_API] Parsing request body...");
    const body = await request.json();
    console.log(`[GENERATE_API] Request body parsed: ${JSON.stringify(body)}`);
    const { shape, length, style, colors, colorHarmony } = body;

    const prompt = `A photorealistic, close-up image of a manicure. The nails are short and round-shaped. The style is french, using a triadic color palette based on pink color.`;

    console.log(`[GENERATE_API] Generating image for user ${userId} with prompt: ${prompt}`);

    const imageUrls = await generateImage(prompt);
    console.log(`[GENERATE_API] Image generation successful: ${JSON.stringify(imageUrls)}`);

    return NextResponse.json({ success: true, data: imageUrls });

  } catch (error) {
    console.error("[GENERATE_API_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}