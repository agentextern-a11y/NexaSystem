import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Settings2, ArrowDown, Info } from "lucide-react";
import { useState } from "react";
import { useSwapTokens, useListWallets, getListWalletsQueryKey } from "@workspace/api-client-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Swap() {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");
  const [walletId, setWalletId] = useState<string>("");

  const { data: wallets } = useListWallets({ query: { queryKey: getListWalletsQueryKey() } });
  const swapTokens = useSwapTokens();

  // Basic mock rate logic for UI feel
  const handleFromChange = (val: string) => {
    setFromAmount(val);
    if (!val || isNaN(Number(val))) setToAmount("");
    else {
      // Mock conversion rate: 1 ETH = 3000 USDC
      const rate = fromToken === "ETH" && toToken === "USDC" ? 3000 : 
                   fromToken === "USDC" && toToken === "ETH" ? 1/3000 : 1;
      setToAmount((Number(val) * rate).toFixed(6).replace(/\.?0+$/, ""));
    }
  };

  const handleSwap = () => {
    if (!walletId) {
      toast.error("Please select a wallet first");
      return;
    }
    if (!fromAmount || Number(fromAmount) <= 0) return;

    swapTokens.mutate({
      walletId: Number(walletId),
      data: {
        fromTokenSymbol: fromToken,
        toTokenSymbol: toToken,
        amount: Number(fromAmount)
      }
    }, {
      onSuccess: () => {
        toast.success(`Successfully swapped ${fromAmount} ${fromToken} for ${toToken}`);
        setFromAmount("");
        setToAmount("");
      },
      onError: () => {
        toast.error("Swap failed. Please try again.");
      }
    });
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    // Trigger recalculation if we had real rates
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <Card className="w-full max-w-[480px] bg-card border-card-border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <CardHeader className="flex flex-row items-center justify-between pb-4 relative z-10">
            <CardTitle className="text-xl font-bold text-white">Swap</CardTitle>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white h-8 w-8">
              <Settings2 className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="relative z-10 space-y-2">
            
            <div className="mb-4">
              <Select value={walletId} onValueChange={setWalletId}>
                <SelectTrigger className="w-full bg-muted/30 border-muted text-white">
                  <SelectValue placeholder="Select Wallet" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-popover-border">
                  {wallets?.map(w => (
                    <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* From Input */}
            <div className="bg-muted/30 rounded-xl p-4 border border-border/50 focus-within:border-primary/50 transition-colors">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>You pay</span>
                <span>Balance: 1.54 ETH</span>
              </div>
              <div className="flex items-center gap-3">
                <Input 
                  type="number" 
                  value={fromAmount}
                  onChange={(e) => handleFromChange(e.target.value)}
                  placeholder="0.0" 
                  className="bg-transparent border-none text-3xl font-medium text-white p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50 w-full"
                />
                <Button variant="secondary" className="shrink-0 gap-2 bg-muted hover:bg-muted/80 text-white rounded-full">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">E</div>
                  {fromToken}
                </Button>
              </div>
            </div>

            {/* Switch Button */}
            <div className="flex justify-center -my-3 relative z-10">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={switchTokens}
                className="rounded-xl bg-card border-card-border hover:bg-muted text-muted-foreground hover:text-white h-10 w-10 shadow-sm"
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
            </div>

            {/* To Input */}
            <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>You receive</span>
                <span>Balance: 150.00 USDC</span>
              </div>
              <div className="flex items-center gap-3">
                <Input 
                  type="text" 
                  value={toAmount}
                  readOnly
                  placeholder="0.0" 
                  className="bg-transparent border-none text-3xl font-medium text-white p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50 w-full"
                />
                <Button variant="secondary" className="shrink-0 gap-2 bg-muted hover:bg-muted/80 text-white rounded-full">
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center text-success">U</div>
                  {toToken}
                </Button>
              </div>
            </div>

            {/* Details */}
            {fromAmount && Number(fromAmount) > 0 && (
              <div className="bg-muted/20 rounded-lg p-3 mt-4 space-y-2 text-xs font-medium text-muted-foreground border border-border/50">
                <div className="flex justify-between">
                  <span>Rate</span>
                  <span className="text-white">1 {fromToken} = 3,000 {toToken}</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Fee</span>
                  <span className="text-white">~$2.45</span>
                </div>
                <div className="flex justify-between">
                  <span>Slippage Tolerance</span>
                  <span className="text-white">0.5%</span>
                </div>
              </div>
            )}

            <Button 
              className="w-full h-14 mt-4 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
              disabled={!fromAmount || Number(fromAmount) <= 0 || swapTokens.isPending || !walletId}
              onClick={handleSwap}
            >
              {swapTokens.isPending ? "Swapping..." : !walletId ? "Select a Wallet" : !fromAmount ? "Enter an amount" : "Review Swap"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
