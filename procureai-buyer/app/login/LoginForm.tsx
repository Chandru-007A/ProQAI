"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Cpu, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") === "vendor" ? "vendor" : "buyer";

  const [role, setRole]             = useState<"buyer" | "vendor">(defaultRole);
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [remember, setRemember]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      
      router.push(data.user.role === "VENDOR" ? "/vendor-dashboard" : "/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg-subtle)" }}
    >
      <div className="w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--primary)" }}
            >
              <Cpu size={20} color="#fff" />
            </div>
            <span className="text-xl font-bold">
              ProQ<span style={{ color: "var(--primary)" }}>.AI</span>
            </span>
          </Link>
          <p className="mt-2 text-sm" style={{ color: "var(--fg-muted)" }}>
            Intelligent Procurement Platform
          </p>
        </div>

        <div className="card-base p-7">
          <h1 className="text-lg font-bold mb-1">Welcome back</h1>
          <p className="text-sm mb-6" style={{ color: "var(--fg-muted)" }}>
            Sign in to your account
          </p>

          {/* Role Tabs */}
          <div
            className="flex rounded-lg p-1 mb-6"
            style={{ background: "var(--bg-muted)" }}
          >
            {(["buyer", "vendor"] as const).map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="flex-1 py-2 text-sm font-medium rounded-md transition-all"
                style={{
                  background: role === r ? "var(--bg)" : "transparent",
                  color: role === r ? "var(--primary)" : "var(--fg-muted)",
                  boxShadow: role === r ? "var(--shadow-sm)" : "none",
                  fontWeight: role === r ? 600 : 400,
                }}
              >
                {r === "buyer" ? "Buyer" : "Vendor"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="label-base">Email address</label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--fg-subtle)" }}
                >
                  <Mail size={15} />
                </span>
                <input
                  id="email"
                  type="email"
                  className="input-base"
                  style={{ paddingLeft: 36 }}
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label-base mb-0">Password</label>
                <button
                  type="button"
                  className="text-xs"
                  style={{ color: "var(--primary)" }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--fg-subtle)" }}
                >
                  <Lock size={15} />
                </span>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  className="input-base"
                  style={{ paddingLeft: 36, paddingRight: 40 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--fg-muted)" }}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label
              className="flex items-center gap-2 cursor-pointer select-none text-sm"
              style={{ color: "var(--fg-muted)" }}
            >
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-600"
                id="remember"
              />
              Remember me for 30 days
            </label>

            {/* Error */}
            {error && (
              <p
                className="text-sm px-3 py-2 rounded-lg"
                style={{ background: "var(--danger-light)", color: "var(--danger)" }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    style={{ animation: "spin 0.7s linear infinite" }}
                  />
                  Signing in…
                </span>
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div className="divider my-5" />
          <p className="text-center text-sm" style={{ color: "var(--fg-muted)" }}>
            Don&apos;t have an account?{" "}
            <span style={{ color: "var(--fg)" }}>Contact your administrator</span>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
