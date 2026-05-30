import { Layout } from "@/components/layout";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
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
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { useListWallets, getListWalletsQueryKey } from "@workspace/api-client-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

/* ── Loading screen ── */
function LoadingScreen({ message = "Loading Nexa…" }: { message?: string }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <svg width="48" height="48" viewBox="0 0 120 120" fill="none" className="animate-pulse">
          <defs>
            <linearGradient id="lG2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00e5ff" />
              <stop offset="100%" stopColor="#2979ff" />
            </linearGradient>
          </defs>
          <path d="M20 88 L20 22 L36 22 L68 62 L68 22 L84 22 L84 88 L68 88 L36 48 L36 88 Z" fill="url(#lG2)" />
          <path d="M82 52 L100 52 L100 44 L116 60 L100 76 L100 68 L82 68 Z" fill="#00e5ff" opacity="0.85" />
        </svg>
        <p className="text-slate-400 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}

/* ── Wallet gate — redirect to onboarding if no wallets ── */
function WalletGate({ children }: { children: React.ReactNode }) {
  const { data: wallets, isLoading } = useListWallets({
    query: { queryKey: getListWalletsQueryKey() },
  });

  if (isLoading) return <LoadingScreen message="Loading your wallets…" />;
  if (!wallets || wallets.length === 0) return <Onboarding />;
  return <>{children}</>;
}

/* ── Auth gate — redirect to login if not authenticated ── */
function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = [null, (p: string) => { window.location.href = p; }];

  if (isLoading) return <LoadingScreen />;

  if (!user) {
    // Redirect to login
    window.location.replace("/login");
    return null;
  }
  return <>{children}</>;
}

/* ── App shell — sidebar + protected routes ── */
function AppShell() {
  return (
    <AuthGate>
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
    </AuthGate>
  );
}

/* ── Onboarding wrapper — requires auth ── */
function OnboardingGate() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!user) { window.location.replace("/login"); return null; }
  return <Onboarding />;
}

/* ── Router ── */
function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/onboarding" component={OnboardingGate} />
      <Route component={AppShell} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster position="top-right" richColors />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
