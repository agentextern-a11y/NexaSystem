import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Zap, Globe, Eye, EyeOff, ArrowLeft } from "lucide-react";

function NexaMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="lG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00e5ff" />
          <stop offset="100%" stopColor="#2979ff" />
        </linearGradient>
      </defs>
      <path d="M20 88 L20 22 L36 22 L68 62 L68 22 L84 22 L84 88 L68 88 L36 48 L36 88 Z" fill="url(#lG)" />
      <path d="M36 30 L62 62 L62 30 Z" fill="#0a1628" opacity="0.45" />
      <path d="M82 52 L100 52 L100 44 L116 60 L100 76 L100 68 L82 68 Z" fill="#00e5ff" opacity="0.85" />
    </svg>
  );
}

type Tab = "login" | "register";

export default function Login() {
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (tab === "register") {
      if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
      if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    }

    setLoading(true);
    try {
      if (tab === "login") {
        await login(email.trim(), password);
        navigate("/dashboard");
      } else {
        await register(email.trim(), password);
        navigate("/onboarding");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[46%] flex-col justify-between p-12" style={{ background: "linear-gradient(160deg,#0a1628 0%,#1a237e 60%,#0d2a50 100%)" }}>
        <a href="/" className="flex items-center gap-3">
          <NexaMark size={36} />
          <div>
            <div className="font-extrabold text-white text-lg tracking-wider">NEXA</div>
            <div className="text-[11px] font-medium tracking-widest" style={{ color: "#00e5ff" }}>Payment Crypto</div>
          </div>
        </a>

        <div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Tap. Pay.<br />
            <span style={{ background: "linear-gradient(90deg,#00e5ff,#2979ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Instantly.
            </span>
          </h2>
          <p className="text-slate-400 text-base mb-10 leading-relaxed">
            Your keys, your crypto. Nexa is a non-custodial wallet for fast, secure, borderless payments.
          </p>
          <div className="space-y-4">
            {[
              { icon: Shield, text: "Non-custodial — you own your private keys" },
              { icon: Globe,  text: "6 networks: ETH, Polygon, BNB, AVAX, ARB, OP" },
              { icon: Zap,    text: "Instant swaps at live market rates" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(41,121,255,0.25)", border: "1px solid rgba(0,229,255,0.2)" }}>
                  <Icon className="w-4 h-4" style={{ color: "#00e5ff" }} />
                </div>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-700 text-xs">© 2025 Nexa Payment Crypto · All rights reserved</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <a href="/" className="flex items-center gap-2">
              <NexaMark size={32} />
              <span className="font-extrabold text-slate-900 text-base">NEXA</span>
            </a>
          </div>

          {/* Back to home (desktop) */}
          <a href="/" className="hidden lg:flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-8 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </a>

          {/* Tab switcher */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  tab === t
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t === "login" ? "Log In" : "Create Account"}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
              {tab === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-slate-500 text-sm">
              {tab === "login"
                ? "Sign in to access your Nexa wallet."
                : "Set up your account to get started with Nexa."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={tab === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === "register" ? "At least 6 characters" : "Your password"}
                  required
                  className="h-11 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {tab === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    className="h-11 rounded-xl pr-10"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-bold rounded-xl mt-2"
              style={{ background: "linear-gradient(135deg,#2979ff,#1a237e)", color: "#fff" }}
            >
              {loading
                ? tab === "login" ? "Signing in…" : "Creating account…"
                : tab === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            {tab === "login" ? (
              <>Don't have an account?{" "}
                <button onClick={() => { setTab("register"); setError(""); }} className="text-blue-600 font-semibold hover:underline">
                  Create one
                </button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => { setTab("login"); setError(""); }} className="text-blue-600 font-semibold hover:underline">
                  Sign in
                </button>
              </>
            )}
          </div>

          {tab === "register" && (
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Your keys, your crypto</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Nexa generates a real Ethereum wallet for you. Your private key is encrypted and only accessible to you.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
