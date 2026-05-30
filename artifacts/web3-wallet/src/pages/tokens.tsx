import { Layout } from "@/components/layout";
import { useListTokens, getListTokensQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Tokens() {
  const { data: tokens, isLoading } = useListTokens({
    query: { queryKey: getListTokensQueryKey() }
  });

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">Market Overview</h1>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search tokens..." 
              className="pl-9 bg-card border-card-border text-white focus-visible:ring-primary/50"
            />
          </div>
        </div>

        <Card className="bg-card border-card-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/20 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium rounded-tl-lg">Token</th>
                  <th className="px-6 py-4 font-medium text-right">Price</th>
                  <th className="px-6 py-4 font-medium text-right">24h Change</th>
                  <th className="px-6 py-4 font-medium text-right hidden md:table-cell">Market Cap</th>
                  <th className="px-6 py-4 font-medium text-right hidden lg:table-cell rounded-tr-lg">Volume (24h)</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(10)].map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-muted/30 animate-pulse"/><div className="h-4 bg-muted/30 rounded animate-pulse w-24"/></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-muted/30 rounded animate-pulse w-16 ml-auto" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-muted/30 rounded animate-pulse w-12 ml-auto" /></td>
                      <td className="px-6 py-4 hidden md:table-cell"><div className="h-4 bg-muted/30 rounded animate-pulse w-24 ml-auto" /></td>
                      <td className="px-6 py-4 hidden lg:table-cell"><div className="h-4 bg-muted/30 rounded animate-pulse w-20 ml-auto" /></td>
                    </tr>
                  ))
                ) : (
                  tokens?.map((token) => (
                    <tr key={token.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={token.logoUrl || `https://cdn.coinbase.com/assets/logos/${token.symbol.toLowerCase()}.svg`} alt={token.name} className="w-8 h-8 rounded-full bg-muted" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxsaW5lIHgxPSIxMiIgeTE9IjgiIHgyPSIxMiIgeTI9IjEyIi8+PGxpbmUgeDE9IjEyIiB5MT0iMTYiIHgyPSIxMiIgeTI9IjE2Ii8+PC9zdmc+'; }} />
                          <div>
                            <div className="font-bold text-white group-hover:text-primary transition-colors">{token.name}</div>
                            <div className="text-xs text-muted-foreground">{token.symbol}</div>
                          </div>
                          {token.isPopular && (
                            <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded border border-primary/20 ml-2">HOT</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-medium text-white">{formatCurrency(token.priceUsd)}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`font-medium ${token.change24hPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {token.change24hPercent >= 0 ? '+' : ''}{formatPercent(token.change24hPercent)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right hidden md:table-cell text-muted-foreground">
                        {formatCurrency(token.marketCapUsd)}
                      </td>
                      <td className="px-6 py-4 text-right hidden lg:table-cell text-muted-foreground">
                        {formatCurrency(token.volume24hUsd)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
