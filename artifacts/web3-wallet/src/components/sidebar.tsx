import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  PieChart,
  Wallet,
  ArrowRightLeft,
  Image as ImageIcon,
  Coins,
  Settings,
  History,
  ChevronDown,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useListWallets, getListWalletsQueryKey, useListNetworks, getListNetworksQueryKey } from "@workspace/api-client-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portfolio", label: "Portfolio", icon: PieChart },
  { href: "/wallets", label: "Wallets", icon: Wallet },
  { href: "/transactions", label: "Transactions", icon: History },
  { href: "/swap", label: "Swap", icon: ArrowRightLeft },
  { href: "/nfts", label: "NFTs", icon: ImageIcon },
  { href: "/tokens", label: "Market", icon: Coins },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  // Treat "/dashboard" and "/" as the same active state for the Dashboard nav item
  const activePath = location === "/" ? "/dashboard" : location;
  const [walletOpen, setWalletOpen] = useState(false);
  const { data: wallets = [] } = useListWallets({ query: { queryKey: getListWalletsQueryKey() } });
  const { data: networks = [] } = useListNetworks({ query: { queryKey: getListNetworksQueryKey() } });

  const activeWallet = wallets[0];
  const activeNetwork = networks.find(n => n.id === activeWallet?.networkId);

  return (
    <div
      className="w-64 flex flex-col h-screen fixed left-0 top-0 z-40"
      style={{
        backgroundColor: "hsl(222, 47%, 11%)",
        borderRight: "1px solid hsl(222, 40%, 18%)"
      }}
    >
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: "hsl(222, 40%, 18%)" }}>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
            NP
          </div>
          <div>
            <div className="font-bold text-white text-base leading-none">NP Wallet</div>
            <div className="text-xs mt-0.5" style={{ color: "hsl(210, 20%, 55%)" }}>Web3 Portfolio Manager</div>
          </div>
        </div>

        {/* Wallet selector */}
        {wallets.length > 0 && (
          <button
            onClick={() => setWalletOpen(!walletOpen)}
            className="w-full flex items-center justify-between rounded-lg p-2.5 text-left transition-colors"
            style={{ backgroundColor: "hsl(222, 40%, 16%)", border: "1px solid hsl(222, 40%, 22%)" }}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div
                className="w-6 h-6 rounded-full flex-shrink-0"
                style={{ backgroundColor: activeWallet?.color || "#3b82f6" }}
              />
              <div className="truncate">
                <div className="text-sm font-medium text-white truncate">{activeWallet?.name || "All Wallets"}</div>
                <div className="text-xs truncate" style={{ color: "hsl(210, 20%, 55%)", fontFamily: "monospace" }}>
                  {activeWallet?.address ? `${activeWallet.address.slice(0, 6)}...${activeWallet.address.slice(-4)}` : ""}
                </div>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${walletOpen ? "rotate-180" : ""}`} style={{ color: "hsl(210, 20%, 55%)" }} />
          </button>
        )}

        {/* Dropdown */}
        {walletOpen && wallets.length > 1 && (
          <div className="mt-1 rounded-lg overflow-hidden" style={{ backgroundColor: "hsl(222, 40%, 14%)", border: "1px solid hsl(222, 40%, 22%)" }}>
            {wallets.map(w => (
              <button key={w.id} className="w-full flex items-center gap-2 p-2.5 text-left hover:bg-white/5 transition-colors">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: w.color || "#3b82f6" }} />
                <span className="text-sm text-white truncate">{w.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <div className="text-xs font-semibold uppercase tracking-wider px-3 mb-2" style={{ color: "hsl(210, 20%, 40%)" }}>
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = activePath === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-sm font-medium",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/8"
              )}>
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer — network status */}
      <div className="p-4 border-t" style={{ borderColor: "hsl(222, 40%, 18%)" }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <span className="text-xs" style={{ color: "hsl(210, 20%, 55%)" }}>
            {activeNetwork?.name || "Ethereum Mainnet"} · Connected
          </span>
        </div>
        <div className="mt-2 text-xs" style={{ color: "hsl(210, 20%, 35%)" }}>
          © 2025 NP Wallet. All rights reserved.
        </div>
      </div>
    </div>
  );
}
