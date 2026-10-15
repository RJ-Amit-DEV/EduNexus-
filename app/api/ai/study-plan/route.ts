import { NextRequest, NextResponse } from "next/server";
import { executeAdaptiveStudyPlanner } from "@/lib/studyPlannerAlgo";
import { generateStudyPlan } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      subject,
      targetGoal,
      weeklyHours = 8,
      durationWeeks = 3,
      currentProficiency = "INTERMEDIATE",
    } = body;

    if (!subject || !subject.trim()) {
      return NextResponse.json({ error: "Subject is required." }, { status: 400 });
    }

    // 1. Run Algorithmic Milestone Decomposition
    const algorithmicPlan = executeAdaptiveStudyPlanner({
      subject: subject.trim(),
      targetGoal: targetGoal?.trim() || "Score 90%+ and master core problem-solving",
      weeklyHours: Number(weeklyHours) || 8,
      durationWeeks: Number(durationWeeks) || 3,
      currentProficiency,
    });

    // 2. Optionally query Gemini to supplement dynamic modules if available
    try {
      const geminiPlan = await generateStudyPlan(
        subject,
        targetGoal || "Score 90%+",
        Number(weeklyHours) || 8
      );
      if (geminiPlan?.aiNote) {
        algorithmicPlan.aiPedagogicalAdvice = `${algorithmicPlan.aiPedagogicalAdvice} ${geminiPlan.aiNote}`;
      }
    } catch {
      // Fallback silently to algorithm output
    }

    return NextResponse.json({
      success: true,
      plan: algorithmicPlan,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
