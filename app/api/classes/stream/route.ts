import { NextRequest, NextResponse } from "next/server";
import { getNoticesForClass, addNotice } from "@/lib/classroomStore";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId") || "cls-1";

    let notices: any[] = [];
    try {
      const dbNotices = await prisma.notice.findMany({
        where: classId === "all" ? {} : { classId },
        orderBy: { createdAt: "desc" },
      });
      if (dbNotices && dbNotices.length > 0) {
        notices = dbNotices;
      }
    } catch (dbErr) {
      console.warn("DB notice fetch fallback:", dbErr);
    }

    if (notices.length === 0) {
      notices = getNoticesForClass(classId);
    }

    return NextResponse.json({
      success: true,
      classId,
      notices,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { classId, title, content, authorName, authorRole, priority, className } = body;

    if (!classId || !content) {
      return NextResponse.json(
        { success: false, error: "classId and content are required." },
        { status: 400 }
      );
    }

    const memoryNotice = addNotice({
      classId,
      className: className || undefined,
      title: title || "📢 Class Announcement",
      content,
      priority: priority || "MEDIUM",
      authorName: authorName || "Dr. Sarah Mitchell",
      authorRole: authorRole || "TEACHER",
    });

    let savedNotice = memoryNotice;
    try {
      const dbNotice = await prisma.notice.create({
        data: {
          id: memoryNotice.id,
          classId,
          className: className || undefined,
          title: title || "📢 Class Announcement",
          content,
          priority: priority || "MEDIUM",
          authorName: authorName || "Dr. Sarah Mitchell",
          authorRole: authorRole || "TEACHER",
        },
      });
      savedNotice = {
        ...memoryNotice,
        ...dbNotice,
        authorRole: (dbNotice.authorRole as any) || "TEACHER",
        priority: (dbNotice.priority as any) || "MEDIUM",
        className: dbNotice.className || undefined,
        createdAt: dbNotice.createdAt.toISOString(),
      };
    } catch (dbErr) {
      console.warn("DB notice create warning:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Class Announcement / Notice posted to stream!",
      notice: savedNotice,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Notice ID is required" }, { status: 400 });
    }

    const { deleteNotice } = await import("@/lib/classroomStore");
    const memSuccess = deleteNotice(id);

    try {
      await prisma.notice.delete({ where: { id } });
    } catch (dbErr) {
      console.warn("DB notice delete warning:", dbErr);
    }

    return NextResponse.json({ success: true, message: "Notice deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
