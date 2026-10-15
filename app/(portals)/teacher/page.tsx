"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import QuizGeneratorModal from "@/components/ai/QuizGeneratorModal";
import CreateClassModal from "@/components/enrollment/CreateClassModal";
import ClassroomWorkspaceModal from "@/components/classroom/ClassroomWorkspaceModal";
import PostNoticeModal from "@/components/classroom/PostNoticeModal";
import { mockUsers, mockClasses, mockAssignments, mockEnrolledStudents } from "@/lib/mockData";
import {
  UserCheck,
  Brain,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  HelpCircle,
  FileCheck,
  BookOpen,
  MessageSquare,
  Megaphone,
  BarChart3,
  TrendingUp,
  Award,
  AlertTriangle,
  ChevronRight,
  Search,
  Filter,
  GraduationCap,
  Calendar,
  Star,
  Pencil,
  Check,
  X,
  ClipboardList,
  LayoutDashboard,
  Bell,
  FileText,
  User,
  Trash2,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────── */
interface TeacherUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
}

interface StudentAttendanceRecord {
  id: string;
  name: string;
  email: string;
  grade: string;
  status: "PRESENT" | "LATE" | "ABSENT";
  attendanceRate: number;
}

interface AssignmentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  assignmentTitle: string;
  assignmentId: string;
  className: string;
  submittedAt: string;
  grade: number | null;
  maxScore: number;
  status: "SUBMITTED" | "GRADED" | "PENDING";
}

interface TeacherClass {
  id: string;
  name: string;
  subject: string;
  code: string;
  room: string;
  schedule: string;
  teacherName: string;
  studentCount: number;
  avgAttendance: number;
  pendingAssignments: number;
}

/* ─── Seed Data ──────────────────────────────────────────────── */
const initialRoster: StudentAttendanceRecord[] = mockEnrolledStudents.map((s) => ({
  id: s.id,
  name: s.name,
  email: s.email,
  grade: s.grade,
  status: "PRESENT" as const,
  attendanceRate: Math.floor(Math.random() * 10) + 90,
}));

const teacherClasses: TeacherClass[] = [
  { id: "cls-1", name: "AP Physics: Mechanics", subject: "Physics", code: "PHY-301", room: "Room 402 / Virtual Lab A", schedule: "Mon, Wed, Fri — 10:00 AM", teacherName: "", studentCount: 32, avgAttendance: 94, pendingAssignments: 3 },
  { id: "cls-2", name: "Calculus BC & Vectors", subject: "Mathematics", code: "MTH-402", room: "Room 210", schedule: "Tue, Thu — 01:30 PM", teacherName: "", studentCount: 28, avgAttendance: 97, pendingAssignments: 1 },
  { id: "cls-3", name: "Data Structures & AI Ethics", subject: "Computer Science", code: "CS-205", room: "Computing Lab 3", schedule: "Wed — 03:00 PM", teacherName: "", studentCount: 24, avgAttendance: 91, pendingAssignments: 5 },
  { id: "cls-4", name: "Advanced Chemistry & Lab", subject: "Chemistry", code: "CHM-303", room: "Lab Block B2", schedule: "Mon, Fri — 12:00 PM", teacherName: "", studentCount: 26, avgAttendance: 96, pendingAssignments: 0 },
];

const submissionsData: AssignmentSubmission[] = mockEnrolledStudents.flatMap((s, si) =>
  mockAssignments.map((a, ai) => ({
    id: `sub-${s.id}-${a.id}`,
    studentId: s.id,
    studentName: s.name,
    assignmentTitle: a.title,
    assignmentId: a.id,
    className: a.className,
    submittedAt: `Oct ${15 + ai + si}, 2026 at ${9 + ai}:30 AM`,
    grade: ai === 2 ? 85 + si * 2 : null,
    maxScore: a.maxScore,
    status: (ai === 2 ? "GRADED" : ai === 1 ? "SUBMITTED" : "PENDING") as "SUBMITTED" | "GRADED" | "PENDING",
  }))
);

/* ─── Component ──────────────────────────────────────────────── */
export default function TeacherPortal() {
  const router = useRouter();

  /* Auth */
  const [currentUser, setCurrentUser] = useState<TeacherUser | null>(null);

  /* Navigation */
  const [activeTab, setActiveTab] = useState<"DASHBOARD" | "CLASSES" | "ATTENDANCE" | "ASSIGNMENTS" | "ANALYTICS">("DASHBOARD");

  /* Modals */
  const [isQuizModalOpen, setQuizModalOpen] = useState(false);
  const [isCreateClassOpen, setCreateClassOpen] = useState(false);
  const [isPostNoticeOpen, setPostNoticeOpen] = useState(false);
  const [activeClassroomModal, setActiveClassroomModal] = useState<any>(null);

  /* Live Announcements / Notices */
  const [announcements, setAnnouncements] = useState<any[]>([
    { id: "notice-101", title: "📢 AP Physics Mechanics Lab Safety & Equipment Notice", content: "Welcome to Week 4! Please bring your rotational dynamics lab notebooks to Wednesday's hands-on experiment in Lab Room 302. Review safety rules on page 12.", className: "AP Physics: Mechanics", priority: "HIGH", createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: "notice-102", title: "💡 Practice Solutions for Angular Momentum Available", content: "AI-graded practice problem set 3 step-by-step solutions have been posted in the Doubt Resolution Hub. Check your answers before Friday's quiz.", className: "AP Physics: Mechanics", priority: "MEDIUM", createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
    { id: "notice-201", title: "📐 Vector Integration Homework Discussion", content: "Please review Module 3 video lectures on line integrals before Thursday's problem set session.", className: "Calculus BC & Vectors", priority: "LOW", createdAt: new Date(Date.now() - 3600000 * 12).toISOString() },
  ]);
  const [announcementFilter, setAnnouncementFilter] = useState("all");

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/classes/stream?classId=all");
      const data = await res.json();
      if (data.success && Array.isArray(data.notices)) {
        setAnnouncements(data.notices);
      }
    } catch (err) {
      console.error("Failed to load stream notices:", err);
    }
  };

  const handleDeleteNotice = async (noticeId: string) => {
    try {
      const res = await fetch(`/api/classes/stream?id=${noticeId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== noticeId));
      }
    } catch (err) {
      console.error("Failed to delete notice:", err);
    }
  };

  /* Attendance */
  const [roster, setRoster] = useState<StudentAttendanceRecord[]>(initialRoster);
  const [selectedClassForAtt, setSelectedClassForAtt] = useState(teacherClasses[0].id);
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const [attendanceSearch, setAttendanceSearch] = useState("");

  /* Assignments / Grading */
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(submissionsData);
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState("");
  const [submissionFilter, setSubmissionFilter] = useState<"ALL" | "SUBMITTED" | "GRADED" | "PENDING">("ALL");
  const [assignmentSearch, setAssignmentSearch] = useState("");

  /* Classes */
  const [classes, setClasses] = useState<TeacherClass[]>(teacherClasses);

  /* ── Auth fetch & Data load ── */
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.success || !data.user) {
          router.push("/login?role=TEACHER");
        } else if (data.user.role !== "TEACHER") {
          router.push(data.user.role === "STUDENT" ? "/student" : "/parent");
        } else {
          setCurrentUser(data.user);
        }
      })
      .catch(() => router.push("/login?role=TEACHER"));

    fetchAnnouncements();
  }, [router]);

  /* ── Derived values ── */
  const teacher = mockUsers.teacher;
  const teacherName = currentUser?.name || teacher.name;
  const teacherDept = currentUser?.department || teacher.department;

  const totalStudents = classes.reduce((s, c) => s + c.studentCount, 0);
  const totalPending = submissions.filter((s) => s.status === "SUBMITTED").length;
  const avgAtt = Math.round(classes.reduce((a, c) => a + c.avgAttendance, 0) / classes.length);

  /* ── Attendance helpers ── */
  const toggleStatus = (id: string, newStatus: "PRESENT" | "LATE" | "ABSENT") => {
    setRoster((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
    setAttendanceSaved(false);
  };

  const handleSaveAttendance = () => {
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 3000);
  };

  const filteredRoster = roster.filter(
    (s) =>
      s.name.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
      s.grade.toLowerCase().includes(attendanceSearch.toLowerCase())
  );
  const presentCount = roster.filter((s) => s.status === "PRESENT").length;
  const lateCount = roster.filter((s) => s.status === "LATE").length;
  const absentCount = roster.filter((s) => s.status === "ABSENT").length;

  /* ── Grading helpers ── */
  const handleSubmitGrade = (subId: string) => {
    const g = parseInt(gradeInput);
    if (isNaN(g)) return;
    setSubmissions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, grade: g, status: "GRADED" } : s))
    );
    setGradingId(null);
    setGradeInput("");
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (submissionFilter !== "ALL" && s.status !== submissionFilter) return false;
    return (
      s.studentName.toLowerCase().includes(assignmentSearch.toLowerCase()) ||
      s.assignmentTitle.toLowerCase().includes(assignmentSearch.toLowerCase()) ||
      s.className.toLowerCase().includes(assignmentSearch.toLowerCase())
    );
  });

  /* ─── Tab Button ─── */
  const TabBtn = ({ id, label, icon: Icon }: { id: typeof activeTab; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
        activeTab === id
          ? "bg-indigo-600 text-white shadow-sm"
          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Hero Header ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-10 w-56 h-56 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <GraduationCap className="h-3.5 w-3.5 text-blue-300" />
                Faculty Management Console
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome, {teacherName}!
              </h1>
              <p className="text-blue-100 text-sm max-w-xl">
                Department: <span className="font-semibold text-white">{teacherDept}</span> • Managing {classes.length} active class sections
              </p>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0">
              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-white font-black text-xl sm:text-2xl">
                  <Users className="h-5 w-5 text-blue-300" />
                  {totalStudents}
                </div>
                <span className="text-[11px] font-medium text-blue-200">Total Students</span>
              </div>
              <div className="h-10 w-px bg-white/20 my-auto" />
              <div className="text-center px-2">
                <div className="text-emerald-300 font-black text-xl sm:text-2xl">{avgAtt}%</div>
                <span className="text-[11px] font-medium text-blue-200">Avg Attendance</span>
              </div>
              <div className="h-10 w-px bg-white/20 my-auto" />
              <div className="text-center px-2">
                <div className="text-amber-300 font-black text-xl sm:text-2xl">{totalPending}</div>
                <span className="text-[11px] font-medium text-blue-200">To Grade</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab Nav ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <TabBtn id="DASHBOARD"   label="Dashboard"    icon={LayoutDashboard} />
          <TabBtn id="CLASSES"     label={`My Classes (${classes.length})`} icon={BookOpen} />
          <TabBtn id="ATTENDANCE"  label="Attendance"   icon={UserCheck} />
          <TabBtn id="ASSIGNMENTS" label={`Grading (${totalPending} pending)`} icon={FileCheck} />
          <TabBtn id="ANALYTICS"   label="Analytics"    icon={BarChart3} />
        </div>

        {/* ══════════════════════════════════════════════════════
            TAB 1 — DASHBOARD
        ══════════════════════════════════════════════════════ */}
        {activeTab === "DASHBOARD" && (
          <div className="space-y-6">

            {/* Quick-action cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Take Attendance", desc: "Mark today's roll-call", icon: UserCheck, color: "indigo", onClick: () => setActiveTab("ATTENDANCE") },
                { label: "Grade Submissions", desc: `${totalPending} awaiting your review`, icon: FileCheck, color: "emerald", onClick: () => setActiveTab("ASSIGNMENTS") },
                { label: "Open Classroom", desc: "Post streams & classwork", icon: Megaphone, color: "blue", onClick: () => setActiveClassroomModal(classes[0]) },
                { label: "Build AI Quiz", desc: "Generate questions instantly", icon: Brain, color: "amber", onClick: () => setQuizModalOpen(true) },
              ].map(({ label, desc, icon: Icon, color, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className={`flex items-start gap-3 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:border-${color}-400 hover:shadow-md transition text-left group`}
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-${color}-50 text-${color}-600 border border-${color}-100 group-hover:scale-105 transition`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{label}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom two-column: Announcements + Doubt Queue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Announcements */}
              <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-indigo-600" />
                      Class Notices & Announcements ({announcements.length})
                    </h3>
                    <p className="text-[11px] text-slate-500">Live synchronized with Student Dashboards & Streams</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={announcementFilter}
                      onChange={(e) => setAnnouncementFilter(e.target.value)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white focus:outline-none"
                    >
                      <option value="all">All Sections</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setPostNoticeOpen(true)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-xl shadow-xs transition"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Broadcast Notice
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {announcements
                    .filter((a) => announcementFilter === "all" || a.classId === announcementFilter || a.classId === "all")
                    .map((a) => (
                    <div key={a.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2 hover:bg-slate-50 transition group">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">{a.title}</h4>
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                              {a.className || "Class Broadcast"}
                            </span>
                            <span className="text-slate-400">
                              {a.createdAt ? new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            a.priority === "HIGH" ? "bg-rose-100 text-rose-700 border border-rose-200" :
                            a.priority === "MEDIUM" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                            "bg-blue-100 text-blue-700 border border-blue-200"
                          }`}>
                            {a.priority || "INFO"}
                          </span>
                          <button
                            onClick={() => handleDeleteNotice(a.id)}
                            title="Delete notice"
                            className="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                        {a.content || a.body}
                      </p>
                    </div>
                  ))}

                  {announcements.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No notices published yet. Click &quot;Broadcast Notice&quot; to post one!
                    </div>
                  )}
                </div>
              </div>

              {/* Doubt Queue + Pending Grading */}
              <div className="space-y-4">
                <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-5 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                    Student Doubt Queue
                  </h3>
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900">Alex Johnson • AP Physics</span>
                      <span className="text-[10px] font-bold bg-blue-200/70 text-blue-800 px-2 py-0.5 rounded-full">AI Pre-Answered</span>
                    </div>
                    <p className="text-xs text-slate-700">"Why is work done by centripetal force always zero?"</p>
                    <div className="text-[11px] text-slate-500 italic bg-white p-2 rounded-md border border-slate-100">
                      AI solution delivered. Teacher review requested for edge-case derivation.
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <a href="/chat?role=TEACHER" className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" /> Open in Chat
                      </a>
                    </div>
                  </div>
                </div>

                {/* Pending grading quick list */}
                <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-indigo-600" />
                      Pending Grading
                    </h3>
                    <button onClick={() => setActiveTab("ASSIGNMENTS")} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                      View All <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {submissions.filter((s) => s.status === "SUBMITTED").slice(0, 3).map((s) => (
                    <div key={s.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{s.studentName}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[180px]">{s.assignmentTitle}</p>
                      </div>
                      <button
                        onClick={() => { setActiveTab("ASSIGNMENTS"); setGradingId(s.id); }}
                        className="shrink-0 rounded-lg bg-indigo-50 text-indigo-700 px-3 py-1.5 text-xs font-bold hover:bg-indigo-100 transition"
                      >
                        Grade
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 2 — MY CLASSES
        ══════════════════════════════════════════════════════ */}
        {activeTab === "CLASSES" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Your Class Sections</h2>
              <button
                onClick={() => setCreateClassOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 text-white px-4 py-2 text-xs font-bold hover:bg-indigo-700 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Create New Class
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {classes.map((cls) => (
                <div key={cls.id} className="rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">{cls.code}</span>
                      <h3 className="font-bold text-slate-900 mt-2">{cls.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{cls.subject}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-2">
                      <div className="font-bold text-sm text-slate-900">{cls.studentCount}</div>
                      <div className="text-[10px] text-slate-500">Students</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-2">
                      <div className={`font-bold text-sm ${cls.avgAttendance >= 95 ? "text-emerald-600" : "text-amber-600"}`}>{cls.avgAttendance}%</div>
                      <div className="text-[10px] text-slate-500">Avg Att.</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-2">
                      <div className={`font-bold text-sm ${cls.pendingAssignments > 0 ? "text-rose-600" : "text-emerald-600"}`}>{cls.pendingAssignments}</div>
                      <div className="text-[10px] text-slate-500">Pending</div>
                    </div>
                  </div>

                  {/* Schedule & room */}
                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-slate-400" />{cls.schedule}</div>
                    <div className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-slate-400" />{cls.room}</div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => setActiveClassroomModal(cls)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
                    >
                      <Megaphone className="h-3.5 w-3.5" />
                      Open Classroom
                    </button>
                    <button
                      onClick={() => { setSelectedClassForAtt(cls.id); setActiveTab("ATTENDANCE"); }}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      Take Attendance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 3 — ATTENDANCE
        ══════════════════════════════════════════════════════ */}
        {activeTab === "ATTENDANCE" && (
          <div className="space-y-5">
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-6 space-y-5">

              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-indigo-600" />
                    One-Click Attendance Register
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Mark, toggle, and commit today's roll-call</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Class selector */}
                  <select
                    value={selectedClassForAtt}
                    onChange={(e) => setSelectedClassForAtt(e.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setActiveClassroomModal(classes.find((c) => c.id === selectedClassForAtt) || classes[0])}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
                  >
                    <Megaphone className="h-3.5 w-3.5" />
                    Classroom Stream
                  </button>
                  <button
                    onClick={handleSaveAttendance}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Save Attendance
                  </button>
                </div>
              </div>

              {/* Save confirmation */}
              {attendanceSaved && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Attendance saved and synced successfully!
                </div>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                <span className="text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">✅ Present: {presentCount}</span>
                <span className="text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">⏰ Late: {lateCount}</span>
                <span className="text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">❌ Absent: {absentCount}</span>
                <span className="ml-auto text-slate-500">
                  Attendance rate today: <span className="font-bold text-slate-800">
                    {Math.round(((presentCount + lateCount) / roster.length) * 100)}%
                  </span>
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student by name or section..."
                  value={attendanceSearch}
                  onChange={(e) => setAttendanceSearch(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              {/* Bulk actions */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Mark all as:</span>
                {(["PRESENT", "LATE", "ABSENT"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setRoster((prev) => prev.map((r) => ({ ...r, status: s })))}
                    className={`px-3 py-1 rounded-lg font-bold transition ${
                      s === "PRESENT" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" :
                      s === "LATE"    ? "bg-amber-100 text-amber-700 hover:bg-amber-200" :
                                       "bg-rose-100 text-rose-700 hover:bg-rose-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Section</th>
                      <th className="py-3 px-4">Overall Rate</th>
                      <th className="py-3 px-4 text-center">Today's Status</th>
                      <th className="py-3 px-4 text-right">Mark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRoster.map((st, idx) => (
                      <tr key={st.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{st.name}</td>
                        <td className="py-3 px-4 text-slate-500">{st.grade}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${st.attendanceRate >= 95 ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${st.attendanceRate}%` }} />
                            </div>
                            <span className="font-bold text-slate-700">{st.attendanceRate}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            st.status === "PRESENT" ? "bg-emerald-100 text-emerald-800" :
                            st.status === "LATE"    ? "bg-amber-100 text-amber-800" :
                                                     "bg-rose-100 text-rose-800"
                          }`}>{st.status}</span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          {(["PRESENT", "LATE", "ABSENT"] as const).map((s) => (
                            <button
                              key={s}
                              onClick={() => toggleStatus(st.id, s)}
                              className={`px-2 py-1 rounded-md text-[11px] font-medium transition ${
                                st.status === s
                                  ? s === "PRESENT" ? "bg-emerald-600 text-white" : s === "LATE" ? "bg-amber-600 text-white" : "bg-rose-600 text-white"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                            >
                              {s === "PRESENT" ? "P" : s === "LATE" ? "L" : "A"}
                            </button>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 4 — ASSIGNMENTS & GRADING
        ══════════════════════════════════════════════════════ */}
        {activeTab === "ASSIGNMENTS" && (
          <div className="space-y-5">
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-indigo-600" />
                    Submissions & Grading Centre
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{totalPending} submissions awaiting your grade</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {(["ALL", "SUBMITTED", "GRADED", "PENDING"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setSubmissionFilter(f)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        submissionFilter === f ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {f === "ALL" ? "All" : f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by student, assignment, or class..."
                  value={assignmentSearch}
                  onChange={(e) => setAssignmentSearch(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              {/* Submissions table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Assignment</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">Submitted</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Grade / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-semibold text-slate-800">{sub.studentName}</td>
                        <td className="py-3 px-4 text-slate-700 max-w-[200px]">
                          <span className="block truncate" title={sub.assignmentTitle}>{sub.assignmentTitle}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{sub.className.split(":")[0]}</td>
                        <td className="py-3 px-4 text-slate-400">{sub.submittedAt}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sub.status === "GRADED"    ? "bg-emerald-100 text-emerald-800" :
                            sub.status === "SUBMITTED" ? "bg-blue-100 text-blue-800" :
                                                        "bg-slate-100 text-slate-600"
                          }`}>{sub.status}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {sub.status === "GRADED" ? (
                            <span className="font-bold text-slate-800">{sub.grade}/{sub.maxScore}</span>
                          ) : sub.status === "SUBMITTED" ? (
                            gradingId === sub.id ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <input
                                  type="number"
                                  min={0}
                                  max={sub.maxScore}
                                  value={gradeInput}
                                  onChange={(e) => setGradeInput(e.target.value)}
                                  placeholder={`/ ${sub.maxScore}`}
                                  className="w-20 rounded-lg border border-indigo-300 px-2 py-1 text-xs text-center focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                  autoFocus
                                />
                                <button onClick={() => handleSubmitGrade(sub.id)} className="rounded-lg bg-emerald-600 text-white px-2 py-1 hover:bg-emerald-700 transition">
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => setGradingId(null)} className="rounded-lg bg-slate-200 text-slate-600 px-2 py-1 hover:bg-slate-300 transition">
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setGradingId(sub.id); setGradeInput(""); }}
                                className="rounded-lg bg-indigo-50 text-indigo-700 px-3 py-1.5 font-bold hover:bg-indigo-100 transition inline-flex items-center gap-1"
                              >
                                <Pencil className="h-3 w-3" />
                                Grade
                              </button>
                            )
                          ) : (
                            <span className="text-slate-400 italic">Not submitted</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredSubmissions.length === 0 && (
                  <div className="text-center py-10 text-slate-400 text-sm">No submissions found.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 5 — ANALYTICS
        ══════════════════════════════════════════════════════ */}
        {activeTab === "ANALYTICS" && (
          <div className="space-y-6">

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Students", value: totalStudents, icon: Users, color: "blue", trend: "+4 this month" },
                { label: "Avg Attendance", value: `${avgAtt}%`, icon: UserCheck, color: "emerald", trend: "+1.2% vs last month" },
                { label: "Assignments Graded", value: submissions.filter((s) => s.status === "GRADED").length, icon: FileCheck, color: "indigo", trend: "This semester" },
                { label: "AI Quizzes Built", value: 12, icon: Brain, color: "amber", trend: "Since Sep 2026" },
              ].map(({ label, value, icon: Icon, color, trend }) => (
                <div key={label} className={`rounded-2xl bg-white border border-slate-200/80 shadow-xs p-5 space-y-3`}>
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-${color}-50 text-${color}-600`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">{value}</div>
                    <div className="text-xs font-semibold text-slate-600">{label}</div>
                    <div className={`text-[11px] text-${color}-600 mt-1 font-medium`}>{trend}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Class performance breakdown */}
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-6 space-y-5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-600" />
                Class-wise Performance Overview
              </h3>
              <div className="space-y-4">
                {classes.map((cls) => {
                  const graded = submissions.filter((s) => s.className === cls.name && s.status === "GRADED");
                  const avgGrade = graded.length
                    ? Math.round(graded.reduce((a, s) => a + (s.grade || 0), 0) / graded.length)
                    : null;
                  return (
                    <div key={cls.id} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{cls.name}</span>
                        <div className="flex items-center gap-4 text-slate-500">
                          <span>{cls.studentCount} students</span>
                          {avgGrade !== null && <span className="font-bold text-indigo-700">Avg Grade: {avgGrade}%</span>}
                        </div>
                      </div>
                      {/* Attendance bar */}
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 w-20 shrink-0">Attendance</span>
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${cls.avgAttendance >= 95 ? "bg-emerald-500" : "bg-amber-500"}`}
                            style={{ width: `${cls.avgAttendance}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-700 w-10 text-right">{cls.avgAttendance}%</span>
                      </div>
                      {avgGrade !== null && (
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-400 w-20 shrink-0">Avg Grade</span>
                          <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${avgGrade}%` }} />
                          </div>
                          <span className="text-xs font-bold text-slate-700 w-10 text-right">{avgGrade}%</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top students leaderboard */}
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                Top Students This Month
              </h3>
              <div className="space-y-3">
                {mockEnrolledStudents.map((s, i) => {
                  const grade = [96, 94, 92, 89, 87, 85][i] ?? 80;
                  const att = [100, 97, 95, 93, 90, 88][i] ?? 85;
                  return (
                    <div key={s.id} className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold ${i === 0 ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-100"}`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black ${i === 0 ? "bg-amber-400 text-white" : i === 1 ? "bg-slate-300 text-slate-700" : i === 2 ? "bg-amber-200 text-amber-800" : "bg-slate-100 text-slate-500"}`}>
                          {i + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-800">{s.name}</div>
                          <div className="text-[10px] text-slate-500">{s.grade}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <div className="font-bold text-indigo-700">{grade}%</div>
                          <div className="text-[10px] text-slate-400">Avg Grade</div>
                        </div>
                        <div>
                          <div className={`font-bold ${att >= 95 ? "text-emerald-700" : "text-amber-700"}`}>{att}%</div>
                          <div className="text-[10px] text-slate-400">Attendance</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* At-risk students alert */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 space-y-3">
              <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                Students Needing Attention
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mockEnrolledStudents.slice(4).map((s) => (
                  <div key={s.id} className="flex items-center justify-between bg-white rounded-xl border border-rose-100 p-3">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{s.name}</p>
                      <p className="text-[11px] text-rose-600 mt-0.5">Attendance below 90% • 2 missing submissions</p>
                    </div>
                    <a href="/chat?role=TEACHER" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" /> Message
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── Modals ── */}
      <QuizGeneratorModal isOpen={isQuizModalOpen} onClose={() => setQuizModalOpen(false)} role="TEACHER" />
      <CreateClassModal
        isOpen={isCreateClassOpen}
        onClose={() => setCreateClassOpen(false)}
        onClassCreated={(newClass) => {
          setClasses((prev) => [...prev, { ...newClass, studentCount: 0, avgAttendance: 0, pendingAssignments: 0, subject: "General", teacherName }]);
        }}
      />
      <PostNoticeModal
        isOpen={isPostNoticeOpen}
        onClose={() => setPostNoticeOpen(false)}
        classes={classes}
        teacherName={teacherName}
        onNoticeCreated={(newNotice) => {
          setAnnouncements((prev) => [newNotice, ...prev]);
        }}
      />
      <ClassroomWorkspaceModal
        isOpen={Boolean(activeClassroomModal)}
        onClose={() => setActiveClassroomModal(null)}
        targetClass={activeClassroomModal}
        userRole="TEACHER"
        currentUserName={teacherName}
        currentUserId={currentUser?.id}
      />
    </div>
  );
}
