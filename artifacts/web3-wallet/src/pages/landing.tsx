import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { listWallets } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Zap, Shield, Globe, BarChart2, ArrowRightLeft, CheckCircle2,
  ChevronRight, Play, Users, Store, Code2, Building2,
  Send, Fingerprint, Lock, Award, TrendingUp, Cpu,
} from "lucide-react";
import { CryptoIcon } from "@/components/crypto-icon";

/* ── NEXA Logo ── */
function NexaLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nGL" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c6fcd"/>
          <stop offset="55%" stopColor="#5b5be6"/>
          <stop offset="100%" stopColor="#1a1363"/>
        </linearGradient>
        <linearGradient id="aGL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5b5be6"/>
          <stop offset="100%" stopColor="#00e5ff"/>
        </linearGradient>
      </defs>
      <path d="M20 88 L20 22 L36 22 L68 62 L68 22 L84 22 L84 88 L68 88 L36 48 L36 88 Z" fill="url(#nGL)"/>
      <path d="M36 30 L62 62 L62 30 Z" fill="#0a1628" opacity="0.35"/>
      <path d="M82 52 L100 52 L100 44 L116 60 L100 76 L100 68 L82 68 Z" fill="url(#aGL)" opacity="0.9"/>
    </svg>
  );
}

/* ── Animated particle background ── */
function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {[...Array(20)].map((_, i) => {
        const size = Math.random() * 5 + 2;
        return (
          <div
            key={i}
            className="particle absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              bottom: "-10px",
              background: `rgba(${91 + Math.round(Math.random() * 60)},${91 + Math.round(Math.random() * 40)},230,${Math.random() * 0.35 + 0.05})`,
              animationDuration: `${Math.random() * 12 + 8}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        );
      })}
      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none orb-float opacity-[0.04]"
        style={{ background: "radial-gradient(circle,#5b5be6,transparent)", animationDuration: "12s" }} />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none orb-float opacity-[0.04]"
        style={{ background: "radial-gradient(circle,#00e5ff,transparent)", animationDuration: "15s", animationDelay: "4s" }} />
    </div>
  );
}

/* ── Animated counter ── */
function Counter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const step = target / 60;
      const interval = setInterval(() => {
        start += step;
        if (start >= target) { setVal(target); clearInterval(interval); }
        else setVal(Math.floor(start));
      }, 16);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ── Phone mockup (NEXA Pay style) ── */
function PhoneMockup() {
  const CHAINS = [
    { sym: "BTC", color: "#F7931A", val: "$42,180" },
    { sym: "ETH", color: "#627EEA", val: "$2,456" },
    { sym: "MATIC", color: "#8247E5", val: "$0.87" },
  ];

  return (
    <div className="relative w-[260px] mx-auto select-none">
      <div className="absolute inset-0 rounded-[40px] blur-[50px] opacity-25"
        style={{ background: "linear-gradient(135deg,#5b5be6,#7c6fcd)" }} />
      <div className="relative rounded-[36px] border-[6px] border-slate-800 bg-[#eef0fb] shadow-2xl overflow-hidden"
        style={{ boxShadow: "0 40px 80px -10px rgba(91,91,230,0.5)" }}>
        {/* Status bar */}
        <div className="flex justify-between items-center px-5 pt-3 pb-1 text-[10px] font-semibold text-slate-400 bg-white/80">
          <span>9:41</span>
          <div className="flex items-center gap-1"><span>▐▐▐</span><span>5G</span><span>⚡</span></div>
        </div>

        {/* Header */}
        <div className="px-4 pt-2 pb-2 bg-white/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <NexaLogo size={20} />
            <span className="font-extrabold text-[13px] text-slate-900">NEXA <span className="text-[#5b5be6]">Pay</span></span>
          </div>
          <div className="text-slate-400 text-xs">≡</div>
        </div>

        {/* Sub-header */}
        <div className="px-4 pb-2 bg-white/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-extrabold"
              style={{ background: "linear-gradient(135deg,#5b5be6,#7c6fcd)" }}>64</div>
            <div>
              <p className="text-[9px] text-slate-400">Good morning 👋</p>
              <p className="text-[11px] font-extrabold text-slate-900">My Wallet</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-500">↺</div>
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-500">🔔</div>
          </div>
        </div>

        {/* Portfolio card */}
        <div className="mx-3 rounded-2xl p-4 mb-3"
          style={{ background: "linear-gradient(135deg,#1a1363 0%,#2d2b8e 40%,#5b5be6 80%,#7c6fcd 100%)" }}>
          <div className="flex items-start justify-between mb-1">
            <p className="text-blue-200 text-[9px] font-semibold uppercase tracking-wider">Total Portfolio</p>
            <div className="bg-emerald-400/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full">↑ +6.28%</div>
          </div>
          <div className="text-white text-2xl font-black mb-0.5">$160.00</div>
          <p className="text-blue-300 text-[9px] font-mono mb-3">0x64a34d69…3eC4e5</p>
          <div className="flex gap-4 mb-3">
            <div>
              <p className="text-blue-300 text-[8px] uppercase tracking-wide">Income</p>
              <p className="text-white text-[11px] font-bold">+$0.00</p>
            </div>
            <div>
              <p className="text-blue-300 text-[8px] uppercase tracking-wide">Txns</p>
              <p className="text-white text-[11px] font-bold">0</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {["Send", "Recv", "NFC", "QR"].map((l) => (
              <div key={l} className="flex flex-col items-center gap-1">
                <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white text-[8px]">⊕</div>
                <span className="text-[8px] text-blue-200 font-medium">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Assets */}
        <div className="bg-white mx-3 rounded-2xl px-3 py-2 mb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold text-slate-900">Assets</span>
            <span className="text-[9px] text-[#5b5be6] font-bold">See All</span>
          </div>
          {CHAINS.map((c) => (
            <div key={c.sym} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-1.5">
                <CryptoIcon symbol={c.sym} size={20} />
                <div>
                  <p className="text-[9px] font-bold text-slate-800">{c.sym}</p>
                </div>
              </div>
              <p className="text-[9px] font-bold text-slate-700">{c.val}</p>
            </div>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="flex justify-around items-end px-2 py-2 bg-white border-t border-slate-100">
          {[
            { icon: "⊞", label: "Home", active: true },
            { icon: "⏱", label: "Activity" },
            null,
            { icon: "▣", label: "Cards" },
            { icon: "◉", label: "Profile" },
          ].map((item, i) => {
            if (!item) return (
              <div key={i} className="flex flex-col items-center gap-0.5 -mt-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                  style={{ background: "linear-gradient(135deg,#5b5be6,#7c6fcd)" }}>
                  <span className="text-white text-sm">⚡</span>
                </div>
                <span className="text-[8px] text-[#5b5be6] font-semibold mt-0.5">Pay</span>
              </div>
            );
            return (
              <div key={i} className={`flex flex-col items-center gap-0.5 ${item.active ? "text-[#5b5be6]" : "text-slate-400"}`}>
                <span className="text-sm">{item.icon}</span>
                <span className="text-[8px] font-medium">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Data ── */
const FEATURES = [
  { icon: Zap,            title: "Instant Settlement",       desc: "Real-time crypto settlement 24/7, 365 days per year. Irreversible. Borderless.", color: "from-violet-500 to-[#5b5be6]" },
  { icon: Shield,         title: "Non-Custodial Security",   desc: "Your cryptographic keys are generated exclusively on-device. We possess zero custody.", color: "from-[#5b5be6] to-cyan-500" },
  { icon: ArrowRightLeft, title: "Cross-Chain Liquidity",    desc: "Seamless token swaps across 6 EVM-compatible networks at institutional-grade rates.", color: "from-cyan-500 to-blue-500" },
];

const NETWORKS = [
  { name: "Ethereum", symbol: "ETH",   color: "#627EEA" },
  { name: "Polygon",  symbol: "MATIC", color: "#8247E5" },
  { name: "BNB Chain",symbol: "BNB",   color: "#F0B90B" },
  { name: "Avalanche",symbol: "AVAX",  color: "#E84142" },
  { name: "Arbitrum", symbol: "ARB",   color: "#28A0F0" },
  { name: "Optimism", symbol: "OP",    color: "#FF0420" },
];

const AUDIENCES = [
  { icon: Users,     label: "Individuals",   sub: "Sovereign asset management for the informed investor" },
  { icon: Store,     label: "Merchants",     sub: "Accept decentralised payments with zero intermediaries" },
  { icon: Code2,     label: "Developers",    sub: "Extensible APIs and SDKs for Web3 integration" },
  { icon: Building2, label: "Institutions",  sub: "Enterprise-grade infrastructure for digital treasury" },
];

const STATS = [
  { label: "Active Wallets",    value: 148000, suffix: "+" },
  { label: "Networks Supported",value: 6,      suffix: "" },
  { label: "Uptime SLA",        value: 99,     suffix: ".9%" },
  { label: "Countries",         value: 180,    suffix: "+" },
];

const SECURITY_POINTS = [
  "Private keys never transmitted — generated and stored exclusively on-device",
  "AES-256-GCM encryption for all locally persisted key material",
  "WebAuthn (FIDO2) biometric authentication — platform authenticator",
  "Cookie-based session management with SameSite-Strict policy",
  "Automatic session expiry and cryptographic nonce rotation",
  "Open architecture — independently auditable by the community",
];

const PARTNERS = ["CoinStore", "Banxa", "Chainlink", "Web3Pay", "Fireblocks", "Alchemy"];

/* ── Main ── */
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

      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 bg-white/92 backdrop-blur-xl border-b border-slate-100"
        style={{ boxShadow: "0 1px 20px rgba(91,91,230,0.06)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <NexaLogo size={30} />
            <div>
              <span className="font-black text-base text-slate-900 tracking-tight">NEXA</span>
              <span className="text-[#5b5be6] font-black text-base ml-1">Pay</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#networks" className="hover:text-slate-900 transition-colors">Networks</a>
            <a href="#security" className="hover:text-slate-900 transition-colors">Security</a>
            <a href="#institutional" className="hover:text-slate-900 transition-colors">Institutional</a>
            <a href="#company" className="hover:text-slate-900 transition-colors">Company</a>
          </nav>
          <div className="flex items-center gap-3">
            {!user && (
              <button onClick={() => navigate("/login")} className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
                Sign In
              </button>
            )}
            <Button
              onClick={handleLaunch}
              className="h-9 px-5 text-sm font-bold rounded-xl gap-1.5 shadow-md hover:shadow-lg transition-shadow"
              style={{ background: "linear-gradient(135deg,#5b5be6,#7c6fcd)", color: "#fff" }}
              disabled={isLoading}
            >
              {isLoading ? "Loading…" : user ? "Open Wallet" : "Get Started"}
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white">
        <ParticleBackground />
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 grid lg:grid-cols-2 gap-16 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 border text-xs font-bold px-3.5 py-1.5 rounded-full mb-7"
              style={{ backgroundColor: "#f0f0ff", borderColor: "#c4c4f5", color: "#5b5be6" }}>
              <Zap className="w-3.5 h-3.5 fill-[#5b5be6]" />
              Next-Generation Decentralised Finance Infrastructure
            </div>

            <h1 className="text-5xl md:text-[58px] font-black text-slate-900 leading-[1.05] mb-5 tracking-tight">
              Sovereign Crypto<br />
              <span className="nexa-text-gradient">Asset Custody.</span>
            </h1>

            <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-lg">
              NEXA Pay delivers <span className="font-bold text-slate-700">institutional-grade, non-custodial</span> digital asset management — engineered for individuals and organisations who demand uncompromising security, cross-chain liquidity, and real-time settlement.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Button
                onClick={handleLaunch}
                size="lg"
                className="h-13 px-8 text-base font-bold rounded-xl gap-2 shadow-xl"
                style={{ background: "linear-gradient(135deg,#5b5be6,#7c6fcd)", color: "#fff", boxShadow: "0 8px 30px rgba(91,91,230,0.4)" }}
                disabled={isLoading}
              >
                {isLoading ? "Loading…" : hasWallet ? "Open My Wallet" : "Open Free Account"}
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-13 px-8 text-base font-semibold rounded-xl gap-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Play className="w-4 h-4 fill-slate-600 text-slate-600" />
                Platform Overview
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              {["Non-custodial architecture", "FIDO2 biometric auth", "6 blockchain networks", "Zero custody fees"].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>

        {/* Feature cards */}
        <div className="max-w-6xl mx-auto px-6 pb-20 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#c4c4f5] transition-all">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 mb-1 text-sm">{title}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Statistics ── */}
      <section className="py-16 bg-[#f8f8ff] border-y border-[#ebebff]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(({ label, value, suffix }) => (
              <div key={label}>
                <div className="text-3xl font-black text-slate-900 mb-1">
                  <Counter target={value} suffix={suffix} />
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Institutional section ── */}
      <section id="institutional" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs font-black uppercase tracking-widest text-[#5b5be6] mb-3">For Institutions & Professionals</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Infrastructure Designed for Demanding Environments
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
              NEXA Pay is engineered to the exacting standards of regulated financial environments. Our architecture accommodates digital treasury operations, structured asset allocation, and audit-grade transaction reporting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Lock,        title: "Regulatory Compliance",     desc: "Designed with FATF Travel Rule awareness and KYC/AML integration pathways for regulated entity deployments." },
              { icon: Cpu,         title: "API-First Architecture",    desc: "RESTful API surface with OpenAPI 3.1 specification enables seamless integration with existing treasury management systems." },
              { icon: Award,       title: "Audit-Ready Reporting",     desc: "Immutable on-chain transaction history, exportable to CSV/XLSX, with full multi-network aggregation across all connected wallets." },
              { icon: TrendingUp,  title: "Portfolio Analytics",       desc: "Real-time mark-to-market valuation, 24h/7d/30d performance attribution, and multi-asset allocation breakdown." },
              { icon: Globe,       title: "Multi-Jurisdiction Reach",  desc: "Operational in 180+ territories with localised currency display and region-specific compliance documentation." },
              { icon: Shield,      title: "HSM-Compatible Design",     desc: "Architecture supports Hardware Security Module integration for institutions requiring offline key ceremony protocols." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-[#c4c4f5] hover:shadow-lg hover:shadow-[#f0f0ff] transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: "#f0f0ff" }}>
                  <Icon className="w-5 h-5 text-[#5b5be6]" />
                </div>
                <h3 className="font-extrabold text-slate-900 mb-2 text-sm">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Networks ── */}
      <section id="networks" className="py-20 bg-[#f8f8ff]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="text-xs font-black uppercase tracking-widest text-[#5b5be6] mb-3">Supported Networks</div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Six Blockchains. One Interface.</h2>
          <p className="text-slate-500 mb-12 max-w-xl mx-auto">
            Manage digital assets across all major EVM-compatible networks through a single, unified platform — eliminating the operational complexity of multi-wallet management.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {NETWORKS.map(({ name, symbol, color }) => (
              <div key={name} className="flex flex-col items-center gap-2.5 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#c4c4f5] transition-all">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shadow-sm">
                  <CryptoIcon symbol={symbol} size={48} />
                </div>
                <div className="text-xs font-extrabold text-slate-700 text-center leading-tight">{name}</div>
                <div className="text-[10px] text-slate-400 font-semibold">{symbol}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs font-black uppercase tracking-widest text-[#5b5be6] mb-3">Platform Capabilities</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Comprehensive Digital Asset Management
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              NEXA Pay consolidates the complete Web3 operational stack into a single, coherent interface — from custody through execution.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe,          title: "Unified Multi-Chain Portfolio",  desc: "Aggregate and track all digital assets across 6 networks in a single real-time dashboard with USD mark-to-market." },
              { icon: BarChart2,      title: "Institutional Performance Charts",desc: "Area charts with configurable periods (1D/7D/30D/90D/1Y) and real-time benchmark comparison." },
              { icon: ArrowRightLeft, title: "Best-Execution Token Swaps",     desc: "Cross-DEX routing for optimal execution with configurable slippage tolerance and fee estimation." },
              { icon: Zap,            title: "NFT Portfolio Management",       desc: "Comprehensive NFT gallery with floor price data, collection analytics, and transfer capabilities." },
              { icon: Fingerprint,    title: "FIDO2 Biometric Authentication", desc: "Platform authenticator integration (Face ID, Touch ID, Windows Hello) for passwordless, phishing-resistant access." },
              { icon: Send,           title: "Granular Transaction History",   desc: "Filter, search and audit every on-chain event with status tracking, block confirmations, and CSV export." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-[#c4c4f5] hover:shadow-lg hover:shadow-[#f0f0ff] transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: "#f0f0ff" }}>
                  <Icon className="w-5 h-5 text-[#5b5be6]" />
                </div>
                <h3 className="font-extrabold text-slate-900 mb-2 text-sm">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Built for everyone ── */}
      <section className="py-20 bg-[#f8f8ff]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Deployed Across Sectors</h2>
          <p className="text-slate-500 mb-12">A single platform engineered to serve the heterogeneous requirements of the modern digital economy.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {AUDIENCES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-[#c4c4f5] hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#f0f0ff" }}>
                  <Icon className="w-6 h-6 text-[#5b5be6]" />
                </div>
                <div className="font-extrabold text-slate-900">{label}</div>
                <div className="text-xs text-slate-500 text-center leading-relaxed">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">Integrated with leading Web3 infrastructure providers</p>
          <div className="flex flex-wrap justify-center gap-10 items-center">
            {PARTNERS.map(p => (
              <div key={p} className="text-slate-400 font-extrabold text-lg tracking-tight hover:text-[#5b5be6] transition-colors cursor-default">{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security ── */}
      <section id="security" className="py-24 bg-[#f8f8ff]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-[#5b5be6] mb-3">Security Architecture</div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-5">Engineered for Sovereign Asset Protection</h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                NEXA Pay operates on a strictly non-custodial architecture. Cryptographic key material is generated and retained exclusively within the client environment — our infrastructure possesses zero access to user funds at any point in the operational lifecycle.
              </p>
              {SECURITY_POINTS.map(item => (
                <div key={item} className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl blur-2xl opacity-10" style={{ background: "linear-gradient(135deg,#5b5be6,#7c6fcd)" }} />
              <div className="relative rounded-3xl border border-[#c4c4f5] bg-white p-10 text-center shadow-lg">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg animate-pulse-glow"
                  style={{ background: "linear-gradient(135deg,#5b5be6,#7c6fcd)" }}>
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div className="text-xl font-extrabold text-slate-900 mb-2">Zero-Knowledge Custody</div>
                <div className="text-slate-500 text-sm mb-6 leading-relaxed">
                  Architectural impossibility of server-side compromise. Your assets exist solely under your cryptographic authority.
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[["0", "Server-side key access"], ["100%", "Self-custody"], ["FIDO2", "Authentication"]].map(([v, l]) => (
                    <div key={l} className="rounded-xl p-3 border border-[#ebebff]" style={{ backgroundColor: "#f8f8ff" }}>
                      <div className="font-extrabold text-[#5b5be6] text-base">{v}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Company section ── */}
      <section id="company" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-xs font-black uppercase tracking-widest text-[#5b5be6] mb-3">About NEXA Financial Technologies</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-5">
              The Infrastructure Layer for Decentralised Finance
            </h2>
            <p className="text-slate-500 max-w-3xl mx-auto leading-relaxed text-base">
              NEXA Financial Technologies Ltd. was established with a singular mandate: to construct a professional-grade, non-custodial digital asset management platform that upholds the foundational principles of cryptographic sovereignty while delivering the operational sophistication demanded by institutional participants. Our engineering organisation comprises veterans of regulated financial services, blockchain protocol development, and enterprise security architecture. NEXA Pay represents the convergence of institutional rigour with the decentralised ethos — a platform where individual sovereignty and professional capability are not mutually exclusive.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { title: "Our Mission",   body: "To democratise access to sovereign digital asset custody — delivering to every participant the tools previously reserved for institutional custodians, without compromise on security, transparency, or user autonomy." },
              { title: "Our Values",    body: "Cryptographic integrity, radical transparency, and unwavering commitment to user sovereignty underpin every architectural decision. We operate as stewards of the non-custodial paradigm." },
              { title: "Our Vision",   body: "A global financial system in which any individual or organisation can participate as a sovereign economic actor — conducting value transfer across borders without intermediary gatekeeping or censorship." },
            ].map(({ title, body }) => (
              <div key={title} className="p-6 bg-[#f8f8ff] rounded-2xl border border-[#ebebff]">
                <h3 className="font-extrabold text-slate-900 mb-3">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-extrabold text-slate-900 mb-2 text-sm">Legal & Compliance</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                NEXA Financial Technologies Ltd. is incorporated as a private limited company. Our platform operates in compliance with applicable digital asset service provider regulations across supported jurisdictions. We maintain comprehensive AML/KYC integration pathways for regulated entity deployments and provide full audit trail capabilities for compliance reporting purposes.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-extrabold text-slate-900 mb-2 text-sm">Technology Standards</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                NEXA Pay adheres to BIP-32/BIP-39/BIP-44 hierarchical deterministic wallet standards, implements WebAuthn Level 3 (FIDO2) authentication, utilises AES-256-GCM for all local key material encryption, and maintains OpenAPI 3.1 specification compliance across all API surfaces. Our infrastructure is auditable, reproducible, and independently verifiable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0a0e24 0%,#1a1363 45%,#2d2b8e 75%,#5b5be6 100%)" }}>
        <ParticleBackground />
        <div className="max-w-2xl mx-auto px-6 text-center relative">
          <NexaLogo size={56} />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-6 mb-4">
            Establish Sovereign Control of Your Digital Assets
          </h2>
          <p className="text-blue-300 text-lg mb-10 leading-relaxed">
            Open your non-custodial NEXA Pay wallet in under 60 seconds.<br />
            <span className="text-blue-400 text-base">No email. No KYC. No custody. No compromise.</span>
          </p>
          <Button
            onClick={handleLaunch}
            size="lg"
            disabled={isLoading}
            className="h-14 px-10 text-base font-bold rounded-xl gap-2"
            style={{ background: "linear-gradient(135deg,#7c6fcd,#5b5be6)", color: "#fff", boxShadow: "0 10px 40px rgba(91,91,230,0.5)" }}
          >
            {isLoading ? "Loading…" : hasWallet ? "Open My Wallet" : "Open Free Account"}
            <ChevronRight className="w-4 h-4" />
          </Button>
          <p className="text-blue-500 text-xs mt-5">
            100% non-custodial · Zero custody fees · FIDO2 biometric authentication
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <NexaLogo size={24} />
                <span className="font-extrabold text-slate-900">NEXA <span className="text-[#5b5be6]">Pay</span></span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Non-custodial digital asset management infrastructure for the sovereign individual and institutional participant.
              </p>
            </div>
            {[
              { title: "Platform", links: ["Dashboard", "Portfolio", "Swap", "NFTs", "Market"] },
              { title: "Company",  links: ["About", "Security", "API Docs", "Compliance", "Contact"] },
              { title: "Legal",    links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Risk Disclosure"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-extrabold text-slate-900 text-sm mb-4">{title}</h4>
                <ul className="space-y-2">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-xs text-slate-400 hover:text-[#5b5be6] transition-colors font-medium">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-4">
            <p className="text-xs text-slate-400">
              © 2025 NEXA Financial Technologies Ltd. All rights reserved. Not investment advice.
            </p>
            <p className="text-xs text-slate-400">
              Regulated digital asset infrastructure · WebAuthn (FIDO2) · AES-256-GCM
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
