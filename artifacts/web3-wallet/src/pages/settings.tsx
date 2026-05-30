import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Moon, Shield, Bell, Key, Globe, Smartphone } from "lucide-react";

export default function Settings() {
  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your wallet preferences, security, and networks.</p>
        </div>

        <div className="grid gap-6">
          <Card className="bg-card border-card-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="w-5 h-5 text-primary" /> Security
              </CardTitle>
              <CardDescription>Protect your assets and recovery phrases.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white font-medium">Require Password on Open</Label>
                  <p className="text-sm text-muted-foreground">Prompt for password when opening the app.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white font-medium">Auto-Lock Timer</Label>
                  <p className="text-sm text-muted-foreground">Lock wallet after 5 minutes of inactivity.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="pt-4 border-t border-border">
                <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10 w-full sm:w-auto gap-2">
                  <Key className="w-4 h-4" /> Reveal Secret Recovery Phrase
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-card-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Globe className="w-5 h-5 text-primary" /> Networks
              </CardTitle>
              <CardDescription>Manage your connected chains and RPC URLs.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <div>
                      <div className="font-medium text-white">Ethereum Mainnet</div>
                      <div className="text-xs text-muted-foreground">Chain ID: 1</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div>
                      <div className="font-medium text-white">Arbitrum One</div>
                      <div className="text-xs text-muted-foreground">Chain ID: 42161</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <Button variant="outline" className="w-full mt-2">Add Custom Network</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-card-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Bell className="w-5 h-5 text-primary" /> Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white font-medium">Transaction Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get alerts for successful and failed transactions.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white font-medium">Price Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notify when top assets move by more than 5%.</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white font-medium">Testnets</Label>
                  <p className="text-sm text-muted-foreground">Show test networks in lists.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
