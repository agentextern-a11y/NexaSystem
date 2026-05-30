import { useListTokens, getListTokensQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Search, TrendingUp, TrendingDown, Flame } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";

export default function Tokens() {
  const { data: tokens, isLoading } = useListTokens({ query: { queryKey: getListTokensQueryKey() } });
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      tokens?.filter(
        (t) =>
          !search ||
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.symbol.toLowerCase().includes(search.toLowerCase())
      ),
    [tokens, search]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Market Overview</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Live prices for supported tokens</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tokens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-card border-border"
          />
        </div>
      </div>

      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">#</th>
                <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Token</th>
                <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide text-right">Price</th>
                <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide text-right">24h Change</th>
                <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide text-right hidden md:table-cell">Market Cap</th>
                <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide text-right hidden lg:table-cell">Volume (24h)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-muted rounded animate-pulse w-full max-w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-muted-foreground">No tokens found</td>
                </tr>
              ) : (
                filtered?.map((token, idx) => {
                  const up = token.change24hPercent >= 0;
                  return (
                    <tr key={token.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-5 py-4 text-muted-foreground text-xs font-medium">{idx + 1}</td>
                      <td className="px-5 py-4">
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
                            <div className="font-semibold text-foreground flex items-center gap-2">
                              {token.name}
                              {token.isPopular && (
                                <span className="flex items-center gap-0.5 text-[10px] font-semibold bg-orange-50 text-orange-600 border border-orange-200 px-1.5 py-0.5 rounded-full">
                                  <Flame className="w-2.5 h-2.5" /> HOT
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">{token.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="font-semibold text-foreground">{formatCurrency(token.priceUsd)}</div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className={`font-semibold flex items-center justify-end gap-1 ${up ? "text-emerald-600" : "text-red-500"}`}>
                          {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {formatPercent(token.change24hPercent)}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right text-muted-foreground hidden md:table-cell">
                        {formatCurrency(token.marketCapUsd)}
                      </td>
                      <td className="px-5 py-4 text-right text-muted-foreground hidden lg:table-cell">
                        {formatCurrency(token.volume24hUsd)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
