import { NextRequest, NextResponse } from "next/server";
import { generateScenarioQuiz } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { topic, gradeLevel, count } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const questions = await generateScenarioQuiz(
      topic,
      gradeLevel || "Grade 11",
      Number(count) || 3
    );

    return NextResponse.json({ success: true, questions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
