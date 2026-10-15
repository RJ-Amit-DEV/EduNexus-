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
  User,
  ArrowRight,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  Shield,
  Hash,
} from "lucide-react";

type RoleType = "STUDENT" | "TEACHER" | "PARENT";

const roles: {
  id: RoleType;
  label: string;
  description: string;
  icon: any;
  accent: string;
  ring: string;
  badge: string;
  badgeBg: string;
}[] = [
  {
    id: "STUDENT",
    label: "Student",
    description: "Join classes & track progress",
    icon: GraduationCap,
    accent: "bg-blue-600 hover:bg-blue-500",
    ring: "focus:ring-blue-500/30 focus:border-blue-500",
    badge: "text-blue-700 bg-blue-50 border-blue-200",
    badgeBg: "bg-blue-600",
  },
  {
    id: "TEACHER",
    label: "Teacher",
    description: "Create & manage classrooms",
    icon: UserCheck,
    accent: "bg-violet-600 hover:bg-violet-500",
    ring: "focus:ring-violet-500/30 focus:border-violet-500",
    badge: "text-violet-700 bg-violet-50 border-violet-200",
    badgeBg: "bg-violet-600",
  },
  {
    id: "PARENT",
    label: "Parent",
    description: "Monitor your child's learning",
    icon: Users,
    accent: "bg-emerald-600 hover:bg-emerald-500",
    ring: "focus:ring-emerald-500/30 focus:border-emerald-500",
    badge: "text-emerald-700 bg-emerald-50 border-emerald-200",
    badgeBg: "bg-emerald-600",
  },
];

const benefits: Record<RoleType, string[]> = {
  STUDENT: [
    "AI-personalised study plans",
    "24/7 doubt resolution",
    "Assignment & grade tracking",
    "Streaks, XP & badges",
    "Live messaging with teachers",
  ],
  TEACHER: [
    "One-click attendance register",
    "AI-generated quiz & assessments",
    "Classroom management tools",
    "Assignment submission pipeline",
    "Parent communication channel",
  ],
  PARENT: [
    "Real-time attendance alerts",
    "Grade & progress reports",
    "Direct teacher messaging",
    "AI growth recommendations",
    "Child's academic overview",
  ],
};

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role")?.toUpperCase() as RoleType | undefined;

  const [selectedRole, setSelectedRole] = useState<RoleType>("STUDENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [extra, setExtra] = useState(""); // gradeLevel / department / childLinkKey
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (roleParam && ["STUDENT", "TEACHER", "PARENT"].includes(roleParam)) {
      setSelectedRole(roleParam);
    }
  }, [roleParam]);

  const currentRole = roles.find((r) => r.id === selectedRole)!;

  const passwordStrength = (() => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: "Too short", color: "bg-rose-500", width: "w-1/4" };
    if (password.length < 10) return { label: "Fair", color: "bg-amber-500", width: "w-2/4" };
    if (password.length < 14) return { label: "Good", color: "bg-blue-500", width: "w-3/4" };
    return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
  })();

  const redirectAfterAuth = (role: string) => {
    if (role === "TEACHER") router.push("/teacher");
    else if (role === "PARENT") router.push("/parent");
    else router.push("/student");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const body: Record<string, string> = { name, email, password, role: selectedRole };
      if (selectedRole === "STUDENT") body.gradeLevel = extra;
      if (selectedRole === "TEACHER") body.department = extra;
      if (selectedRole === "PARENT") body.childLinkKey = extra;

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success && data.user) redirectAfterAuth(data.user.role);
      else setError(data.error || "Registration failed. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
      else setError(data.error || "Google sign-up failed.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ── Left panel ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] relative bg-slate-900 flex-col justify-between p-12 overflow-hidden">
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

        <div className="relative space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white leading-snug mb-3">
              Start your journey<br />with EduNexus
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Join thousands of students, teachers, and parents already using EduNexus to transform how they learn and teach.
            </p>
          </div>

          {/* Dynamic benefits based on role */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              What you get as a {currentRole.label}
            </p>
            <ul className="space-y-3">
              {benefits[selectedRole].map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <div className={`h-5 w-5 rounded-full ${currentRole.badgeBg} flex items-center justify-center shrink-0`}>
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { val: "50k+", label: "Active students" },
              { val: "3.2k+", label: "Educators" },
              { val: "120+", label: "Partner schools" },
              { val: "98%", label: "Satisfaction" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <p className="text-xl font-bold text-white">{s.val}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-2 text-xs text-slate-500">
          <Shield className="h-3.5 w-3.5" />
          Free forever for students · FERPA compliant · Role-isolated access
        </div>
      </div>

      {/* ── Right panel (form) ────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-14 xl:px-20 overflow-y-auto">
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
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900 mb-1.5">Create your account</h1>
            <p className="text-sm text-slate-500">Choose your role and get started in seconds.</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
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

          {/* Google signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition mb-4 disabled:opacity-60"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Sign up with Google as {currentRole.label}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or sign up with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className={`w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${currentRole.ring} transition`}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${currentRole.ring} transition`}
                />
              </div>
            </div>

            {/* Role-specific extra field */}
            {selectedRole === "STUDENT" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Grade / Year level</label>
                <input
                  type="text"
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  placeholder="e.g. Grade 10, Year 12, Class XI"
                  className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${currentRole.ring} transition`}
                />
              </div>
            )}
            {selectedRole === "TEACHER" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Department / Subject</label>
                <input
                  type="text"
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  placeholder="e.g. Mathematics, Science & Technology"
                  className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${currentRole.ring} transition`}
                />
              </div>
            )}
            {selectedRole === "PARENT" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Child's link code <span className="font-normal text-slate-400">(optional)</span></label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={extra}
                    onChange={(e) => setExtra(e.target.value)}
                    placeholder="Ask your child's school for this code"
                    className={`w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${currentRole.ring} transition`}
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
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
              {/* Strength bar */}
              {passwordStrength && (
                <div className="mt-2">
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`} />
                  </div>
                  <p className={`text-[10px] font-semibold mt-1 ${
                    passwordStrength.label === "Strong" ? "text-emerald-600" :
                    passwordStrength.label === "Good" ? "text-blue-600" :
                    passwordStrength.label === "Fair" ? "text-amber-600" : "text-rose-600"
                  }`}>{passwordStrength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className={`w-full rounded-xl border ${
                    confirmPassword && confirmPassword !== password
                      ? "border-rose-300 focus:ring-rose-300/30 focus:border-rose-400"
                      : confirmPassword && confirmPassword === password
                      ? "border-emerald-300"
                      : "border-slate-200"
                  } bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition`}
                />
                {confirmPassword && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {confirmPassword === password
                      ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      : <AlertCircle className="h-4 w-4 text-rose-500" />
                    }
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Terms */}
            <p className="text-[11px] text-slate-400 leading-relaxed">
              By creating an account you agree to our{" "}
              <a href="#" className="underline hover:text-slate-700">Terms of Service</a> and{" "}
              <a href="#" className="underline hover:text-slate-700">Privacy Policy</a>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition shadow-sm disabled:opacity-60 ${currentRole.accent}`}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              Create {currentRole.label} Account
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href={`/login?role=${selectedRole}`} className="font-semibold text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
