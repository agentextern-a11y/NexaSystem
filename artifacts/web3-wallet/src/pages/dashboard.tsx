import {
  useGetPortfolioSummary, getGetPortfolioSummaryQueryKey,
  useGetRecentActivity, getGetRecentActivityQueryKey,
  useListTokens, getListTokensQueryKey,
  useListWallets, getListWalletsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "wouter";

function TokenLogo({ symbol, logoUrl, size = 8 }: { symbol: string; logoUrl: string; size?: number }) {
  const fallbackSrc = `https://assets.coingecko.com/coins/images/1/small/bitcoin.png`;
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}
      style={{ width: size * 4, height: size * 4, backgroundColor: "#3b82f6" }}
    >
      <img
        src={logoUrl}
        alt={symbol}
        className="w-full h-full rounded-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          e.currentTarget.parentElement!.textContent = symbol.slice(0, 2);
        }}
      />
    </div>
  );
}

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetPortfolioSummary({
    query: { queryKey: getGetPortfolioSummaryQueryKey() }
  });
  const { data: activities, isLoading: loadingActivities } = useGetRecentActivity({ limit: 6 }, {
    query: { queryKey: getGetRecentActivityQueryKey({ limit: 6 }) }
  });
  const { data: tokens, isLoading: loadingTokens } = useListTokens({
    query: { queryKey: getListTokensQueryKey() }
  });
  const { data: wallets } = useListWallets({ query: { queryKey: getListWalletsQueryKey() } });

  const isUp = (summary?.change24hPercent ?? 0) >= 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {wallets?.length ? `${wallets.length} wallet${wallets.length > 1 ? "s" : ""} connected` : "Loading..."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-9">
            <ArrowDownLeft className="w-4 h-4" /> Receive
          </Button>
          <Button className="gap-2 h-9 bg-blue-600 hover:bg-blue-700 text-white">
            <ArrowUpRight className="w-4 h-4" /> Send
          </Button>
          <Link href="/swap">
            <Button variant="secondary" className="gap-2 h-9">
              <ArrowRightLeft className="w-4 h-4" /> Swap
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total balance — big card */}
        <Card className="col-span-2 border-border shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-2">Total Portfolio Value</p>
            {loadingSummary ? (
              <div className="h-10 bg-muted rounded-md animate-pulse w-48 mb-3" />
            ) : (
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-foreground">
                  {formatCurrency(summary?.totalValueUsd ?? 0)}
                </span>
                <span className={`flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-full ${isUp ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                  {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {formatPercent(summary?.change24hPercent ?? 0)}
                </span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {isUp ? "+" : ""}{formatCurrency(summary?.change24hUsd ?? 0)} today
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-2">Wallets</p>
            <p className="text-3xl font-bold text-foreground">{summary?.walletCount ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">across {summary?.networkCount ?? 0} networks</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-2">Transactions</p>
            <p className="text-3xl font-bold text-foreground">{summary?.totalTransactions ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">all time</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top tokens */}
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Top Tokens</CardTitle>
            <Link href="/tokens">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 h-7 px-2 text-xs">
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-border">
              {loadingTokens ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse w-20" />
                    </div>
                    <div className="h-4 bg-muted rounded animate-pulse w-16" />
                  </div>
                ))
              ) : (
                tokens?.slice(0, 6).map((token) => (
                  <div key={token.id} className="flex items-center justify-between py-3 hover:bg-muted/40 -mx-2 px-2 rounded-lg transition-colors">
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
                        <div className="font-medium text-foreground text-sm">{token.name}</div>
                        <div className="text-xs text-muted-foreground">{token.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground text-sm">{formatCurrency(token.priceUsd)}</div>
                      <div className={`text-xs font-medium ${token.change24hPercent >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {formatPercent(token.change24hPercent)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Recent Activity</CardTitle>
            <Link href="/transactions">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 h-7 px-2 text-xs">
                History
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
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
              ) : (
                activities?.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3 hover:bg-muted/40 -mx-2 px-2 rounded-lg transition-colors">
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
                        <div className="font-medium text-foreground text-sm">{activity.title}</div>
                        <div className="text-xs text-muted-foreground">{activity.subtitle}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold text-sm ${activity.type === "receive" ? "text-emerald-600" : "text-foreground"}`}>
                        {activity.type === "receive" ? "+" : activity.type === "send" ? "-" : ""}{formatCurrency(activity.valueUsd)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
