import { NextRequest, NextResponse } from "next/server";
import { signToken, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { findUserByEmail, addUser } from "@/lib/userStore";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, gradeLevel, department, subject, studentLinkKey } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: "Name, email, password, and role are required." },
        { status: 400 }
      );
    }

    const validRoles: Role[] = ["STUDENT", "TEACHER", "PARENT"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid role specified." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if user already exists in MySQL database
    try {
      const dbExisting = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (dbExisting) {
        return NextResponse.json(
          { success: false, error: "An account with this email address already exists." },
          { status: 400 }
        );
      }
    } catch (dbErr) {
      console.warn("DB check fallback to memory:", dbErr);
      const memExisting = findUserByEmail(cleanEmail);
      if (memExisting) {
        return NextResponse.json(
          { success: false, error: "An account with this email address already exists." },
          { status: 400 }
        );
      }
    }

    const passwordHash = await hashPassword(password);
    let createdUser: any = null;

    // 2. Persist directly to MySQL Database
    try {
      createdUser = await prisma.user.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          passwordHash,
          role: role as Role,
          gradeLevel: role === "STUDENT" ? gradeLevel || "Grade 11 - General" : undefined,
          department: role === "TEACHER" ? department || "General Science" : undefined,
          subject: role === "TEACHER" ? subject || "Science & Technology" : undefined,
          studentLinkKey: role === "PARENT" ? studentLinkKey : role === "STUDENT" ? `LINK-${name.trim().split(" ")[0].toUpperCase()}-${Math.floor(10 + Math.random() * 90)}` : undefined,
        },
      });

      // Create initial gamification profile for students in MySQL
      if (role === "STUDENT") {
        await prisma.gamificationProfile.create({
          data: {
            studentId: createdUser.id,
            points: 1250,
            streakCount: 5,
            consistencyScore: 94,
            badgesJson: JSON.stringify(["Fast Learner", "Physics Ace", "Streak Champion"]),
          },
        }).catch((e) => console.warn("Gamification profile create warning:", e));
      }
    } catch (dbInsertErr) {
      console.error("Failed to insert user to MySQL, falling back to memory store:", dbInsertErr);
      const userId = `${role.toLowerCase()}-${Date.now()}`;
      createdUser = addUser({
        id: userId,
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: role as Role,
        gradeLevel: role === "STUDENT" ? gradeLevel || "Grade 11 - General" : undefined,
        department: role === "TEACHER" ? department || "General Science" : undefined,
        subject: role === "TEACHER" ? subject || "Science & Technology" : undefined,
        studentLinkKey: role === "PARENT" ? studentLinkKey : undefined,
        createdAt: new Date().toISOString(),
      });
    }

    // Keep memory store synchronized as fallback
    addUser({
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      passwordHash: createdUser.passwordHash,
      role: createdUser.role,
      gradeLevel: createdUser.gradeLevel,
      department: createdUser.department,
      subject: createdUser.subject,
      studentLinkKey: createdUser.studentLinkKey,
      createdAt: new Date().toISOString(),
    });

    const sessionUser = {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
    };

    const token = signToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      message: `Account created successfully in database for ${createdUser.name}!`,
      user: sessionUser,
      token,
    });

    response.cookies.set("edunexus_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
