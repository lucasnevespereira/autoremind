"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import type { Session } from "@/lib/auth";

export function LayoutContent({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const pathname = usePathname();

  async function handleSignOut() {
    await signOut();
    window.location.href = "/sign-in";
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border/40 sticky top-0 z-50 backdrop-blur-sm bg-card/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-fintech group-hover:scale-105 transition-transform duration-200">
                <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-foreground tracking-tight">AutoRemind</span>
            </Link>

            <div className="flex items-center gap-1.5">
              <Link href="/configuracoes">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl h-9 px-3"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline font-medium">Settings</span>
                </Button>
              </Link>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl h-9 px-3"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">{children}</main>
    </div>
  );
}
