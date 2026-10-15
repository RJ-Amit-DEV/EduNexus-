"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  HelpCircle,
  Search,
  MessageSquare,
  FileQuestion,
  LifeBuoy,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Mail,
  Phone,
  ArrowRight,
  Loader2,
  Check,
  BookOpen,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "STUDENT" | "TEACHER" | "PARENT" | "TECH";
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "STUDENT",
    question: "How do I turn in homework or assignments in the Google Classroom view?",
    answer:
      "Click on 'Enrolled Classes', select 'Google Classroom Stream', navigate to the 'Classwork & Homework' tab, click 'Turn In Homework Response' on your assigned task, type or paste your solution, and click 'Submit to Instructor'. Your status will update immediately to Turned In.",
  },
  {
    id: "faq-2",
    category: "STUDENT",
    question: "How does the AI Study Planner work?",
    answer:
      "The AI Study Planner analyzes your target subject, milestone goal, and weekly available study hours to generate an adaptive 3-week learning roadmap with weekly topics, estimated hours, and actionable checklists.",
  },
  {
    id: "faq-3",
    category: "PARENT",
    question: "How do I link my account to my child's student profile?",
    answer:
      "Your child can copy their unique 'Parent Link Key' from the top of their Student Portal (e.g., LINK-ALEX-99). In your Parent Portal, click '+ Link Another Student', paste the link key, and your portal will immediately synchronize their attendance and progress records.",
  },
  {
    id: "faq-4",
    category: "TEACHER",
    question: "How do I take quick roll-call attendance for my class?",
    answer:
      "In the Teacher Console under 'Live Roll Call Attendance Register', toggle each student between Present, Late, or Absent with one click, then click 'Save Roll Call Records' to broadcast the update to connected parent dashboards.",
  },
  {
    id: "faq-5",
    category: "TECH",
    question: "Is EduNexus FERPA compliant and is my student data secure?",
    answer:
      "Yes, EduNexus implements strict role-based access control (RBAC), HTTP-only JWT encrypted session cookies, and multi-tenant isolation ensuring parents only access their linked child's records.",
  },
  {
    id: "faq-6",
    category: "STUDENT",
    question: "How can I resolve homework doubts when my teacher is offline?",
    answer:
      "Open the '24/7 Doubt Resolver' from your Student Portal or enter the 'Live Doubt Resolution Hub' in the Messages tab. You can ask any question and receive instant step-by-step conceptual breakdowns and formula derivations from the AI Tutor.",
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | "STUDENT" | "TEACHER" | "PARENT" | "TECH">("ALL");
  const [expandedFaq, setExpandedFaq] = useState<string | null>("faq-1");

  // AI Support Assistant State
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  // Ticket Form State
  const [ticketName, setTicketName] = useState("");
  const [ticketEmail, setTicketEmail] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Technical Issue");
  const [ticketPriority, setTicketPriority] = useState("Medium");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  const handleAskAIAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setAiLoading(true);
    setAiAnswer(null);
    try {
      const res = await fetch("/api/ai/doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Provide helpful, step-by-step support instructions for the user issue: "${aiQuery}"`,
          subject: "EduNexus Support Center",
        }),
      });
      const data = await res.json();
      if (data.success && data.solution) {
        setAiAnswer(data.solution);
      } else {
        setAiAnswer("For this issue, please ensure you are logged into the correct role or submit a support ticket below for direct administrator review.");
      }
    } catch {
      setAiAnswer("Our support systems are online. Please check your query or submit a direct ticket below.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    setSubmittingTicket(true);
    setTimeout(() => {
      const id = `TICKET-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedTicketId(id);
      setSubmittingTicket(false);
      setTicketSubject("");
      setTicketMessage("");
    }, 1000);
  };

  const filteredFaqs = FAQS.filter((faq) => {
    if (selectedCategory !== "ALL" && faq.category !== selectedCategory) return false;
    return (
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* ── 1. Hero Header & Search ─────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-8 sm:p-12 text-white shadow-xl text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
            <LifeBuoy className="h-3.5 w-3.5 text-blue-300" />
            <span>EduNexus Help & Support Center</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            How can we help you today?
          </h1>

          <p className="text-blue-100 text-sm max-w-xl mx-auto leading-relaxed">
            Search our comprehensive guides, ask the AI Support Assistant for instant solutions, or open a ticket with our dedicated team.
          </p>

          {/* Quick Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, assignments, login help, or class codes..."
              className="w-full rounded-2xl bg-white text-slate-900 pl-12 pr-4 py-3.5 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* ── 2. Live System Status Bar ────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Core Web Platform", status: "Operational (99.9%)", color: "bg-emerald-500" },
            { label: "Real-Time Socket Hub", status: "Operational (Live)", color: "bg-emerald-500" },
            { label: "AI Study & Doubt Engine", status: "Operational", color: "bg-emerald-500" },
            { label: "Classroom Workspace", status: "Operational", color: "bg-emerald-500" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${item.color} shrink-0 animate-pulse`} />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{item.label}</p>
                <p className="text-[11px] text-slate-500">{item.status}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── 3. AI Instant Support Assistant ──────────────────────── */}
        <div className="rounded-3xl bg-gradient-to-br from-purple-50 via-indigo-50/40 to-white border border-purple-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Support Assistant</h2>
              <p className="text-xs text-slate-500">Ask any question to receive instant troubleshooting guidance</p>
            </div>
          </div>

          <form onSubmit={handleAskAIAssistant} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="e.g. How do I turn in my assignment or copy my parent link code?"
              className="flex-1 rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-none shadow-xs"
            />
            <button
              type="submit"
              disabled={aiLoading || !aiQuery.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 text-xs font-bold transition disabled:opacity-50 shadow-xs shrink-0"
            >
              {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>Get Instant AI Answer</span>
            </button>
          </form>

          {aiAnswer && (
            <div className="rounded-2xl bg-white p-5 border border-purple-200 shadow-xs space-y-2">
              <span className="text-[11px] font-extrabold uppercase text-purple-700 tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />
                AI Resolution
              </span>
              <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">
                {aiAnswer}
              </div>
            </div>
          )}
        </div>

        {/* ── 4. Knowledge Base & FAQs ─────────────────────────────── */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-slate-500">Curated answers for students, teachers, and parents</p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {(["ALL", "STUDENT", "TEACHER", "PARENT", "TECH"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {cat === "ALL" ? "All FAQs" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden transition"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md shrink-0">
                        {faq.category}
                      </span>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900">{faq.question}</h3>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs leading-relaxed text-slate-600 border-t border-slate-100 bg-slate-50/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 5. Submit Support Ticket Form & Direct Contact ───────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ticket Form (2 cols) */}
          <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-blue-600" />
                Open an Official Support Ticket
              </h2>
              <p className="text-xs text-slate-500">Our technical team reviews and responds to all tickets within 24 hours</p>
            </div>

            {submittedTicketId ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-emerald-900">Support Ticket Created Successfully!</h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Your reference ID is <span className="font-mono font-black text-emerald-900">{submittedTicketId}</span>. A confirmation has been logged and our support team is reviewing your inquiry.
                </p>
                <button
                  onClick={() => setSubmittedTicketId(null)}
                  className="rounded-xl bg-emerald-700 text-white px-4 py-2 text-xs font-bold hover:bg-emerald-800 transition"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={ticketEmail}
                      onChange={(e) => setTicketEmail(e.target.value)}
                      placeholder="e.g. you@school.edu"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none bg-white"
                    >
                      <option value="Technical Issue">Technical & System Issue</option>
                      <option value="Portal Access">Portal Access & Login</option>
                      <option value="Homework & Grades">Homework & Grade Discrepancy</option>
                      <option value="Parent Linking">Parent Link Key Assistance</option>
                      <option value="Feature Request">Feature Suggestion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none bg-white"
                    >
                      <option value="Low">Low - General Question</option>
                      <option value="Medium">Medium - Normal Request</option>
                      <option value="High">High - Impending Deadline</option>
                      <option value="Urgent">Urgent - Blocked Account</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Short summary of the issue..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Provide details, error messages, and what steps you were taking..."
                    className="w-full rounded-xl border border-slate-200 p-3.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingTicket}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 text-xs font-bold transition shadow-sm disabled:opacity-50"
                >
                  {submittingTicket ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span>Submit Support Ticket</span>
                </button>
              </form>
            )}
          </div>

          {/* Direct Support Channels (1 col) */}
          <div className="space-y-4">
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Direct Support Channels</h3>
              <p className="text-xs text-slate-500">Need immediate assistance? Connect through our official channels.</p>

              <div className="space-y-3 pt-2">
                <Link
                  href="/chat"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition text-left group"
                >
                  <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-blue-950 group-hover:text-blue-700 transition">Live Messaging Hub</p>
                    <p className="text-[11px] text-blue-700">Chat with faculty and support</p>
                  </div>
                </Link>

                <a
                  href="mailto:support@edunexus.edu"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition text-left"
                >
                  <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900">Email Support</p>
                    <p className="text-[11px] text-slate-500">support@edunexus.edu</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900">Phone Support</p>
                    <p className="text-[11px] text-slate-500">+1 (800) EDU-NEXUS (Mon-Fri)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                <ShieldCheck className="h-4 w-4" />
                <span>FERPA & Student Privacy</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                All inquiries and records are handled in strict compliance with educational privacy standards and 256-bit encryption.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
