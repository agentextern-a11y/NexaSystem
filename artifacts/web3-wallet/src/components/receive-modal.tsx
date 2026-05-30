import { useState, useCallback } from "react";
import { X, ArrowDownLeft, Copy, Check, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Wallet {
  id: string;
  name: string;
  address: string;
  color?: string;
  network?: { symbol?: string; name?: string };
}

interface Props {
  open: boolean;
  onClose: () => void;
  wallets: Wallet[];
}

/* ── Simple QR-like visual (not a real QR, just a styled placeholder) ── */
function QRPlaceholder({ address }: { address: string }) {
  const seed = address.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    const x = i % 21;
    const y = Math.floor(i / 21);
    const isCorner =
      (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    const hash = (seed * (i + 1) * 31337) % 100;
    return isCorner || hash > 55;
  });

  return (
    <div className="w-44 h-44 mx-auto mb-4 p-3 bg-white rounded-2xl shadow-md">
      <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(21, 1fr)" }}>
        {cells.map((filled, i) => (
          <div
            key={i}
            className="aspect-square rounded-[1px]"
            style={{ backgroundColor: filled ? "#1a1363" : "transparent" }}
          />
        ))}
      </div>
    </div>
  );
}

export function ReceiveModal({ open, onClose, wallets }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const wallet = wallets[selectedIdx];
  const address = wallet?.address ?? "0x64a34d69C4D5F1D23eC4e5";

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  }, [address]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-100">
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="font-extrabold text-slate-900">Receive Crypto</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Wallet selector */}
          {wallets.length > 1 && (
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {wallets.map((w, i) => (
                <button
                  key={w.id}
                  onClick={() => setSelectedIdx(i)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    i === selectedIdx
                      ? "text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                  style={i === selectedIdx ? { background: "linear-gradient(135deg,#5b5be6,#7c6fcd)" } : {}}
                >
                  {w.name}
                </button>
              ))}
            </div>
          )}

          {/* Network badge */}
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0F0FF] rounded-full text-xs font-bold text-[#5b5be6]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {wallet?.network?.name ?? "Ethereum"} · {wallet?.network?.symbol ?? "ETH"}
            </span>
          </div>

          {/* QR Code */}
          <QRPlaceholder address={address} />

          {/* Address */}
          <div
            className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4 mb-4 cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={handleCopy}
          >
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-slate-400 font-medium mb-0.5 uppercase tracking-wider">Wallet Address</p>
              <p className="text-sm font-mono font-semibold text-slate-700 truncate">{address}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
            </div>
          </div>

          <Button
            onClick={handleCopy}
            className="w-full h-11 rounded-xl font-bold gap-2"
            style={{ background: "linear-gradient(135deg,#5b5be6,#7c6fcd)", color: "#fff" }}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Wallet Address"}
          </Button>

          <p className="mt-4 text-center text-[11px] text-slate-400">
            Only send {wallet?.network?.symbol ?? "ETH"}-compatible assets to this address. Sending incompatible tokens may result in permanent loss.
          </p>
        </div>
      </div>
    </div>
  );
}
