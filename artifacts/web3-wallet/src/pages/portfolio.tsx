import {
  useGetPortfolioHistory, getGetPortfolioHistoryQueryKey,
  useGetPortfolioSummary, getGetPortfolioSummaryQueryKey,
  useListWallets, getListWalletsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useState } from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

const PERIODS = ["1d", "7d", "30d", "90d", "1y"] as const;
type Period = typeof PERIODS[number];

export default function Portfolio() {
  const [period, setPeriod] = useState<Period>("30d");

  const { data: summary, isLoading: loadingSummary } = useGetPortfolioSummary({
    query: { queryKey: getGetPortfolioSummaryQueryKey() },
  });
  const { data: history, isLoading: loadingHistory } = useGetPortfolioHistory(
    { period },
    { query: { queryKey: getGetPortfolioHistoryQueryKey({ period }) } }
  );
  const { data: wallets, isLoading: loadingWallets } = useListWallets({
    query: { queryKey: getListWalletsQueryKey() },
  });

  const isUp = (summary?.change24hPercent ?? 0) >= 0;

  const tickFormatter = (val: string) => {
    const d = new Date(val);
    return period === "1d"
      ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Portfolio</h1>
        <p className="text-muted-foreground text-sm">Track your asset performance and wallet breakdown.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Value",
            value: loadingSummary ? null : formatCurrency(summary?.totalValueUsd ?? 0),
            sub: loadingSummary ? null : (
              <span className={`flex items-center gap-1 text-xs font-semibold ${isUp ? "text-emerald-600" : "text-red-500"}`}>
                {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {formatPercent(summary?.change24hPercent ?? 0)} today
              </span>
            ),
          },
          { label: "24h Change", value: loadingSummary ? null : `${isUp ? "+" : ""}${formatCurrency(summary?.change24hUsd ?? 0)}`, sub: <span className="text-xs text-muted-foreground">vs. yesterday</span> },
          { label: "Wallets", value: loadingSummary ? null : String(summary?.walletCount ?? 0), sub: <span className="text-xs text-muted-foreground">{summary?.networkCount ?? 0} networks</span> },
          { label: "Transactions", value: loadingSummary ? null : String(summary?.totalTransactions ?? 0), sub: <span className="text-xs text-muted-foreground">all time</span> },
        ].map(({ label, value, sub }) => (
          <Card key={label} className="border-border shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">{label}</p>
              {value === null ? (
                <div className="h-7 bg-muted rounded animate-pulse w-24 mb-1" />
              ) : (
                <p className="text-2xl font-bold text-foreground mb-0.5">{value}</p>
              )}
              {sub}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-semibold text-foreground">Performance</CardTitle>
          <div className="flex bg-muted rounded-lg p-1 gap-0.5">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  period === p
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {loadingHistory ? (
            <div className="h-72 bg-muted/40 animate-pulse rounded-lg" />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history ?? []} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(214,32%,91%)" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={tickFormatter}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(215,16%,47%)", fontSize: 11 }}
                    dy={8}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(215,16%,47%)", fontSize: 11 }}
                    width={52}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", borderColor: "hsl(214,32%,91%)", borderRadius: "8px", fontSize: 12 }}
                    labelFormatter={(l) => new Date(l).toLocaleString()}
                    formatter={(v: number) => [formatCurrency(v), "Portfolio Value"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="valueUsd"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#grad)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#2563eb" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wallet breakdown */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Wallet Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadingWallets
            ? [...Array(3)].map((_, i) => <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />)
            : wallets?.map((wallet) => {
                const walletUp = (wallet.change24hPercent ?? 0) >= 0;
                return (
                  <Card key={wallet.id} className="border-border shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${wallet.color || "#3b82f6"}18`, border: `2px solid ${wallet.color || "#3b82f6"}` }}
                        >
                          <Wallet className="w-5 h-5" style={{ color: wallet.color || "#3b82f6" }} />
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-semibold text-foreground truncate">{wallet.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Balance</div>
                          <div className="text-xl font-bold text-foreground">
                            {formatCurrency(wallet.totalValueUsd ?? 0)}
                          </div>
                        </div>
                        <div className={`text-sm font-semibold flex items-center gap-1 ${walletUp ? "text-emerald-600" : "text-red-500"}`}>
                          {walletUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {formatPercent(wallet.change24hPercent ?? 0)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
        </div>
      </div>
    </div>
  );
}
