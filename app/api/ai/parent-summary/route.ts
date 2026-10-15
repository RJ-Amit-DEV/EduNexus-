import { NextRequest, NextResponse } from "next/server";
import { generateParentInsights } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { studentName, attendancePercent, averageGrade, consistencyScore } = await req.json();

    const insights = await generateParentInsights(
      studentName || "Alex Johnson",
      Number(attendancePercent) || 95,
      Number(averageGrade) || 88,
      Number(consistencyScore) || 92
    );

    return NextResponse.json({ success: true, insights });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
