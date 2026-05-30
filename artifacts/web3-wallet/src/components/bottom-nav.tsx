import { Link, useLocation } from "wouter";
import { Home, Clock, Zap, CreditCard, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard",    label: "Home",     icon: Home },
  { href: "/transactions", label: "Activity", icon: Clock },
  { href: "/dashboard",    label: "Pay",      icon: Zap,  center: true },
  { href: "/wallets",      label: "Cards",    icon: CreditCard },
  { href: "/settings",     label: "Profile",  icon: User },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 px-2 pb-safe md:hidden"
      style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon, center }) => {
          const isActive = location === href || (href !== "/dashboard" && location.startsWith(href));
          if (center) {
            return (
              <Link key={label} href={href}>
                <div className="flex flex-col items-center gap-0.5 -mt-5">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg animate-pulse-glow"
                    style={{ background: "linear-gradient(135deg,#5b5be6,#7c6fcd)" }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 mt-1">{label}</span>
                </div>
              </Link>
            );
          }
          return (
            <Link key={label} href={href}>
              <div className={cn(
                "flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all",
                isActive ? "text-[#5b5be6]" : "text-slate-400"
              )}>
                <Icon className="w-5 h-5" />
                <span className={cn("text-[10px] font-semibold", isActive ? "text-[#5b5be6]" : "text-slate-400")}>
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
