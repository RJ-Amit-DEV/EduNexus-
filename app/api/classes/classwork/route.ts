import { NextRequest, NextResponse } from "next/server";
import { getClassworkForClass, addClasswork, submitClassworkResponse } from "@/lib/classroomStore";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId") || "cls-1";

    const classwork = getClassworkForClass(classId);

    return NextResponse.json({
      success: true,
      classId,
      classwork,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { classId, title, type, instructions, dueDate, maxPoints } = body;

    if (!classId || !title || !instructions) {
      return NextResponse.json(
        { success: false, error: "classId, title, and instructions are required." },
        { status: 400 }
      );
    }

    const item = addClasswork({
      classId,
      title,
      type: type || "HOMEWORK",
      instructions,
      dueDate: dueDate || "Friday at 11:59 PM",
      maxPoints: maxPoints ? Number(maxPoints) : 100,
    });

    return NextResponse.json({
      success: true,
      message: "Homework / Assignment created successfully!",
      classwork: item,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { classworkId, studentId, studentName, content } = body;

    if (!classworkId || !content) {
      return NextResponse.json(
        { success: false, error: "classworkId and content are required." },
        { status: 400 }
      );
    }

    const submission = submitClassworkResponse(
      classworkId,
      studentId || "student-101",
      studentName || "Alex Johnson",
      content
    );

    if (!submission) {
      return NextResponse.json(
        { success: false, error: "Classwork item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Homework turned in successfully!",
      submission,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
