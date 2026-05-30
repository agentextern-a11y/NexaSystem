import {
  useListWallets, getListWalletsQueryKey,
  useCreateWallet,
  useListNetworks, getListNetworksQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Wallet, ArrowUpRight, ArrowDownLeft, CheckCircle2 } from "lucide-react";
import { formatCurrency, formatPercent, truncateAddress } from "@/lib/utils";
import { Link } from "wouter";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TrendingUp, TrendingDown } from "lucide-react";

const COLORS = [
  "#3b82f6", "#8b5cf6", "#ec4899", "#10b981",
  "#f59e0b", "#ef4444", "#06b6d4", "#6366f1",
];

export default function Wallets() {
  const { data: wallets, isLoading } = useListWallets({
    query: { queryKey: getListWalletsQueryKey() },
  });
  const { data: networks = [] } = useListNetworks({ query: { queryKey: getListNetworksQueryKey() } });

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedNetworkId, setSelectedNetworkId] = useState<number>(1);

  const createWallet = useCreateWallet();
  const queryClient = useQueryClient();

  const mainnetNetworks = networks.filter(n => !n.isTestnet);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createWallet.mutate(
      { data: { name: name.trim(), networkId: selectedNetworkId, color: selectedColor } },
      {
        onSuccess: () => {
          toast.success("Wallet created successfully");
          setOpen(false);
          setName("");
          setSelectedColor(COLORS[0]);
          queryClient.invalidateQueries({ queryKey: getListWalletsQueryKey() });
        },
        onError: () => toast.error("Failed to create wallet"),
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wallets</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{wallets?.length ?? 0} wallets connected</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4" /> New Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Wallet</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-5 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="walletName">Wallet Name</Label>
                <Input
                  id="walletName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Main Wallet, DeFi Vault, Trading"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>Network</Label>
                <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto">
                  {mainnetNetworks.map(network => (
                    <button
                      key={network.id}
                      type="button"
                      onClick={() => setSelectedNetworkId(network.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border-2 text-left transition-all text-sm ${
                        selectedNetworkId === network.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-border bg-card hover:border-blue-300"
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: network.color || "#627EEA" }} />
                      <span className="font-medium text-foreground truncate">{network.name}</span>
                      {selectedNetworkId === network.id && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 ml-auto flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className="w-8 h-8 rounded-full border-2 transition-all"
                      style={{
                        backgroundColor: color,
                        borderColor: selectedColor === color ? "#1d4ed8" : "transparent",
                        outline: selectedColor === color ? "2px solid #bfdbfe" : "none",
                        outlineOffset: "1px",
                      }}
                    />
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white" disabled={createWallet.isPending}>
                {createWallet.isPending ? "Creating..." : "Create Wallet"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-52 bg-muted rounded-xl animate-pulse" />)
        ) : wallets?.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-card border border-dashed border-border rounded-xl">
            <Wallet className="w-10 h-10 text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No wallets yet</h3>
            <p className="text-muted-foreground text-sm mb-5">Create your first wallet to start managing assets.</p>
            <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="w-4 h-4" /> Create Wallet
            </Button>
          </div>
        ) : (
          wallets?.map((wallet) => {
            const up = (wallet.change24hPercent ?? 0) >= 0;
            return (
              <Link key={wallet.id} href={`/wallets/${wallet.id}`}>
                <Card className="border-border shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer overflow-hidden group">
                  <div className="h-1.5 w-full" style={{ backgroundColor: wallet.color || "#3b82f6" }} />
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-5">
                      <div className="overflow-hidden">
                        <div className="font-bold text-foreground group-hover:text-blue-600 transition-colors truncate">{wallet.name}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5 bg-muted px-1.5 py-0.5 rounded inline-block">
                          {truncateAddress(wallet.address)}
                        </div>
                      </div>
                      <div
                        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: `${wallet.color || "#3b82f6"}18` }}
                      >
                        <Wallet className="w-4 h-4" style={{ color: wallet.color || "#3b82f6" }} />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs text-muted-foreground mb-1">Total Balance</div>
                      <div className="flex items-baseline justify-between">
                        <div className="text-2xl font-bold text-foreground">
                          {formatCurrency(wallet.totalValueUsd ?? 0)}
                        </div>
                        <div className={`text-sm font-semibold flex items-center gap-1 ${up ? "text-emerald-600" : "text-red-500"}`}>
                          {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {formatPercent(wallet.change24hPercent ?? 0)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1.5 h-8 text-xs"
                        onClick={(e) => e.preventDefault()}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" /> Send
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1.5 h-8 text-xs"
                        onClick={(e) => e.preventDefault()}
                      >
                        <ArrowDownLeft className="w-3.5 h-3.5" /> Receive
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
