import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { listWallets } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import {
  Shield, Zap, Globe, BarChart2, ArrowRightLeft, Image as ImageIcon,
  Lock, ChevronRight, Star, TrendingUp, Wallet, CheckCircle2
} from "lucide-react";

const FEATURES = [
  {
    icon: Globe,
    title: "Multi-Chain Support",
    desc: "Manage assets across Ethereum, Polygon, BNB Chain, Avalanche, Arbitrum, and Optimism from one dashboard.",
  },
  {
    icon: BarChart2,
    title: "Live Portfolio Tracking",
    desc: "Real-time prices, 24h change, portfolio history charts, and wallet-level breakdown — all in one view.",
  },
  {
    icon: ArrowRightLeft,
    title: "Instant Token Swaps",
    desc: "Swap any supported token pair at live market rates with configurable slippage tolerance and estimated fees.",
  },
  {
    icon: ImageIcon,
    title: "NFT Gallery",
    desc: "Browse all your NFTs with floor prices, collection names, and rarity details — beautifully laid out.",
  },
  {
    icon: Shield,
    title: "Non-Custodial Security",
    desc: "Your private keys never leave your device. Auto-lock, biometric auth, and password protection built in.",
  },
  {
    icon: Lock,
    title: "Full Transaction History",
    desc: "Filter, search, and audit every on-chain activity with status badges and explorer deep-links.",
  },
];

const CHAINS = [
  { name: "Ethereum", color: "#627EEA", symbol: "ETH" },
  { name: "Polygon", color: "#8247E5", symbol: "MATIC" },
  { name: "BNB Chain", color: "#F0B90B", symbol: "BNB" },
  { name: "Avalanche", color: "#E84142", symbol: "AVAX" },
  { name: "Arbitrum", color: "#28A0F0", symbol: "ARB" },
  { name: "Optimism", color: "#FF0420", symbol: "OP" },
];

const STATS = [
  { value: "6", label: "Supported Chains" },
  { value: "100+", label: "Listed Tokens" },
  { value: "0%", label: "Custody Fees" },
  { value: "24/7", label: "Market Data" },
];

export default function Landing() {
  const [, navigate] = useLocation();

  const { data: wallets, isLoading } = useQuery({
    queryKey: ["wallets"],
    queryFn: () => listWallets(),
    staleTime: 10_000,
  });

  const handleLaunch = () => {
    if (!isLoading && wallets && wallets.length > 0) {
      navigate("/dashboard");
    } else {
      navigate("/onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">NP</div>
            <span className="font-bold text-lg text-slate-900">NP Wallet</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#chains" className="hover:text-slate-900 transition-colors">Networks</a>
            <a href="#security" className="hover:text-slate-900 transition-colors">Security</a>
          </nav>
          <Button
            onClick={handleLaunch}
            className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 text-sm gap-1.5"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : (wallets && wallets.length > 0 ? "Open App" : "Get Started")}
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-100 opacity-60 blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-100 opacity-50 blur-[120px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
            <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
            Professional Web3 Portfolio Manager
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
            Your crypto.<br />
            <span className="text-blue-600">All in one place.</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            NP Wallet is a professional, non-custodial Web3 wallet for managing digital assets across multiple blockchains.
            Track portfolios, swap tokens, browse NFTs, and monitor live market data — all with a clean, fast interface.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleLaunch}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 text-base font-semibold gap-2 rounded-xl shadow-lg shadow-blue-200"
              disabled={isLoading}
            >
              <Wallet className="w-5 h-5" />
              {isLoading ? "Loading..." : (wallets && wallets.length > 0 ? "Open Your Wallet" : "Create Your Wallet")}
              <ChevronRight className="w-4 h-4" />
            </Button>
            <a href="#features" className="text-slate-500 hover:text-slate-700 text-sm font-medium flex items-center gap-1.5 transition-colors">
              Learn more ↓
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            {["Non-custodial", "Open source", "Zero fees", "6 networks"].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* App Preview mockup */}
        <div className="relative max-w-5xl mx-auto px-6 pb-20">
          <div className="rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200 overflow-hidden bg-slate-50">
            {/* Mock browser chrome */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="ml-4 flex-1 bg-white rounded border border-slate-200 px-3 py-1 text-xs text-slate-400 max-w-xs">
                npwallet.app/dashboard
              </div>
            </div>
            {/* Fake dashboard preview */}
            <div className="flex" style={{ minHeight: 280 }}>
              {/* Sidebar preview */}
              <div className="w-44 flex-shrink-0 p-4" style={{ backgroundColor: "hsl(222,47%,11%)" }}>
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center text-white text-[9px] font-bold">NP</div>
                  <span className="text-white text-xs font-bold">NP Wallet</span>
                </div>
                {["Dashboard", "Portfolio", "Wallets", "Transactions", "Swap", "NFTs"].map((item, i) => (
                  <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded text-[10px] mb-0.5 ${i === 0 ? "bg-blue-600 text-white" : "text-slate-400"}`}>
                    <div className="w-2 h-2 rounded-sm bg-current opacity-70" />
                    {item}
                  </div>
                ))}
              </div>
              {/* Content preview */}
              <div className="flex-1 p-5 bg-slate-50/80">
                <div className="text-xs font-bold text-slate-700 mb-3">Dashboard</div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[["$76,065", "Total Value"], ["3", "Wallets"], ["10", "Transactions"]].map(([v, l]) => (
                    <div key={l} className="bg-white rounded-lg p-2.5 border border-slate-100 shadow-sm">
                      <div className="text-[9px] text-slate-400 mb-1">{l}</div>
                      <div className="text-sm font-bold text-slate-800">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-2.5 border border-slate-100 shadow-sm">
                    <div className="text-[9px] text-slate-400 mb-2 font-semibold">Top Tokens</div>
                    {[["ETH", "$3,218", "+2.34%", "#627EEA"], ["BTC", "$62,451", "-0.87%", "#F7931A"]].map(([sym, price, chg, color]) => (
                      <div key={sym} className="flex items-center justify-between py-1 border-t border-slate-50">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-[9px] font-medium text-slate-700">{sym}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] font-semibold text-slate-800">{price}</div>
                          <div className={`text-[8px] font-medium ${chg.startsWith('+') ? "text-emerald-600" : "text-red-500"}`}>{chg}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-slate-100 shadow-sm">
                    <div className="text-[9px] text-slate-400 mb-2 font-semibold">Recent Activity</div>
                    {[["Received ETH", "+$5,793", "receive"], ["Sent USDC", "-$500", "send"], ["Swapped MATIC", "$1,235", "swap"]].map(([title, val, type]) => (
                      <div key={title} className="flex items-center justify-between py-1 border-t border-slate-50">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] ${type === "receive" ? "bg-emerald-100 text-emerald-600" : type === "send" ? "bg-red-100 text-red-500" : "bg-blue-100 text-blue-600"}`}>
                            {type === "receive" ? "↓" : type === "send" ? "↑" : "⇄"}
                          </div>
                          <span className="text-[9px] text-slate-600">{title}</span>
                        </div>
                        <span className={`text-[9px] font-semibold ${type === "receive" ? "text-emerald-600" : "text-slate-700"}`}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-extrabold text-white mb-1">{value}</div>
              <div className="text-sm text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Features</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Everything you need to manage crypto</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Built for both beginners and power users, NP Wallet covers every aspect of digital asset management.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Networks */}
      <section id="chains" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Networks</div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">6 blockchains, one wallet</h2>
          <p className="text-slate-500 mb-12 max-w-xl mx-auto">
            Seamlessly manage assets across all major EVM-compatible chains. No switching, no friction.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {CHAINS.map(({ name, color, symbol }) => (
              <div key={name} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: color }}
                >
                  {symbol.slice(0, 2)}
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900 text-sm">{name}</div>
                  <div className="text-xs text-slate-400 font-mono">{symbol}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security section */}
      <section id="security" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Security First</div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-5">Your keys, your crypto</h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                NP Wallet is fully non-custodial. Private keys are generated and stored exclusively on your device — we never have access to your funds.
              </p>
              <div className="space-y-4">
                {[
                  "Private keys never leave your device",
                  "Biometric & password authentication",
                  "Auto-lock after inactivity",
                  "Seed phrase backup & recovery",
                  "Open-source & auditable",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl" />
              <div className="relative p-10 text-center">
                <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-200">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div className="text-xl font-bold text-slate-900 mb-2">Bank-grade security</div>
                <div className="text-slate-500 text-sm">
                  AES-256 encrypted local storage, zero server-side key custody, hardware wallet support coming soon.
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[["0", "Data breaches"], ["100%", "Self-custody"], ["∞", "Uptime"]].map(([v, l]) => (
                    <div key={l} className="bg-white rounded-xl p-3 border border-blue-100 shadow-sm">
                      <div className="font-extrabold text-blue-600 text-lg">{v}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <TrendingUp className="w-10 h-10 text-blue-400 mx-auto mb-5" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to take control?</h2>
          <p className="text-slate-400 text-lg mb-10">
            Create your first wallet in under 60 seconds. No email. No KYC. No custody.
          </p>
          <Button
            onClick={handleLaunch}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-10 text-base font-semibold gap-2 rounded-xl shadow-xl shadow-blue-900/40"
            disabled={isLoading}
          >
            <Wallet className="w-5 h-5" />
            {isLoading ? "Loading..." : (wallets && wallets.length > 0 ? "Open My Wallet" : "Create Free Wallet")}
          </Button>
          <p className="text-slate-600 text-xs mt-5">
            100% non-custodial · No registration required · Always free
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">NP</div>
            <span className="font-bold text-white">NP Wallet</span>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-slate-500">
            <a href="#features" className="hover:text-slate-300 transition-colors">Features</a>
            <a href="#chains" className="hover:text-slate-300 transition-colors">Networks</a>
            <a href="#security" className="hover:text-slate-300 transition-colors">Security</a>
          </nav>
          <p className="text-slate-600 text-xs">© 2025 NP Wallet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
