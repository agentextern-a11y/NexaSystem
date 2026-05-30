import { useState, useEffect, useCallback } from "react";
import { Bell, X, CheckCircle2, ArrowUpRight, ArrowDownLeft, AlertCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AppNotification {
  id: string;
  type: "receive" | "send" | "security" | "system" | "promo";
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
}

const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: "1",
    type: "receive",
    title: "Funds Received",
    body: "+0.05 ETH received from 0x3f4a…7c2d",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    read: false,
  },
  {
    id: "2",
    type: "system",
    title: "Wallet Active",
    body: "Your NEXA Pay wallet is connected and operating nominally.",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
  },
  {
    id: "3",
    type: "security",
    title: "Security Notice",
    body: "New sign-in detected from this device. Biometric authentication is available.",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    read: true,
  },
  {
    id: "4",
    type: "promo",
    title: "Buy Crypto Instantly",
    body: "Purchase crypto with card or bank transfer — powered by Banxa.",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: true,
  },
];

function timeAgo(date: Date): string {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

const TYPE_ICON: Record<AppNotification["type"], React.ElementType> = {
  receive: ArrowDownLeft,
  send: ArrowUpRight,
  security: AlertCircle,
  system: CheckCircle2,
  promo: Zap,
};

const TYPE_COLORS: Record<AppNotification["type"], string> = {
  receive: "bg-emerald-50 text-emerald-600",
  send:    "bg-red-50 text-red-500",
  security:"bg-amber-50 text-amber-600",
  system:  "bg-blue-50 text-blue-600",
  promo:   "bg-purple-50 text-purple-600",
};

function requestPushPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

interface Props {
  className?: string;
}

export function NotificationsPanel({ className }: Props) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(DEMO_NOTIFICATIONS);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    requestPushPermission();
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      const n: AppNotification = {
        id: String(Date.now()),
        type: "receive",
        title: "Live Update",
        body: "Network block confirmed — all assets are synchronised.",
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [n, ...prev]);
      if (Notification.permission === "granted") {
        new Notification("NEXA Pay — " + n.title, { body: n.body, icon: "/nexa-logo.png" });
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [open]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm hover:shadow-md transition-all"
      >
        <Bell className="w-4 h-4 text-slate-600" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#5b5be6] text-white text-[9px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div>
                <span className="font-bold text-slate-900 text-sm">Notifications</span>
                {unread > 0 && (
                  <span className="ml-2 bg-[#5b5be6] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unread} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-[11px] text-[#5b5be6] font-semibold hover:underline">
                    Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
              {notifications.length === 0 && (
                <div className="py-10 text-center text-slate-400 text-sm">No notifications</div>
              )}
              {notifications.map((n) => {
                const Icon = TYPE_ICON[n.type];
                return (
                  <div
                    key={n.id}
                    className={cn("flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors", !n.read && "bg-[#f5f5ff]")}
                  >
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", TYPE_COLORS[n.type])}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 leading-tight">{n.title}</span>
                        <button onClick={() => dismiss(n.id)} className="text-slate-300 hover:text-slate-500 flex-shrink-0 mt-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.body}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{timeAgo(n.timestamp)}</span>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full bg-[#5b5be6] flex-shrink-0 mt-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
