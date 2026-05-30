import { useGetPortfolioSummary, getGetPortfolioSummaryQueryKey, useGetRecentActivity, getGetRecentActivityQueryKey, useListTokens, getListTokensQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Activity } from "lucide-react";
import { Layout } from "@/components/layout";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetPortfolioSummary({
    query: { queryKey: getGetPortfolioSummaryQueryKey() }
  });

  const { data: activities, isLoading: loadingActivities } = useGetRecentActivity({ limit: 5 }, {
    query: { queryKey: getGetRecentActivityQueryKey({ limit: 5 }) }
  });

  const { data: tokens, isLoading: loadingTokens } = useListTokens({
    query: { queryKey: getListTokensQueryKey() }
  });

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 border-border/50 text-white">
              <ArrowDownLeft className="w-4 h-4" /> Receive
            </Button>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <ArrowUpRight className="w-4 h-4" /> Send
            </Button>
            <Link href="/swap">
              <Button variant="secondary" className="gap-2">
                <ArrowRightLeft className="w-4 h-4" /> Swap
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-2 bg-card border-card-border overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <CardHeader>
              <CardTitle className="text-muted-foreground text-sm font-medium">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSummary ? (
                <div className="h-12 bg-muted/50 rounded-md animate-pulse w-48 mb-2"></div>
              ) : (
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-bold tracking-tighter text-white">
                    {formatCurrency(summary?.totalValueUsd)}
                  </span>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${summary && summary.change24hPercent >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                    {summary && summary.change24hPercent >= 0 ? '+' : ''}{formatPercent(summary?.change24hPercent)}
                  </span>
                </div>
              )}
              {/* Mini chart placeholder */}
              <div className="h-32 mt-6 w-full bg-gradient-to-t from-primary/10 to-transparent border-b-2 border-primary"></div>
            </CardContent>
          </Card>

          <Card className="bg-card border-card-border">
            <CardHeader>
              <CardTitle className="text-muted-foreground text-sm font-medium">Network Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSummary ? (
                <div className="space-y-4">
                  <div className="h-4 bg-muted/50 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full pb-8">
                  <div className="relative w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center mb-4">
                    <div className="absolute inset-0 rounded-full border-8 border-primary border-r-transparent border-b-transparent transform rotate-45"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{summary?.networkCount || 0}</div>
                      <div className="text-xs text-muted-foreground">Networks</div>
                    </div>
                  </div>
                  <div className="text-sm text-center text-muted-foreground">
                    Holding assets across {summary?.networkCount || 0} active networks
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-card-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white">Top Tokens</CardTitle>
              <Link href="/tokens">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white h-8">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-4">
                {loadingTokens ? (
                  [...Array(4)].map((_, i) => <div key={i} className="h-12 bg-muted/30 rounded animate-pulse"></div>)
                ) : (
                  tokens?.slice(0, 5).map((token) => (
                    <div key={token.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={token.logoUrl || `https://cdn.coinbase.com/assets/logos/${token.symbol.toLowerCase()}.svg`} alt={token.name} className="w-8 h-8 rounded-full bg-muted" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxsaW5lIHgxPSIxMiIgeTE9IjgiIHgyPSIxMiIgeTI9IjEyIi8+PGxpbmUgeDE9IjEyIiB5MT0iMTYiIHgyPSIxMiIgeTI9IjE2Ii8+PC9zdmc+'; }} />
                        <div>
                          <div className="font-medium text-white">{token.name}</div>
                          <div className="text-xs text-muted-foreground">{token.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">{formatCurrency(token.priceUsd)}</div>
                        <div className={`text-xs ${token.change24hPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {token.change24hPercent >= 0 ? '+' : ''}{formatPercent(token.change24hPercent)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-card-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <Link href="/transactions">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white h-8">History</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-4">
                {loadingActivities ? (
                  [...Array(4)].map((_, i) => <div key={i} className="h-12 bg-muted/30 rounded animate-pulse"></div>)
                ) : activities?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No recent activity</div>
                ) : (
                  activities?.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                          {activity.type === 'send' && <ArrowUpRight className="w-4 h-4 text-white" />}
                          {activity.type === 'receive' && <ArrowDownLeft className="w-4 h-4 text-success" />}
                          {activity.type === 'swap' && <ArrowRightLeft className="w-4 h-4 text-primary" />}
                          {activity.type === 'contract' && <Activity className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">{activity.title}</div>
                          <div className="text-xs text-muted-foreground">{activity.subtitle}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium text-sm ${activity.type === 'receive' ? 'text-success' : 'text-white'}`}>
                          {activity.type === 'receive' ? '+' : ''}{formatCurrency(activity.valueUsd)}
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
    </Layout>
  );
}
