import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { findUserByEmail, addUser } from "@/lib/userStore";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role = "STUDENT", email: customEmail, name: customName } = body;

    const email = customEmail || `google.${role.toLowerCase()}@gmail.com`;
    const name = customName || (role === "TEACHER" ? "Dr. Google Instructor" : role === "PARENT" ? "Google Parent User" : "Google Student User");

    let existing = findUserByEmail(email);
    if (!existing) {
      existing = addUser({
        id: `google-${role.toLowerCase()}-${Date.now()}`,
        name,
        email,
        passwordHash: "$2a$10$google_oauth_hash_placeholder",
        role: role as Role,
        gradeLevel: role === "STUDENT" ? "Grade 11 - STEM" : undefined,
        department: role === "TEACHER" ? "Computer Science & Physics" : undefined,
        subject: role === "TEACHER" ? "AP Physics & Technology" : undefined,
        createdAt: new Date().toISOString(),
      });
    }

    const sessionUser = {
      id: existing.id,
      name: existing.name,
      email: existing.email,
      role: existing.role,
    };

    const token = signToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      message: `Signed in with Google as ${existing.name}!`,
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
