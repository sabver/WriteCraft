import { NextRequest, NextResponse } from "next/server";
import { getAIReview } from "@/services/ai";
import { z } from "zod";

const RequestSchema = z.object({
  source: z.string().min(1),
  translation: z.string().min(1),
  scene: z.enum(['INTERVIEW', 'DAILY']),
  context: z.record(z.string(), z.string()).default({}),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = RequestSchema.parse(body);

    const issues = await getAIReview(
      validated.source,
      validated.translation,
      validated.scene,
      validated.context
    );

    return NextResponse.json({ success: true, data: issues });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }
    console.error("Review API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get AI review" },
      { status: 500 }
    );
  }
}
