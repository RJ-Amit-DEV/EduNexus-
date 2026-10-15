"use client";

import React, { useState } from "react";
import { Plus, X, Copy, Check, BookOpen, Loader2, Sparkles } from "lucide-react";

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClassCreated: (newClass: any) => void;
}

export default function CreateClassModal({
  isOpen,
  onClose,
  onClassCreated,
}: CreateClassModalProps) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("Chemistry");
  const [gradeLevel, setGradeLevel] = useState("Grade 11 - Advanced");
  const [schedule, setSchedule] = useState("Tue, Thu - 11:00 AM");
  const [room, setRoom] = useState("Science Wing - Lab 204");
  const [loading, setLoading] = useState(false);
  const [createdClass, setCreatedClass] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/classes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, subject, gradeLevel, schedule, room }),
      });
      const data = await res.json();
      if (data.success && data.class) {
        setCreatedClass(data.class);
        onClassCreated(data.class);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (createdClass?.code) {
      navigator.clipboard.writeText(createdClass.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 p-6">
        <button
          onClick={() => {
            setCreatedClass(null);
            onClose();
          }}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        {!createdClass ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Create New Course / Section</h3>
                <p className="text-xs text-slate-500">
                  Generate a unique Class Code for students to self-enroll
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class / Section Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. AP Chemistry: Thermodynamics"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Grade Level</label>
                  <input
                    type="text"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Schedule</label>
                  <input
                    type="text"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Room / Lab</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Generate Class & Code
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Class Created Successfully!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Share this unique 6-character code with your students to self-enroll
              </p>
            </div>

            {/* Generated Code Box */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 text-center">
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                Student Self-Enrollment Code
              </span>
              <span className="text-3xl font-extrabold tracking-widest text-indigo-900">
                {createdClass.code}
              </span>
              <div className="mt-3">
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-indigo-700 transition"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied to Clipboard!" : "Copy Class Code"}
                </button>
              </div>
            </div>

            <div className="text-left text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-600 space-y-1">
              <div><strong>Course:</strong> {createdClass.name}</div>
              <div><strong>Schedule:</strong> {createdClass.schedule}</div>
              <div><strong>Room:</strong> {createdClass.room}</div>
            </div>

            <button
              onClick={() => {
                setCreatedClass(null);
                onClose();
              }}
              className="w-full rounded-xl bg-slate-900 text-white py-2 text-xs font-bold hover:bg-slate-800 transition"
            >
              Done & Return to Console
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
