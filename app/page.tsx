"use client";

import Link from "next/link";
import { useState } from "react";
import {
  GraduationCap,
  UserCheck,
  Users,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  BarChart3,
  MessageCircle,
  Bell,
  Star,
  Shield,
  Zap,
  Globe,
  ChevronRight,
  Menu,
  X,
  Brain,
  CalendarCheck,
  TrendingUp,
  Award,
  ClipboardList,
  HeartHandshake,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white scroll-smooth">
      {/* Ambient bg */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 15%, rgba(59,130,246,0.07) 0%, transparent 45%), radial-gradient(circle at 80% 85%, rgba(99,102,241,0.06) 0%, transparent 45%)",
        }}
      />

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Edu<span className="text-blue-400">Nexus</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            <button
              onClick={() => scrollTo("features")}
              className="px-3.5 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo("portals")}
              className="px-3.5 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Portals
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="px-3.5 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="px-3.5 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Contact
            </button>

            {/* Separator */}
            <span className="mx-2 h-4 w-px bg-white/10" />

            <Link
              href="/login?role=STUDENT"
              className="px-3.5 py-2 text-sm text-slate-400 hover:text-blue-400 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Students
            </Link>
            <Link
              href="/login?role=TEACHER"
              className="px-3.5 py-2 text-sm text-slate-400 hover:text-violet-400 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Teachers
            </Link>
            <Link
              href="/login?role=PARENT"
              className="px-3.5 py-2 text-sm text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Users className="h-3.5 w-3.5" />
              Parents
            </Link>
          </nav>

          {/* Right CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-sm"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0d0d14] px-4 py-4 space-y-1">
            {[
              { label: "Features", id: "features" },
              { label: "Portals", id: "portals" },
              { label: "About", id: "about" },
              { label: "Contact", id: "contact" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-white/5 space-y-1">
              <Link href="/login?role=STUDENT" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-blue-400 hover:bg-white/5 rounded-lg">
                <GraduationCap className="h-4 w-4" /> Student Sign In
              </Link>
              <Link href="/login?role=TEACHER" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-violet-400 hover:bg-white/5 rounded-lg">
                <UserCheck className="h-4 w-4" /> Teacher Sign In
              </Link>
              <Link href="/login?role=PARENT" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-emerald-400 hover:bg-white/5 rounded-lg">
                <Users className="h-4 w-4" /> Parent Sign In
              </Link>
            </div>
            <div className="pt-2 flex gap-2">
              <Link href="/login" className="flex-1 text-center py-2.5 text-sm font-medium border border-white/10 rounded-lg text-slate-300 hover:text-white hover:bg-white/5">Sign In</Link>
              <Link href="/signup" className="flex-1 text-center py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500">Get Started</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-36 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-xs font-medium text-blue-400 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          Now available for schools worldwide
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
          The smarter way to{" "}
          <span className="text-blue-400">manage education</span>
        </h1>

        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
          EduNexus brings students, teachers, and parents onto one intelligent platform — with AI-powered learning tools, real-time communication, and actionable progress insights.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          <Link
            href="/login?role=STUDENT"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
          >
            Student Sign In <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login?role=TEACHER"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
          >
            Teacher Sign In
          </Link>
          <Link
            href="/login?role=PARENT"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
          >
            Parent Sign In
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> No credit card required</span>
          <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-emerald-500" /> FERPA compliant</span>
          <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> Trusted by 500+ schools</span>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50,000+", label: "Active Students" },
              { value: "3,200+", label: "Educators" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "120+", label: "Partner Schools" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">Platform Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything you need, built in</h2>
          <p className="text-slate-400 max-w-xl mx-auto">One platform that replaces ten fragmented tools. Designed for modern schools and institutions.</p>
        </div>

        {/* Feature rows */}
        <div className="space-y-6">
          {/* Row 1 — 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: Brain,
                color: "text-amber-400",
                border: "border-amber-500/20",
                bg: "bg-amber-500/8",
                title: "AI Study Plans",
                desc: "Personalized multi-week learning roadmaps generated from each student's performance data, goals, and available study hours.",
              },
              {
                icon: MessageCircle,
                color: "text-blue-400",
                border: "border-blue-500/20",
                bg: "bg-blue-500/8",
                title: "Real-Time Messaging",
                desc: "Live one-on-one and group chat rooms between students, teachers, and parents. Ask doubts, get answers — instantly.",
              },
              {
                icon: BarChart3,
                color: "text-violet-400",
                border: "border-violet-500/20",
                bg: "bg-violet-500/8",
                title: "Progress Analytics",
                desc: "Detailed grade tracking, consistency scores, attendance trends, and XP streaks — all in one visual dashboard.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/6 bg-white/[0.025] p-6 hover:bg-white/[0.04] transition-colors">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${f.border} ${f.bg} mb-4`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Row 2 — 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: CalendarCheck,
                color: "text-emerald-400",
                border: "border-emerald-500/20",
                bg: "bg-emerald-500/8",
                title: "Smart Attendance",
                desc: "One-click attendance registers for teachers. Parents get instant alerts for absences. Students see their own attendance history.",
              },
              {
                icon: ClipboardList,
                color: "text-rose-400",
                border: "border-rose-500/20",
                bg: "bg-rose-500/8",
                title: "Assignment & Homework",
                desc: "Teachers assign, students submit, parents monitor. Complete lifecycle from posting to grading with AI-assisted scoring support.",
              },
              {
                icon: Award,
                color: "text-amber-400",
                border: "border-amber-500/20",
                bg: "bg-amber-500/8",
                title: "Gamification & Badges",
                desc: "Daily learning streaks, XP points, unlockable achievement badges, and leaderboards to keep students motivated and engaged.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/6 bg-white/[0.025] p-6 hover:bg-white/[0.04] transition-colors">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${f.border} ${f.bg} mb-4`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Row 3 — 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: BookOpen,
                color: "text-sky-400",
                border: "border-sky-500/20",
                bg: "bg-sky-500/8",
                title: "Classroom Management",
                desc: "Create virtual classrooms with join codes, post announcements, share resources, and manage enrolments — all from one view.",
              },
              {
                icon: Bell,
                color: "text-fuchsia-400",
                border: "border-fuchsia-500/20",
                bg: "bg-fuchsia-500/8",
                title: "Smart Notifications",
                desc: "Timely alerts for upcoming assignments, attendance anomalies, new messages, grade updates, and important announcements.",
              },
              {
                icon: Shield,
                color: "text-slate-300",
                border: "border-white/10",
                bg: "bg-white/5",
                title: "Secure & Compliant",
                desc: "Role-based access control with encrypted JWT sessions. Every account strictly sees only the data they're authorised for.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/6 bg-white/[0.025] p-6 hover:bg-white/[0.04] transition-colors">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${f.border} ${f.bg} mb-4`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTALS ───────────────────────────────────────────── */}
      <section id="portals" className="relative z-10 border-t border-white/5 bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">Dedicated Portals</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Built for every stakeholder</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Three purpose-built experiences, each tailored to the unique needs of students, educators, and parents.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Link
              href="/login?role=STUDENT"
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-transparent p-8 hover:border-blue-500/30 hover:from-blue-500/[0.06] transition-all duration-300"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20 mb-6">
                <GraduationCap className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Student Portal</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">Personalized learning paths, AI tutoring, assignment tracking, and gamified progress to keep students engaged.</p>
              <ul className="space-y-2.5 mb-8">
                {["Adaptive AI study plans", "24/7 doubt resolution", "Assignment & grade tracker", "Learning streaks & badges"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-blue-400 group-hover:gap-2.5 transition-all">
                Access Student Portal <ChevronRight className="h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/login?role=TEACHER"
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-transparent p-8 hover:border-violet-500/30 hover:from-violet-500/[0.06] transition-all duration-300"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/10 border border-violet-500/20 mb-6">
                <UserCheck className="h-5 w-5 text-violet-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Teacher Portal</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">Powerful classroom management tools — from one-click attendance and AI quiz generation to real-time doubt resolution.</p>
              <ul className="space-y-2.5 mb-8">
                {["Smart attendance register", "AI-generated assessments", "Classroom doubt hub", "Assignment scoring & feedback"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-violet-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-violet-400 group-hover:gap-2.5 transition-all">
                Access Teacher Portal <ChevronRight className="h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/login?role=PARENT"
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-transparent p-8 hover:border-emerald-500/30 hover:from-emerald-500/[0.06] transition-all duration-300"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600/10 border border-emerald-500/20 mb-6">
                <Users className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Parent Portal</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">Stay connected with your child's academic journey — attendance, grades, progress scores, and teacher communication.</p>
              <ul className="space-y-2.5 mb-8">
                {["Live attendance monitoring", "Academic progress reports", "Direct teacher messaging", "AI growth recommendations"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400 group-hover:gap-2.5 transition-all">
                Access Parent Portal <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Loved by educators & families</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { quote: "EduNexus transformed how I manage my classroom. The AI quiz builder alone saves me hours every week.", name: "Dr. Sarah M.", role: "Senior Physics Teacher", rating: 5 },
            { quote: "I can finally see exactly where my son needs help. The progress insights are clear and genuinely useful.", name: "David Johnson", role: "Parent of Grade 11 Student", rating: 5 },
            { quote: "The doubt resolution feature is incredible. I get step-by-step answers instantly without waiting for class.", name: "Alex K.", role: "Grade 11 STEM Student", rating: 5 },
          ].map((t) => (
            <div key={t.name} className="rounded-2xl border border-white/6 bg-white/[0.025] p-6">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-5">"{t.quote}"</p>
              <div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────── */}
      <section id="about" className="relative z-10 border-t border-white/5 bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">About EduNexus</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                Built by educators,<br />for educators
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                EduNexus was founded with a simple belief: every student deserves a personalised learning experience, and every teacher deserves tools that actually save time. We built a platform that connects the entire school ecosystem in one place.
              </p>
              <p className="text-slate-400 leading-relaxed mb-8">
                From AI-powered doubt resolution that answers questions at 2 AM, to parent dashboards that surface exactly what matters — EduNexus is designed to reduce friction and increase outcomes for everyone involved in a child's education.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: TrendingUp, label: "Improved learning outcomes", val: "up 34%" },
                  { icon: HeartHandshake, label: "Parent-teacher engagement", val: "up 5×" },
                  { icon: Zap, label: "Time saved per teacher/week", val: "6 hrs" },
                  { icon: Award, label: "Student retention rate", val: "96%" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/6 bg-white/[0.03] p-4">
                    <item.icon className="h-4 w-4 text-blue-400 mb-2" />
                    <p className="text-xl font-bold text-white">{item.val}</p>
                    <p className="text-xs text-slate-500 leading-snug">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                { title: "Our Mission", body: "To democratise quality education management so that every school — regardless of size or budget — can give students, teachers, and parents the tools they deserve." },
                { title: "Our Approach", body: "We integrate AI intelligently: not to replace teachers, but to eliminate the repetitive work that prevents them from doing what they do best — teach." },
                { title: "Our Values", body: "Transparency, privacy, and student wellbeing are non-negotiable. Every feature we build is reviewed against the question: does this genuinely help learning?" },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/6 bg-white/[0.025] p-6">
                  <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 via-blue-600/5 to-transparent p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to transform your school?</h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-8">Join thousands of schools already using EduNexus to improve learning outcomes and strengthen communication across the entire school community.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">
              Create Free Account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────── */}
      <section id="contact" className="relative z-10 border-t border-white/5 bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">Get In Touch</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">We'd love to hear from you</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Whether you're a school administrator, a teacher, or a parent — our team is here to help.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact info */}
            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email Us", value: "hello@edunexus.edu", sub: "We reply within 24 hours" },
                { icon: Phone, label: "Call Us", value: "+1 (800) EDU-NEXUS", sub: "Mon–Fri, 9am–6pm IST" },
                { icon: MapPin, label: "Our Office", value: "EduNexus HQ, Tech Park, Bangalore", sub: "India — 560001" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-white/6 bg-white/[0.025] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 shrink-0">
                    <item.icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-0.5">{item.label}</p>
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                    <p className="text-xs text-slate-500">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact form */}
            <div className="rounded-2xl border border-white/6 bg-white/[0.025] p-7">
              <h3 className="text-base font-bold text-white mb-5">Send us a message</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="you@school.edu"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Role</label>
                  <select className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 transition-colors">
                    <option value="" className="bg-slate-900">Select your role</option>
                    <option value="admin" className="bg-slate-900">School Administrator</option>
                    <option value="teacher" className="bg-slate-900">Teacher</option>
                    <option value="parent" className="bg-slate-900">Parent</option>
                    <option value="student" className="bg-slate-900">Student</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us how we can help..."
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                  />
                </div>
                <button className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span className="text-base font-bold">Edu<span className="text-blue-400">Nexus</span></span>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                The unified education management platform connecting students, teachers, and parents through intelligent tools.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-xs text-slate-500">Available worldwide</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Product</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Features", onClick: true, id: "features" },
                  { label: "Portals", onClick: true, id: "portals" },
                  { label: "About", onClick: true, id: "about" },
                  { label: "Contact", onClick: true, id: "contact" },
                ].map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => scrollTo(l.id)}
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Portals</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Student Login", href: "/login?role=STUDENT" },
                  { label: "Teacher Login", href: "/login?role=TEACHER" },
                  { label: "Parent Login", href: "/login?role=PARENT" },
                  { label: "Create Account", href: "/signup" },
                ].map((l) => (
                  <li key={l.label}><Link href={l.href} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Company</p>
              <ul className="space-y-2.5">
                {["About", "Blog", "Careers", "Privacy Policy", "Terms of Service"].map((l) => (
                  <li key={l}><a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} EduNexus. All rights reserved.</p>
            <div className="flex items-center gap-5">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
                <a key={l} href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
