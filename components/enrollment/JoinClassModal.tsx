"use client";

import React, { useState } from "react";
import { Plus, X, Check, BookOpen, Loader2, KeyRound } from "lucide-react";

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClassJoined: (joinedClass: any) => void;
}

export default function JoinClassModal({
  isOpen,
  onClose,
  onClassJoined,
}: JoinClassModalProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joinedSuccess, setJoinedSuccess] = useState<any>(null);

  if (!isOpen) return null;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/classes/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.success && data.class) {
        setJoinedSuccess(data.class);
        onClassJoined(data.class);
      } else {
        setError(data.error || "Failed to find class with that code");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sampleCodes = [
    { code: "BIO-204", label: "Cellular & Molecular Biology (Dr. Green)" },
    { code: "PHY-301", label: "AP Physics: Mechanics (Dr. Mitchell)" },
    { code: "MTH-402", label: "Calculus BC & Vectors (Prof. Vance)" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-100 p-6">
        <button
          onClick={() => {
            setJoinedSuccess(null);
            setError(null);
            onClose();
          }}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        {!joinedSuccess ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Join a Class Group</h3>
                <p className="text-xs text-slate-500">
                  Enter the 6-character code provided by your instructor
                </p>
              </div>
            </div>

            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Code *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. BIO-204"
                  maxLength={10}
                  className="w-full text-center tracking-widest text-lg font-bold rounded-xl border border-slate-200 px-3.5 py-2.5 focus:border-blue-500 focus:outline-none uppercase"
                />
              </div>

              {error && (
                <div className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  {error}
                </div>
              )}

              {/* Sample codes helper */}
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block">
                  Quick Demo Codes to Try:
                </span>
                <div className="space-y-1.5">
                  {sampleCodes.map((s) => (
                    <button
                      key={s.code}
                      type="button"
                      onClick={() => setCode(s.code)}
                      className="w-full text-left text-[11px] text-blue-700 hover:bg-blue-50 p-1.5 rounded-md transition flex items-center justify-between"
                    >
                      <span>{s.label}</span>
                      <span className="font-bold font-mono bg-blue-100 px-1.5 py-0.5 rounded text-[10px]">
                        {s.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Join Class
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Enrolled Successfully!</h3>
              <p className="text-xs text-slate-500 mt-1">
                You have been added to the course roster and classroom chat
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-left text-xs space-y-1.5">
              <div className="font-bold text-sm text-blue-950">{joinedSuccess.name}</div>
              <div className="text-slate-600">Instructor: <strong>{joinedSuccess.teacherName}</strong></div>
              <div className="text-slate-600">Schedule: {joinedSuccess.schedule}</div>
              <div className="text-slate-600">Room: {joinedSuccess.room}</div>
            </div>

            <button
              onClick={() => {
                setJoinedSuccess(null);
                setCode("");
                onClose();
              }}
              className="w-full rounded-xl bg-slate-900 text-white py-2 text-xs font-bold hover:bg-slate-800 transition"
            >
              Done & View Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
