import { ReactNode, useEffect } from "react";
import { Sidebar } from "./sidebar";

export function Layout({ children }: { children: ReactNode }) {
  // Ensure dark mode is active
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex dark">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
