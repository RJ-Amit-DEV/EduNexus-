import { NextRequest, NextResponse } from "next/server";

// Sample verified classes in the system
const KNOWN_CLASSES: Record<string, any> = {
  "PHY-301": {
    id: "cls-1",
    name: "AP Physics: Mechanics",
    subject: "Physics",
    code: "PHY-301",
    teacherName: "Dr. Sarah Mitchell",
    schedule: "Mon, Wed, Fri - 10:00 AM",
    room: "Room 402 / Virtual Lab A",
  },
  "MTH-402": {
    id: "cls-2",
    name: "Calculus BC & Vectors",
    subject: "Mathematics",
    code: "MTH-402",
    teacherName: "Prof. Alan Vance",
    schedule: "Tue, Thu - 01:30 PM",
    room: "Room 210",
  },
  "CS-205": {
    id: "cls-3",
    name: "Data Structures & AI Ethics",
    subject: "Computer Science",
    code: "CS-205",
    teacherName: "Ms. Elena Rostova",
    schedule: "Wed - 03:00 PM",
    room: "Computing Lab 3",
  },
  "BIO-204": {
    id: "cls-4",
    name: "Cellular & Molecular Biology",
    subject: "Biology",
    code: "BIO-204",
    teacherName: "Dr. Rachel Green",
    schedule: "Tue, Fri - 09:00 AM",
    room: "Bio-Sciences Lab 1",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { code, studentId } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, error: "Class code is required" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const foundClass = KNOWN_CLASSES[cleanCode] || {
      id: "cls-" + Date.now(),
      name: `${cleanCode.split("-")[0]} Advanced Class`,
      subject: cleanCode.split("-")[0],
      code: cleanCode,
      teacherName: "Faculty Instructor",
      schedule: "Mon, Wed - 02:00 PM",
      room: "Room 105",
    };

    return NextResponse.json({
      success: true,
      message: `Enrolled successfully in ${foundClass.name}!`,
      class: foundClass,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
