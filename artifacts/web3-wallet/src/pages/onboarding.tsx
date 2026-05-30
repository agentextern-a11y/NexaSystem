import { useState } from "react";
import { useCreateWallet, useListNetworks, getListNetworksQueryKey, getListWalletsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Shield, Zap, Globe, ChevronRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function NexaMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="oG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00e5ff"/>
          <stop offset="100%" stopColor="#2979ff"/>
        </linearGradient>
      </defs>
      <path d="M20 88 L20 22 L36 22 L68 62 L68 22 L84 22 L84 88 L68 88 L36 48 L36 88 Z" fill="url(#oG)"/>
      <path d="M36 30 L62 62 L62 30 Z" fill="#0a1628" opacity="0.45"/>
      <path d="M82 52 L100 52 L100 44 L116 60 L100 76 L100 68 L82 68 Z" fill="#00e5ff" opacity="0.85"/>
    </svg>
  );
}

const COLORS = [
  "#2979ff", "#00b8d4", "#7c3aed", "#ec4899",
  "#10b981", "#f59e0b", "#ef4444", "#0ea5e9",
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
          toast.success("Wallet created! Welcome to Nexa.");
          queryClient.invalidateQueries({ queryKey: getListWalletsQueryKey() });
          navigate("/dashboard");
        },
        onError: () => toast.error("Failed to create wallet. Please try again."),
      }
    );
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel — dark brand */}
      <div className="hidden lg:flex lg:w-[46%] flex-col justify-between p-12" style={{ background: "linear-gradient(160deg,#0a1628 0%,#1a237e 60%,#0d2a50 100%)" }}>
        <div className="flex items-center gap-3">
          <NexaMark size={36} />
          <div>
            <div className="font-extrabold text-white text-lg tracking-wider">NEXA</div>
            <div className="text-[11px] font-medium tracking-widest" style={{ color: "#00e5ff" }}>Payment Crypto</div>
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Tap. Pay.<br />
            <span style={{ background: "linear-gradient(90deg,#00e5ff,#2979ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Instantly.
            </span>
          </h2>
          <p className="text-slate-400 text-base mb-10 leading-relaxed">
            Your keys, your crypto. Nexa is a non-custodial wallet for fast, secure, borderless payments across 6 blockchains.
          </p>
          <div className="space-y-4">
            {[
              { icon: Shield, text: "Non-custodial — you own your private keys" },
              { icon: Globe,  text: "6 networks: ETH, Polygon, BNB, AVAX, ARB, OP" },
              { icon: Zap,    text: "Instant swaps at live market rates" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(41,121,255,0.25)", border: "1px solid rgba(0,229,255,0.2)" }}>
                  <Icon className="w-4 h-4" style={{ color: "#00e5ff" }} />
                </div>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-700 text-xs">© 2025 Nexa Payment Crypto · All rights reserved</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        {step === "welcome" ? (
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-6 lg:hidden">
              <NexaMark size={48} />
            </div>
            <div className="mb-10">
              <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome to Nexa</h1>
              <p className="text-slate-500">Create your first wallet to start sending, receiving, and swapping crypto instantly.</p>
            </div>

            <div className="space-y-3 mb-8">
              <Button
                className="w-full h-14 text-base font-bold gap-3 rounded-xl"
                style={{ background: "linear-gradient(135deg,#2979ff,#1a237e)", color: "#fff", boxShadow: "0 8px 24px rgba(41,121,255,0.3)" }}
                onClick={() => setStep("create")}
              >
                Create New Wallet
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Non-custodial wallet</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Nexa never stores your private keys. You are always in full, sole control of your assets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <button
              onClick={() => setStep("welcome")}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-7 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <h1 className="text-2xl font-black text-slate-900 mb-1">Create your wallet</h1>
            <p className="text-slate-500 text-sm mb-8">Choose a name, network, and color to identify your wallet.</p>

            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-1.5">
                <Label htmlFor="wName" className="text-sm font-semibold text-slate-700">Wallet Name</Label>
                <Input
                  id="wName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Main Wallet, DeFi Vault, Trading"
                  required
                  className="h-12 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Network</Label>
                <div className="grid grid-cols-2 gap-2">
                  {networks.filter(n => !n.isTestnet).slice(0, 6).map(network => (
                    <button
                      key={network.id}
                      type="button"
                      onClick={() => setSelectedNetworkId(network.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all ${
                        selectedNetworkId === network.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-100 bg-white hover:border-blue-200"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: network.color || "#627EEA" }} />
                      <span className="text-sm font-semibold text-slate-800 truncate">{network.name}</span>
                      {selectedNetworkId === network.id && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 ml-auto flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Wallet Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className="w-9 h-9 rounded-full transition-all"
                      style={{
                        backgroundColor: color,
                        border: selectedColor === color ? `3px solid ${color}` : "3px solid transparent",
                        outline: selectedColor === color ? "2px solid white" : "none",
                        boxShadow: selectedColor === color ? `0 0 0 3px ${color}55` : "none",
                      }}
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={!name.trim() || createWallet.isPending}
                className="w-full h-12 text-base font-bold rounded-xl"
                style={{ background: "linear-gradient(135deg,#2979ff,#1a237e)", color: "#fff" }}
              >
                {createWallet.isPending ? "Creating wallet…" : "Create Wallet"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
