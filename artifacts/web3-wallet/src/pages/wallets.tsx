import { Layout } from "@/components/layout";
import { useListWallets, getListWalletsQueryKey, useCreateWallet } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Wallet, MoreHorizontal, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { formatCurrency, formatPercent, truncateAddress } from "@/lib/utils";
import { Link } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Wallets() {
  const { data: wallets, isLoading } = useListWallets({
    query: { queryKey: getListWalletsQueryKey() }
  });
  
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const createWallet = useCreateWallet();
  const queryClient = useQueryClient();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createWallet.mutate({
      data: {
        name,
        networkId: 1, // Defaulting to Ethereum for this UI demo
        color: `hsl(${Math.random() * 360} 70% 60%)` // random color
      }
    }, {
      onSuccess: () => {
        toast.success("Wallet created successfully");
        setOpen(false);
        setName("");
        queryClient.invalidateQueries({ queryKey: getListWalletsQueryKey() });
      },
      onError: () => {
        toast.error("Failed to create wallet");
      }
    });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-white">Wallets</h1>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4" /> New Wallet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card border-card-border">
              <DialogHeader>
                <DialogTitle className="text-white">Create Wallet</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Wallet Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Trading Wallet, Vault" 
                    className="bg-muted/50 border-muted-border text-white"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createWallet.isPending}>
                  {createWallet.isPending ? "Creating..." : "Create Wallet"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(6)].map((_, i) => <div key={i} className="h-48 bg-muted/30 rounded-xl animate-pulse" />)
          ) : wallets?.length === 0 ? (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
              <Wallet className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">No wallets found</h3>
              <p className="text-muted-foreground mb-6">Create your first wallet to start managing your assets.</p>
              <Button onClick={() => setOpen(true)}>Create Wallet</Button>
            </div>
          ) : (
            wallets?.map(wallet => (
              <Link key={wallet.id} href={`/wallets/${wallet.id}`}>
                <Card className="bg-card border-card-border hover:bg-muted/10 hover:border-primary/50 transition-all cursor-pointer overflow-hidden group">
                  <div className="h-2 w-full" style={{ backgroundColor: wallet.color || 'var(--primary)' }} />
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="font-bold text-lg text-white group-hover:text-primary transition-colors">{wallet.name}</div>
                        <div className="text-sm text-muted-foreground font-mono bg-muted/50 inline-block px-2 py-0.5 rounded mt-1">
                          {truncateAddress(wallet.address)}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="text-sm text-muted-foreground">Total Balance</div>
                      <div className="flex items-baseline justify-between">
                        <div className="text-2xl font-bold text-white">{formatCurrency(wallet.totalValueUsd)}</div>
                        <div className={`text-sm ${wallet.change24hPercent && wallet.change24hPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {wallet.change24hPercent && wallet.change24hPercent >= 0 ? '+' : ''}{formatPercent(wallet.change24hPercent)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                      <Button variant="secondary" size="sm" className="flex-1 gap-2 bg-muted/50 hover:bg-muted" onClick={(e) => e.preventDefault()}>
                        <ArrowUpRight className="w-3 h-3" /> Send
                      </Button>
                      <Button variant="secondary" size="sm" className="flex-1 gap-2 bg-muted/50 hover:bg-muted" onClick={(e) => e.preventDefault()}>
                        <ArrowDownLeft className="w-3 h-3" /> Receive
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
