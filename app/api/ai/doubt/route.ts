import { NextRequest, NextResponse } from "next/server";
import { solveStudentDoubt } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { question, subject } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Question text is required" }, { status: 400 });
    }

    const solution = await solveStudentDoubt(question, subject || "General Academic");

    return NextResponse.json({ success: true, ...solution });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
