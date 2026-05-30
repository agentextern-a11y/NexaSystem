import { useState } from "react";
import { useCreateWallet, useListNetworks, getListNetworksQueryKey, getListWalletsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Wallet, Shield, Zap, Globe, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const COLORS = [
  "#3b82f6", "#8b5cf6", "#ec4899", "#10b981",
  "#f59e0b", "#ef4444", "#06b6d4", "#6366f1",
];

export default function Onboarding() {
  const [step, setStep] = useState<"welcome" | "create">("welcome");
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedNetworkId, setSelectedNetworkId] = useState<number>(1);

  const { data: networks = [] } = useListNetworks({ query: { queryKey: getListNetworksQueryKey() } });
  const createWallet = useCreateWallet();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createWallet.mutate(
      { data: { name: name.trim(), networkId: selectedNetworkId, color: selectedColor } },
      {
        onSuccess: () => {
          toast.success("Wallet created! Welcome to NP Wallet.");
          queryClient.invalidateQueries({ queryKey: getListWalletsQueryKey() });
          navigate("/");
        },
        onError: () => toast.error("Failed to create wallet. Please try again."),
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12" style={{ background: "hsl(222, 47%, 11%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold">NP</div>
          <span className="text-white font-bold text-xl">NP Wallet</span>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your keys,<br />your crypto.
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            A professional multi-chain wallet for managing digital assets, tracking your portfolio, and swapping tokens — all in one place.
          </p>
          <div className="space-y-4">
            {[
              { icon: Shield, text: "Non-custodial — you own your keys" },
              { icon: Globe, text: "6 networks: Ethereum, Polygon, BNB, Avalanche, Arbitrum, Optimism" },
              { icon: Zap, text: "Instant token swaps and real-time prices" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-xs">© 2025 NP Wallet · All rights reserved</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        {step === "welcome" ? (
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">NP</div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to NP Wallet</h1>
              <p className="text-muted-foreground">Create your first wallet to get started managing your crypto assets.</p>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full h-14 text-base gap-3 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setStep("create")}
              >
                <Wallet className="w-5 h-5" />
                Create a New Wallet
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
            </div>

            <div className="mt-8 p-4 bg-muted rounded-xl border border-border">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Non-custodial wallet</p>
                  <p className="text-xs text-muted-foreground mt-0.5">NP Wallet never stores your private keys. You are always in full control of your assets.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <button
              onClick={() => setStep("welcome")}
              className="text-sm text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-foreground mb-1">Create your wallet</h1>
            <p className="text-muted-foreground text-sm mb-8">Set a name, pick a network and choose a color to identify your wallet.</p>

            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="walletName">Wallet Name</Label>
                <Input
                  id="walletName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Main Wallet, Trading, DeFi Vault"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label>Network</Label>
                <div className="grid grid-cols-2 gap-2">
                  {networks.filter(n => !n.isTestnet).slice(0, 6).map(network => (
                    <button
                      key={network.id}
                      type="button"
                      onClick={() => setSelectedNetworkId(network.id)}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 text-left transition-all ${
                        selectedNetworkId === network.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-border bg-card hover:border-blue-300"
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: network.color || "#627EEA" }}
                      />
                      <span className="text-sm font-medium text-foreground truncate">{network.name}</span>
                      {selectedNetworkId === network.id && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 ml-auto flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Wallet Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className="w-9 h-9 rounded-full border-2 transition-all"
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

              <Button
                type="submit"
                className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!name.trim() || createWallet.isPending}
              >
                {createWallet.isPending ? "Creating wallet..." : "Create Wallet"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
