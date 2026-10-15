"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Calendar,
  BookOpen,
  Clock,
  CheckCircle2,
  Loader2,
  X,
  TrendingUp,
  Award,
  Download,
  Copy,
  Check,
  Layers,
  Zap,
  Target,
  BarChart2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { StudyPlanResult, TaskItem } from "@/lib/studyPlannerAlgo";

interface StudyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_SUBJECTS = [
  "AP Physics: Mechanics",
  "Calculus BC & Vectors",
  "Organic Chemistry",
  "Computer Science: Data Structures",
  "AP Biology: Cell & Genetics",
];

export default function StudyPlanModal({ isOpen, onClose }: StudyPlanModalProps) {
  const [subject, setSubject] = useState("AP Physics: Mechanics");
  const [targetGoal, setTargetGoal] = useState("Master Newton's Laws & Score >90% on Unit Exam");
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [durationWeeks, setDurationWeeks] = useState(3);
  const [currentProficiency, setCurrentProficiency] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">("INTERMEDIATE");

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StudyPlanResult | null>(null);
  const [activeWeekTab, setActiveWeekTab] = useState(1);
  const [copiedSchedule, setCopiedSchedule] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!subject.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          targetGoal,
          weeklyHours,
          durationWeeks,
          currentProficiency,
        }),
      });
      const data = await res.json();
      if (data.success && data.plan) {
        setPlan(data.plan);
        setActiveWeekTab(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompleted = (weekNumber: number, taskId: string) => {
    if (!plan) return;
    setPlan((prevPlan) => {
      if (!prevPlan) return null;
      const updatedModules = prevPlan.modules.map((mod) => {
        if (mod.weekNumber !== weekNumber) return mod;
        const updatedTasks = mod.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        return { ...mod, tasks: updatedTasks };
      });
      return { ...prevPlan, modules: updatedModules };
    });
  };

  const calculateTotalProgress = () => {
    if (!plan) return 0;
    let total = 0;
    let completed = 0;
    plan.modules.forEach((m) => {
      m.tasks.forEach((t) => {
        total++;
        if (t.completed) completed++;
      });
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const handleCopySchedule = () => {
    if (!plan) return;
    let text = `# ${plan.title}\nTarget Goal: ${plan.targetGoal}\nTotal Hours: ${plan.totalStudyHours} hrs (${plan.weeklyHours} hrs/week across ${plan.durationWeeks} weeks)\nProjected Readiness: ${plan.projectedReadiness}%\n\n`;

    plan.modules.forEach((m) => {
      text += `## Week ${m.weekNumber}: ${m.focusArea} (${m.totalHours} hrs)\nTheme: ${m.theme}\n`;
      m.tasks.forEach((t) => {
        text += `- [${t.completed ? "x" : " "}] (${t.estimatedMinutes}m) [${t.type}] ${t.title} - ${t.notes || ""}\n`;
      });
      text += `Milestone: ${m.milestoneCheck}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedSchedule(true);
    setTimeout(() => setCopiedSchedule(false), 2000);
  };

  const progressPercent = calculateTotalProgress();
  const currentModule = plan?.modules.find((m) => m.weekNumber === activeWeekTab) || plan?.modules[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-slate-100 p-6 sm:p-8 max-h-[92vh] overflow-y-auto flex flex-col justify-between">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Adaptive AI Study Planning Engine
                </h2>
                <span className="text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">
                  Algo v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Spaced repetition, cognitive load balancing & milestone decomposition
              </p>
            </div>
          </div>

          {/* Configuration Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
            {/* Subject input */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Subject / Course Name *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. AP Physics, Organic Chemistry"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 focus:border-purple-500 focus:outline-none"
              />
              {/* Quick suggestion chips */}
              <div className="flex flex-wrap gap-1 pt-1">
                {PRESET_SUBJECTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSubject(s)}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition ${
                      subject === s
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {s.split(":")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Goal */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Target Academic Milestone *</label>
              <input
                type="text"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                placeholder="e.g. Score >90% on Final Exam"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Duration Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Duration</label>
                <span className="text-xs font-mono font-bold text-purple-700">{durationWeeks} Weeks</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            {/* Weekly Hours */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Weekly Time</label>
                <span className="text-xs font-mono font-bold text-purple-700">{weeklyHours} hrs/week</span>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            {/* Proficiency */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Current Proficiency Baseline</label>
              <div className="grid grid-cols-3 gap-2">
                {(["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setCurrentProficiency(lvl)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition ${
                      currentProficiency === lvl
                        ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Action Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !subject.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 py-3 text-xs font-bold text-white shadow-md hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Decomposing Curriculum & Generating Spaced Roadmap...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Adaptive Study Roadmap & Schedule</span>
              </>
            )}
          </button>

          {/* ── Generated Algorithmic Plan Display ────────────────────────── */}
          {plan && (
            <div className="space-y-6 pt-2">
              {/* Algorithm Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gradient-to-r from-purple-900 to-indigo-950 p-4 sm:p-5 rounded-2xl text-white shadow-md">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Exam Readiness</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-emerald-400">{plan.projectedReadiness}%</span>
                    <span className="text-[11px] text-purple-200">(from {plan.initialReadiness}%)</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Total Commitment</span>
                  <p className="text-xl font-black text-white">{plan.totalStudyHours} Hours</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Daily Target</span>
                  <p className="text-sm font-bold text-purple-200 mt-1">{plan.dailyRecommendation}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Live Progress</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-white/20 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full transition-all" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <span className="text-xs font-bold text-emerald-300">{progressPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Cognitive Load Breakdown Pills */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-purple-600" />
                  Cognitive Allocation:
                </span>
                <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                  <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                    📖 Theory: {plan.cognitivePillars.theoryHours}h (30%)
                  </span>
                  <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                    ⚡ Drills: {plan.cognitivePillars.practiceHours}h (40%)
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    📝 Mocks: {plan.cognitivePillars.mockHours}h (20%)
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                    🔍 Review: {plan.cognitivePillars.reviewHours}h (10%)
                  </span>
                </div>
              </div>

              {/* Week Modules Tabs */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {plan.modules.map((m) => (
                      <button
                        key={m.weekNumber}
                        onClick={() => setActiveWeekTab(m.weekNumber)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                          activeWeekTab === m.weekNumber
                            ? "bg-purple-600 text-white shadow-xs"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Week {m.weekNumber}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleCopySchedule}
                    className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl hover:bg-purple-100 transition"
                  >
                    {copiedSchedule ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedSchedule ? "Copied!" : "Copy Schedule"}</span>
                  </button>
                </div>

                {/* Active Week Task Checklist */}
                {currentModule && (
                  <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700">
                          {currentModule.theme}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900">{currentModule.focusArea}</h4>
                      </div>
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                        {currentModule.totalHours} Study Hours Scheduled
                      </span>
                    </div>

                    {/* Task checklist */}
                    <div className="space-y-2.5">
                      {currentModule.tasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => toggleTaskCompleted(currentModule.weekNumber, task.id)}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border transition cursor-pointer ${
                            task.completed
                              ? "bg-emerald-50/60 border-emerald-200 text-slate-500"
                              : "bg-slate-50/60 border-slate-200 text-slate-900 hover:bg-slate-100/80"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => {}}
                            className="mt-0.5 h-4 w-4 rounded accent-emerald-600 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold ${
                                  task.completed ? "line-through text-slate-400" : "text-slate-900"
                                }`}
                              >
                                {task.title}
                              </span>
                              <span
                                className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                                  task.type === "THEORY"
                                    ? "bg-blue-100 text-blue-800"
                                    : task.type === "PRACTICE"
                                    ? "bg-amber-100 text-amber-800"
                                    : task.type === "ASSESSMENT"
                                    ? "bg-rose-100 text-rose-800"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {task.type}
                              </span>
                            </div>
                            {task.notes && (
                              <p className="text-[11px] text-slate-500 mt-0.5">{task.notes}</p>
                            )}
                          </div>
                          <span className="text-[11px] font-mono font-semibold text-slate-400 shrink-0">
                            {task.estimatedMinutes}m
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Milestone Checkpoint */}
                    <div className="flex items-center gap-2 rounded-xl bg-purple-50 border border-purple-200 p-3 text-xs text-purple-900 font-medium">
                      <Target className="h-4 w-4 text-purple-600 shrink-0" />
                      <span>
                        <strong className="font-bold">Week Milestone:</strong> {currentModule.milestoneCheck}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Pedagogical Advice */}
              {plan.aiPedagogicalAdvice && (
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-800 block mb-1">💡 Pedagogical Study Advice:</span>
                  {plan.aiPedagogicalAdvice}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
