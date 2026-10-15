"use client";

import React, { useState } from "react";
import { mockFaculty, mockEnrolledStudents } from "@/lib/mockData";
import {
  UserCheck,
  GraduationCap,
  Users,
  Search,
  X,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: "STUDENT" | "TEACHER" | "PARENT";
  onSelectRecipient: (recipient: {
    id: string;
    name: string;
    role: "STUDENT" | "TEACHER" | "PARENT";
    subtext: string;
    roomId: string;
  }) => void;
}

export default function NewConversationModal({
  isOpen,
  onClose,
  currentUserRole,
  onSelectRecipient,
}: NewConversationModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [teacherTargetTab, setTeacherTargetTab] = useState<"STUDENTS" | "PARENTS">("STUDENTS");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 p-6 max-h-[85vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Start New 1-on-1 Conversation</h3>
            <p className="text-xs text-slate-500">
              {currentUserRole === "STUDENT" && "Select an enrolled faculty instructor"}
              {currentUserRole === "PARENT" && "Connect with one of your child's teachers"}
              {currentUserRole === "TEACHER" && "Message an enrolled student or their guardian"}
            </p>
          </div>
        </div>

        {/* Academic Boundary Rule Note */}
        <div className="mb-4 rounded-xl bg-slate-50 border border-slate-200/80 p-3 flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Academic Boundary Enforced:</strong> You are securely connected only with faculty, students, or guardians in verified active courses.
          </span>
        </div>

        {/* Teacher Tab Selector: Students vs Parents */}
        {currentUserRole === "TEACHER" && (
          <div className="flex items-center gap-2 mb-4 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTeacherTargetTab("STUDENTS")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                teacherTargetTab === "STUDENTS"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Enrolled Students (6)
            </button>
            <button
              onClick={() => setTeacherTargetTab("PARENTS")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                teacherTargetTab === "PARENTS"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Parent Guardians (6)
            </button>
          </div>
        )}

        {/* Search input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or subject..."
            className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Directory List */}
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {/* STUDENT or PARENT View: Shows Enrolled Faculty */}
          {(currentUserRole === "STUDENT" || currentUserRole === "PARENT") && (
            <>
              {mockFaculty
                .filter(
                  (f) =>
                    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    f.subject.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      const prefix = currentUserRole === "STUDENT" ? "direct-student-101" : "direct-parent-301";
                      onSelectRecipient({
                        id: f.id,
                        name: f.name,
                        role: "TEACHER",
                        subtext: f.subject,
                        roomId: `${prefix}-${f.id}`,
                      });
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        <UserCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {f.name}
                        </h4>
                        <p className="text-[11px] text-slate-500">{f.subject}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                      Faculty
                    </span>
                  </button>
                ))}
            </>
          )}

          {/* TEACHER View: Shows Enrolled Students */}
          {currentUserRole === "TEACHER" && teacherTargetTab === "STUDENTS" && (
            <>
              {mockEnrolledStudents
                .filter((st) => st.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      onSelectRecipient({
                        id: st.id,
                        name: st.name,
                        role: "STUDENT",
                        subtext: `${st.grade} • Student`,
                        roomId: `direct-${st.id}-teacher-201`,
                      });
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {st.name}
                        </h4>
                        <p className="text-[11px] text-slate-500">{st.grade}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      Student
                    </span>
                  </button>
                ))}
            </>
          )}

          {/* TEACHER View: Shows Parents of Enrolled Students */}
          {currentUserRole === "TEACHER" && teacherTargetTab === "PARENTS" && (
            <>
              {mockEnrolledStudents
                .filter((st) => st.parentName.toLowerCase().includes(searchTerm.toLowerCase()) || st.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((st) => (
                  <button
                    key={st.parentId}
                    onClick={() => {
                      onSelectRecipient({
                        id: st.parentId,
                        name: `${st.parentName} (${st.name}'s Parent)`,
                        role: "PARENT",
                        subtext: `Parent of ${st.name} (${st.grade})`,
                        roomId: `direct-${st.parentId}-teacher-201`,
                      });
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                          {st.parentName}
                        </h4>
                        <p className="text-[11px] text-slate-500">Guardian of {st.name}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                      Parent
                    </span>
                  </button>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
