export interface ClassNotice {
  id: string;
  classId: string;
  className?: string;
  authorName: string;
  authorRole: "TEACHER" | "STUDENT";
  title?: string;
  content: string;
  priority?: "HIGH" | "MEDIUM" | "LOW";
  createdAt: string;
}

export interface ClassworkSubmission {
  id: string;
  classworkId: string;
  studentId: string;
  studentName: string;
  content: string;
  submittedAt: string;
  status: "SUBMITTED" | "GRADED";
  grade?: number;
}

export interface ClassworkItem {
  id: string;
  classId: string;
  title: string;
  type: "HOMEWORK" | "ASSIGNMENT" | "LAB" | "PROJECT";
  instructions: string;
  dueDate: string;
  maxPoints: number;
  createdAt: string;
  submissions: ClassworkSubmission[];
}

// Pre-populated default notices and homework for demo classes
let mockStreamNotices: ClassNotice[] = [
  {
    id: "notice-101",
    classId: "cls-1",
    className: "AP Physics: Mechanics",
    authorName: "Dr. Sarah Mitchell",
    authorRole: "TEACHER",
    title: "📢 AP Physics Mechanics Lab Safety & Equipment Notice",
    content: "Welcome to Week 4! Please bring your rotational dynamics lab notebooks to Wednesday's hands-on experiment in Lab Room 302. Review safety rules on page 12.",
    priority: "HIGH",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: "notice-102",
    classId: "cls-1",
    className: "AP Physics: Mechanics",
    authorName: "Dr. Sarah Mitchell",
    authorRole: "TEACHER",
    title: "💡 Practice Solutions for Angular Momentum Available",
    content: "AI-graded practice problem set 3 step-by-step solutions have been posted in the Doubt Resolution Hub. Check your answers before Friday's quiz.",
    priority: "MEDIUM",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "notice-201",
    classId: "cls-2",
    className: "Calculus BC & Vectors",
    authorName: "Prof. Alan Vance",
    authorRole: "TEACHER",
    title: "📐 Vector Integration Homework Discussion",
    content: "Please review Module 3 video lectures on line integrals before Thursday's problem set session.",
    priority: "LOW",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

const mockClassworkItems: ClassworkItem[] = [
  {
    id: "cw-101",
    classId: "cls-1",
    title: "Rotational Torque & Centripetal Acceleration Problem Set",
    type: "HOMEWORK",
    instructions: "Complete problems 1 through 8 on page 142. Write down full step-by-step vector derivations and state free-body diagram assumptions.",
    dueDate: "Tomorrow at 11:59 PM",
    maxPoints: 100,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    submissions: [
      {
        id: "sub-101",
        classworkId: "cw-101",
        studentId: "student-101",
        studentName: "Alex Johnson",
        content: "Attached derivation for torque tau = I * alpha and centripetal force components.",
        submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: "GRADED",
        grade: 96,
      },
    ],
  },
  {
    id: "cw-102",
    classId: "cls-1",
    title: "Incline Planes & Friction Coefficient Experimental Lab Report",
    type: "LAB",
    instructions: "Submit your experimental measurements of static vs kinetic friction coefficients on inclined wooden surfaces.",
    dueDate: "Friday at 05:00 PM",
    maxPoints: 50,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    submissions: [],
  },
];

// In-Memory store operations
export function getNoticesForClass(classId: string): ClassNotice[] {
  return mockStreamNotices.filter((n) => n.classId === classId || classId === "all");
}

export function addNotice(notice: Omit<ClassNotice, "id" | "createdAt">): ClassNotice {
  const newNotice: ClassNotice = {
    ...notice,
    id: `notice-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  mockStreamNotices.unshift(newNotice);
  return newNotice;
}

export function deleteNotice(noticeId: string): boolean {
  const initialLength = mockStreamNotices.length;
  mockStreamNotices = mockStreamNotices.filter((n) => n.id !== noticeId);
  return mockStreamNotices.length < initialLength;
}

export function getClassworkForClass(classId: string): ClassworkItem[] {
  return mockClassworkItems.filter((cw) => cw.classId === classId || classId === "all");
}

export function addClasswork(item: Omit<ClassworkItem, "id" | "createdAt" | "submissions">): ClassworkItem {
  const newItem: ClassworkItem = {
    ...item,
    id: `cw-${Date.now()}`,
    createdAt: new Date().toISOString(),
    submissions: [],
  };
  mockClassworkItems.unshift(newItem);
  return newItem;
}

export function submitClassworkResponse(classworkId: string, studentId: string, studentName: string, content: string): ClassworkSubmission | null {
  const item = mockClassworkItems.find((cw) => cw.id === classworkId);
  if (!item) return null;

  const submission: ClassworkSubmission = {
    id: `sub-${Date.now()}`,
    classworkId,
    studentId,
    studentName,
    content,
    submittedAt: new Date().toISOString(),
    status: "SUBMITTED",
  };

  item.submissions.push(submission);
  return submission;
}
