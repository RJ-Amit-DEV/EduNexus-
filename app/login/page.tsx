"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  UserCheck,
  Users,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  Shield,
  Star,
} from "lucide-react";

type RoleType = "STUDENT" | "TEACHER" | "PARENT";

const roles: { id: RoleType; label: string; description: string; icon: any; accent: string; ring: string; badge: string; badgeBg: string }[] = [
  {
    id: "STUDENT",
    label: "Student",
    description: "Access learning tools & grades",
    icon: GraduationCap,
    accent: "bg-blue-600 hover:bg-blue-500",
    ring: "focus:ring-blue-500/30 focus:border-blue-500",
    badge: "text-blue-700 bg-blue-50 border-blue-200",
    badgeBg: "bg-blue-600",
  },
  {
    id: "TEACHER",
    label: "Teacher",
    description: "Manage classes & assessments",
    icon: UserCheck,
    accent: "bg-violet-600 hover:bg-violet-500",
    ring: "focus:ring-violet-500/30 focus:border-violet-500",
    badge: "text-violet-700 bg-violet-50 border-violet-200",
    badgeBg: "bg-violet-600",
  },
  {
    id: "PARENT",
    label: "Parent",
    description: "Monitor child's progress",
    icon: Users,
    accent: "bg-emerald-600 hover:bg-emerald-500",
    ring: "focus:ring-emerald-500/30 focus:border-emerald-500",
    badge: "text-emerald-700 bg-emerald-50 border-emerald-200",
    badgeBg: "bg-emerald-600",
  },
];

const demoAccounts: Record<RoleType, { email: string; name: string; password: string }> = {
  STUDENT: { email: "alex@edunexus.edu", name: "Alex Johnson", password: "password123" },
  TEACHER: { email: "dr.mitchell@edunexus.edu", name: "Dr. Sarah Mitchell", password: "password123" },
  PARENT: { email: "david@edunexus.edu", name: "David Johnson", password: "password123" },
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role")?.toUpperCase() as RoleType | undefined;

  const [selectedRole, setSelectedRole] = useState<RoleType>("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (roleParam && ["STUDENT", "TEACHER", "PARENT"].includes(roleParam)) {
      setSelectedRole(roleParam);
    }
  }, [roleParam]);

  const currentRole = roles.find((r) => r.id === selectedRole)!;

  const redirectAfterAuth = (role: string) => {
    if (role === "TEACHER") router.push("/teacher");
    else if (role === "PARENT") router.push("/parent");
    else router.push("/student");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });
      const data = await res.json();
      if (data.success && data.user) redirectAfterAuth(data.user.role);
      else setError(data.error || "Invalid credentials. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      });
      const data = await res.json();
      if (data.success && data.user) redirectAfterAuth(data.user.role);
      else setError(data.error || "Google sign-in failed.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    const demo = demoAccounts[selectedRole];
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demo.email, password: demo.password, role: selectedRole }),
      });
      const data = await res.json();
      if (data.success && data.user) redirectAfterAuth(data.user.role);
      else setError("Demo login failed. Please try again.");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ── Left panel (branding) ───────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-slate-900 flex-col justify-between p-12 overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-violet-600/10 to-transparent pointer-events-none" />

        {/* Brand */}
        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-white">
            Edu<span className="text-blue-400">Nexus</span>
          </span>
        </Link>

        {/* Central message */}
        <div className="relative space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white leading-snug mb-4">
              Welcome back to<br />your learning hub
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Sign in to access your personalised dashboard, track progress, and stay connected with your school community.
            </p>
          </div>

          {/* Testimonial */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5">
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              "EduNexus gave me everything in one place — my grades, homework, and even a way to ask doubts at midnight. Game changer."
            </p>
            <div>
              <p className="text-xs font-semibold text-white">Alex K.</p>
              <p className="text-xs text-slate-500">Grade 11 STEM Student</p>
            </div>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {["AI Study Plans", "Live Chat", "Progress Reports", "Attendance Tracking"].map((f) => (
              <span key={f} className="flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-white/5 border border-white/8 rounded-full px-3 py-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />{f}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom trust */}
        <div className="relative flex items-center gap-2 text-xs text-slate-500">
          <Shield className="h-3.5 w-3.5" />
          FERPA compliant · All sessions encrypted · Role-isolated access
        </div>
      </div>

      {/* ── Right panel (form) ─────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
        {/* Mobile brand */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="text-base font-bold text-slate-900">Edu<span className="text-blue-600">Nexus</span></span>
          </Link>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1.5">Sign in to EduNexus</h1>
            <p className="text-sm text-slate-500">Select your role to continue to your portal.</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-7">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => { setSelectedRole(role.id); setError(null); }}
                className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 px-2 text-xs font-semibold transition-all ${
                  selectedRole === role.id
                    ? `border-current ${role.badge} shadow-sm`
                    : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 bg-white"
                }`}
              >
                <role.icon className="h-4 w-4" />
                {role.label}
              </button>
            ))}
          </div>

          {/* Google login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition mb-4 disabled:opacity-60"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google as {currentRole.label}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Email / password form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={demoAccounts[selectedRole].email}
                  className={`w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${currentRole.ring} transition`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${currentRole.ring} transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition shadow-sm disabled:opacity-60 ${currentRole.accent}`}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              Sign In as {currentRole.label}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Quick demo access</p>
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2.5 hover:bg-slate-50 transition text-xs disabled:opacity-60"
            >
              <div className="flex items-center gap-2">
                <div className={`h-6 w-6 rounded-full ${currentRole.badgeBg} flex items-center justify-center text-white`}>
                  <currentRole.icon className="h-3 w-3" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800">{demoAccounts[selectedRole].name}</p>
                  <p className="text-slate-400 text-[10px]">{demoAccounts[selectedRole].email}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentRole.badge}`}>
                {selectedRole}
              </span>
            </button>
          </div>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link href={`/signup?role=${selectedRole}`} className="font-semibold text-blue-600 hover:text-blue-500">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
