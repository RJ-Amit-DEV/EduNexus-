"use client";

import React, { useState } from "react";
import { Plus, X, Check, Users, Loader2, ShieldCheck, KeyRound } from "lucide-react";

interface LinkChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChildLinked: (child: any) => void;
}

export default function LinkChildModal({
  isOpen,
  onClose,
  onChildLinked,
}: LinkChildModalProps) {
  const [linkKey, setLinkKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkedChild, setLinkedChild] = useState<any>(null);

  if (!isOpen) return null;

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkKey.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/parent/link-child", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkKey }),
      });
      const data = await res.json();
      if (data.success && data.child) {
        setLinkedChild(data.child);
        onChildLinked(data.child);
      } else {
        setError(data.error || "Failed to link student with that key");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sampleStudentKeys = [
    { key: "LINK-SOPHIA-42", label: "Sophia Martinez (Grade 11 - STEM)" },
    { key: "LINK-LIAM-77", label: "Liam Chen (Grade 11 - STEM)" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-100 p-6">
        <button
          onClick={() => {
            setLinkedChild(null);
            setError(null);
            onClose();
          }}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        {!linkedChild ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Link Student Guardian Profile</h3>
                <p className="text-xs text-slate-500">
                  Connect your child's academic record via their Student Link Key
                </p>
              </div>
            </div>

            <form onSubmit={handleLink} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Link Key *
                </label>
                <input
                  type="text"
                  required
                  value={linkKey}
                  onChange={(e) => setLinkKey(e.target.value.toUpperCase())}
                  placeholder="e.g. LINK-SOPHIA-42"
                  className="w-full text-center tracking-widest text-base font-bold font-mono rounded-xl border border-slate-200 px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none uppercase"
                />
              </div>

              {error && (
                <div className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  {error}
                </div>
              )}

              {/* Sample Student Keys Helper */}
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block">
                  Quick Demo Student Keys to Try:
                </span>
                <div className="space-y-1.5">
                  {sampleStudentKeys.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setLinkKey(s.key)}
                      className="w-full text-left text-[11px] text-emerald-800 hover:bg-emerald-50 p-1.5 rounded-md transition flex items-center justify-between"
                    >
                      <span>{s.label}</span>
                      <span className="font-bold font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                        {s.key}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !linkKey.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Verify & Link Child
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Child Linked Successfully!</h3>
              <p className="text-xs text-slate-500 mt-1">
                You now have real-time oversight of attendance, consistency scores, and teacher updates
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left text-xs space-y-1.5">
              <div className="font-bold text-sm text-emerald-950">{linkedChild.name}</div>
              <div className="text-slate-600">Grade Level: <strong>{linkedChild.grade}</strong></div>
              <div className="text-slate-600">Attendance: {linkedChild.attendanceRate}%</div>
              <div className="text-slate-600">Consistency Score: {linkedChild.consistencyScore}%</div>
            </div>

            <button
              onClick={() => {
                setLinkedChild(null);
                setLinkKey("");
                onClose();
              }}
              className="w-full rounded-xl bg-slate-900 text-white py-2 text-xs font-bold hover:bg-slate-800 transition"
            >
              Done & View Child Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
