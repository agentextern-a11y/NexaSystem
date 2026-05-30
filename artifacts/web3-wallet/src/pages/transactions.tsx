import { Layout } from "@/components/layout";
import { useListTransactions, getListTransactionsQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Activity, ExternalLink } from "lucide-react";
import { formatCurrency, formatCrypto, truncateAddress } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Transactions() {
  const [filter, setFilter] = useState<"all" | "send" | "receive" | "swap" | "contract">("all");
  
  const { data: transactions, isLoading } = useListTransactions(
    filter !== "all" ? { type: filter as any } : {}, 
    { query: { queryKey: getListTransactionsQueryKey(filter !== "all" ? { type: filter as any } : {}) } }
  );

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">Transactions</h1>
          <div className="flex bg-muted/50 p-1 rounded-lg overflow-x-auto">
            {["all", "send", "receive", "swap", "contract"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize whitespace-nowrap ${filter === f ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-white"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <Card className="bg-card border-card-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/20 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Value</th>
                  <th className="px-6 py-4 font-medium">From / To</th>
                  <th className="px-6 py-4 font-medium">Hash</th>
                  <th className="px-6 py-4 font-medium">Time</th>
                  <th className="px-6 py-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="px-6 py-5"><div className="h-5 bg-muted/30 rounded animate-pulse w-24" /></td>
                      <td className="px-6 py-5"><div className="h-5 bg-muted/30 rounded animate-pulse w-20" /></td>
                      <td className="px-6 py-5"><div className="h-5 bg-muted/30 rounded animate-pulse w-16" /></td>
                      <td className="px-6 py-5"><div className="h-5 bg-muted/30 rounded animate-pulse w-32" /></td>
                      <td className="px-6 py-5"><div className="h-5 bg-muted/30 rounded animate-pulse w-24" /></td>
                      <td className="px-6 py-5"><div className="h-5 bg-muted/30 rounded animate-pulse w-24" /></td>
                      <td className="px-6 py-5"><div className="h-5 bg-muted/30 rounded animate-pulse w-16 ml-auto" /></td>
                    </tr>
                  ))
                ) : transactions?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-muted-foreground">No transactions found</td>
                  </tr>
                ) : (
                  transactions?.map((tx) => (
                    <tr key={tx.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                            {tx.type === 'send' && <ArrowUpRight className="w-4 h-4 text-white" />}
                            {tx.type === 'receive' && <ArrowDownLeft className="w-4 h-4 text-success" />}
                            {tx.type === 'swap' && <RefreshCw className="w-4 h-4 text-primary" />}
                            {tx.type === 'contract' && <Activity className="w-4 h-4 text-muted-foreground" />}
                          </div>
                          <span className="capitalize font-medium text-white">{tx.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${tx.type === 'receive' ? 'text-success' : 'text-white'}`}>
                          {tx.type === 'receive' ? '+' : tx.type === 'send' ? '-' : ''}{formatCrypto(tx.amount)} {tx.tokenSymbol}
                        </span>
                        {tx.type === 'swap' && tx.toTokenSymbol && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <ArrowUpRight className="w-3 h-3 inline" /> {formatCrypto(tx.toAmount)} {tx.toTokenSymbol}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-muted-foreground">{formatCurrency(tx.valueUsd)}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {tx.type === 'send' ? (
                          <span className="flex items-center gap-1">To: <span className="text-white">{truncateAddress(tx.toAddress)}</span></span>
                        ) : tx.type === 'receive' ? (
                          <span className="flex items-center gap-1">From: <span className="text-white">{truncateAddress(tx.fromAddress)}</span></span>
                        ) : (
                          <span>Contract</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        <a href={`#`} className="text-primary hover:underline flex items-center gap-1">
                          {truncateAddress(tx.hash)}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          tx.status === 'confirmed' ? 'bg-success/10 text-success border border-success/20' :
                          tx.status === 'pending' ? 'bg-warning/10 text-warning border border-warning/20' : 
                          'bg-destructive/10 text-destructive border border-destructive/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            tx.status === 'confirmed' ? 'bg-success shadow-[0_0_5px_rgba(var(--success),0.5)]' :
                            tx.status === 'pending' ? 'bg-warning' : 'bg-destructive'
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
    </Layout>
  );
}
