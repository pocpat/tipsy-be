import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkDailyGenerationLimit } from "../../../utils/rateLimiter";
import { generateImage } from "../../../utils/imageRouter";

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check daily generation limit
    if (!checkDailyGenerationLimit(userId)) {
      return new NextResponse("Daily generation limit exceeded.", { status: 429 });
    }

    const { shape, length, style, colors, colorHarmony } = await request.json();

    // Build the prompt for the AI model
    const prompt = `A photorealistic, close-up image of a manicure. The nails are ${length} and ${shape}-shaped. The style is ${style}, using a ${colorHarmony} color palette based on ${colors.join(', ')}.`;

    console.log(`Generating image for user ${userId} with prompt: ${prompt}`);

    // Call the image generation service
    const imageUrls = await generateImage(prompt);

    return NextResponse.json({ success: true, data: imageUrls });

  } catch (error) {
    console.error("[GENERATE_API_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
