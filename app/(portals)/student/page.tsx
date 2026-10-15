"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import StudyPlanModal from "@/components/ai/StudyPlanModal";
import DoubtSolverModal from "@/components/ai/DoubtSolverModal";
import QuizGeneratorModal from "@/components/ai/QuizGeneratorModal";
import JoinClassModal from "@/components/enrollment/JoinClassModal";
import ClassroomWorkspaceModal from "@/components/classroom/ClassroomWorkspaceModal";
import { mockClasses, MockClass, mockAssignments } from "@/lib/mockData";
import {
  Flame,
  Award,
  BookOpen,
  Sparkles,
  HelpCircle,
  Brain,
  Clock,
  CheckCircle2,
  Calendar,
  Video,
  FileText,
  ChevronRight,
  Plus,
  KeyRound,
  Copy,
  Check,
  MessageSquare,
  Megaphone,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  Layers,
  GraduationCap,
  ShieldCheck,
  User,
  ArrowUpRight,
  ExternalLink,
  BookMarked,
  Bell,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface StudentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  gradeLevel?: string;
  streak?: number;
  points?: number;
  consistencyScore?: number;
  badges?: string[];
  studentLinkKey?: string;
}

export default function StudentPortal() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);
  const [enrolledClasses, setEnrolledClasses] = useState<MockClass[]>(mockClasses);
  const [activeTab, setActiveTab] = useState<"CLASSES" | "ASSIGNMENTS" | "ATTENDANCE" | "ACHIEVEMENTS">("CLASSES");
  const [assignmentFilter, setAssignmentFilter] = useState<"ALL" | "PENDING" | "SUBMITTED" | "GRADED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isStudyPlanOpen, setStudyPlanOpen] = useState(false);
  const [isDoubtOpen, setDoubtOpen] = useState(false);
  const [isQuizOpen, setQuizOpen] = useState(false);
  const [isJoinClassOpen, setJoinClassOpen] = useState(false);
  const [activeClassroomModal, setActiveClassroomModal] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Live stream notices
  const [notices, setNotices] = useState<any[]>([]);
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || !data.user) {
          router.push("/login?role=STUDENT");
        } else if (data.user.role !== "STUDENT") {
          const target = data.user.role === "TEACHER" ? "/teacher" : "/parent";
          router.push(target);
        } else {
          setCurrentUser(data.user);
        }
      })
      .catch(() => router.push("/login?role=STUDENT"));

    // Fetch live stream notices
    fetch("/api/classes/stream?classId=all")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.notices)) {
          setNotices(data.notices);
        }
      })
      .catch((err) => console.error("Failed to load student stream notices:", err));
  }, [router]);

  const studentName = currentUser?.name || "Student";
  const studentEmail = currentUser?.email || "student@edunexus.edu";
  const studentGrade = currentUser?.gradeLevel || "Grade 11 - STEM Track";
  const studentStreak = currentUser?.streak ?? 5;
  const studentPoints = currentUser?.points ?? 1250;
  const studentConsistency = currentUser?.consistencyScore ?? 94;
  const studentBadges = currentUser?.badges ?? ["Fast Learner", "Physics Ace", "Streak Champion", "Top 5% Quiz"];
  const studentLinkKey = currentUser?.studentLinkKey || `LINK-${(currentUser?.name?.split(" ")[0] || "STUDENT").toUpperCase()}-88`;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(studentLinkKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const filteredClasses = enrolledClasses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAssignments = mockAssignments.filter((a) => {
    if (assignmentFilter !== "ALL" && a.status !== assignmentFilter) return false;
    return (
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.className.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const attendanceData = [
    { subject: "AP Physics: Mechanics", present: 28, total: 30, percentage: 93, status: "Good Standing" },
    { subject: "Advanced Chemistry & Lab", present: 29, total: 30, percentage: 97, status: "Excellent" },
    { subject: "Calculus BC & Analysis", present: 30, total: 30, percentage: 100, status: "Perfect" },
    { subject: "Computer Science Principles", present: 27, total: 28, percentage: 96, status: "Excellent" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── 1. Hero / Student Identity & Gamification Card ──────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* User Bio */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                  <GraduationCap className="h-3.5 w-3.5 text-blue-300" />
                  <span>Student Portal</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                  <ShieldCheck className="h-3 w-3" />
                  {studentGrade}
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome back, {studentName}!
                </h1>
                <p className="text-blue-100 text-sm mt-1 max-w-xl">
                  Track your courses, complete assignments, clear tricky concepts with AI, and maintain your academic streak.
                </p>
              </div>

              {/* Student Parent Link Key snippet */}
              <div className="inline-flex items-center gap-2 rounded-xl bg-black/30 border border-white/10 px-3.5 py-2 text-xs backdrop-blur-md">
                <KeyRound className="h-3.5 w-3.5 text-amber-300" />
                <span className="text-blue-200">Parent Link Key:</span>
                <span className="font-mono font-bold text-white tracking-wider">{studentLinkKey}</span>
                <button
                  onClick={handleCopyKey}
                  className="ml-1 p-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition"
                  title="Copy link key for parents"
                >
                  {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Gamification Strip */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0">
              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-amber-300 font-black text-xl sm:text-2xl">
                  <Flame className="h-6 w-6 fill-amber-300" />
                  {studentStreak}
                </div>
                <span className="text-[11px] font-medium text-blue-200">Day Streak</span>
              </div>
              <div className="h-10 w-px bg-white/20 my-auto" />
              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-purple-200 font-black text-xl sm:text-2xl">
                  <Award className="h-6 w-6 text-purple-300" />
                  {studentPoints}
                </div>
                <span className="text-[11px] font-medium text-blue-200">Total XP</span>
              </div>
              <div className="h-10 w-px bg-white/20 my-auto" />
              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-emerald-300 font-black text-xl sm:text-2xl">
                  <TrendingUp className="h-5 w-5" />
                  {studentConsistency}%
                </div>
                <span className="text-[11px] font-medium text-blue-200">Consistency</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. AI Learning & Study Tools Quick Launchers ─────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              AI Learning & Mastery Tools
            </h2>
            <span className="text-[11px] font-medium text-slate-400">Available 24/7 on-demand</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Study Plan */}
            <button
              onClick={() => setStudyPlanOpen(true)}
              className="flex items-start gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition text-left group"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:scale-105 transition">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">
                    Adaptive Study Plan
                  </h3>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">AI</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Generate milestone roadmaps, revision schedules, and exam readiness checkpoints.
                </p>
              </div>
            </button>

            {/* 2. Doubt Resolver */}
            <button
              onClick={() => setDoubtOpen(true)}
              className="flex items-start gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:border-violet-400 hover:shadow-md transition text-left group"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 border border-violet-100 group-hover:scale-105 transition">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-violet-600 transition">
                    24/7 Doubt Resolver
                  </h3>
                  <span className="text-[10px] font-bold bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded">AI Tutor</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Stuck on complex homework? Get step-by-step conceptual hints and formulas.
                </p>
              </div>
            </button>

            {/* 3. AI Quiz Practice */}
            <button
              onClick={() => setQuizOpen(true)}
              className="flex items-start gap-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition text-left group"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 group-hover:scale-105 transition">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition">
                    Interactive AI Quizzes
                  </h3>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">+50 XP</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Generate scenario-based practice tests to prepare for upcoming unit exams.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* ── 2.5 Live Faculty Notices & Announcements ─────────────────────── */}
        {notices.length > 0 && (
          <div className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Megaphone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    Faculty Notices & Announcements
                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      {notices.length} Live
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Official syllabus, lab, and schedule updates broadcast by your teachers</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {notices.slice(0, 4).map((notice) => {
                const isExpanded = expandedNoticeId === notice.id;
                const isUrgent = notice.priority === "HIGH";
                return (
                  <div
                    key={notice.id}
                    className={`rounded-2xl border p-4 transition space-y-2.5 ${
                      isUrgent
                        ? "bg-rose-50/40 border-rose-200/80 shadow-2xs"
                        : "bg-slate-50/60 border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="inline-block text-[10px] font-bold text-indigo-700 bg-white border border-indigo-100 px-2 py-0.5 rounded-md">
                          {notice.className || "Class Broadcast"}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{notice.title}</h4>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          notice.priority === "HIGH"
                            ? "bg-rose-100 text-rose-700 border border-rose-200"
                            : notice.priority === "MEDIUM"
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {notice.priority || "INFO"}
                      </span>
                    </div>

                    <p className={`text-xs text-slate-600 leading-relaxed whitespace-pre-line ${isExpanded ? "" : "line-clamp-2"}`}>
                      {notice.content}
                    </p>

                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 text-[10px]">
                      <span className="text-slate-400">
                        {notice.authorName} • {notice.createdAt ? new Date(notice.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent"}
                      </span>
                      <button
                        onClick={() => setExpandedNoticeId(isExpanded ? null : notice.id)}
                        className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                      >
                        <span>{isExpanded ? "Show Less" : "Read Full"}</span>
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 3. Main Dashboard Content with Navigation Tabs ───────────────────── */}
        <div className="space-y-6">
          {/* Navigation Bar for Dashboard Sections */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab("CLASSES")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "CLASSES"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>My Classes ({enrolledClasses.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("ASSIGNMENTS")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "ASSIGNMENTS"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Assignments & Work</span>
              </button>

              <button
                onClick={() => setActiveTab("ATTENDANCE")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "ATTENDANCE"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Attendance Log</span>
              </button>

              <button
                onClick={() => setActiveTab("ACHIEVEMENTS")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "ACHIEVEMENTS"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Award className="h-3.5 w-3.5" />
                <span>Badges & XP</span>
              </button>
            </div>

            {/* Quick Actions / Join Class Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setJoinClassOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-bold hover:bg-slate-800 transition shadow-sm"
              >
                <Plus className="h-3.5 w-3.5 text-blue-400" />
                <span>Join Class with Code</span>
              </button>
            </div>
          </div>

          {/* ── TAB 1: MY CLASSES & GOOGLE CLASSROOM WORKSPACE ── */}
          {activeTab === "CLASSES" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="rounded-lg bg-blue-50 border border-blue-100 px-2.5 py-1 text-xs font-mono font-bold text-blue-700">
                        {cls.code}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active Enrolled
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900">{cls.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Instructor: <span className="font-semibold text-slate-700">{cls.teacherName}</span>
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>{cls.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                        <span>{cls.room}</span>
                      </div>
                    </div>
                  </div>

                  {/* Classroom Actions */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                    <button
                      onClick={() => setActiveClassroomModal(cls)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
                    >
                      <Megaphone className="h-3.5 w-3.5" />
                      Open Google Classroom Stream
                    </button>
                    <a
                      href={`/chat?role=STUDENT&channel=direct-${currentUser?.id || "student-101"}-${cls.id}`}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
                      Chat with Instructor
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── TAB 2: ASSIGNMENTS & HOMEWORK PIPELINE ── */}
          {activeTab === "ASSIGNMENTS" && (
            <div className="space-y-6">
              {/* Assignment Filter Pills */}
              <div className="flex items-center gap-2 pb-2">
                {(["ALL", "PENDING", "SUBMITTED", "GRADED"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAssignmentFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      assignmentFilter === filter
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {filter === "ALL" ? "All Assignments" : filter}
                  </button>
                ))}
              </div>

              {/* Assignment Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAssignments.map((asg) => (
                  <div
                    key={asg.id}
                    className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                          {asg.className}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            asg.status === "PENDING"
                              ? "bg-amber-100 text-amber-800"
                              : asg.status === "SUBMITTED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {asg.status === "GRADED" ? `Graded: ${asg.grade}/${asg.maxScore}` : asg.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900">{asg.title}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" /> Due Date: {asg.dueDate} • Max {asg.maxScore} points
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          const target = enrolledClasses.find((c) => c.name === asg.className) || enrolledClasses[0];
                          setActiveClassroomModal(target);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                      >
                        <span>View in Classwork</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-[11px] text-slate-400">
                        {asg.status === "PENDING" ? "Action Required" : "Completed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 3: ATTENDANCE LOG & SUMMARY ── */}
          {activeTab === "ATTENDANCE" && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Official Attendance Register</h3>
                    <p className="text-xs text-slate-500">Live synchronized records from classroom instructor roll-calls</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      Overall Attendance: 96.5%
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-y border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Course / Subject</th>
                        <th className="px-4 py-3">Classes Attended</th>
                        <th className="px-4 py-3">Attendance Rate</th>
                        <th className="px-4 py-3">Academic Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {attendanceData.map((row) => (
                        <tr key={row.subject} className="hover:bg-slate-50/80 transition">
                          <td className="px-4 py-3.5 font-bold text-slate-900">{row.subject}</td>
                          <td className="px-4 py-3.5">
                            {row.present} of {row.total} sessions
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    row.percentage >= 95 ? "bg-emerald-500" : "bg-blue-500"
                                  }`}
                                  style={{ width: `${row.percentage}%` }}
                                />
                              </div>
                              <span className="font-bold text-slate-800">{row.percentage}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              <Check className="h-3 w-3" />
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 4: ACHIEVEMENTS, XP & BADGES ── */}
          {activeTab === "ACHIEVEMENTS" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Badges Earned */}
              <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    Unlocked Academic Achievements
                  </h3>
                  <p className="text-xs text-slate-500">Badges earned through consistent practice, quiz scores, and assignments</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {studentBadges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/50 to-white p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 text-lg">
                        🏆
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{badge}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Awarded for high consistency & top quiz scores</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Class Leaderboard Preview */}
              <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Weekly Class Leaderboard
                </h3>

                <div className="space-y-2.5">
                  {[
                    { rank: 1, name: "Liam Chen", xp: 1420, current: false },
                    { rank: 2, name: studentName, xp: studentPoints, current: true },
                    { rank: 3, name: "Sophia Martinez", xp: 1180, current: false },
                    { rank: 4, name: "Lucas Garcia", xp: 950, current: false },
                  ].map((entry) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold ${
                        entry.current
                          ? "bg-blue-50 border-blue-200 text-blue-900"
                          : "bg-slate-50 border-slate-100 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-black text-xs text-slate-400 w-4">{entry.rank}</span>
                        <span>{entry.name} {entry.current && "(You)"}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">{entry.xp} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Modals & Dialogs ─────────────────────────────────────────────────── */}
      <StudyPlanModal isOpen={isStudyPlanOpen} onClose={() => setStudyPlanOpen(false)} />
      <DoubtSolverModal isOpen={isDoubtOpen} onClose={() => setDoubtOpen(false)} />
      <QuizGeneratorModal isOpen={isQuizOpen} onClose={() => setQuizOpen(false)} role="STUDENT" />
      <JoinClassModal
        isOpen={isJoinClassOpen}
        onClose={() => setJoinClassOpen(false)}
        onClassJoined={(joinedClass) => {
          setEnrolledClasses((prev) => {
            if (prev.some((c) => c.code === joinedClass.code)) return prev;
            return [...prev, joinedClass];
          });
        }}
      />
      <ClassroomWorkspaceModal
        isOpen={Boolean(activeClassroomModal)}
        onClose={() => setActiveClassroomModal(null)}
        targetClass={activeClassroomModal}
        userRole="STUDENT"
        currentUserName={studentName}
        currentUserId={currentUser?.id}
      />
    </div>
  );
}
