"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import LinkChildModal from "@/components/enrollment/LinkChildModal";
import { mockUsers, mockAttendanceRecords } from "@/lib/mockData";
import {
  Users,
  Sparkles,
  TrendingUp,
  Award,
  Calendar,
  MessageSquare,
  Eye,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Plus,
} from "lucide-react";

export default function ParentPortal() {
  const router = useRouter();
  const parent = mockUsers.parent;
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeChild, setActiveChild] = useState<any>(parent.children[0]);
  const [isLinkChildOpen, setLinkChildOpen] = useState(false);
  const child = activeChild;

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || !data.user) {
          router.push("/login?role=PARENT");
        } else if (data.user.role !== "PARENT") {
          const target = data.user.role === "STUDENT" ? "/student" : "/teacher";
          router.push(target);
        } else {
          setCurrentUser(data.user);
        }
      })
      .catch(() => router.push("/login?role=PARENT"));
  }, [router]);

  const [loadingAI, setLoadingAI] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>({
    summary: `${child.name} is demonstrating strong academic consistency this term, ranking in the 90th percentile for homework punctuality and maintaining a stellar 96% attendance record.`,
    recommendation: `Encourage 30 minutes of targeted problem-solving review on physics kinetics before Wednesday's laboratory assessment.`,
    highlight: `Outstanding 14-day consecutive active learning streak!`,
  });

  const parentName = currentUser?.name || parent.name;

  const handleRefreshAI = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch("/api/ai/parent-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: child.name,
          attendancePercent: child.attendanceRate,
          averageGrade: child.avgGrade,
          consistencyScore: child.consistencyScore,
        }),
      });
      const data = await res.json();
      if (data.success && data.insights) {
        setAiInsights(data.insights);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Parent Header */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-3">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Parent Guardian Oversight</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {parentName}
              </h1>
              <p className="text-emerald-100 text-sm mt-1">
                Monitoring progress for: <span className="font-bold text-white">{child.name}</span> ({child.grade})
              </p>
            </div>

            {/* Core Metrics & Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/20">
                <div className="text-center px-3">
                  <div className="text-xl sm:text-2xl font-bold text-emerald-300">
                    {child.consistencyScore}%
                  </div>
                  <div className="text-[11px] text-emerald-100">Consistency Score</div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-center px-3">
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {child.attendanceRate}%
                  </div>
                  <div className="text-[11px] text-emerald-100">Attendance</div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-center px-3">
                  <div className="text-xl sm:text-2xl font-bold text-amber-300">
                    {child.avgGrade}%
                  </div>
                  <div className="text-[11px] text-emerald-100">GPA Average</div>
                </div>
              </div>

              <button
                onClick={() => setLinkChildOpen(true)}
                className="flex items-center gap-2 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs px-4 py-3.5 shadow-lg transition"
              >
                <Plus className="h-4 w-4" />
                Link Child
              </button>
            </div>
          </div>
        </div>

        {/* AI Parent Academic Advisory Card */}
        <div className="rounded-2xl bg-white p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  AI Academic Growth Advisory
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time cognitive synthesis generated by Gemini from attendance and submission logs
                </p>
              </div>
            </div>

            <button
              onClick={handleRefreshAI}
              disabled={loadingAI}
              className="flex items-center gap-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-2 text-xs font-bold hover:bg-emerald-100 transition disabled:opacity-50"
            >
              {loadingAI ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              Re-Analyze with Gemini
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="md:col-span-2 rounded-xl bg-emerald-50/40 p-4 border border-emerald-100/60">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1.5">
                Executive Synthesis
              </h4>
              <p className="text-xs leading-relaxed text-slate-700">{aiInsights.summary}</p>
              <div className="mt-3 pt-3 border-t border-emerald-100/80">
                <span className="text-xs font-semibold text-emerald-900 block mb-1">
                  💡 Actionable Guidance for Parents:
                </span>
                <p className="text-xs text-slate-600">{aiInsights.recommendation}</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Key Milestone Highlight
              </h4>
              <div className="flex items-start gap-2.5">
                <Award className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-slate-800">{aiInsights.highlight}</p>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                Verified across 14 class sessions and 3 graded labs.
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column: Attendance Records & Teacher Communication */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Attendance Logs */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600" />
                Verified Attendance History
              </h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                96% Present Rate
              </span>
            </div>

            <div className="space-y-2">
              {mockAttendanceRecords.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-800 block">{rec.className}</span>
                    <span className="text-[11px] text-slate-400">{rec.date}</span>
                  </div>
                  <span
                    className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                      rec.status === "PRESENT"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Contact & Read-Only Observation */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              Teacher Connection & Observation
            </h3>

            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Dr. Sarah Mitchell</h4>
                  <p className="text-[11px] text-slate-500">AP Physics: Mechanics Teacher</p>
                </div>
                <a
                  href="/chat?role=PARENT&channel=direct-parent-teacher"
                  className="rounded-lg bg-blue-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-blue-700 transition inline-flex items-center gap-1"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Message Dr. Mitchell
                </a>
              </div>
              <p className="text-xs text-slate-600 italic">
                "Alex showed great initiative during this morning's lab on rotational torque."
              </p>
            </div>

            {/* Read-Only Observation Mode */}
            <div className="rounded-xl border border-slate-200 p-4 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-slate-500" />
                  Read-Only Virtual Class Observation
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Attend ongoing virtual sessions quietly without disrupting class microphones
                </p>
              </div>
              <button
                onClick={() => alert("Launching Read-Only Classroom Observation Window...")}
                className="rounded-lg bg-slate-100 text-slate-700 px-3 py-1.5 text-xs font-bold hover:bg-slate-200 transition"
              >
                Observe Class
              </button>
            </div>
          </div>
        </div>
      </main>

      <LinkChildModal
        isOpen={isLinkChildOpen}
        onClose={() => setLinkChildOpen(false)}
        onChildLinked={(newChild) => {
          if (newChild) setActiveChild(newChild);
        }}
      />
    </div>
  );
}
