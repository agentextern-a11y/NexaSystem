import { Layout } from "@/components/layout";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Portfolio from "@/pages/portfolio";
import Wallets from "@/pages/wallets";
import WalletDetail from "@/pages/wallet-detail";
import Transactions from "@/pages/transactions";
import Swap from "@/pages/swap";
import Nfts from "@/pages/nfts";
import Tokens from "@/pages/tokens";
import Settings from "@/pages/settings";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/wallets" component={Wallets} />
      <Route path="/wallets/:id" component={WalletDetail} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/swap" component={Swap} />
      <Route path="/nfts" component={Nfts} />
      <Route path="/tokens" component={Tokens} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
