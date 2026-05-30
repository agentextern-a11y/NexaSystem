import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, Bell, Key, Globe, Plus, ExternalLink } from "lucide-react";
import { useListNetworks, getListNetworksQueryKey } from "@workspace/api-client-react";

export default function Settings() {
  const { data: networks = [], isLoading } = useListNetworks({ query: { queryKey: getListNetworksQueryKey() } });
  const mainnetNetworks = networks.filter(n => !n.isTestnet);

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your wallet preferences, security, and connected networks.</p>
      </div>

      {/* Security */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground text-base">
            <Shield className="w-4 h-4 text-blue-600" /> Security
          </CardTitle>
          <CardDescription>Protect your assets and recovery phrases.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground font-medium">Require Password on Open</Label>
              <p className="text-sm text-muted-foreground">Prompt for password when opening the app.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground font-medium">Auto-Lock (5 min inactivity)</Label>
              <p className="text-sm text-muted-foreground">Lock wallet automatically when idle.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground font-medium">Biometric Authentication</Label>
              <p className="text-sm text-muted-foreground">Use fingerprint or face recognition to unlock.</p>
            </div>
            <Switch />
          </div>
          <div className="pt-3 border-t border-border">
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 gap-2">
              <Key className="w-4 h-4" /> Reveal Secret Recovery Phrase
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Networks — live from API */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground text-base">
            <Globe className="w-4 h-4 text-blue-600" /> Connected Networks
          </CardTitle>
          <CardDescription>All supported blockchain networks and their configuration.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {mainnetNetworks.map((network) => (
                <div
                  key={network.id}
                  className="flex items-center justify-between p-3.5 bg-muted/40 rounded-lg border border-border hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: network.color || "#627EEA" }}
                    >
                      {network.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm">{network.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        Chain ID: {network.chainId}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </div>
                    <a
                      href={network.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-3 gap-2 border-dashed">
                <Plus className="w-4 h-4" /> Add Custom Network
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground text-base">
            <Bell className="w-4 h-4 text-blue-600" /> Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground font-medium">Transaction Notifications</Label>
              <p className="text-sm text-muted-foreground">Alerts for successful and failed transactions.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground font-medium">Price Alerts</Label>
              <p className="text-sm text-muted-foreground">Notify when top assets move more than 5%.</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground font-medium">Show Test Networks</Label>
              <p className="text-sm text-muted-foreground">Display Goerli, Sepolia, Mumbai in network lists.</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground font-medium">Currency Display</Label>
              <p className="text-sm text-muted-foreground">Display portfolio values in USD.</p>
            </div>
            <select className="text-sm bg-muted border border-border rounded px-2 py-1.5 text-foreground">
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold text-foreground">NP Wallet</div>
              <div className="text-sm text-muted-foreground mt-0.5">Version 1.0.0 · Production</div>
              <div className="text-xs text-muted-foreground mt-2">
                A professional multi-chain Web3 wallet for managing digital assets across Ethereum, Polygon, BNB, Avalanche, Arbitrum and Optimism.
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">NP</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
