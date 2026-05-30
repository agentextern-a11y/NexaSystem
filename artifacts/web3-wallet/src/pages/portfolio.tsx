import { useGetPortfolioHistory, getGetPortfolioHistoryQueryKey, useGetPortfolioSummary, getGetPortfolioSummaryQueryKey, useListWallets, getListWalletsQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export default function Portfolio() {
  const [period, setPeriod] = useState<"1d" | "7d" | "30d" | "90d" | "1y">("30d");

  const { data: summary, isLoading: loadingSummary } = useGetPortfolioSummary({
    query: { queryKey: getGetPortfolioSummaryQueryKey() }
  });

  const { data: history, isLoading: loadingHistory } = useGetPortfolioHistory({ period }, {
    query: { queryKey: getGetPortfolioHistoryQueryKey({ period }) }
  });

  const { data: wallets, isLoading: loadingWallets } = useListWallets({
    query: { queryKey: getListWalletsQueryKey() }
  });

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Portfolio</h1>
          {loadingSummary ? (
            <div className="h-10 bg-muted/30 rounded w-48 animate-pulse" />
          ) : (
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold tracking-tighter text-white">
                {formatCurrency(summary?.totalValueUsd)}
              </span>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${summary && summary.change24hPercent >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                {summary && summary.change24hPercent >= 0 ? '+' : ''}{formatPercent(summary?.change24hPercent)}
              </span>
            </div>
          )}
        </div>

        <Card className="bg-card border-card-border overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-white">Performance</CardTitle>
            <div className="flex bg-muted/50 p-1 rounded-lg">
              {["1d", "7d", "30d", "90d", "1y"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p as any)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${period === p ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-white"}`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {loadingHistory ? (
              <div className="h-[300px] w-full flex items-center justify-center">
                <div className="h-full w-full bg-muted/20 animate-pulse rounded-md" />
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(val) => {
                        const d = new Date(val);
                        return period === '1d' ? d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : d.toLocaleDateString([], {month: 'short', day: 'numeric'});
                      }} 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      width={60}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      labelFormatter={(label) => new Date(label).toLocaleString()}
                      formatter={(value: number) => [formatCurrency(value), "Value"]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="valueUsd" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <h2 className="text-xl font-bold text-white mt-4">Wallet Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadingWallets ? (
            [...Array(3)].map((_, i) => <div key={i} className="h-32 bg-muted/30 rounded-xl animate-pulse" />)
          ) : (
            wallets?.map(wallet => (
              <Card key={wallet.id} className="bg-card/50 border-card-border hover:bg-card/80 transition-colors">
                <CardContent className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted/50" style={{ border: `1px solid ${wallet.color || 'var(--primary)'}` }}>
                        <Wallet className="w-5 h-5" style={{ color: wallet.color || 'var(--primary)' }} />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{wallet.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {wallet.address.slice(0,6)}...{wallet.address.slice(-4)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Balance</div>
                      <div className="text-xl font-bold text-white">{formatCurrency(wallet.totalValueUsd)}</div>
                    </div>
                    <div className={`text-sm ${wallet.change24hPercent && wallet.change24hPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {wallet.change24hPercent && wallet.change24hPercent >= 0 ? '+' : ''}{formatPercent(wallet.change24hPercent)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
