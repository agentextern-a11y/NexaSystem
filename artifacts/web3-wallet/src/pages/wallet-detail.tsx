import { useParams, Link } from "wouter";
import {
  useGetWallet, getGetWalletQueryKey,
  useGetWalletTokens, getGetWalletTokensQueryKey,
  useGetWalletNfts, getGetWalletNftsQueryKey,
  useListTransactions, getListTransactionsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, Copy, QrCode, RefreshCw, ExternalLink, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatCrypto, formatPercent, truncateAddress } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function WalletDetail() {
  const { id } = useParams();
  const walletId = parseInt(id || "0", 10);

  const { data: wallet, isLoading: loadingWallet } = useGetWallet(walletId, {
    query: { enabled: !!walletId, queryKey: getGetWalletQueryKey(walletId) },
  });
  const { data: tokens, isLoading: loadingTokens } = useGetWalletTokens(walletId, {
    query: { enabled: !!walletId, queryKey: getGetWalletTokensQueryKey(walletId) },
  });
  const { data: nfts, isLoading: loadingNfts } = useGetWalletNfts(walletId, {
    query: { enabled: !!walletId, queryKey: getGetWalletNftsQueryKey(walletId) },
  });
  const { data: transactions, isLoading: loadingTx } = useListTransactions({ walletId }, {
    query: { enabled: !!walletId, queryKey: getListTransactionsQueryKey({ walletId }) },
  });

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      toast.success("Address copied to clipboard");
    }
  };

  if (loadingWallet) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-36 bg-muted rounded-xl" />
        <div className="h-96 bg-muted rounded-xl" />
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">Wallet not found</h2>
        <Link href="/wallets"><Button variant="outline">Back to Wallets</Button></Link>
      </div>
    );
  }

  const up = (wallet.change24hPercent ?? 0) >= 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header card */}
      <Card className="border-border shadow-sm overflow-hidden">
        <div className="h-1.5 w-full" style={{ backgroundColor: wallet.color || "#3b82f6" }} />
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-foreground">{wallet.name}</h1>
                <button
                  onClick={copyAddress}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded font-mono hover:bg-muted/80 transition-colors"
                >
                  {truncateAddress(wallet.address)}
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-3xl font-bold text-foreground">
                  {formatCurrency(wallet.totalValueUsd ?? 0)}
                </span>
                <span className={`flex items-center gap-1 text-sm font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>
                  {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {formatPercent(wallet.change24hPercent ?? 0)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 h-9">
                    <QrCode className="w-4 h-4" /> Receive
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm border-border flex flex-col items-center p-8">
                  <DialogHeader>
                    <DialogTitle className="text-center text-foreground mb-4">Receive Funds</DialogTitle>
                  </DialogHeader>
                  <div className="bg-white border border-border p-4 rounded-xl mb-5 shadow-sm">
                    <svg viewBox="0 0 100 100" className="w-44 h-44" fill="black">
                      <rect x="10" y="10" width="25" height="25" rx="2" />
                      <rect x="65" y="10" width="25" height="25" rx="2" />
                      <rect x="10" y="65" width="25" height="25" rx="2" />
                      <rect x="42" y="42" width="16" height="16" rx="1" />
                      <rect x="42" y="10" width="8" height="8" />
                      <rect x="10" y="42" width="8" height="8" />
                      <rect x="70" y="42" width="8" height="8" />
                      <rect x="70" y="70" width="8" height="8" />
                      <rect x="42" y="70" width="8" height="8" />
                      <rect x="62" y="62" width="8" height="8" />
                      <path d="M15 15h15v15H15zM70 15h15v15H70zM15 70h15v15H15z" fill="white" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 text-center">Scan to send to this address</p>
                  <div className="w-full bg-muted p-3 rounded-lg flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-foreground truncate">{wallet.address}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={copyAddress}>
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button className="gap-2 h-9 bg-blue-600 hover:bg-blue-700 text-white">
                <ArrowUpRight className="w-4 h-4" /> Send
              </Button>
              <Link href="/swap">
                <Button variant="secondary" className="gap-2 h-9">
                  <RefreshCw className="w-4 h-4" /> Swap
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="tokens">
        <TabsList className="bg-muted border-b-0 rounded-lg p-1 mb-5">
          <TabsTrigger value="tokens" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">
            Tokens {tokens && `(${tokens.length})`}
          </TabsTrigger>
          <TabsTrigger value="nfts" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">
            NFTs {nfts && `(${nfts.length})`}
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">
            Transactions {transactions && `(${transactions.length})`}
          </TabsTrigger>
        </TabsList>

        {/* Tokens tab */}
        <TabsContent value="tokens" className="mt-0">
          <Card className="border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Asset</th>
                    <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide text-right">Balance</th>
                    <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide text-right">Price</th>
                    <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loadingTokens ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(4)].map((_, j) => (
                          <td key={j} className="px-5 py-4">
                            <div className="h-4 bg-muted rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : tokens?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center text-muted-foreground">
                        No tokens in this wallet
                      </td>
                    </tr>
                  ) : (
                    tokens?.map((token) => {
                      const up = (token.change24hPercent ?? 0) >= 0;
                      return (
                        <tr key={token.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground overflow-hidden flex-shrink-0">
                                <img
                                  src={token.logoUrl}
                                  alt={token.tokenSymbol}
                                  className="w-full h-full object-cover rounded-full"
                                  onError={(e) => { e.currentTarget.style.display = "none"; (e.currentTarget.parentElement!).textContent = token.tokenSymbol.slice(0, 2); }}
                                />
                              </div>
                              <div>
                                <div className="font-semibold text-foreground">{token.tokenName}</div>
                                <div className="text-xs text-muted-foreground">{token.tokenSymbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="font-medium text-foreground">{formatCrypto(token.balance)} {token.tokenSymbol}</div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="text-foreground font-medium">{formatCurrency(token.priceUsd)}</div>
                            <div className={`text-xs font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>
                              {formatPercent(token.change24hPercent)}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right font-semibold text-foreground">
                            {formatCurrency(token.valueUsd)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* NFTs tab */}
        <TabsContent value="nfts" className="mt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loadingNfts ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-border">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))
            ) : nfts?.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground bg-card border border-border rounded-xl">
                No NFTs in this wallet
              </div>
            ) : (
              nfts?.map((nft) => (
                <Card key={nft.id} className="border-border shadow-sm overflow-hidden hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <img
                      src={nft.imageUrl}
                      alt={nft.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='%23e2e8f0'%3E%3Crect width='200' height='200'/%3E%3C/svg%3E"; }}
                    />
                  </div>
                  <CardContent className="p-3.5">
                    <div className="text-xs text-muted-foreground mb-0.5 truncate">{nft.collection}</div>
                    <div className="font-semibold text-foreground text-sm truncate">{nft.name}</div>
                    {nft.floorPriceEth != null && (
                      <div className="mt-2 text-xs bg-muted px-2 py-1.5 rounded flex justify-between">
                        <span className="text-muted-foreground">Floor</span>
                        <span className="font-semibold text-foreground">{Number(nft.floorPriceEth).toFixed(2)} ETH</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Transactions tab */}
        <TabsContent value="transactions" className="mt-0">
          <Card className="border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Type</th>
                    <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Amount</th>
                    <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Address</th>
                    <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Date</th>
                    <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Status</th>
                    <th className="px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loadingTx ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(6)].map((_, j) => (
                          <td key={j} className="px-5 py-4">
                            <div className="h-4 bg-muted rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : transactions?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">No transactions yet</td>
                    </tr>
                  ) : (
                    transactions?.map((tx) => (
                      <tr key={tx.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                              tx.type === "receive" ? "bg-emerald-50 text-emerald-600" :
                              tx.type === "send" ? "bg-red-50 text-red-500" :
                              tx.type === "swap" ? "bg-blue-50 text-blue-600" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {tx.type === "send" && <ArrowUpRight className="w-3.5 h-3.5" />}
                              {tx.type === "receive" && <ArrowDownLeft className="w-3.5 h-3.5" />}
                              {tx.type === "swap" && <RefreshCw className="w-3.5 h-3.5" />}
                            </div>
                            <span className="capitalize font-medium text-foreground text-sm">{tx.type}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-medium text-sm">
                          <span className={tx.type === "receive" ? "text-emerald-600" : tx.type === "send" ? "text-red-500" : "text-foreground"}>
                            {formatCrypto(tx.amount)} {tx.tokenSymbol}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                          {tx.type === "send" ? truncateAddress(tx.toAddress) : truncateAddress(tx.fromAddress)}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground text-xs">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            tx.status === "confirmed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            tx.status === "pending" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                            "bg-red-50 text-red-600 border border-red-200"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              tx.status === "confirmed" ? "bg-emerald-500" :
                              tx.status === "pending" ? "bg-amber-500" : "bg-red-500"
                            }`} />
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right font-semibold text-foreground">
                          {formatCurrency(tx.valueUsd)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
