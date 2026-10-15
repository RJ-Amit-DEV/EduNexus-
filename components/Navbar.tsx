"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  UserCheck,
  Users,
  LogOut,
  LogIn,
  UserPlus,
  ShieldCheck,
  Bell,
  Settings,
  HelpCircle,
  MessageSquare,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";

type UserType = { name: string; role: string; email: string } | null;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<UserType>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeRole = user?.role || (
    pathname.includes("/teacher")
      ? "TEACHER"
      : pathname.includes("/parent")
      ? "PARENT"
      : "STUDENT"
  );

  const portalPath =
    user?.role === "TEACHER" ? "/teacher" : user?.role === "PARENT" ? "/parent" : "/student";

  const roleMeta = {
    STUDENT: { label: "Student", color: "text-blue-600", dot: "bg-blue-500", icon: GraduationCap },
    TEACHER: { label: "Teacher", color: "text-violet-600", dot: "bg-violet-500", icon: UserCheck },
    PARENT: { label: "Parent", color: "text-emerald-600", dot: "bg-emerald-500", icon: Users },
  }[user?.role || "STUDENT"] || {
    label: "Student",
    color: "text-blue-600",
    dot: "bg-blue-500",
    icon: GraduationCap,
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.success && data.user ? data.user : null);
      })
      .catch(() => setUser(null));
  }, [pathname]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setShowUserMenu(false);
    router.push("/login");
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ── Brand ──────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Edu<span className="text-blue-600">Nexus</span>
          </span>
        </Link>

        {/* ── Centre nav (unauthenticated) ───────────────── */}
        {!user && (
          <nav className="hidden md:flex items-center gap-0.5">
            <Link
              href="/#features"
              className="px-3.5 py-2 text-sm text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#about"
              className="px-3.5 py-2 text-sm text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
            >
              About
            </Link>
            <Link
              href="/#contact"
              className="px-3.5 py-2 text-sm text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/support"
              className={`px-3.5 py-2 text-sm rounded-lg transition-colors ${
                pathname === "/support"
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Support
            </Link>
          </nav>
        )}

        {/* ── Centre nav (authenticated) — portal links ──── */}
        {user && (
          <nav className="hidden md:flex items-center gap-0.5">
            <Link
              href={portalPath}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-sm rounded-lg transition-colors ${
                pathname === portalPath
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </Link>
            <Link
              href="/chat"
              className={`flex items-center gap-1.5 px-3.5 py-2 text-sm rounded-lg transition-colors ${
                pathname === "/chat"
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Messages
            </Link>
            <Link
              href="/support"
              className={`flex items-center gap-1.5 px-3.5 py-2 text-sm rounded-lg transition-colors ${
                pathname === "/support"
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Support
            </Link>
          </nav>
        )}

        {/* ── Right actions ──────────────────────────────── */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Authenticated */}
          {user ? (
            <>
              {/* Notification bell */}
              <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
              </button>

              {/* Role chip */}
              <div className={`hidden sm:flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600`}>
                <span className={`h-1.5 w-1.5 rounded-full ${roleMeta.dot}`} />
                {roleMeta.label}
              </div>

              {/* User avatar + dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu((v) => !v)}
                  className="flex items-center gap-1.5 rounded-lg pl-1 pr-2 py-1 hover:bg-slate-100 transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white flex items-center justify-center text-xs font-bold">
                    {getInitials(user.name)}
                  </div>
                  <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-100 shadow-xl overflow-hidden z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-slate-50">
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        href={portalPath}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-slate-400" />
                        My Dashboard
                      </Link>
                      <Link
                        href="/chat"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <MessageSquare className="h-4 w-4 text-slate-400" />
                        Messages
                      </Link>
                      <Link
                        href="/support"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <HelpCircle className="h-4 w-4 text-slate-400" />
                        Help & Support
                      </Link>
                    </div>

                    {/* Role badge in menu */}
                    <div className="px-4 py-2.5 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                        Signed in as <span className="font-semibold">{roleMeta.label}</span>
                      </div>
                    </div>

                    {/* Logout */}
                    <div className="py-1 border-t border-slate-50">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Unauthenticated */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-sm"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
