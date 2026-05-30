import { Layout } from "@/components/layout";
import { useListWallets, getListWalletsQueryKey, useGetWalletNfts, getGetWalletNftsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Since API hook takes walletId, we fetch wallets then map them, or mock a global fetch if needed.
// For this demo, we'll fetch wallets, then show an aggregated view.
// Given hook limits, we'll just fetch NFTs for the first wallet, or use a placeholder list if needed.
// Actually, let's fetch for the first wallet and show them.

export default function Nfts() {
  const { data: wallets, isLoading: loadingWallets } = useListWallets({
    query: { queryKey: getListWalletsQueryKey() }
  });

  const walletId = wallets?.[0]?.id;

  const { data: nfts, isLoading: loadingNfts } = useGetWalletNfts(walletId || 0, {
    query: { enabled: !!walletId, queryKey: getGetWalletNftsQueryKey(walletId || 0) }
  });

  const isLoading = loadingWallets || loadingNfts;

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-white">NFT Gallery</h1>
          <div className="px-3 py-1 bg-muted/50 border border-border rounded-full text-sm font-medium text-muted-foreground">
            {nfts?.length || 0} Assets
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {isLoading ? (
            [...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-muted/30 rounded-xl animate-pulse" />
            ))
          ) : nfts?.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-card border border-card-border rounded-2xl">
              <ImageIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">No NFTs found</h3>
              <p className="text-muted-foreground">Your collected NFTs will appear here.</p>
            </div>
          ) : (
            nfts?.map((nft) => (
              <Card key={nft.id} className="bg-card border-card-border overflow-hidden hover:border-primary/50 hover:shadow-[0_0_15px_rgba(var(--primary),0.2)] transition-all cursor-pointer group">
                <div className="aspect-square bg-muted relative overflow-hidden">
                  <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    #{nft.tokenId}
                  </div>
                </div>
                <CardContent className="p-4 bg-card/80 backdrop-blur-sm relative -mt-2">
                  <div className="text-xs text-muted-foreground font-medium mb-1">{nft.collection}</div>
                  <div className="font-bold text-white text-sm truncate">{nft.name}</div>
                  {nft.floorPriceEth && (
                    <div className="mt-3 flex items-center justify-between text-xs bg-muted/30 p-2 rounded border border-border/50">
                      <span className="text-muted-foreground">Floor</span>
                      <span className="font-bold text-white">{nft.floorPriceEth} ETH</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
