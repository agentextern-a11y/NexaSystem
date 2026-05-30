import { Layout } from "@/components/layout";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Onboarding from "@/pages/onboarding";
import Dashboard from "@/pages/dashboard";
import Portfolio from "@/pages/portfolio";
import Wallets from "@/pages/wallets";
import WalletDetail from "@/pages/wallet-detail";
import Transactions from "@/pages/transactions";
import Swap from "@/pages/swap";
import Nfts from "@/pages/nfts";
import Tokens from "@/pages/tokens";
import Settings from "@/pages/settings";
import { listWallets } from "@workspace/api-client-react";
import { useLocation } from "wouter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

/** Wraps all authenticated app routes — shows onboarding if no wallets exist */
function WalletGate({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();
  const { data: wallets, isLoading } = useQuery({
    queryKey: ["wallets"],
    queryFn: () => listWallets(),
    staleTime: 10_000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg animate-pulse">
            NP
          </div>
          <p className="text-muted-foreground text-sm">Loading NP Wallet…</p>
        </div>
      </div>
    );
  }

  if (!wallets || wallets.length === 0) {
    return <Onboarding />;
  }

  return <>{children}</>;
}

/** App shell — sidebar layout with all protected routes */
function AppShell() {
  return (
    <WalletGate>
      <Layout>
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
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
      </Layout>
    </WalletGate>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public routes — no sidebar, no wallet gate */}
      <Route path="/" component={Landing} />
      <Route path="/onboarding" component={Onboarding} />

      {/* All other paths go to the authenticated app shell */}
      <Route component={AppShell} />
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
        <Toaster position="top-right" richColors />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
