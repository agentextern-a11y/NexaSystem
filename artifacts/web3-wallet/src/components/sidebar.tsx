import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, PieChart, Wallet, ArrowRightLeft,
  Image as ImageIcon, Coins, Settings, History, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useListWallets, getListWalletsQueryKey, useListNetworks, getListNetworksQueryKey } from "@workspace/api-client-react";

/* ── Nexa logo mark (small version for sidebar) ── */
function NexaMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="sG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00e5ff"/>
          <stop offset="100%" stopColor="#2979ff"/>
        </linearGradient>
      </defs>
      <path d="M20 88 L20 22 L36 22 L68 62 L68 22 L84 22 L84 88 L68 88 L36 48 L36 88 Z" fill="url(#sG)"/>
      <path d="M36 30 L62 62 L62 30 Z" fill="#0a1628" opacity="0.45"/>
      <path d="M82 52 L100 52 L100 44 L116 60 L100 76 L100 68 L82 68 Z" fill="#00e5ff" opacity="0.85"/>
    </svg>
  );
}

const navItems = [
  { href: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { href: "/portfolio",    label: "Portfolio",    icon: PieChart },
  { href: "/wallets",      label: "Wallets",      icon: Wallet },
  { href: "/transactions", label: "Transactions", icon: History },
  { href: "/swap",         label: "Swap",         icon: ArrowRightLeft },
  { href: "/nfts",         label: "NFTs",         icon: ImageIcon },
  { href: "/tokens",       label: "Market",       icon: Coins },
  { href: "/settings",     label: "Settings",     icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const activePath = location === "/" ? "/dashboard" : location;
  const [walletOpen, setWalletOpen] = useState(false);

  const { data: wallets = [] } = useListWallets({ query: { queryKey: getListWalletsQueryKey() } });
  const { data: networks = [] } = useListNetworks({ query: { queryKey: getListNetworksQueryKey() } });

  const activeWallet = wallets[0];
  const activeNetwork = networks.find(n => n.id === activeWallet?.networkId);

  return (
    <div
      className="w-64 flex flex-col h-screen fixed left-0 top-0 z-40"
      style={{ backgroundColor: "hsl(222,60%,8%)", borderRight: "1px solid hsl(222,45%,14%)" }}
    >
      {/* ── Logo ── */}
      <div className="p-5 border-b" style={{ borderColor: "hsl(222,45%,14%)" }}>
        <Link href="/">
          <div className="flex items-center gap-2.5 mb-5 cursor-pointer group">
            <NexaMark />
            <div>
              <div className="font-extrabold text-white text-base leading-none tracking-wider">NEXA</div>
              <div className="text-[10px] mt-0.5 font-medium tracking-wide" style={{ color: "hsl(185,80%,55%)" }}>
                Payment Crypto
              </div>
            </div>
          </div>
        </Link>

        {/* Wallet selector */}
        {wallets.length > 0 && (
          <button
            onClick={() => setWalletOpen(v => !v)}
            className="w-full flex items-center justify-between rounded-xl p-3 text-left transition-colors"
            style={{ backgroundColor: "hsl(222,45%,13%)", border: "1px solid hsl(222,45%,20%)" }}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div
                className="w-6 h-6 rounded-full flex-shrink-0"
                style={{ backgroundColor: activeWallet?.color || "#2979ff" }}
              />
              <div className="truncate">
                <div className="text-sm font-semibold text-white truncate">{activeWallet?.name || "All Wallets"}</div>
                <div className="text-[10px] truncate font-mono" style={{ color: "hsl(210,20%,50%)" }}>
                  {activeWallet?.address ? `${activeWallet.address.slice(0, 6)}...${activeWallet.address.slice(-4)}` : ""}
                </div>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${walletOpen ? "rotate-180" : ""}`} style={{ color: "hsl(210,20%,50%)" }} />
          </button>
        )}

        {walletOpen && wallets.length > 1 && (
          <div className="mt-1 rounded-xl overflow-hidden" style={{ backgroundColor: "hsl(222,45%,12%)", border: "1px solid hsl(222,45%,20%)" }}>
            {wallets.map(w => (
              <button key={w.id} className="w-full flex items-center gap-2 p-2.5 text-left hover:bg-white/5 transition-colors">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: w.color || "#2979ff" }} />
                <span className="text-sm text-white truncate">{w.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <div className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2.5" style={{ color: "hsl(210,20%,35%)" }}>
          Main Menu
        </div>
        {navItems.map((item) => {
          const isActive = activePath.startsWith(item.href === "/dashboard" ? "/dashboard" : item.href);
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-sm font-medium",
                isActive
                  ? "text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/6"
              )}
                style={isActive ? { background: "linear-gradient(135deg,rgba(41,121,255,0.7),rgba(0,229,255,0.3))", boxShadow: "0 0 12px rgba(41,121,255,0.25)" } : {}}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="p-4 border-t" style={{ borderColor: "hsl(222,45%,14%)" }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
          <span className="text-xs" style={{ color: "hsl(210,20%,50%)" }}>
            {activeNetwork?.name || "Ethereum Mainnet"} · Live
          </span>
        </div>
        <div className="text-[10px]" style={{ color: "hsl(210,20%,30%)" }}>
          © 2025 Nexa Payment Crypto
        </div>
      </div>
    </div>
  );
}
