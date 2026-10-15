"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Megaphone,
  BookOpen,
  Users,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  FileText,
  Copy,
  Check,
  Loader2,
  Sparkles,
  Calendar,
  Award,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

interface ClassroomWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetClass: any;
  userRole?: "STUDENT" | "TEACHER" | "PARENT";
  currentUserName?: string;
  currentUserId?: string;
}

export default function ClassroomWorkspaceModal({
  isOpen,
  onClose,
  targetClass,
  userRole = "STUDENT",
  currentUserName,
  currentUserId,
}: ClassroomWorkspaceModalProps) {
  const [activeTab, setActiveTab] = useState<"STREAM" | "CLASSWORK" | "PEOPLE">("STREAM");
  
  // Stream / Notices State
  const [notices, setNotices] = useState<any[]>([]);
  const [newNoticeTitle, setNewNoticeTitle] = useState("");
  const [newNoticeContent, setNewNoticeContent] = useState("");
  const [postingNotice, setPostingNotice] = useState(false);

  // Classwork / Homework State
  const [classwork, setClasswork] = useState<any[]>([]);
  const [isCreateHomeworkOpen, setCreateHomeworkOpen] = useState(false);
  const [hwTitle, setHwTitle] = useState("");
  const [hwType, setHwType] = useState<"HOMEWORK" | "ASSIGNMENT" | "LAB">("HOMEWORK");
  const [hwInstructions, setHwInstructions] = useState("");
  const [hwDueDate, setHwDueDate] = useState("Friday at 11:59 PM");
  const [hwPoints, setHwPoints] = useState(100);
  const [creatingHw, setCreatingHw] = useState(false);

  // Turn In / Submit State
  const [selectedHwToSubmit, setSelectedHwToSubmit] = useState<any>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submittingHw, setSubmittingHw] = useState(false);

  const [copiedCode, setCopiedCode] = useState(false);

  const classId = targetClass?.id || "cls-1";
  const className = targetClass?.name || "AP Physics: Mechanics";
  const teacherName = targetClass?.teacherName || "Dr. Sarah Mitchell";
  const classCode = targetClass?.code || "PHY-301";
  const schedule = targetClass?.schedule || "Mon, Wed, Fri - 10:00 AM";
  const room = targetClass?.room || "Room 402 / Lab 3";

  // Fetch Stream Notices & Classwork
  useEffect(() => {
    if (isOpen && classId) {
      fetchStreamNotices();
      fetchClasswork();
    }
  }, [isOpen, classId]);

  const fetchStreamNotices = async () => {
    try {
      const res = await fetch(`/api/classes/stream?classId=${classId}`);
      const data = await res.json();
      if (data.success && data.notices) {
        setNotices(data.notices);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClasswork = async () => {
    try {
      const res = await fetch(`/api/classes/classwork?classId=${classId}`);
      const data = await res.json();
      if (data.success && data.classwork) {
        setClasswork(data.classwork);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeContent.trim()) return;

    setPostingNotice(true);
    try {
      const res = await fetch("/api/classes/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId,
          title: newNoticeTitle.trim() || "📢 Class Notice & Update",
          content: newNoticeContent.trim(),
          authorName: userRole === "TEACHER" ? teacherName : (currentUserName || "Student User"),
          authorRole: userRole,
        }),
      });
      const data = await res.json();
      if (data.success && data.notice) {
        setNotices((prev) => [data.notice, ...prev]);
        setNewNoticeTitle("");
        setNewNoticeContent("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPostingNotice(false);
    }
  };

  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle.trim() || !hwInstructions.trim()) return;

    setCreatingHw(true);
    try {
      const res = await fetch("/api/classes/classwork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId,
          title: hwTitle,
          type: hwType,
          instructions: hwInstructions,
          dueDate: hwDueDate,
          maxPoints: hwPoints,
        }),
      });
      const data = await res.json();
      if (data.success && data.classwork) {
        setClasswork((prev) => [data.classwork, ...prev]);
        setHwTitle("");
        setHwInstructions("");
        setCreateHomeworkOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingHw(false);
    }
  };

  const handleSubmitHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHwToSubmit || !submissionText.trim()) return;

    setSubmittingHw(true);
    try {
      const res = await fetch("/api/classes/classwork", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classworkId: selectedHwToSubmit.id,
          studentId: currentUserId || "student-101",
          studentName: currentUserName || "Student User",
          content: submissionText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchClasswork();
        setSelectedHwToSubmit(null);
        setSubmissionText("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingHw(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(classCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full p-2 bg-black/20 text-white hover:bg-black/40 backdrop-blur-md transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Google Classroom Header Banner */}
        <div className="relative bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-2">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Google Classroom Workspace</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{className}</h1>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">
                Instructor: <span className="font-bold text-white">{teacherName}</span> • {room}
              </p>
            </div>

            {/* Class Code & Schedule Card */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 block">Class Code</span>
                <span className="text-base font-mono font-black text-white">{classCode}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
                title="Copy Class Code"
              >
                {copiedCode ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Google Classroom Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            onClick={() => setActiveTab("STREAM")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-xs font-bold transition-all ${
              activeTab === "STREAM"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Megaphone className="h-4 w-4" />
            Stream & Notices ({notices.length})
          </button>

          <button
            onClick={() => setActiveTab("CLASSWORK")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-xs font-bold transition-all ${
              activeTab === "CLASSWORK"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="h-4 w-4" />
            Classwork & Homework ({classwork.length})
          </button>

          <button
            onClick={() => setActiveTab("PEOPLE")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-xs font-bold transition-all ${
              activeTab === "PEOPLE"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="h-4 w-4" />
            People & Roster
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {/* 1. STREAM & NOTICES TAB */}
          {activeTab === "STREAM" && (
            <div className="space-y-6">
              {/* Teacher Announcement / Notice Form */}
              {(userRole === "TEACHER" || userRole === "STUDENT") && (
                <form
                  onSubmit={handlePostNotice}
                  className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                    <Megaphone className="h-4 w-4 text-blue-600" />
                    <span>Post Announcement or Notice to Class Stream</span>
                  </div>
                  <input
                    type="text"
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    placeholder="Announcement Title (e.g. Lab Safety Rules & Exam Schedule)"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    required
                    value={newNoticeContent}
                    onChange={(e) => setNewNoticeContent(e.target.value)}
                    placeholder="Announce something to your class..."
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium focus:border-blue-500 focus:outline-none resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={postingNotice || !newNoticeContent.trim()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {postingNotice ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      Post Notice to Stream
                    </button>
                  </div>
                </form>
              )}

              {/* Stream Feed Notices List */}
              <div className="space-y-4">
                {notices.map((n) => (
                  <div key={n.id} className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {n.authorName ? n.authorName[0] : "T"}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">{n.authorName}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                        {n.authorRole} Notice
                      </span>
                    </div>

                    {n.title && <h3 className="font-bold text-sm text-slate-900">{n.title}</h3>}
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. CLASSWORK & HOMEWORK TAB */}
          {activeTab === "CLASSWORK" && (
            <div className="space-y-6">
              {/* Teacher Create Homework Button */}
              {userRole === "TEACHER" && (
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Assigned Coursework & Labs
                  </h3>
                  <button
                    onClick={() => setCreateHomeworkOpen(!isCreateHomeworkOpen)}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 text-white px-3.5 py-2 text-xs font-bold hover:bg-blue-700 transition"
                  >
                    <Plus className="h-4 w-4" />
                    + Assign Homework / Assignment
                  </button>
                </div>
              )}

              {/* Create Homework Form */}
              {isCreateHomeworkOpen && userRole === "TEACHER" && (
                <form onSubmit={handleCreateHomework} className="rounded-2xl bg-white p-5 border border-slate-200 shadow-md space-y-4">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Create New Homework or Assignment Task
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                      <input
                        type="text"
                        required
                        value={hwTitle}
                        onChange={(e) => setHwTitle(e.target.value)}
                        placeholder="e.g. Kinematics Free Body Diagram Assignment"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Task Type</label>
                      <select
                        value={hwType}
                        onChange={(e: any) => setHwType(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-white"
                      >
                        <option value="HOMEWORK">Homework Problem Set</option>
                        <option value="ASSIGNMENT">Graded Assignment</option>
                        <option value="LAB">Experimental Lab Report</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Instructions *</label>
                    <textarea
                      rows={3}
                      required
                      value={hwInstructions}
                      onChange={(e) => setHwInstructions(e.target.value)}
                      placeholder="Detailed instructions for students..."
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                      <input
                        type="text"
                        value={hwDueDate}
                        onChange={(e) => setHwDueDate(e.target.value)}
                        placeholder="e.g. Friday at 11:59 PM"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Max Points</label>
                      <input
                        type="number"
                        value={hwPoints}
                        onChange={(e) => setHwPoints(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setCreateHomeworkOpen(false)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingHw}
                      className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
                    >
                      {creatingHw ? "Creating..." : "Publish Homework Task"}
                    </button>
                  </div>
                </form>
              )}

              {/* Classwork List */}
              <div className="space-y-4">
                {classwork.map((cw) => {
                  const studentSub = cw.submissions?.find((s: any) => s.studentId === "student-101");

                  return (
                    <div key={cw.id} className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                            {cw.type}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900">{cw.title}</h4>
                        </div>
                        <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-amber-500" /> Due: {cw.dueDate} • {cw.maxPoints} pts
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{cw.instructions}</p>

                      {/* Submissions & Turn In Actions */}
                      <div className="pt-2 flex items-center justify-between">
                        {studentSub ? (
                          <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>
                              Turned In {studentSub.status === "GRADED" ? `(Grade: ${studentSub.grade}/${cw.maxPoints})` : ""}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedHwToSubmit(cw)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 text-white px-3.5 py-1.5 text-xs font-bold hover:bg-blue-700 transition"
                          >
                            <Send className="h-3.5 w-3.5" />
                            Turn In Homework Response
                          </button>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {cw.submissions?.length || 0} total submissions
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Turn In Homework Modal Dialog */}
              {selectedHwToSubmit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
                  <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="font-bold text-sm text-slate-900">
                        Turn In: {selectedHwToSubmit.title}
                      </h4>
                      <button onClick={() => setSelectedHwToSubmit(null)}>
                        <X className="h-4 w-4 text-slate-400" />
                      </button>
                    </div>
                    <form onSubmit={handleSubmitHomework} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Your Homework Submission Answer *
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          placeholder="Type or paste your completed assignment solution here..."
                          className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-blue-500 focus:outline-none resize-none"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedHwToSubmit(null)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submittingHw}
                          className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
                        >
                          {submittingHw ? "Submitting..." : "Submit to Instructor"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. PEOPLE & ROSTER TAB */}
          {activeTab === "PEOPLE" && (
            <div className="space-y-6">
              {/* Instructor Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-blue-700 uppercase tracking-wider pb-2 border-b border-blue-100">
                  Teachers & Faculty Instructors
                </h3>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                      {teacherName[0]}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{teacherName}</span>
                      <span className="text-[11px] text-slate-500">Primary Course Instructor</span>
                    </div>
                  </div>
                  <a
                    href="/chat?role=STUDENT&channel=direct-student-101-teacher-201"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Message Instructor
                  </a>
                </div>
              </div>

              {/* Classmates Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider pb-2 border-b border-slate-200">
                  Enrolled Classmates (6 Students)
                </h3>
                <div className="space-y-2">
                  {["Alex Johnson", "Sophia Martinez", "Liam Chen", "Emma Watson", "Lucas Garcia", "Olivia Davis"].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[11px]">
                          {s[0]}
                        </div>
                        <span className="font-semibold text-slate-800">{s}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        Active Enrolled
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
