import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, subject, gradeLevel, schedule, room, teacherId } = await req.json();

    if (!name || !subject) {
      return NextResponse.json({ success: false, error: "Class name and subject are required" }, { status: 400 });
    }

    // Generate clean 6-character uppercase class code
    const prefix = subject.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, "CLS");
    const randomNum = Math.floor(100 + Math.random() * 900);
    const code = `${prefix}-${randomNum}`;

    // Get an existing teacher for relation, or seed teacher
    let teacher = await prisma.user.findFirst({
      where: { role: "TEACHER" },
    });

    if (!teacher) {
      teacher = await prisma.user.create({
        data: {
          id: teacherId || "teacher-201",
          name: "Dr. Sarah Mitchell",
          email: "dr.mitchell@edunexus.edu",
          passwordHash: "$2a$10$placeholder_hash",
          role: "TEACHER",
        },
      });
    }

    // Create class record in MySQL database
    let createdDbClass: any = null;
    try {
      createdDbClass = await prisma.class.create({
        data: {
          name,
          subject,
          code,
          gradeLevel: gradeLevel || "Grade 11 - Advanced",
          teacherId: teacher.id,
        },
      });
    } catch (dbErr) {
      console.warn("DB class create warning:", dbErr);
    }

    const newClass = {
      id: createdDbClass?.id || "cls-" + Date.now(),
      name,
      subject,
      code,
      gradeLevel: gradeLevel || "Grade 11",
      teacherName: teacher.name,
      schedule: schedule || "Mon, Wed, Fri - 11:30 AM",
      room: room || "Lab Room 302",
      enrolledCount: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, class: newClass });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
