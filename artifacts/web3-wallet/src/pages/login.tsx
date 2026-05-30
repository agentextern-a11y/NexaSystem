import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth, hasBiometricRegistered, isBiometricSupported } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, ArrowLeft, Fingerprint, Loader2, CheckCircle2 } from "lucide-react";

function NexaMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="lGLogin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c6fcd" />
          <stop offset="100%" stopColor="#5b5be6" />
        </linearGradient>
      </defs>
      <path d="M20 88 L20 22 L36 22 L68 62 L68 22 L84 22 L84 88 L68 88 L36 48 L36 88 Z" fill="url(#lGLogin)" />
      <path d="M36 30 L62 62 L62 30 Z" fill="#0a1628" opacity="0.35" />
      <path d="M82 52 L100 52 L100 44 L116 60 L100 76 L100 68 L82 68 Z" fill="#00e5ff" opacity="0.9" />
    </svg>
  );
}

/* ── Particle background ── */
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="particle absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            bottom: "-10px",
            background: `rgba(${91 + Math.round(Math.random() * 50)}, ${91 + Math.round(Math.random() * 30)}, 230, ${Math.random() * 0.4 + 0.1})`,
            animationDuration: `${Math.random() * 8 + 6}s`,
            animationDelay: `${Math.random() * 6}s`,
          }}
        />
      ))}
    </div>
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
  const [bioLoading, setBioLoading] = useState(false);
  const [bioAvailable, setBioAvailable] = useState(false);
  const [bioRegistered, setBioRegistered] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const [offerBio, setOfferBio] = useState(false);
  const [bioEnabled, setBioEnabled] = useState(false);

  const { login, register, enableBiometric, loginWithBiometric } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    setBioAvailable(isBiometricSupported());
    setBioRegistered(hasBiometricRegistered());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (tab === "register") {
      if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
      if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    }

    setLoading(true);
    try {
      if (tab === "login") {
        await login(email.trim(), password);
        navigate("/dashboard");
      } else {
        await register(email.trim(), password);
        setJustRegistered(true);
        if (isBiometricSupported()) setOfferBio(true);
        else navigate("/onboarding");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setBioLoading(true);
    setError("");
    try {
      const ok = await loginWithBiometric();
      if (ok) navigate("/dashboard");
      else setError("Biometric authentication unsuccessful. Please sign in with your password.");
    } catch {
      setError("Biometric authentication unavailable.");
    } finally {
      setBioLoading(false);
    }
  };

  const handleEnableBio = async () => {
    setBioLoading(true);
    try {
      const ok = await enableBiometric();
      if (ok) {
        setBioEnabled(true);
        setTimeout(() => navigate("/onboarding"), 1200);
      } else {
        navigate("/onboarding");
      }
    } finally {
      setBioLoading(false);
    }
  };

  /* ── Biometric offer screen (post-registration) ── */
  if (offerBio && !bioEnabled) {
    return (
      <div className="min-h-screen bg-[#eef0fb] flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl text-center animate-slide-up">
          <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center animate-pulse-glow"
            style={{ background: "linear-gradient(135deg,#5b5be6,#7c6fcd)" }}>
            <Fingerprint className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Enable Biometric Login</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            Use your device's fingerprint or Face ID for fast, secure access to your NEXA Pay wallet. Your biometric data never leaves your device.
          </p>
          <Button
            onClick={handleEnableBio}
            disabled={bioLoading}
            className="w-full h-12 text-base font-bold rounded-xl mb-3"
            style={{ background: "linear-gradient(135deg,#5b5be6,#7c6fcd)", color: "#fff" }}
          >
            {bioLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enable Biometric Authentication"}
          </Button>
          <button onClick={() => navigate("/onboarding")} className="text-sm text-slate-400 hover:text-slate-600 font-medium">
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  if (bioEnabled) {
    return (
      <div className="min-h-screen bg-[#eef0fb] flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center animate-slide-up">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Biometric Enabled</h2>
          <p className="text-sm text-slate-500">Setting up your wallet…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex lg:w-[46%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#0a0e24 0%,#1a1363 45%,#2d2b8e 75%,#5b5be6 100%)" }}>
        <Particles />
        {/* Orbs */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-10 orb-float"
          style={{ background: "radial-gradient(circle,#5b5be6,transparent)", animationDuration: "8s" }} />
        <div className="absolute bottom-32 left-10 w-48 h-48 rounded-full opacity-8 orb-float"
          style={{ background: "radial-gradient(circle,#00e5ff,transparent)", animationDuration: "11s", animationDelay: "3s" }} />

        <a href="/" className="flex items-center gap-3 relative z-10">
          <NexaMark size={36} />
          <div>
            <div className="font-extrabold text-white text-lg tracking-wider">NEXA</div>
            <div className="text-[11px] font-medium tracking-widest text-[#00e5ff]">Payment Crypto</div>
          </div>
        </a>

        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Institutional-Grade<br />
            <span style={{ background: "linear-gradient(90deg,#7c6fcd,#00e5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Crypto Custody
            </span>
          </h2>
          <p className="text-slate-400 text-base mb-10 leading-relaxed">
            NEXA Pay delivers sovereign, non-custodial asset management engineered for professionals who demand uncompromising security and seamless cross-chain liquidity.
          </p>
          <div className="space-y-4">
            {[
              { icon: Shield, text: "Military-grade AES-256 local key encryption" },
              { icon: Fingerprint, text: "WebAuthn biometric authentication (FIDO2)" },
              { icon: CheckCircle2, text: "6 networks · Real-time settlement · Zero custody" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 glass">
                  <Icon className="w-4 h-4 text-[#7c6fcd]" />
                </div>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-xs relative z-10">
          © 2025 NEXA Financial Technologies Ltd. · All rights reserved<br />
          Regulated digital asset infrastructure
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#f5f7ff]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <a href="/" className="flex items-center gap-2">
              <NexaMark size={32} />
              <span className="font-extrabold text-slate-900 text-base">NEXA</span>
            </a>
          </div>

          <a href="/" className="hidden lg:flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-8 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </a>

          {/* Biometric quick access */}
          {tab === "login" && bioRegistered && bioAvailable && (
            <div className="mb-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 mb-3 font-medium">Registered device detected</p>
              <Button
                onClick={handleBiometricLogin}
                disabled={bioLoading}
                className="w-full h-11 rounded-xl gap-2 font-bold"
                style={{ background: "linear-gradient(135deg,#5b5be6,#7c6fcd)", color: "#fff" }}
              >
                {bioLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Fingerprint className="w-4 h-4" />
                }
                {bioLoading ? "Authenticating…" : "Sign In with Biometrics"}
              </Button>
            </div>
          )}

          {/* Tab switcher */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
              {tab === "login" ? "Welcome back" : "Open your account"}
            </h1>
            <p className="text-slate-500 text-sm">
              {tab === "login"
                ? "Access your NEXA Pay wallet securely."
                : "Establish your sovereign, non-custodial wallet in under 60 seconds."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email address</Label>
              <Input
                id="email" type="email" autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="h-12 rounded-xl bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={tab === "login" ? "current-password" : "new-password"}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === "register" ? "Minimum 8 characters" : "Your password"}
                  required className="h-12 rounded-xl pr-12 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {tab === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password" required
                  className="h-12 rounded-xl bg-white"
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium flex items-center gap-2">
                <Shield className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit" disabled={loading}
              className="w-full h-12 text-base font-bold rounded-xl mt-1"
              style={{ background: "linear-gradient(135deg,#5b5be6,#7c6fcd)", color: "#fff" }}
            >
              {loading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : tab === "login" ? "Sign In to NEXA Pay" : "Create Secure Account"}
            </Button>
          </form>

          {tab === "login" && bioAvailable && !bioRegistered && (
            <p className="mt-4 text-center text-xs text-slate-400">
              Biometric authentication available — enable it after signing in.
            </p>
          )}

          <div className="mt-6 text-center text-sm text-slate-500">
            {tab === "login" ? (
              <>Don't have an account?{" "}
                <button onClick={() => { setTab("register"); setError(""); }} className="text-[#5b5be6] font-semibold hover:underline">
                  Open account
                </button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => { setTab("login"); setError(""); }} className="text-[#5b5be6] font-semibold hover:underline">
                  Sign in
                </button>
              </>
            )}
          </div>

          {tab === "register" && (
            <div className="mt-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-[#5b5be6] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Your keys. Your sovereignty.</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    NEXA Pay generates a cryptographically secure Ethereum wallet. Your private key is encrypted locally and never transmitted to any server.
                  </p>
                </div>
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-[11px] text-slate-300">
            Protected by WebAuthn (FIDO2) · NEXA Financial Technologies Ltd.
          </p>
        </div>
      </div>
    </div>
  );
}
