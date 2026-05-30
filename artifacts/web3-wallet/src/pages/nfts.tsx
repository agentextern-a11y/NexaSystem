import {
  useListWallets, getListWalletsQueryKey,
  useGetWalletNfts, getGetWalletNftsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Nfts() {
  const { data: wallets, isLoading: loadingWallets } = useListWallets({
    query: { queryKey: getListWalletsQueryKey() },
  });

  const [selectedWalletId, setSelectedWalletId] = useState<string>("");
  const effectiveWalletId = selectedWalletId ? parseInt(selectedWalletId) : (wallets?.[0]?.id ?? 0);

  const { data: nfts, isLoading: loadingNfts } = useGetWalletNfts(effectiveWalletId, {
    query: {
      enabled: !!effectiveWalletId,
      queryKey: getGetWalletNftsQueryKey(effectiveWalletId),
    },
  });

  const isLoading = loadingWallets || loadingNfts;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">NFT Gallery</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{nfts?.length ?? 0} collectibles</p>
        </div>
        <Select
          value={selectedWalletId || String(wallets?.[0]?.id ?? "")}
          onValueChange={setSelectedWalletId}
        >
          <SelectTrigger className="w-48 h-9 border-border bg-card">
            <SelectValue placeholder="Select wallet" />
          </SelectTrigger>
          <SelectContent>
            {wallets?.map((w) => (
              <SelectItem key={w.id} value={String(w.id)}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: w.color || "#3b82f6" }} />
                  {w.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {isLoading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-border">
              <div className="aspect-square bg-muted animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))
        ) : nfts?.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-card border border-dashed border-border rounded-2xl">
            <ImageIcon className="w-10 h-10 text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No NFTs found</h3>
            <p className="text-muted-foreground text-sm">Collectibles owned by this wallet will appear here.</p>
          </div>
        ) : (
          nfts?.map((nft) => (
            <Card
              key={nft.id}
              className="border-border shadow-sm overflow-hidden hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
            >
              <div className="aspect-square bg-muted relative overflow-hidden">
                <img
                  src={nft.imageUrl}
                  alt={nft.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='%23e2e8f0'%3E%3Crect width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%2394a3b8' font-size='14'%3ENFT%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  #{nft.tokenId}
                </div>
              </div>
              <CardContent className="p-3.5">
                <div className="text-xs text-muted-foreground font-medium mb-0.5 truncate">{nft.collection}</div>
                <div className="font-semibold text-foreground text-sm truncate">{nft.name}</div>
                {nft.floorPriceEth != null && (
                  <div className="mt-2 flex items-center justify-between text-xs bg-muted px-2 py-1.5 rounded-md">
                    <span className="text-muted-foreground">Floor</span>
                    <span className="font-semibold text-foreground">{Number(nft.floorPriceEth).toFixed(2)} ETH</span>
                  </div>
                )}
                {nft.floorPriceUsd != null && (
                  <div className="text-xs text-muted-foreground mt-1 text-right">
                    ≈ {formatCurrency(Number(nft.floorPriceUsd))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
