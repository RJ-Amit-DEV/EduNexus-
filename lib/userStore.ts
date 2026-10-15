import { Role } from "@prisma/client";

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  gradeLevel?: string;
  department?: string;
  subject?: string;
  studentLinkKey?: string;
  streak?: number;
  points?: number;
  consistencyScore?: number;
  badges?: string[];
  createdAt: string;
}

// Global in-memory storage for registered users with default demo accounts
const registeredUsers: RegisteredUser[] = [
  {
    id: "student-101",
    name: "Alex Johnson",
    email: "alex@edunexus.edu",
    passwordHash: "$2a$10$wT3oV.S9aZ18WbA9uC0C7.d2t9/v0/lJ9lYyH/N3V2H5V.Yw.Xm.", // 'password123'
    role: "STUDENT",
    gradeLevel: "Grade 11 - STEM",
    streak: 5,
    points: 1250,
    consistencyScore: 94,
    badges: ["Fast Learner", "Physics Ace", "7-Day Streak Master", "Quiz Top 5%"],
    studentLinkKey: "LINK-ALEX-99",
    createdAt: new Date().toISOString(),
  },
  {
    id: "teacher-201",
    name: "Dr. Sarah Mitchell",
    email: "dr.mitchell@edunexus.edu",
    passwordHash: "$2a$10$wT3oV.S9aZ18WbA9uC0C7.d2t9/v0/lJ9lYyH/N3V2H5V.Yw.Xm.",
    role: "TEACHER",
    department: "Physics & Astronomy",
    subject: "AP Physics: Mechanics",
    createdAt: new Date().toISOString(),
  },
  {
    id: "parent-301",
    name: "David Johnson",
    email: "david@edunexus.edu",
    passwordHash: "$2a$10$wT3oV.S9aZ18WbA9uC0C7.d2t9/v0/lJ9lYyH/N3V2H5V.Yw.Xm.",
    role: "PARENT",
    studentLinkKey: "LINK-ALEX-99",
    createdAt: new Date().toISOString(),
  },
];

export function findUserByEmail(email: string): RegisteredUser | undefined {
  const cleanEmail = email.trim().toLowerCase();
  return registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
}

export function findUserById(id: string): RegisteredUser | undefined {
  return registeredUsers.find((u) => u.id === id);
}

export function addUser(user: RegisteredUser): RegisteredUser {
  // Ensure default stats for students if not provided
  if (user.role === "STUDENT") {
    user.streak = user.streak ?? 1;
    user.points = user.points ?? 350;
    user.consistencyScore = user.consistencyScore ?? 90;
    user.badges = user.badges ?? ["New Pioneer", "First Step"];
    if (!user.studentLinkKey) {
      user.studentLinkKey = `LINK-${user.name.split(" ")[0].toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    }
  }
  registeredUsers.push(user);
  return user;
}

export function getAllUsers(): RegisteredUser[] {
  return registeredUsers;
}
