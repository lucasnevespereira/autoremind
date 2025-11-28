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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-900">
              AutoRemind
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/configuracoes">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-gray-600"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </Link>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="gap-2 text-gray-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">{children}</main>
    </div>
  );
}
