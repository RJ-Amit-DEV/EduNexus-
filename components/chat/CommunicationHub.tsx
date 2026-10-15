"use client";

import React, { useState, useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";
import NewConversationModal from "./NewConversationModal";
import {
  MessageSquare,
  Send,
  Sparkles,
  Users,
  GraduationCap,
  UserCheck,
  HelpCircle,
  Loader2,
  Plus,
  ShieldCheck,
  Search,
  CheckCircle2,
  User,
  Radio,
  Clock,
  ChevronRight,
  Filter,
  BookOpen,
} from "lucide-react";

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderRole: "STUDENT" | "TEACHER" | "PARENT" | "AI";
  content: string;
  timestamp: string;
  isDoubt?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  type: "CLASS" | "DOUBT_HUB" | "DIRECT_STUDENT_TEACHER" | "DIRECT_PARENT_TEACHER";
  badge?: string;
}

const DEFAULT_CHANNELS: Channel[] = [
  {
    id: "direct-student-101-teacher-201",
    name: "Student ↔ Dr. Sarah Mitchell",
    description: "AP Physics 1-on-1 Faculty Channel",
    type: "DIRECT_STUDENT_TEACHER",
    badge: "Faculty Direct",
  },
  {
    id: "direct-parent-301-teacher-201",
    name: "Parent Guardian ↔ Dr. Mitchell",
    description: "Guardian updates, attendance & progress feedback",
    type: "DIRECT_PARENT_TEACHER",
    badge: "Parent Oversight",
  },
  {
    id: "doubts-live",
    name: "Live Doubt Resolution Hub",
    description: "24/7 instant peer, teacher, and AI doubt clearing",
    type: "DOUBT_HUB",
    badge: "AI Powered",
  },
  {
    id: "class-cls-1",
    name: "AP Physics: Mechanics (PHY-301)",
    description: "Classroom stream questions, lab discussions & notices",
    type: "CLASS",
  },
  {
    id: "class-cls-2",
    name: "Calculus BC & Analysis (MTH-401)",
    description: "Problem set discussions, derivations & exam prep",
    type: "CLASS",
  },
];

interface CommunicationHubProps {
  initialRole?: "STUDENT" | "TEACHER" | "PARENT";
  initialChannelId?: string;
}

export default function CommunicationHub({
  initialRole = "STUDENT",
  initialChannelId,
}: CommunicationHubProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentRole, setCurrentRole] = useState<"STUDENT" | "TEACHER" | "PARENT">(initialRole);
  const [channels, setChannels] = useState<Channel[]>(DEFAULT_CHANNELS);
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<"ALL" | "DIRECT" | "CLASS" | "DOUBT">("ALL");
  const [isNewChatModalOpen, setNewChatModalOpen] = useState(false);

  // Fetch logged in user on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
          if (data.user.role) {
            setCurrentRole(data.user.role as any);
          }
        }
      })
      .catch(() => {});
  }, []);

  const personaName =
    currentUser?.name ||
    (currentRole === "TEACHER"
      ? "Dr. Sarah Mitchell"
      : currentRole === "PARENT"
      ? "David Johnson"
      : "Alex Johnson");

  const personaId =
    currentUser?.id ||
    (currentRole === "TEACHER" ? "teacher-201" : currentRole === "PARENT" ? "parent-301" : "student-101");

  // Set default active channel
  const defaultChannel =
    channels.find((c) => c.id === initialChannelId) ||
    (currentRole === "PARENT" ? channels[1] : channels[0]);

  const [activeChannel, setActiveChannel] = useState<Channel>(defaultChannel);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [isAskingAI, setIsAskingAI] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialChannelId) {
      const existing = channels.find((c) => c.id === initialChannelId);
      if (existing) {
        setActiveChannel(existing);
      } else {
        const isParent = initialChannelId.includes("parent");
        const newChan: Channel = {
          id: initialChannelId,
          name: isParent ? "Parent ↔ Faculty Channel" : "Direct Student Channel",
          description: "1-on-1 Academic Channel",
          type: isParent ? "DIRECT_PARENT_TEACHER" : "DIRECT_STUDENT_TEACHER",
          badge: isParent ? "Parent Oversight" : "1-on-1 Direct",
        };
        setChannels((prev) => [newChan, ...prev]);
        setActiveChannel(newChan);
      }
    }
  }, [initialChannelId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket setup
  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    if (socket.connected) setIsConnected(true);

    socket.on("room_history", ({ roomId, messages: history }) => {
      if (roomId === activeChannel.id) {
        setMessages(history);
      }
    });

    socket.on("receive_message", (newMsg: Message) => {
      if (newMsg.roomId === activeChannel.id) {
        setMessages((prev) => [...prev, newMsg]);
      }
    });

    socket.on("user_typing", ({ userName }) => {
      setTypingUser(userName);
    });
    socket.on("user_stop_typing", () => {
      setTypingUser(null);
    });

    socket.emit("join_room", {
      roomId: activeChannel.id,
      user: { name: personaName, role: currentRole },
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("room_history");
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("user_stop_typing");
    };
  }, [activeChannel.id, personaName, currentRole]);

  const handleSendMessage = (isDoubt: boolean = false) => {
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: "msg-" + Date.now(),
      roomId: activeChannel.id,
      senderId: personaId,
      senderName: personaName,
      senderRole: currentRole,
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isDoubt,
    };

    const socket = getSocket();
    if (socket.connected) {
      socket.emit("send_message", newMsg);
      socket.emit("stop_typing", { roomId: activeChannel.id });
    } else {
      setMessages((prev) => [...prev, newMsg]);
    }

    setInputText("");
  };

  const handleAskAIInChat = async () => {
    const lastMsg = [...messages].reverse().find((m) => m.senderRole !== "AI");
    const prompt =
      inputText.trim() ||
      lastMsg?.content ||
      `Provide a pedagogical step-by-step conceptual clarification for students in ${activeChannel.name}`;

    setIsAskingAI(true);
    try {
      const res = await fetch("/api/ai/doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: prompt,
          subject: activeChannel.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const aiMsg: Message = {
          id: "ai-" + Date.now(),
          roomId: activeChannel.id,
          senderId: "ai-bot",
          senderName: "EduNexus AI Tutor",
          senderRole: "AI",
          content: data.solution,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        const socket = getSocket();
        if (socket.connected) {
          socket.emit("send_message", aiMsg);
        } else {
          setMessages((prev) => [...prev, aiMsg]);
        }
      }
    } catch (err) {
      console.error("AI chat error:", err);
    } finally {
      setIsAskingAI(false);
    }
  };

  const handleSelectRecipient = (recipient: {
    id: string;
    name: string;
    role: "STUDENT" | "TEACHER" | "PARENT";
    subtext: string;
    roomId: string;
  }) => {
    const existing = channels.find((c) => c.id === recipient.roomId);
    if (existing) {
      setActiveChannel(existing);
      return;
    }

    const newChannel: Channel = {
      id: recipient.roomId,
      name: `${personaName.split(" ")[0]} ↔ ${recipient.name}`,
      description: recipient.subtext,
      type: recipient.role === "PARENT" ? "DIRECT_PARENT_TEACHER" : "DIRECT_STUDENT_TEACHER",
      badge: recipient.role === "PARENT" ? "Parent Oversight" : "1-on-1 Direct",
    };

    setChannels((prev) => [newChannel, ...prev]);
    setActiveChannel(newChannel);
  };

  const filteredChannels = channels.filter((ch) => {
    if (channelFilter === "DIRECT" && !ch.type.startsWith("DIRECT")) return false;
    if (channelFilter === "CLASS" && ch.type !== "CLASS") return false;
    if (channelFilter === "DOUBT" && ch.type !== "DOUBT_HUB") return false;
    return (
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${
              currentRole === "TEACHER"
                ? "bg-indigo-600 shadow-indigo-500/20"
                : currentRole === "PARENT"
                ? "bg-emerald-600 shadow-emerald-500/20"
                : "bg-blue-600 shadow-blue-500/20"
            }`}
          >
            {currentRole === "TEACHER" ? (
              <UserCheck className="h-6 w-6" />
            ) : currentRole === "PARENT" ? (
              <Users className="h-6 w-6" />
            ) : (
              <GraduationCap className="h-6 w-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Messaging As:
              </span>
              <span
                className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                  currentRole === "TEACHER"
                    ? "bg-indigo-100 text-indigo-800"
                    : currentRole === "PARENT"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {currentRole}
              </span>
            </div>
            <h2 className="text-base font-extrabold text-slate-900">{personaName}</h2>
          </div>
        </div>

        {/* Live Socket Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span>{isConnected ? "Real-Time Socket Connected" : "Connecting to Socket.io..."}</span>
          </div>
        </div>
      </div>

      {/* Main Messaging Container */}
      <div className="flex flex-col lg:flex-row h-[700px] rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        {/* Left Sidebar: Channels & Chats */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/70 flex flex-col shrink-0">
          {/* Header & Search */}
          <div className="p-4 border-b border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                Conversations
              </h3>
              <button
                onClick={() => setNewChatModalOpen(true)}
                className="inline-flex items-center gap-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 text-xs font-bold transition shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Chat</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search channels or faculty..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs focus:bg-white focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
              {(["ALL", "DIRECT", "CLASS", "DOUBT"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setChannelFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                    channelFilter === filter
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Channels List */}
          <div className="p-2 space-y-1 overflow-y-auto flex-1">
            {filteredChannels.map((ch) => {
              const isActive = ch.id === activeChannel.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch)}
                  className={`w-full text-left p-3 rounded-2xl transition flex items-start gap-3 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "hover:bg-slate-200/60 text-slate-700"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-white border border-slate-200 text-slate-700"
                    }`}
                  >
                    {ch.type === "DOUBT_HUB" ? (
                      <Sparkles className="h-4 w-4 text-amber-500" />
                    ) : ch.type === "DIRECT_PARENT_TEACHER" ? (
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    ) : ch.type === "DIRECT_STUDENT_TEACHER" ? (
                      <UserCheck className="h-4 w-4 text-indigo-500" />
                    ) : (
                      <BookOpen className="h-4 w-4 text-blue-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{ch.name}</span>
                      {ch.badge && (
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shrink-0 ml-1 ${
                            isActive ? "bg-white/30 text-white" : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {ch.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${isActive ? "text-blue-100" : "text-slate-500"}`}>
                      {ch.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* User Presence Bar */}
          <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                {personaName[0]}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[140px]">
                  {personaName}
                </p>
                <span className="text-[10px] font-medium text-slate-500 capitalize">
                  {currentRole.toLowerCase()} portal
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Active
            </span>
          </div>
        </div>

        {/* Right Main Chat Panel */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Channel Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{activeChannel.name}</h3>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 truncate max-w-sm hidden sm:inline">
                  {activeChannel.description}
                </span>
              </div>
              {typingUser && (
                <span className="text-[11px] text-blue-600 italic animate-pulse">
                  {typingUser} is typing...
                </span>
              )}
            </div>

            <button
              onClick={handleAskAIInChat}
              disabled={isAskingAI}
              className="flex items-center gap-1.5 rounded-xl bg-purple-50 border border-purple-200 px-3.5 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 transition disabled:opacity-50"
            >
              {isAskingAI ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-600" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              )}
              <span>Ask AI in Channel</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                <MessageSquare className="h-10 w-10 mb-2 stroke-[1.2] text-slate-300" />
                <p className="font-semibold text-slate-600">No messages yet in {activeChannel.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Send a message below or ask the AI Tutor for assistance.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderName === personaName;
                const isAI = msg.senderRole === "AI";

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-500">
                      <span className="font-bold text-slate-800">{msg.senderName}</span>
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${
                          isAI
                            ? "bg-purple-100 text-purple-800"
                            : msg.senderRole === "TEACHER"
                            ? "bg-indigo-100 text-indigo-800"
                            : msg.senderRole === "PARENT"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {msg.senderRole}
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                        isAI
                          ? "bg-purple-50/90 border border-purple-200/80 text-purple-950 shadow-xs whitespace-pre-line font-medium"
                          : msg.isDoubt
                          ? "bg-amber-50 border border-amber-200 text-amber-950 shadow-xs"
                          : isMe
                          ? currentRole === "TEACHER"
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                            : currentRole === "PARENT"
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/10"
                            : "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                          : "bg-white border border-slate-200 text-slate-800 shadow-xs"
                      }`}
                    >
                      {msg.isDoubt && (
                        <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-amber-700 mb-1">
                          <HelpCircle className="h-3.5 w-3.5" /> Academic Question / Doubt
                        </div>
                      )}
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3.5 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(false);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeChannel.name} as ${personaName}...`}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none transition"
              />

              {activeChannel.type === "DOUBT_HUB" && (
                <button
                  type="button"
                  onClick={() => handleSendMessage(true)}
                  title="Highlight as conceptual doubt"
                  className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 transition shrink-0"
                >
                  Post as Doubt
                </button>
              )}

              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`flex items-center justify-center h-10 w-10 rounded-xl text-white transition disabled:opacity-40 shrink-0 ${
                  currentRole === "TEACHER"
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : currentRole === "PARENT"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* New Conversation Modal */}
      <NewConversationModal
        isOpen={isNewChatModalOpen}
        onClose={() => setNewChatModalOpen(false)}
        currentUserRole={currentRole}
        onSelectRecipient={handleSelectRecipient}
      />
    </div>
  );
}
