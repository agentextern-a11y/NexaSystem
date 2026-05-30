import { useListTransactions, getListTransactionsQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Activity, ExternalLink } from "lucide-react";
import { formatCurrency, formatCrypto, truncateAddress } from "@/lib/utils";
import { useState } from "react";

const FILTERS = ["all", "send", "receive", "swap", "contract"] as const;
type Filter = typeof FILTERS[number];

export default function Transactions() {
  const [filter, setFilter] = useState<Filter>("all");

  const { data: transactions, isLoading } = useListTransactions(
    filter !== "all" ? { type: filter as "send" | "receive" | "swap" | "contract" } : {},
    { query: { queryKey: getListTransactionsQueryKey(filter !== "all" ? { type: filter as any } : {}) } }
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{transactions?.length ?? 0} records</p>
        </div>
        <div className="flex bg-muted p-1 rounded-lg gap-0.5 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 text-sm font-medium rounded-md transition-all capitalize whitespace-nowrap ${
                filter === f
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Type</th>
                <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Amount</th>
                <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Value</th>
                <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">From / To</th>
                <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Hash</th>
                <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Time</th>
                <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-muted rounded animate-pulse w-full max-w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : transactions?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-muted-foreground">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions?.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          tx.type === "receive" ? "bg-emerald-50 text-emerald-600" :
                          tx.type === "send" ? "bg-red-50 text-red-500" :
                          tx.type === "swap" ? "bg-blue-50 text-blue-600" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {tx.type === "send" && <ArrowUpRight className="w-3.5 h-3.5" />}
                          {tx.type === "receive" && <ArrowDownLeft className="w-3.5 h-3.5" />}
                          {tx.type === "swap" && <RefreshCw className="w-3.5 h-3.5" />}
                          {tx.type === "contract" && <Activity className="w-3.5 h-3.5" />}
                        </div>
                        <span className="capitalize font-medium text-foreground text-sm">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-medium text-sm ${tx.type === "receive" ? "text-emerald-600" : tx.type === "send" ? "text-red-500" : "text-foreground"}`}>
                        {tx.type === "receive" ? "+" : tx.type === "send" ? "-" : ""}
                        {formatCrypto(tx.amount)} {tx.tokenSymbol}
                      </span>
                      {tx.type === "swap" && tx.toTokenSymbol && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          → {formatCrypto(tx.toAmount ?? 0)} {tx.toTokenSymbol}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground text-sm">
                      {formatCurrency(tx.valueUsd)}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                      {tx.type === "send" ? (
                        <span>To: <span className="text-foreground">{truncateAddress(tx.toAddress)}</span></span>
                      ) : tx.type === "receive" ? (
                        <span>From: <span className="text-foreground">{truncateAddress(tx.fromAddress)}</span></span>
                      ) : (
                        <span className="text-foreground">Contract</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs">
                      <span className="text-blue-600 flex items-center gap-1">
                        {truncateAddress(tx.hash, 4)}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${
                        tx.status === "confirmed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        tx.status === "pending" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        "bg-red-50 text-red-600 border border-red-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          tx.status === "confirmed" ? "bg-emerald-500" :
                          tx.status === "pending" ? "bg-amber-500" : "bg-red-500"
                        }`} />
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
