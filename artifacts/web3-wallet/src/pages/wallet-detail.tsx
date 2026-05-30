import { Layout } from "@/components/layout";
import { useParams, Link } from "wouter";
import { 
  useGetWallet, getGetWalletQueryKey, 
  useGetWalletTokens, getGetWalletTokensQueryKey,
  useGetWalletNfts, getGetWalletNftsQueryKey,
  useListTransactions, getListTransactionsQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, Copy, QrCode, ExternalLink, RefreshCw } from "lucide-react";
import { formatCurrency, formatCrypto, formatPercent, truncateAddress } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function WalletDetail() {
  const { id } = useParams();
  const walletId = parseInt(id || "0", 10);

  const { data: wallet, isLoading: loadingWallet } = useGetWallet(walletId, {
    query: { enabled: !!walletId, queryKey: getGetWalletQueryKey(walletId) }
  });

  const { data: tokens, isLoading: loadingTokens } = useGetWalletTokens(walletId, {
    query: { enabled: !!walletId, queryKey: getGetWalletTokensQueryKey(walletId) }
  });

  const { data: nfts, isLoading: loadingNfts } = useGetWalletNfts(walletId, {
    query: { enabled: !!walletId, queryKey: getGetWalletNftsQueryKey(walletId) }
  });

  const { data: transactions, isLoading: loadingTx } = useListTransactions({ walletId }, {
    query: { enabled: !!walletId, queryKey: getListTransactionsQueryKey({ walletId }) }
  });

  const copyToClipboard = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      toast.success("Address copied to clipboard");
    }
  };

  if (loadingWallet) {
    return (
      <Layout>
        <div className="animate-pulse space-y-8">
          <div className="h-40 bg-muted/20 rounded-xl" />
          <div className="h-[400px] bg-muted/20 rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!wallet) return <Layout>Wallet not found</Layout>;

  return (
    <Layout>
      <div className="flex flex-col gap-6 relative">
        <div 
          className="absolute -top-10 -left-10 w-96 h-96 rounded-full blur-[100px] opacity-10 pointer-events-none"
          style={{ backgroundColor: wallet.color || 'var(--primary)' }}
        />
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-card border border-card-border p-6 rounded-xl relative z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: wallet.color || 'var(--primary)' }} />
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{wallet.name}</h1>
              <div className="px-2 py-0.5 rounded text-xs font-mono bg-muted/50 text-muted-foreground flex items-center gap-1 border border-border">
                {truncateAddress(wallet.address)}
                <button onClick={copyToClipboard} className="hover:text-white transition-colors ml-1 p-0.5">
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-4xl font-bold tracking-tighter text-white">
                {formatCurrency(wallet.totalValueUsd)}
              </span>
              <span className={`text-sm font-medium ${wallet.change24hPercent && wallet.change24hPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                {wallet.change24hPercent && wallet.change24hPercent >= 0 ? '+' : ''}{formatPercent(wallet.change24hPercent)}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 bg-card">
                  <QrCode className="w-4 h-4" /> Receive
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-card border-card-border flex flex-col items-center justify-center p-8">
                <DialogHeader>
                  <DialogTitle className="text-center text-white mb-4">Receive Funds</DialogTitle>
                </DialogHeader>
                <div className="bg-white p-4 rounded-xl mb-6">
                  {/* Mock QR Code Pattern */}
                  <svg viewBox="0 0 100 100" className="w-48 h-48" fill="black">
                    <rect x="10" y="10" width="20" height="20" />
                    <rect x="70" y="10" width="20" height="20" />
                    <rect x="10" y="70" width="20" height="20" />
                    <rect x="40" y="40" width="20" height="20" />
                    <rect x="40" y="10" width="10" height="10" />
                    <rect x="10" y="40" width="10" height="10" />
                    <rect x="70" y="40" width="10" height="10" />
                    <rect x="70" y="70" width="10" height="10" />
                    <rect x="40" y="70" width="10" height="10" />
                    <path d="M15 15h10v10H15zM75 15h10v10H75zM15 75h10v10H15z" fill="white" />
                  </svg>
                </div>
                <div className="w-full text-center">
                  <p className="text-sm text-muted-foreground mb-2">Scan to send funds to this address</p>
                  <div className="bg-muted p-3 rounded-lg flex items-center justify-between">
                    <span className="font-mono text-sm truncate mr-2">{wallet.address}</span>
                    <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <ArrowUpRight className="w-4 h-4" /> Send
            </Button>
            <Link href="/swap">
              <Button variant="secondary" className="gap-2">
                <RefreshCw className="w-4 h-4" /> Swap
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="bg-card border-card-border p-1 w-full justify-start overflow-x-auto h-12 mb-6 rounded-lg">
            <TabsTrigger value="tokens" className="px-6 data-[state=active]:bg-muted">Tokens</TabsTrigger>
            <TabsTrigger value="nfts" className="px-6 data-[state=active]:bg-muted">NFTs</TabsTrigger>
            <TabsTrigger value="transactions" className="px-6 data-[state=active]:bg-muted">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="mt-0">
            <Card className="bg-card border-card-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground bg-muted/20 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-medium rounded-tl-lg">Asset</th>
                      <th className="px-6 py-4 font-medium text-right">Balance</th>
                      <th className="px-6 py-4 font-medium text-right">Price</th>
                      <th className="px-6 py-4 font-medium text-right rounded-tr-lg">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingTokens ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="px-6 py-4"><div className="h-8 bg-muted/30 rounded animate-pulse w-32" /></td>
                          <td className="px-6 py-4"><div className="h-6 bg-muted/30 rounded animate-pulse w-24 ml-auto" /></td>
                          <td className="px-6 py-4"><div className="h-6 bg-muted/30 rounded animate-pulse w-16 ml-auto" /></td>
                          <td className="px-6 py-4"><div className="h-6 bg-muted/30 rounded animate-pulse w-24 ml-auto" /></td>
                        </tr>
                      ))
                    ) : tokens?.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No tokens found in this wallet</td>
                      </tr>
                    ) : (
                      tokens?.map((token) => (
                        <tr key={token.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={token.logoUrl || `https://cdn.coinbase.com/assets/logos/${token.tokenSymbol.toLowerCase()}.svg`} alt={token.tokenName} className="w-8 h-8 rounded-full bg-muted" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxsaW5lIHgxPSIxMiIgeTE9IjgiIHgyPSIxMiIgeTI9IjEyIi8+PGxpbmUgeDE9IjEyIiB5MT0iMTYiIHgyPSIxMiIgeTI9IjE2Ii8+PC9zdmc+'; }} />
                              <div>
                                <div className="font-medium text-white">{token.tokenName}</div>
                                <div className="text-xs text-muted-foreground">{token.tokenSymbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="font-medium text-white">{formatCrypto(token.balance)}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-white">{formatCurrency(token.priceUsd)}</div>
                            <div className={`text-xs ${token.change24hPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                              {token.change24hPercent >= 0 ? '+' : ''}{formatPercent(token.change24hPercent)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-white">
                            {formatCurrency(token.valueUsd)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="nfts" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {loadingNfts ? (
                [...Array(4)].map((_, i) => <div key={i} className="aspect-square bg-muted/30 rounded-xl animate-pulse" />)
              ) : nfts?.length === 0 ? (
                <div className="col-span-full py-12 text-center text-muted-foreground bg-card border border-card-border rounded-xl">No NFTs found in this wallet</div>
              ) : (
                nfts?.map((nft) => (
                  <Card key={nft.id} className="bg-card border-card-border overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground truncate mb-1">{nft.collection}</div>
                      <div className="font-medium text-white text-sm truncate">{nft.name}</div>
                      {nft.floorPriceEth && (
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Floor</span>
                          <span className="font-medium text-white">{nft.floorPriceEth} ETH</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="mt-0">
            <Card className="bg-card border-card-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground bg-muted/20 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-medium rounded-tl-lg">Type</th>
                      <th className="px-6 py-4 font-medium">Asset</th>
                      <th className="px-6 py-4 font-medium">To / From</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right rounded-tr-lg">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingTx ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="px-6 py-4"><div className="h-6 bg-muted/30 rounded animate-pulse w-24" /></td>
                          <td className="px-6 py-4"><div className="h-6 bg-muted/30 rounded animate-pulse w-20" /></td>
                          <td className="px-6 py-4"><div className="h-6 bg-muted/30 rounded animate-pulse w-32" /></td>
                          <td className="px-6 py-4"><div className="h-6 bg-muted/30 rounded animate-pulse w-24" /></td>
                          <td className="px-6 py-4"><div className="h-6 bg-muted/30 rounded animate-pulse w-16" /></td>
                          <td className="px-6 py-4"><div className="h-6 bg-muted/30 rounded animate-pulse w-20 ml-auto" /></td>
                        </tr>
                      ))
                    ) : transactions?.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No transactions found</td>
                      </tr>
                    ) : (
                      transactions?.map((tx) => (
                        <tr key={tx.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {tx.type === 'send' && <ArrowUpRight className="w-4 h-4 text-white" />}
                              {tx.type === 'receive' && <ArrowDownLeft className="w-4 h-4 text-success" />}
                              {tx.type === 'swap' && <RefreshCw className="w-4 h-4 text-primary" />}
                              <span className="capitalize text-white">{tx.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-white">{formatCrypto(tx.amount)} {tx.tokenSymbol}</span>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                            {tx.type === 'send' ? truncateAddress(tx.toAddress) : truncateAddress(tx.fromAddress)}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              tx.status === 'confirmed' ? 'bg-success/10 text-success' :
                              tx.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-medium text-white">{formatCurrency(tx.valueUsd)}</span>
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
    </Layout>
  );
}
