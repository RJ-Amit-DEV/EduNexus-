"use client";

import React, { useState } from "react";
import { Megaphone, X, Send, Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

interface PostNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: Array<{ id: string; name: string }>;
  teacherName?: string;
  onNoticeCreated: (newNotice: any) => void;
}

export default function PostNoticeModal({
  isOpen,
  onClose,
  classes,
  teacherName = "Dr. Sarah Mitchell",
  onNoticeCreated,
}: PostNoticeModalProps) {
  const [targetClassId, setTargetClassId] = useState<string>("all");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<"HIGH" | "MEDIUM" | "LOW">("MEDIUM");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Please write the content of your announcement.");
      return;
    }

    setLoading(true);
    setError(null);

    const targetClass = classes.find((c) => c.id === targetClassId);
    const className = targetClassId === "all" ? "All Enrolled Classes" : (targetClass?.name || "Class Announcement");

    try {
      const res = await fetch("/api/classes/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: targetClassId,
          className,
          title: title.trim() || "📢 Class Notice & Announcement",
          content: content.trim(),
          priority,
          authorName: teacherName,
          authorRole: "TEACHER",
        }),
      });

      const data = await res.json();
      if (data.success && data.notice) {
        onNoticeCreated(data.notice);
        setTitle("");
        setContent("");
        setPriority("MEDIUM");
        setTargetClassId("all");
        onClose();
      } else {
        setError(data.error || "Failed to publish announcement.");
      }
    } catch (err: any) {
      setError(err.message || "Network error while publishing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Broadcast Class Notice</h3>
            <p className="text-xs text-slate-500">
              Publish an urgent announcement or update to student dashboards
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Section */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target Course / Section
            </label>
            <select
              value={targetClassId}
              onChange={(e) => setTargetClassId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="all">📢 All Enrolled Classes (Global Broadcast)</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Notice Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mid-Term Lab Preparation & Schedule Change"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Priority Pill Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Priority Urgency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "HIGH", label: "🔴 High / Urgent", desc: "Exam dates, deadlines", activeClass: "bg-rose-50 border-rose-400 text-rose-700" },
                { id: "MEDIUM", label: "🟡 Medium", desc: "General homework", activeClass: "bg-amber-50 border-amber-400 text-amber-700" },
                { id: "LOW", label: "🔵 Info / Low", desc: "Optional resources", activeClass: "bg-blue-50 border-blue-400 text-blue-700" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    priority === p.id
                      ? `${p.activeClass} font-bold ring-2 ring-indigo-400`
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-xs font-bold">{p.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Body */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Announcement Details *
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide complete instructions, room numbers, or links for students..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Broadcast Notice</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
