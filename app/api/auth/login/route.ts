import { NextRequest, NextResponse } from "next/server";
import { signToken, comparePassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { findUserByEmail } from "@/lib/userStore";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role } = body;

    let sessionUser: { id: string; name: string; email: string; role: Role } | null = null;

    // 1. First check MySQL database
    if (email && email.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: cleanEmail },
        });

        if (dbUser) {
          if (password) {
            const isValid = await comparePassword(password, dbUser.passwordHash);
            if (!isValid) {
              return NextResponse.json(
                { success: false, error: "Invalid email or password" },
                { status: 401 }
              );
            }
          }

          sessionUser = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
          };
        }
      } catch (dbErr) {
        console.warn("DB login lookup fallback to memory:", dbErr);
      }

      // 2. Fallback to in-memory store if not in DB
      if (!sessionUser) {
        const existingUser = findUserByEmail(cleanEmail);
        if (existingUser) {
          if (password) {
            const isValid = await comparePassword(password, existingUser.passwordHash);
            if (!isValid) {
              return NextResponse.json(
                { success: false, error: "Invalid email or password" },
                { status: 401 }
              );
            }
          }
          sessionUser = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
          };
        }
      }
    }

    // 3. Fallback to Demo Quick-Login Switcher if user credentials not explicitly found
    if (!sessionUser) {
      const selectedRole: Role =
        role ||
        (email?.includes("teacher")
          ? "TEACHER"
          : email?.includes("parent")
          ? "PARENT"
          : "STUDENT");

      sessionUser = {
        id:
          selectedRole === "TEACHER"
            ? "teacher-201"
            : selectedRole === "PARENT"
            ? "parent-301"
            : "student-101",
        name:
          selectedRole === "TEACHER"
            ? "Dr. Sarah Mitchell"
            : selectedRole === "PARENT"
            ? "David Johnson"
            : "Alex Johnson",
        email: email || `${selectedRole.toLowerCase()}@edunexus.edu`,
        role: selectedRole,
      };
    }

    const token = signToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${sessionUser.name}!`,
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
