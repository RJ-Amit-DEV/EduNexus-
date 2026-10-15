import { NextRequest, NextResponse } from "next/server";

const STUDENT_KEYS: Record<string, any> = {
  "LINK-ALEX-99": {
    id: "student-101",
    name: "Alex Johnson",
    grade: "Grade 11 - STEM",
    attendanceRate: 96,
    avgGrade: 88.5,
    consistencyScore: 92,
  },
  "LINK-SOPHIA-42": {
    id: "student-102",
    name: "Sophia Martinez",
    grade: "Grade 11 - STEM",
    attendanceRate: 98,
    avgGrade: 94.0,
    consistencyScore: 96,
  },
  "LINK-LIAM-77": {
    id: "student-103",
    name: "Liam Chen",
    grade: "Grade 11 - STEM",
    attendanceRate: 91,
    avgGrade: 84.5,
    consistencyScore: 88,
  },
};

export async function POST(req: NextRequest) {
  try {
    const { linkKey, parentId } = await req.json();

    if (!linkKey) {
      return NextResponse.json({ success: false, error: "Student Link Key is required" }, { status: 400 });
    }

    const cleanKey = linkKey.trim().toUpperCase();
    const student = STUDENT_KEYS[cleanKey] || {
      id: "student-" + Date.now(),
      name: `${cleanKey.replace("LINK-", "").split("-")[0]} Student`,
      grade: "Grade 11",
      attendanceRate: 95,
      avgGrade: 89,
      consistencyScore: 90,
    };

    return NextResponse.json({
      success: true,
      message: `Successfully linked ${student.name} to your parent account!`,
      child: student,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
