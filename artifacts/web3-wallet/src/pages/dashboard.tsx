import {
  useGetPortfolioSummary, getGetPortfolioSummaryQueryKey,
  useGetRecentActivity, getGetRecentActivityQueryKey,
  useListTokens, getListTokensQueryKey,
  useListWallets, getListWalletsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercent, truncateAddress } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Activity, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetPortfolioSummary({
    query: { queryKey: getGetPortfolioSummaryQueryKey() },
  });
  const { data: activities, isLoading: loadingActivities } = useGetRecentActivity(
    { limit: 6 },
    { query: { queryKey: getGetRecentActivityQueryKey({ limit: 6 }) } }
  );
  const { data: tokens, isLoading: loadingTokens } = useListTokens({
    query: { queryKey: getListTokensQueryKey() },
  });
  const { data: wallets, isLoading: loadingWallets } = useListWallets({
    query: { queryKey: getListWalletsQueryKey() },
  });

  const isUp = (summary?.change24hPercent ?? 0) >= 0;

  return (
    <div className="flex flex-col gap-6">

      {/* ── Total Balance hero card (inspired by mobile app) ── */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1a237e 0%,#2979ff 55%,#00b8d4 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle,#fff,transparent)", transform: "translate(30%,-30%)" }} />
        <div className="absolute bottom-0 left-24 w-40 h-40 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle,#00e5ff,transparent)", transform: "translate(0,30%)" }} />

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-blue-200 text-xs font-semibold mb-1 flex items-center gap-1.5">
                Total Balance
                <span className="text-blue-300 text-[10px]">●</span>
              </div>
              {loadingSummary ? (
                <div className="h-10 bg-white/20 rounded-lg animate-pulse w-48 mb-2" />
              ) : (
                <div className="text-white text-4xl font-extrabold tracking-tight mb-1">
                  {formatCurrency(summary?.totalValueUsd ?? 0)}
                </div>
              )}
              <div className={`inline-flex items-center gap-1 text-sm font-bold px-2.5 py-0.5 rounded-full ${isUp ? "bg-emerald-400/20 text-emerald-300" : "bg-red-400/20 text-red-300"}`}>
                {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {isUp ? "+" : ""}{formatPercent(summary?.change24hPercent ?? 0)}
                <span className="font-normal text-xs ml-0.5">today</span>
              </div>
            </div>
            <div className="text-right text-blue-200 text-xs">
              <div>{summary?.walletCount ?? 0} wallets</div>
              <div className="mt-0.5">{summary?.networkCount ?? 0} networks</div>
              <div className="mt-0.5">{summary?.totalTransactions ?? 0} txs</div>
            </div>
          </div>

          {/* Quick action buttons (like mobile app) */}
          <div className="flex gap-3">
            {[
              { icon: ArrowUpRight,   label: "Send",    href: null },
              { icon: ArrowDownLeft,  label: "Receive", href: null },
              { icon: ArrowRightLeft, label: "Swap",    href: "/swap" },
              { icon: Wallet,         label: "Wallets", href: "/wallets" },
            ].map(({ icon: Icon, label, href }) => {
              const inner = (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all hover:scale-105" style={{ backgroundColor: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.25)" }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-blue-200 text-xs font-semibold">{label}</span>
                </div>
              );
              return href ? (
                <Link key={label} href={href}>{inner}</Link>
              ) : (
                <button key={label}>{inner}</button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Wallet list (like mobile app "Wallets" section) ── */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3 pt-5 px-5">
          <CardTitle className="text-sm font-bold text-foreground">My Wallets</CardTitle>
          <Link href="/wallets">
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 h-7 px-2 text-xs font-semibold">
              See All
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-0">
          <div className="divide-y divide-border">
            {loadingWallets ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-1.5">
                      <div className="h-3.5 bg-muted rounded animate-pulse w-28" />
                      <div className="h-3 bg-muted rounded animate-pulse w-20" />
                    </div>
                  </div>
                  <div className="space-y-1.5 text-right">
                    <div className="h-3.5 bg-muted rounded animate-pulse w-20" />
                    <div className="h-3 bg-muted rounded animate-pulse w-12 ml-auto" />
                  </div>
                </div>
              ))
            ) : wallets?.map((wallet) => {
              const up = (wallet.change24hPercent ?? 0) >= 0;
              return (
                <Link key={wallet.id} href={`/wallets/${wallet.id}`}>
                  <div className="flex items-center justify-between py-3.5 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ backgroundColor: wallet.color || "#2979ff" }}
                      >
                        {wallet.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm group-hover:text-blue-600 transition-colors">{wallet.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{truncateAddress(wallet.address)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground text-sm">{formatCurrency(wallet.totalValueUsd ?? 0)}</div>
                      <div className={`text-xs font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>
                        {up ? "+" : ""}{formatPercent(wallet.change24hPercent ?? 0)}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Bottom grid: Top Tokens + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top tokens */}
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 pt-5 px-5">
            <CardTitle className="text-sm font-bold text-foreground">Top Tokens</CardTitle>
            <Link href="/tokens">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 h-7 px-2 text-xs font-semibold">
                Market
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <div className="divide-y divide-border">
              {loadingTokens ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse w-20" />
                    </div>
                    <div className="h-4 bg-muted rounded animate-pulse w-14" />
                  </div>
                ))
              ) : tokens?.slice(0, 6).map((token) => {
                const up = token.change24hPercent >= 0;
                return (
                  <div key={token.id} className="flex items-center justify-between py-3 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground overflow-hidden flex-shrink-0">
                        <img
                          src={token.logoUrl}
                          alt={token.symbol}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => { e.currentTarget.style.display = "none"; (e.currentTarget.parentElement!).textContent = token.symbol.slice(0, 2); }}
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">{token.name}</div>
                        <div className="text-xs text-muted-foreground">{token.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground text-sm">{formatCurrency(token.priceUsd)}</div>
                      <div className={`text-xs font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>
                        {up ? "+" : ""}{formatPercent(token.change24hPercent)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 pt-5 px-5">
            <CardTitle className="text-sm font-bold text-foreground">Recent Activity</CardTitle>
            <Link href="/transactions">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 h-7 px-2 text-xs font-semibold">
                History
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <div className="divide-y divide-border">
              {loadingActivities ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 bg-muted rounded animate-pulse w-28" />
                        <div className="h-3 bg-muted rounded animate-pulse w-20" />
                      </div>
                    </div>
                    <div className="h-4 bg-muted rounded animate-pulse w-14" />
                  </div>
                ))
              ) : activities?.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground text-sm">No activity yet</div>
              ) : activities?.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-3 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === "receive" ? "bg-emerald-50 text-emerald-600" :
                      activity.type === "send" ? "bg-red-50 text-red-500" :
                      activity.type === "swap" ? "bg-blue-50 text-blue-600" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {activity.type === "send" && <ArrowUpRight className="w-4 h-4" />}
                      {activity.type === "receive" && <ArrowDownLeft className="w-4 h-4" />}
                      {activity.type === "swap" && <ArrowRightLeft className="w-4 h-4" />}
                      {activity.type === "contract" && <Activity className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{activity.title}</div>
                      <div className="text-xs text-muted-foreground">{activity.subtitle}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-sm ${activity.type === "receive" ? "text-emerald-600" : "text-foreground"}`}>
                      {activity.type === "receive" ? "+" : activity.type === "send" ? "-" : ""}{formatCurrency(activity.valueUsd)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
