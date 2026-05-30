import { useState, useEffect } from "react";
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
  Activity,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useListWallets, getListWalletsQueryKey } from "@workspace/api-client-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portfolio", label: "Portfolio", icon: PieChart },
  { href: "/wallets", label: "Wallets", icon: Wallet },
  { href: "/transactions", label: "Transactions", icon: History },
  { href: "/swap", label: "Swap", icon: ArrowRightLeft },
  { href: "/nfts", label: "NFTs", icon: ImageIcon },
  { href: "/tokens", label: "Tokens", icon: Coins },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const { data: wallets = [] } = useListWallets({ query: { queryKey: getListWalletsQueryKey() } });
  
  const activeWallet = wallets[0]; // Just picking first for demo if no global state

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-screen fixed left-0 top-0">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            NP
          </div>
          <span className="font-bold text-lg tracking-tight">NP Wallet</span>
        </div>
        
        {/* Wallet Selector Dropdown placeholder */}
        <button className="w-full flex items-center justify-between bg-background border border-border rounded-md p-2 hover:bg-muted/50 transition-colors text-left">
          <div className="flex items-center gap-2 overflow-hidden">
            <div 
              className="w-6 h-6 rounded-full flex-shrink-0" 
              style={{ backgroundColor: activeWallet?.color || 'var(--primary)' }}
            />
            <div className="truncate">
              <div className="text-sm font-medium truncate">{activeWallet?.name || "All Wallets"}</div>
              <div className="text-xs text-muted-foreground truncate">{activeWallet?.address ? `${activeWallet.address.slice(0, 6)}...${activeWallet.address.slice(-4)}` : "Overview"}</div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer text-sm font-medium",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-success"></div>
          Ethereum Mainnet
        </div>
      </div>
    </div>
  );
}
