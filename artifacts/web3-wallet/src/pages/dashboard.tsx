import { useState, useCallback } from "react";
import {
  useGetPortfolioSummary, getGetPortfolioSummaryQueryKey,
  useGetRecentActivity, getGetRecentActivityQueryKey,
  useListTokens, getListTokensQueryKey,
  useListWallets, getListWalletsQueryKey,
} from "@workspace/api-client-react";
import { formatCurrency, formatPercent, truncateAddress } from "@/lib/utils";
import {
  ArrowUpRight, ArrowDownLeft, ArrowRightLeft, TrendingUp, TrendingDown,
  Wifi, QrCode, RefreshCw, Copy, Check, ChevronRight, ShoppingCart,
} from "lucide-react";
import { Link } from "wouter";
import { CryptoIcon } from "@/components/crypto-icon";
import { NotificationsPanel } from "@/components/notifications-panel";
import { SendModal } from "@/components/send-modal";
import { ReceiveModal } from "@/components/receive-modal";
import { toast } from "sonner";

/* ── NEXA Pay logo mark ── */
function NexaMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="dG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c6fcd" />
          <stop offset="100%" stopColor="#5b5be6" />
        </linearGradient>
      </defs>
      <path d="M20 88 L20 22 L36 22 L68 62 L68 22 L84 22 L84 88 L68 88 L36 48 L36 88 Z" fill="url(#dG)" />
      <path d="M82 52 L100 52 L100 44 L116 60 L100 76 L100 68 L82 68 Z" fill="#00e5ff" opacity="0.9" />
    </svg>
  );
}

/* ── Header ── */
function DashboardHeader({ onRefresh }: { onRefresh: () => void }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
          style={{ background: "linear-gradient(135deg,#5b5be6,#7c6fcd)" }}>
          64
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">{greeting} 👋</p>
          <p className="text-base font-extrabold text-slate-900">My Wallet</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:shadow-md transition-all"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
        </button>
        <NotificationsPanel />
      </div>
    </div>
  );
}

/* ── Portfolio hero card ── */
function PortfolioCard({ summary, isLoading }: { summary: any; isLoading: boolean }) {
  const isUp = (summary?.change24hPercent ?? 0) >= 0;
  const address = "0x64a34d69...3eC4e5";

  return (
    <div
      className="rounded-3xl p-6 relative overflow-hidden mb-5 select-none"
      style={{ background: "linear-gradient(135deg,#1a1363 0%,#2d2b8e 35%,#5b5be6 75%,#7c6fcd 100%)" }}
    >
      {/* Decorative orbs */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none opacity-15"
        style={{ background: "radial-gradient(circle,#fff,transparent)", transform: "translate(30%,-30%)" }} />
      <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle,#00e5ff,transparent)", transform: "translate(-20%,30%)" }} />

      <div className="relative">
        <div className="flex items-start justify-between mb-1">
          <p className="text-blue-200 text-[11px] font-semibold tracking-widest uppercase">Total Portfolio</p>
          <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${isUp ? "bg-emerald-400/20 text-emerald-300" : "bg-red-400/20 text-red-300"}`}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isUp ? "+" : ""}{formatPercent(summary?.change24hPercent ?? 6.28)}
          </div>
        </div>

        {isLoading ? (
          <div className="h-10 bg-white/20 rounded-lg animate-pulse w-40 mb-2" />
        ) : (
          <div className="text-white text-4xl font-black tracking-tight mb-1">
            {formatCurrency(summary?.totalValueUsd ?? 160)}
          </div>
        )}

        <p className="text-blue-300 text-xs font-mono mb-5">{address}</p>

        <div className="flex gap-8">
          <div>
            <p className="text-blue-300 text-[10px] font-medium uppercase tracking-wider">Today's Income</p>
            <p className="text-white text-sm font-bold mt-0.5">
              +{formatCurrency(summary?.todayIncome ?? 0)}
            </p>
          </div>
          <div>
            <p className="text-blue-300 text-[10px] font-medium uppercase tracking-wider">Transactions</p>
            <p className="text-white text-sm font-bold mt-0.5">{summary?.totalTransactions ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Quick action buttons ── */
function QuickActions({ onSend, onReceive }: { onSend: () => void; onReceive: () => void }) {
  const actions = [
    { icon: ArrowUpRight,   label: "Send",    color: "#F0F0FF", iconColor: "#5b5be6", onClick: onSend },
    { icon: ArrowDownLeft,  label: "Receive", color: "#F0FFF4", iconColor: "#10B981", onClick: onReceive },
    { icon: Wifi,           label: "NFC Pay", color: "#F0F8FF", iconColor: "#3B82F6", onClick: () => toast.info("NFC Pay requires a compatible device.") },
    { icon: QrCode,         label: "QR Code", color: "#FFFBF0", iconColor: "#F59E0B", onClick: () => toast.info("Open your QR scanner to pay.") },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      {actions.map(({ icon: Icon, label, color, iconColor, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: color }}>
            <Icon className="w-5 h-5" style={{ color: iconColor }} />
          </div>
          <span className="text-[11px] font-semibold text-slate-600">{label}</span>
        </button>
      ))}
    </div>
  );
}

/* ── Buy Crypto Banner ── */
function BuyCryptoBanner() {
  return (
    <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm mb-5 hover:shadow-md transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#F0F0FF" }}>
          <ShoppingCart className="w-5 h-5 text-[#5b5be6]" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Buy Crypto Instantly</p>
          <p className="text-[11px] text-slate-400">Card, bank transfer · Powered by Banxa</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400" />
    </div>
  );
}

/* ── Asset row ── */
function AssetRow({ wallet }: { wallet: any }) {
  const up = (wallet.change24hPercent ?? 0) >= 0;
  const symbol = wallet.network?.symbol || "NX";

  return (
    <Link href={`/wallets/${wallet.id}`}>
      <div className="flex items-center justify-between py-3.5 hover:bg-slate-50 -mx-3 px-3 rounded-xl transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: wallet.color || "#5b5be6" }}>
              <CryptoIcon symbol={symbol} size={40} logoUrl={undefined} />
            </div>
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm">{wallet.name}</p>
            <p className="text-xs text-slate-400">{formatCurrency(wallet.balance ?? 0)} {symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-900 text-sm">{formatCurrency(wallet.totalValueUsd ?? 0)}</p>
          <p className={`text-xs font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>
            {up ? "+" : ""}{formatPercent(wallet.change24hPercent ?? -1.21)}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ── Token row ── */
function TokenRow({ token }: { token: any }) {
  const up = token.change24hPercent >= 0;
  return (
    <div className="flex items-center justify-between py-3 hover:bg-slate-50 -mx-3 px-3 rounded-xl transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-slate-100 flex-shrink-0">
          <CryptoIcon symbol={token.symbol} size={36} logoUrl={token.logoUrl} />
        </div>
        <div>
          <p className="font-semibold text-slate-900 text-sm">{token.name}</p>
          <p className="text-xs text-slate-400">{token.symbol}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-slate-900 text-sm">{formatCurrency(token.priceUsd)}</p>
        <p className={`text-xs font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>
          {up ? "+" : ""}{formatPercent(token.change24hPercent)}
        </p>
      </div>
    </div>
  );
}

/* ── Activity row ── */
function ActivityRow({ activity }: { activity: any }) {
  const isReceive = activity.type === "receive";
  const isSend = activity.type === "send";
  return (
    <div className="flex items-center justify-between py-3 hover:bg-slate-50 -mx-3 px-3 rounded-xl transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
          isReceive ? "bg-emerald-50 text-emerald-600" :
          isSend    ? "bg-red-50 text-red-500" :
                      "bg-[#F0F0FF] text-[#5b5be6]"
        }`}>
          {isReceive && <ArrowDownLeft className="w-4 h-4" />}
          {isSend    && <ArrowUpRight className="w-4 h-4" />}
          {!isReceive && !isSend && <ArrowRightLeft className="w-4 h-4" />}
        </div>
        <div>
          <p className="font-semibold text-slate-900 text-sm">{activity.title}</p>
          <p className="text-xs text-slate-400">{activity.subtitle}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold text-sm ${isReceive ? "text-emerald-600" : "text-slate-900"}`}>
          {isReceive ? "+" : isSend ? "-" : ""}{formatCurrency(activity.valueUsd)}
        </p>
        <p className="text-[10px] text-slate-400">{new Date(activity.timestamp).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function Dashboard() {
  const [sendOpen, setSendOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: summary, isLoading: loadingSummary, refetch: refetchSummary } = useGetPortfolioSummary({
    query: { queryKey: [...getGetPortfolioSummaryQueryKey(), refreshKey] },
  });
  const { data: activities, isLoading: loadingActivities } = useGetRecentActivity(
    { limit: 5 },
    { query: { queryKey: [...getGetRecentActivityQueryKey({ limit: 5 }), refreshKey] } }
  );
  const { data: tokens, isLoading: loadingTokens } = useListTokens({
    query: { queryKey: [...getListTokensQueryKey(), refreshKey] },
  });
  const { data: wallets, isLoading: loadingWallets } = useListWallets({
    query: { queryKey: [...getListWalletsQueryKey(), refreshKey] },
  });

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
    toast.success("Portfolio refreshed");
  }, []);

  return (
    <div className="pb-4">
      <DashboardHeader onRefresh={handleRefresh} />
      <PortfolioCard summary={summary} isLoading={loadingSummary} />
      <QuickActions onSend={() => setSendOpen(true)} onReceive={() => setReceiveOpen(true)} />
      <BuyCryptoBanner />

      {/* Assets */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-extrabold text-slate-900 text-base">Assets</h2>
          <Link href="/wallets">
            <button className="text-xs font-bold text-[#5b5be6] hover:underline">See All</button>
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {loadingWallets ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 bg-slate-100 rounded animate-pulse w-24" />
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-16" />
                  </div>
                </div>
                <div className="space-y-1.5 text-right">
                  <div className="h-3.5 bg-slate-100 rounded animate-pulse w-16" />
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-10 ml-auto" />
                </div>
              </div>
            ))
          ) : wallets?.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">No assets yet — create a wallet to get started.</div>
          ) : (
            wallets?.slice(0, 5).map((w) => <AssetRow key={w.id} wallet={w} />)
          )}
        </div>
      </div>

      {/* Market prices */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-extrabold text-slate-900 text-base">Market Prices</h2>
          <Link href="/tokens">
            <button className="text-xs font-bold text-[#5b5be6] hover:underline">Market</button>
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {loadingTokens ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 animate-pulse" />
                  <div className="h-4 bg-slate-100 rounded animate-pulse w-20" />
                </div>
                <div className="h-4 bg-slate-100 rounded animate-pulse w-14" />
              </div>
            ))
          ) : (
            tokens?.slice(0, 6).map((t) => <TokenRow key={t.id} token={t} />)
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-extrabold text-slate-900 text-base">Recent Activity</h2>
          <Link href="/transactions">
            <button className="text-xs font-bold text-[#5b5be6] hover:underline">History</button>
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {loadingActivities ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 bg-slate-100 rounded animate-pulse w-28" />
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-20" />
                  </div>
                </div>
                <div className="h-4 bg-slate-100 rounded animate-pulse w-14" />
              </div>
            ))
          ) : activities?.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">No transactions yet.</div>
          ) : (
            activities?.map((a) => <ActivityRow key={a.id} activity={a} />)
          )}
        </div>
      </div>

      {/* Modals */}
      <SendModal open={sendOpen} onClose={() => setSendOpen(false)} wallets={wallets ?? []} />
      <ReceiveModal open={receiveOpen} onClose={() => setReceiveOpen(false)} wallets={wallets ?? []} />
    </div>
  );
}
