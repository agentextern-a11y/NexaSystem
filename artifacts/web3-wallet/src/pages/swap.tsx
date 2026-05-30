import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDown, Settings2, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";
import {
  useSwapTokens,
  useListWallets, getListWalletsQueryKey,
  useListTokens, getListTokensQueryKey,
  useGetWalletTokens, getGetWalletTokensQueryKey,
  getListTransactionsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

export default function Swap() {
  const [fromAmount, setFromAmount] = useState("");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");
  const [walletId, setWalletId] = useState<string>("");
  const [slippage, setSlippage] = useState("0.5");

  const { data: wallets = [] } = useListWallets({ query: { queryKey: getListWalletsQueryKey() } });
  const { data: tokens = [] } = useListTokens({ query: { queryKey: getListTokensQueryKey() } });
  const { data: holdings = [] } = useGetWalletTokens(Number(walletId) || 0, {
    query: { enabled: !!walletId, queryKey: getGetWalletTokensQueryKey(Number(walletId) || 0) }
  });

  const swapTokens = useSwapTokens();
  const queryClient = useQueryClient();

  const fromTokenData = useMemo(() => tokens.find(t => t.symbol === fromToken), [tokens, fromToken]);
  const toTokenData = useMemo(() => tokens.find(t => t.symbol === toToken), [tokens, toToken]);

  const fromBalance = useMemo(
    () => holdings.find(h => h.tokenSymbol === fromToken)?.balance ?? 0,
    [holdings, fromToken]
  );
  const toBalance = useMemo(
    () => holdings.find(h => h.tokenSymbol === toToken)?.balance ?? 0,
    [holdings, toToken]
  );

  const toAmount = useMemo(() => {
    const amt = parseFloat(fromAmount);
    if (!amt || !fromTokenData || !toTokenData || toTokenData.priceUsd === 0) return "";
    const valueUsd = amt * fromTokenData.priceUsd;
    const result = valueUsd / toTokenData.priceUsd;
    return result < 0.01 ? result.toFixed(8) : result < 1000 ? result.toFixed(4) : result.toFixed(2);
  }, [fromAmount, fromTokenData, toTokenData]);

  const estimatedFee = fromTokenData ? fromTokenData.priceUsd * 0.002 : 0;
  const rate = fromTokenData && toTokenData && toTokenData.priceUsd > 0
    ? (fromTokenData.priceUsd / toTokenData.priceUsd)
    : null;

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
  };

  const handleSwap = () => {
    if (!walletId) { toast.error("Please select a wallet"); return; }
    const amt = parseFloat(fromAmount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    if (fromToken === toToken) { toast.error("Select different tokens"); return; }

    swapTokens.mutate(
      { walletId: Number(walletId), data: { fromTokenSymbol: fromToken, toTokenSymbol: toToken, amount: amt } },
      {
        onSuccess: () => {
          toast.success(`Swapped ${fromAmount} ${fromToken} → ${toAmount} ${toToken}`);
          setFromAmount("");
          queryClient.invalidateQueries({ queryKey: getGetWalletTokensQueryKey(Number(walletId)) });
          queryClient.invalidateQueries({ queryKey: getListTransactionsQueryKey() });
        },
        onError: () => toast.error("Swap failed. Please try again."),
      }
    );
  };

  const popularTokens = tokens.filter(t => t.isPopular).slice(0, 8);

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Swap Tokens</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Swap tokens instantly at live market rates</p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-semibold">Token Swap</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Slippage:</span>
            <select
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              className="text-xs bg-muted border border-border rounded px-1.5 py-1 text-foreground"
            >
              {["0.1", "0.5", "1.0", "3.0"].map(s => (
                <option key={s} value={s}>{s}%</option>
              ))}
            </select>
            <Settings2 className="w-4 h-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Wallet select */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Wallet</Label>
            <Select value={walletId} onValueChange={setWalletId}>
              <SelectTrigger className="h-10 bg-muted/40 border-border">
                <SelectValue placeholder="Select wallet to swap from" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map(w => (
                  <SelectItem key={w.id} value={w.id.toString()}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: w.color || "#3b82f6" }} />
                      {w.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* From */}
          <div className="bg-muted/40 rounded-xl p-4 border border-border focus-within:border-blue-400 transition-colors">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>You pay</span>
              <span>
                Balance: {typeof fromBalance === 'number' ? fromBalance.toFixed(4) : '—'} {fromToken}
                {fromBalance > 0 && (
                  <button onClick={() => setFromAmount(fromBalance.toString())} className="ml-1.5 text-blue-600 hover:underline">Max</button>
                )}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.0"
                min="0"
                className="bg-transparent border-none text-2xl font-bold text-foreground p-0 h-auto focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Select value={fromToken} onValueChange={v => { setFromToken(v); }}>
                <SelectTrigger className="w-32 h-9 bg-card border-border shrink-0 font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {popularTokens.map(t => (
                    <SelectItem key={t.symbol} value={t.symbol} disabled={t.symbol === toToken}>
                      {t.symbol} — {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {fromAmount && fromTokenData && (
              <div className="text-xs text-muted-foreground mt-1">
                ≈ {formatCurrency(parseFloat(fromAmount) * fromTokenData.priceUsd)}
              </div>
            )}
          </div>

          {/* Switch button */}
          <div className="flex justify-center -my-1 relative z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={switchTokens}
              className="rounded-full h-8 w-8 bg-card border-border hover:bg-muted shadow-sm"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>

          {/* To */}
          <div className="bg-muted/40 rounded-xl p-4 border border-border">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>You receive</span>
              <span>Balance: {typeof toBalance === 'number' ? toBalance.toFixed(4) : '—'} {toToken}</span>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="text"
                value={toAmount}
                readOnly
                placeholder="0.0"
                className="bg-transparent border-none text-2xl font-bold text-foreground p-0 h-auto focus-visible:ring-0"
              />
              <Select value={toToken} onValueChange={v => { setToToken(v); }}>
                <SelectTrigger className="w-32 h-9 bg-card border-border shrink-0 font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {popularTokens.map(t => (
                    <SelectItem key={t.symbol} value={t.symbol} disabled={t.symbol === fromToken}>
                      {t.symbol} — {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {toAmount && toTokenData && (
              <div className="text-xs text-muted-foreground mt-1">
                ≈ {formatCurrency(parseFloat(toAmount) * toTokenData.priceUsd)}
              </div>
            )}
          </div>

          {/* Rate details */}
          {rate !== null && fromAmount && parseFloat(fromAmount) > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exchange Rate</span>
                <span className="font-medium text-foreground">
                  1 {fromToken} = {rate < 0.01 ? rate.toFixed(8) : rate.toFixed(4)} {toToken}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Gas Fee</span>
                <span className="font-medium text-foreground">≈ {formatCurrency(estimatedFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slippage Tolerance</span>
                <span className="font-medium text-foreground">{slippage}%</span>
              </div>
            </div>
          )}

          {fromToken === toToken && (
            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Select two different tokens to swap.
            </div>
          )}

          <Button
            className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            disabled={!fromAmount || parseFloat(fromAmount) <= 0 || swapTokens.isPending || !walletId || fromToken === toToken}
            onClick={handleSwap}
          >
            {swapTokens.isPending ? "Swapping..." :
              !walletId ? "Select a Wallet" :
              !fromAmount || parseFloat(fromAmount) <= 0 ? "Enter an Amount" :
              fromToken === toToken ? "Select Different Tokens" :
              `Swap ${fromToken} → ${toToken}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
