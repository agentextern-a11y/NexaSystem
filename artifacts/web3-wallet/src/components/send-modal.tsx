import { useState } from "react";
import { X, ArrowUpRight, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CryptoIcon } from "./crypto-icon";
import { toast } from "sonner";

interface Wallet {
  id: string;
  name: string;
  address: string;
  color?: string;
  network?: { symbol?: string };
  totalValueUsd?: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  wallets: Wallet[];
}

export function SendModal({ open, onClose, wallets }: Props) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(wallets[0] ?? null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSend = async () => {
    if (!to || !amount) { toast.error("Please fill in all fields."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    toast.success(`Transaction initiated — ${amount} sent to ${to.slice(0, 8)}…`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#5b5be6,#7c6fcd)" }}>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-slate-900">Send Crypto</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* From wallet */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-slate-700">From</Label>
            <div className="relative">
              <select
                className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[#5b5be6]"
                value={selectedWallet?.id ?? ""}
                onChange={(e) => setSelectedWallet(wallets.find((w) => w.id === e.target.value) ?? null)}
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>{w.name} — ${w.totalValueUsd?.toFixed(2) ?? "0.00"}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* To address */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-slate-700">Recipient Address</Label>
            <Input
              value={to} onChange={(e) => setTo(e.target.value)}
              placeholder="0x… or ENS name"
              className="h-12 rounded-xl bg-slate-50 font-mono text-sm"
            />
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-slate-700">Amount</Label>
            <div className="relative">
              <Input
                type="number"
                value={amount} onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="h-12 rounded-xl bg-slate-50 pr-16 text-sm font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                {selectedWallet?.network?.symbol || "ETH"}
              </span>
            </div>
          </div>

          {/* Gas notice */}
          <p className="text-[11px] text-slate-400 text-center">
            Network fees will be calculated at confirmation · Transactions are irreversible
          </p>

          <Button
            onClick={handleSend}
            disabled={loading}
            className="w-full h-12 text-base font-bold rounded-xl"
            style={{ background: "linear-gradient(135deg,#5b5be6,#7c6fcd)", color: "#fff" }}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm & Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
