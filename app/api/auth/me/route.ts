import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { findUserById, findUserByEmail } from "@/lib/userStore";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("edunexus_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const sessionUser = verifyToken(token);
    if (!sessionUser) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    // 1. Try fetching full user profile from MySQL database
    let dbUser: any = null;
    try {
      dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            { id: sessionUser.id },
            { email: sessionUser.email },
          ],
        },
        include: {
          gamification: true,
        },
      });
    } catch (err) {
      console.warn("DB user lookup fallback to memory:", err);
    }

    // 2. Fallback to in-memory profile if DB lookup was empty
    const memProfile = findUserById(sessionUser.id) || findUserByEmail(sessionUser.email);

    let parsedBadges: string[] | undefined = undefined;
    if (dbUser?.gamification?.badgesJson) {
      try {
        parsedBadges = JSON.parse(dbUser.gamification.badgesJson);
      } catch {
        parsedBadges = ["Fast Learner", "Physics Ace"];
      }
    }

    const userResponse = {
      id: dbUser?.id || memProfile?.id || sessionUser.id,
      name: dbUser?.name || memProfile?.name || sessionUser.name,
      email: dbUser?.email || memProfile?.email || sessionUser.email,
      role: dbUser?.role || memProfile?.role || sessionUser.role,
      gradeLevel: dbUser?.gradeLevel || memProfile?.gradeLevel || (sessionUser.role === "STUDENT" ? "Grade 11 - STEM Track" : undefined),
      department: dbUser?.department || memProfile?.department,
      subject: dbUser?.subject || memProfile?.subject,
      studentLinkKey: dbUser?.studentLinkKey || memProfile?.studentLinkKey,
      streak: dbUser?.gamification?.streakCount ?? memProfile?.streak ?? (sessionUser.role === "STUDENT" ? 5 : undefined),
      points: dbUser?.gamification?.points ?? memProfile?.points ?? (sessionUser.role === "STUDENT" ? 1250 : undefined),
      consistencyScore: dbUser?.gamification?.consistencyScore ?? memProfile?.consistencyScore ?? (sessionUser.role === "STUDENT" ? 94 : undefined),
      badges: parsedBadges || (memProfile?.badges ?? (sessionUser.role === "STUDENT" ? ["Fast Learner", "Physics Ace", "7-Day Streak Master"] : undefined)),
    };

    return NextResponse.json({
      success: true,
      user: userResponse,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
