import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { listWallets } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Zap, Shield, Globe, BarChart2, ArrowRightLeft,
  CheckCircle2, ChevronRight, Play, Users, Store,
  Code2, Building2, Twitter, Send, ArrowDownLeft
} from "lucide-react";

/* ── Nexa logo mark ─────────────────────────────────────── */
function NexaLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00e5ff"/>
          <stop offset="55%" stopColor="#2979ff"/>
          <stop offset="100%" stopColor="#1a237e"/>
        </linearGradient>
        <linearGradient id="aG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2979ff"/>
          <stop offset="100%" stopColor="#00e5ff"/>
        </linearGradient>
      </defs>
      <circle cx="22" cy="42" r="3" fill="#00e5ff" opacity="0.7"/>
      <circle cx="10" cy="58" r="2.5" fill="#00e5ff" opacity="0.5"/>
      <line x1="22" y1="42" x2="10" y2="58" stroke="#00e5ff" strokeWidth="1.2" opacity="0.5"/>
      <circle cx="98" cy="28" r="3" fill="#00e5ff" opacity="0.7"/>
      <line x1="85" y1="22" x2="98" y2="28" stroke="#00e5ff" strokeWidth="1.2" opacity="0.4"/>
      <path d="M20 88 L20 22 L36 22 L68 62 L68 22 L84 22 L84 88 L68 88 L36 48 L36 88 Z" fill="url(#nG)"/>
      <path d="M36 30 L62 62 L62 30 Z" fill="#0a1628" opacity="0.45"/>
      <path d="M82 52 L100 52 L100 44 L116 60 L100 76 L100 68 L82 68 Z" fill="url(#aG)" opacity="0.9"/>
    </svg>
  );
}

const FEATURES = [
  {
    icon: Zap,
    title: "Tap to Pay",
    desc: "Pay in-store or online using your crypto wallet. Fast, easy and secure.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: BarChart2,
    title: "Instant Settlement",
    desc: "Real-time crypto settlement 24/7. No waiting. No middlemen.",
    color: "from-violet-500 to-blue-500",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "Your assets are protected with top-tier non-custodial security.",
    color: "from-cyan-500 to-teal-400",
  },
];

const AUDIENCES = [
  { icon: Users,     label: "Users",      sub: "Pay anywhere instantly" },
  { icon: Store,     label: "Merchants",  sub: "Accept crypto with ease" },
  { icon: Code2,     label: "Developers", sub: "Powerful APIs and SDKs" },
  { icon: Building2, label: "Businesses", sub: "Scale global with Nexa" },
];

const CHAINS = [
  { name: "Ethereum", color: "#627EEA", sym: "ETH" },
  { name: "Polygon",  color: "#8247E5", sym: "MATIC" },
  { name: "BNB Chain",color: "#F0B90B", sym: "BNB" },
  { name: "Avalanche",color: "#E84142", sym: "AVAX" },
  { name: "Arbitrum", color: "#28A0F0", sym: "ARB" },
  { name: "Optimism", color: "#FF0420", sym: "OP" },
];

const PARTNERS = ["CoinStore", "BlockMarket", "CryptoHub", "Web3Pay", "FinixLab"];

/* ── Phone App Mockup ───────────────────────────────────── */
function AppMockup() {
  return (
    <div className="relative w-[260px] mx-auto select-none">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-[40px] blur-[40px] opacity-30" style={{ background: "linear-gradient(135deg,#00e5ff,#2979ff)" }} />
      {/* Phone frame */}
      <div className="relative rounded-[36px] border-[6px] border-slate-800 bg-white shadow-2xl overflow-hidden" style={{ boxShadow: "0 40px 80px -10px rgba(41,121,255,0.4)" }}>
        {/* Status bar */}
        <div className="flex justify-between items-center px-5 pt-3 pb-1 text-[10px] font-semibold text-slate-400 bg-white">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <span>▐▐▐</span>
            <span>WiFi</span>
            <span>⚡</span>
          </div>
        </div>

        {/* Header */}
        <div className="px-5 pt-1 pb-3 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">A</div>
            <div>
              <div className="text-xs text-slate-400">Hello,</div>
              <div className="text-sm font-bold text-slate-900">Alex 👋</div>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 text-xs">🔔</div>
        </div>

        {/* Balance card */}
        <div className="mx-3 rounded-2xl p-4 mb-3" style={{ background: "linear-gradient(135deg,#1a237e 0%,#2979ff 50%,#00b8d4 100%)" }}>
          <div className="text-blue-200 text-[11px] mb-1 font-medium">Total Balance</div>
          <div className="text-white text-2xl font-extrabold mb-1">$76,065.11</div>
          <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-semibold">
            <span>↑</span> +2.20% today
          </div>
          {/* Quick actions */}
          <div className="flex justify-between mt-4">
            {[
              { icon: "↑", label: "Send" },
              { icon: "↓", label: "Receive" },
              { icon: "⇄", label: "Swap" },
              { icon: "⋯", label: "More" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-sm backdrop-blur-sm">{icon}</div>
                <span className="text-[9px] text-blue-200 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet list */}
        <div className="px-4 pb-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-800">Wallets</span>
            <span className="text-xs text-blue-600 font-semibold">See All</span>
          </div>
          {[
            { name: "Nexa Wallet", amount: "1,250.50 USDC", usd: "$1,250.50", color: "#2979ff", sym: "N" },
            { name: "Bitcoin",     amount: "0.025 BTC",    usd: "$1,125.20", color: "#F7931A", sym: "₿" },
            { name: "Ethereum",    amount: "0.320 ETH",    usd: "$256.33",  color: "#627EEA", sym: "Ξ" },
          ].map(w => (
            <div key={w.name} className="flex items-center justify-between py-2 border-b border-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: w.color }}>
                  {w.sym}
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-800">{w.name}</div>
                  <div className="text-[10px] text-slate-400">{w.usd}</div>
                </div>
              </div>
              <div className="text-[11px] font-semibold text-slate-700 text-right">{w.amount}</div>
            </div>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="flex justify-around px-2 py-3 border-t border-slate-100 bg-white">
          {[{ icon: "⊞", label: "Home", active: true }, { icon: "⏱", label: "History" }, { icon: "⊕", label: "Pay" }, { icon: "▣", label: "Cards" }, { icon: "◉", label: "Profile" }].map(({ icon, label, active }) => (
            <div key={label} className={`flex flex-col items-center gap-0.5 ${active ? "text-blue-600" : "text-slate-400"}`}>
              <span className="text-base">{icon}</span>
              <span className="text-[9px] font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function Landing() {
  const [, navigate] = useLocation();

  const { user } = useAuth();

  const { data: wallets, isLoading } = useQuery({
    queryKey: ["wallets"],
    queryFn: () => listWallets(),
    staleTime: 10_000,
    enabled: !!user,
  });

  const hasWallet = !!user && !isLoading && wallets && wallets.length > 0;

  const handleLaunch = () => {
    if (!user) { navigate("/login"); return; }
    navigate(hasWallet ? "/dashboard" : "/onboarding");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <NexaLogo size={32} />
            <div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight">NEXA</span>
              <span className="text-[10px] text-slate-400 ml-1.5 font-medium hidden sm:inline">Payment Crypto</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#networks" className="hover:text-slate-900 transition-colors">Networks</a>
            <a href="#security" className="hover:text-slate-900 transition-colors">Security</a>
            <a href="#business" className="hover:text-slate-900 transition-colors">For Business</a>
          </nav>
          <div className="flex items-center gap-3">
            {!user && (
              <button onClick={() => navigate("/login")} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
                Log In
              </button>
            )}
            <Button
              onClick={handleLaunch}
              className="h-9 px-5 text-sm font-bold rounded-lg gap-1.5"
              style={{ background: "linear-gradient(135deg,#2979ff,#1a237e)", color: "#fff" }}
              disabled={isLoading}
            >
              {isLoading ? "Loading…" : user ? "Open App" : "Get Started"}
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-[0.07] pointer-events-none" style={{ background: "radial-gradient(circle,#2979ff,transparent)", transform: "translate(30%,-30%)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.05] pointer-events-none" style={{ background: "radial-gradient(circle,#00e5ff,transparent)", transform: "translate(-30%,30%)" }} />

        <div className="max-w-6xl mx-auto px-6 pt-20 pb-10 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-3.5 py-1.5 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
              The Next Generation of Crypto Payments
            </div>

            <h1 className="text-5xl md:text-[58px] font-black text-slate-900 leading-none mb-4 tracking-tight">
              Send. Receive.<br />
              <span className="nexa-text-gradient">Instantly.</span>
            </h1>

            <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-lg">
              The next generation of crypto payments.<br />
              <span className="font-semibold text-slate-700">Fast. Secure. Borderless.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Button
                onClick={handleLaunch}
                size="lg"
                className="h-13 px-8 text-base font-bold rounded-xl gap-2 shadow-lg"
                style={{ background: "linear-gradient(135deg,#2979ff,#1a237e)", color: "#fff", boxShadow: "0 8px 30px rgba(41,121,255,0.35)" }}
                disabled={isLoading}
              >
                {isLoading ? "Loading…" : hasWallet ? "Open My Wallet" : "Start Now"}
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-13 px-8 text-base font-semibold rounded-xl gap-2 border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Play className="w-4 h-4 fill-slate-600 text-slate-600" />
                Watch Demo
              </Button>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              {["Non-custodial", "Zero custody fees", "6 networks", "24/7 access"].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <AppMockup />
          </div>
        </div>

        {/* ── 3 Feature cards ── */}
        <div className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 mb-1">{title}</div>
                  <div className="text-sm text-slate-500 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Built for Everyone ── */}
      <section id="business" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Built for Everyone</h2>
          <p className="text-slate-500 mb-12">Powering payments for people and businesses around the world.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {AUDIENCES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="font-bold text-slate-900">{label}</div>
                <div className="text-xs text-slate-500 text-center">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-slate-400 mb-8 uppercase tracking-widest">Trusted by forward-thinking companies</p>
          <div className="flex flex-wrap justify-center gap-10 items-center">
            {PARTNERS.map(p => (
              <div key={p} className="text-slate-400 font-bold text-lg tracking-tight hover:text-slate-600 transition-colors cursor-default">{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Networks ── */}
      <section id="networks" className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Networks</div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">6 blockchains, one wallet</h2>
          <p className="text-slate-500 mb-12 max-w-xl mx-auto">Seamlessly manage assets across all major EVM-compatible chains. No switching, no friction.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {CHAINS.map(({ name, color, sym }) => (
              <div key={name} className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ backgroundColor: color }}>
                  {sym.slice(0, 2)}
                </div>
                <div className="text-xs font-bold text-slate-700 text-center leading-tight">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features detail ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Features</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Everything for modern crypto management
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              From portfolio tracking to real-time swaps — Nexa puts every tool at your fingertips.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe,          title: "Multi-Chain Portfolio",  desc: "Track all assets across 6 networks in a single unified dashboard." },
              { icon: BarChart2,      title: "Live Performance Charts", desc: "Area charts with 1D/7D/30D/90D/1Y periods and real-time price updates." },
              { icon: ArrowRightLeft, title: "Instant Token Swaps",    desc: "Swap any pair at live rates with configurable slippage and estimated fees." },
              { icon: Zap,            title: "NFT Gallery",            desc: "Browse your full NFT collection with floor prices and rarity details." },
              { icon: Shield,         title: "Non-Custodial Security", desc: "Your keys never leave your device. Auto-lock and biometric auth built in." },
              { icon: Send,           title: "Full Tx History",        desc: "Filter, search and audit every on-chain activity with status badges." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-sm">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security ── */}
      <section id="security" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Security First</div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-5">Safe. Fast. Borderless.</h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Nexa is fully non-custodial. Your private keys are generated and stored only on your device — we never touch your funds.
              </p>
              {[
                "Private keys never leave your device",
                "AES-256 encrypted local storage",
                "Biometric & password authentication",
                "Auto-lock after 5 minutes of inactivity",
                "Open-source and community-auditable",
              ].map(item => (
                <div key={item} className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl blur-2xl opacity-15" style={{ background: "linear-gradient(135deg,#00e5ff,#2979ff)" }} />
              <div className="relative rounded-3xl border border-blue-100 bg-white p-10 text-center shadow-lg">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg" style={{ background: "linear-gradient(135deg,#2979ff,#1a237e)" }}>
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div className="text-xl font-bold text-slate-900 mb-2">Bank-grade security</div>
                <div className="text-slate-500 text-sm mb-6">Zero server-side key custody. No data breaches possible by design.</div>
                <div className="grid grid-cols-3 gap-3">
                  {[["0", "Data breaches"], ["100%", "Self-custody"], ["∞", "Uptime"]].map(([v, l]) => (
                    <div key={l} className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                      <div className="font-extrabold text-blue-600 text-lg">{v}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24" style={{ background: "linear-gradient(135deg,#0a1628 0%,#1a237e 50%,#0d2050 100%)" }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <NexaLogo size={52} />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-6 mb-4">
            Ready to pay instantly?
          </h2>
          <p className="text-blue-300 text-lg mb-10">
            Create your Nexa wallet in under 60 seconds.<br />No email. No KYC. No custody.
          </p>
          <Button
            onClick={handleLaunch}
            size="lg"
            disabled={isLoading}
            className="h-14 px-10 text-base font-bold rounded-xl gap-2"
            style={{ background: "linear-gradient(135deg,#00e5ff,#2979ff)", color: "#0a1628", boxShadow: "0 10px 40px rgba(0,229,255,0.3)" }}
          >
            {isLoading ? "Loading…" : hasWallet ? "Open My Wallet" : "Create Free Wallet"}
            <ChevronRight className="w-4 h-4" />
          </Button>
          <p className="text-blue-500 text-xs mt-5">100% non-custodial · No registration required · Always free</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <NexaLogo size={28} />
                <span className="font-extrabold text-white tracking-tight">NEXA</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">The next generation of crypto payments. Fast. Secure. Borderless.</p>
            </div>
            {[
              { title: "Product",   links: ["Features", "Pricing", "Security", "Roadmap"] },
              { title: "Company",   links: ["About Us", "Careers", "Blog", "Contact"] },
              { title: "Resources", links: ["Developers", "Docs", "Help Center", "Community"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">{title}</div>
                <ul className="space-y-2">
                  {links.map(l => (
                    <li key={l}><a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Follow Us</div>
              <div className="flex gap-3">
                {[Twitter, Send, ArrowDownLeft].map((Icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <span>© 2025 Nexa Payment Crypto. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
