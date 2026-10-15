export interface MockStudent {
  id: string;
  name: string;
  email: string;
  role: "STUDENT";
  grade: string;
  points: number;
  streak: number;
  consistencyScore: number;
  badges: string[];
}

export interface MockClass {
  id: string;
  name: string;
  subject: string;
  code: string;
  teacherName: string;
  schedule: string;
  room: string;
}

export interface MockAssignment {
  id: string;
  classId: string;
  className: string;
  title: string;
  dueDate: string;
  status: "PENDING" | "SUBMITTED" | "GRADED";
  grade?: number;
  maxScore: number;
}

export interface MockAttendance {
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
  className: string;
}

export const mockFaculty = [
  {
    id: "teacher-201",
    name: "Dr. Sarah Mitchell",
    subject: "AP Physics: Mechanics",
    email: "dr.mitchell@edunexus.edu",
    role: "TEACHER" as const,
    classes: ["AP Physics: Mechanics"],
  },
  {
    id: "teacher-202",
    name: "Prof. Alan Vance",
    subject: "Calculus BC & Vectors",
    email: "prof.vance@edunexus.edu",
    role: "TEACHER" as const,
    classes: ["Calculus BC & Vectors"],
  },
  {
    id: "teacher-203",
    name: "Ms. Elena Rostova",
    subject: "Data Structures & AI Ethics",
    email: "elena.rostova@edunexus.edu",
    role: "TEACHER" as const,
    classes: ["Data Structures & AI Ethics"],
  },
];

export const mockEnrolledStudents = [
  {
    id: "student-101",
    name: "Alex Johnson",
    email: "alex.student@edunexus.edu",
    grade: "Grade 11-A",
    parentName: "David Johnson",
    parentId: "parent-301",
  },
  {
    id: "student-102",
    name: "Sophia Martinez",
    email: "sophia.student@edunexus.edu",
    grade: "Grade 11-A",
    parentName: "Maria Martinez",
    parentId: "parent-302",
  },
  {
    id: "student-103",
    name: "Liam Chen",
    email: "liam.student@edunexus.edu",
    grade: "Grade 11-A",
    parentName: "Kevin Chen",
    parentId: "parent-303",
  },
  {
    id: "student-104",
    name: "Emma Watson",
    email: "emma.student@edunexus.edu",
    grade: "Grade 11-A",
    parentName: "George Watson",
    parentId: "parent-304",
  },
  {
    id: "student-105",
    name: "Lucas Garcia",
    email: "lucas.student@edunexus.edu",
    grade: "Grade 11-A",
    parentName: "Carlos Garcia",
    parentId: "parent-305",
  },
  {
    id: "student-106",
    name: "Olivia Davis",
    email: "olivia.student@edunexus.edu",
    grade: "Grade 11-A",
    parentName: "Sarah Davis",
    parentId: "parent-306",
  },
];

export const mockUsers = {
  student: {
    id: "student-101",
    name: "Alex Johnson",
    email: "alex.student@edunexus.edu",
    role: "STUDENT" as const,
    grade: "Grade 11 - STEM",
    points: 840,
    streak: 14,
    consistencyScore: 92,
    badges: ["Math Whiz", "14-Day Streak", "Code Pioneer", "Quick Learner"],
  },
  teacher: {
    id: "teacher-201",
    name: "Dr. Sarah Mitchell",
    email: "dr.mitchell@edunexus.edu",
    role: "TEACHER" as const,
    department: "Physics & Advanced Sciences",
    classesCount: 4,
    totalStudents: 128,
  },
  parent: {
    id: "parent-301",
    name: "David Johnson",
    email: "david.parent@edunexus.edu",
    role: "PARENT" as const,
    children: [
      {
        id: "student-101",
        name: "Alex Johnson",
        grade: "Grade 11",
        attendanceRate: 96,
        avgGrade: 88.5,
        consistencyScore: 92,
      },
    ],
  },
};

export const mockClasses: MockClass[] = [
  {
    id: "cls-1",
    name: "AP Physics: Mechanics",
    subject: "Physics",
    code: "PHY-301",
    teacherName: "Dr. Sarah Mitchell",
    schedule: "Mon, Wed, Fri - 10:00 AM",
    room: "Room 402 / Virtual Lab A",
  },
  {
    id: "cls-2",
    name: "Calculus BC & Vectors",
    subject: "Mathematics",
    code: "MTH-402",
    teacherName: "Prof. Alan Vance",
    schedule: "Tue, Thu - 01:30 PM",
    room: "Room 210",
  },
  {
    id: "cls-3",
    name: "Data Structures & AI Ethics",
    subject: "Computer Science",
    code: "CS-205",
    teacherName: "Ms. Elena Rostova",
    schedule: "Wed - 03:00 PM",
    room: "Computing Lab 3",
  },
];

export const mockAssignments: MockAssignment[] = [
  {
    id: "asg-1",
    classId: "cls-1",
    className: "AP Physics: Mechanics",
    title: "Incline Planes & Friction Coefficient Lab Report",
    dueDate: "Tomorrow, 11:59 PM",
    status: "PENDING",
    maxScore: 100,
  },
  {
    id: "asg-2",
    classId: "cls-2",
    className: "Calculus BC & Vectors",
    title: "Integration by Parts & Trigonometric Substitution",
    dueDate: "Oct 24, 2026",
    status: "SUBMITTED",
    maxScore: 50,
  },
  {
    id: "asg-3",
    classId: "cls-3",
    className: "Data Structures & AI Ethics",
    title: "Binary Search Trees & Heap Implementation",
    dueDate: "Oct 18, 2026",
    status: "GRADED",
    grade: 96,
    maxScore: 100,
  },
];

export const mockAttendanceRecords: MockAttendance[] = [
  { date: "Oct 20, 2026", status: "PRESENT", className: "AP Physics: Mechanics" },
  { date: "Oct 19, 2026", status: "PRESENT", className: "Calculus BC & Vectors" },
  { date: "Oct 18, 2026", status: "PRESENT", className: "Data Structures & AI Ethics" },
  { date: "Oct 17, 2026", status: "LATE", className: "AP Physics: Mechanics" },
  { date: "Oct 16, 2026", status: "PRESENT", className: "Calculus BC & Vectors" },
];
