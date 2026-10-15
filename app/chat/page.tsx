"use client";

import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import CommunicationHub from "@/components/chat/CommunicationHub";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function ChatContent() {
  const searchParams = useSearchParams();
  const rawRole = searchParams.get("role")?.toUpperCase();
  const initialChannelId = searchParams.get("channel") || undefined;

  const initialRole: "STUDENT" | "TEACHER" | "PARENT" =
    rawRole === "TEACHER" || rawRole === "PARENT" ? rawRole : "STUDENT";

  return (
    <CommunicationHub
      key={`${initialRole}-${initialChannelId}`}
      initialRole={initialRole}
      initialChannelId={initialChannelId}
    />
  );
}

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Real-Time Communication & Live Doubt Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Seamless multi-party messaging connecting students, faculty, and parents with Gemini AI assistance
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex h-96 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          }
        >
          <ChatContent />
        </Suspense>
      </main>
    </div>
  );
}
