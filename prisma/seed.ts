import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding MySQL Database 'edunexus'...");

  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Create Teacher
  const teacher = await prisma.user.upsert({
    where: { email: "dr.mitchell@edunexus.edu" },
    update: {},
    create: {
      id: "teacher-201",
      email: "dr.mitchell@edunexus.edu",
      name: "Dr. Sarah Mitchell",
      passwordHash,
      role: Role.TEACHER,
    },
  });

  // 2. Create Student
  const student = await prisma.user.upsert({
    where: { email: "alex@edunexus.edu" },
    update: {},
    create: {
      id: "student-101",
      email: "alex@edunexus.edu",
      name: "Alex Johnson",
      passwordHash,
      role: Role.STUDENT,
    },
  });

  // 3. Create Parent
  const parent = await prisma.user.upsert({
    where: { email: "david@edunexus.edu" },
    update: {},
    create: {
      id: "parent-301",
      email: "david@edunexus.edu",
      name: "David Johnson",
      passwordHash,
      role: Role.PARENT,
      children: {
        connect: [{ id: student.id }],
      },
    },
  });

  // 4. Create Demo Classes
  const physicsClass = await prisma.class.upsert({
    where: { code: "PHY-301" },
    update: {},
    create: {
      id: "cls-1",
      name: "AP Physics: Mechanics",
      subject: "Physics",
      code: "PHY-301",
      gradeLevel: "Grade 11 - STEM",
      teacherId: teacher.id,
    },
  });

  const mathClass = await prisma.class.upsert({
    where: { code: "MTH-402" },
    update: {},
    create: {
      id: "cls-2",
      name: "Calculus BC & Vectors",
      subject: "Mathematics",
      code: "MTH-402",
      gradeLevel: "Grade 11 - Advanced",
      teacherId: teacher.id,
    },
  });

  // 5. Enroll Student in Classes
  await prisma.enrollment.upsert({
    where: {
      studentId_classId: {
        studentId: student.id,
        classId: physicsClass.id,
      },
    },
    update: {},
    create: {
      studentId: student.id,
      classId: physicsClass.id,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      studentId_classId: {
        studentId: student.id,
        classId: mathClass.id,
      },
    },
    update: {},
    create: {
      studentId: student.id,
      classId: mathClass.id,
    },
  });

  // 6. Create Initial Assignments
  const existingAsg = await prisma.assignment.findFirst({
    where: { classId: physicsClass.id, title: "Incline Planes & Friction Coefficient Lab Report" },
  });

  if (!existingAsg) {
    await prisma.assignment.create({
      data: {
        id: "asg-1",
        classId: physicsClass.id,
        title: "Incline Planes & Friction Coefficient Lab Report",
        description: "Submit your experimental measurements of static vs kinetic friction coefficients.",
        dueDate: new Date(Date.now() + 86400000 * 3),
        maxScore: 100,
      },
    });
  }

  // 7. Seed Initial Notices
  const existingNotice = await prisma.notice.findFirst({
    where: { classId: physicsClass.id },
  });

  if (!existingNotice) {
    await prisma.notice.create({
      data: {
        id: "notice-101",
        classId: physicsClass.id,
        className: physicsClass.name,
        title: "📢 AP Physics Mechanics Lab Safety & Equipment Notice",
        content: "Welcome to Week 4! Please bring your rotational dynamics lab notebooks to Wednesday's hands-on experiment in Lab Room 302.",
        priority: "HIGH",
        authorName: teacher.name,
        authorRole: "TEACHER",
      },
    });
  }

  console.log("✅ MySQL Database successfully seeded!");
  console.log("   - Users: 3 (Student, Teacher, Parent)");
  console.log("   - Classes: 2 (AP Physics, Calculus)");
  console.log("   - Enrollments & Assignments linked");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
