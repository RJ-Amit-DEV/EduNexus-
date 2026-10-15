"use client";

import React, { useState } from "react";
import { HelpCircle, Send, Sparkles, CheckCircle2, MessageSquare, Loader2, X } from "lucide-react";

interface DoubtSolverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DoubtSolverModal({ isOpen, onClose }: DoubtSolverModalProps) {
  const [subject, setSubject] = useState("Physics");
  const [question, setQuestion] = useState("Why does a spinning ice skater speed up when pulling in their arms?");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, subject }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-100 p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">AI Instant Doubt Solver</h2>
            <p className="text-xs text-slate-500">
              Get step-by-step academic clarifications with Google Gemini
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Area</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
            >
              <option value="Physics">Physics: Mechanics & Waves</option>
              <option value="Calculus">Mathematics & Calculus</option>
              <option value="Computer Science">Computer Science & Algorithms</option>
              <option value="Chemistry">Chemistry</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Question or Concept</label>
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Type your question or paste a tricky problem statement..."
            />
          </div>
        </div>

        <button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition disabled:opacity-50 mb-6"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing Concept & Computing Solution...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Resolve Doubt with AI
            </>
          )}
        </button>

        {/* Output */}
        {result && (
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Step-by-Step Resolution
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                AI Confidence: {Math.round((result.aiConfidence || 0.95) * 100)}%
              </span>
            </div>

            <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-line bg-white p-3 rounded-lg border border-slate-200">
              {result.solution}
            </div>

            {result.followUpQuestions?.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  Follow-up Knowledge Checks:
                </span>
                <div className="space-y-1.5">
                  {result.followUpQuestions.map((q: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setQuestion(q)}
                      className="w-full text-left text-xs text-blue-700 bg-blue-100/60 hover:bg-blue-100 p-2 rounded-md transition flex items-center gap-2"
                    >
                      <MessageSquare className="h-3 w-3 shrink-0" />
                      <span>{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
