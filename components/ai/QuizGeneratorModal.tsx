"use client";

import React, { useState } from "react";
import { Sparkles, Brain, Check, X, AlertCircle, Loader2, Award } from "lucide-react";

interface QuizGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: "TEACHER" | "STUDENT";
}

export default function QuizGeneratorModal({ isOpen, onClose, role = "TEACHER" }: QuizGeneratorModalProps) {
  const [topic, setTopic] = useState("Newton's Laws & Friction in Autonomous Vehicles");
  const [gradeLevel, setGradeLevel] = useState("Grade 11 - Advanced STEM");
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setShowResults(false);
    setSelectedAnswers({});
    try {
      const res = await fetch("/api/ai/quiz-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, gradeLevel, count }),
      });
      const data = await res.json();
      if (data.success && data.questions) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) score++;
    });
    return score;
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {role === "TEACHER" ? "AI Scenario-Based Quiz Builder" : "AI Practice Assessment"}
            </h2>
            <p className="text-xs text-slate-500">
              Generate real-world application questions with Google Gemini
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Topic / Curriculum Concept</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
              placeholder="e.g. Electromagnetic Induction, Photosynthesis"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Grade Level</label>
            <input
              type="text"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-amber-700 transition disabled:opacity-50 mb-6"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Drafting Scenario Questions via Gemini...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Scenario Quiz
            </>
          )}
        </button>

        {/* Generated Questions */}
        {questions.length > 0 && (
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id || idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="mb-2">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    Question {idx + 1}
                  </span>
                  <p className="text-xs italic text-slate-600 mt-1 bg-amber-50/60 p-2.5 rounded-lg border border-amber-100">
                    "{q.scenario}"
                  </p>
                  <p className="text-sm font-semibold text-slate-900 mt-2">{q.question}</p>
                </div>

                <div className="space-y-2 mt-3">
                  {q.options?.map((opt: string, optIdx: number) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;
                    const isCorrect = q.correctIndex === optIdx;

                    let btnStyle = "border-slate-200 bg-white hover:bg-slate-100 text-slate-700";
                    if (showResults) {
                      if (isCorrect) {
                        btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold";
                      } else if (isSelected && !isCorrect) {
                        btnStyle = "border-rose-500 bg-rose-50 text-rose-800 line-through";
                      }
                    } else if (isSelected) {
                      btnStyle = "border-amber-500 bg-amber-50 text-amber-900 font-medium";
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-left rounded-lg border p-2.5 text-xs transition flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {showResults && isCorrect && <Check className="h-4 w-4 text-emerald-600" />}
                        {showResults && isSelected && !isCorrect && (
                          <X className="h-4 w-4 text-rose-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {showResults && (
                  <div className="mt-3 text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-600">
                    <span className="font-semibold text-slate-800">Explanation: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            ))}

            {/* Submit / Score Action */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              {!showResults ? (
                <button
                  onClick={() => setShowResults(true)}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="rounded-xl bg-slate-900 text-white px-5 py-2 text-xs font-semibold hover:bg-slate-800 transition disabled:opacity-40"
                >
                  Submit & Check Answers
                </button>
              ) : (
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <Award className="h-5 w-5 text-amber-500" />
                  Score: {calculateScore()} / {questions.length} (
                  {Math.round((calculateScore() / questions.length) * 100)}%)
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
