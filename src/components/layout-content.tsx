"use client";

import Link from "next/link";
import { AppFooter } from "@/components/app-footer";
import { useLanguage } from "@/contexts/language-context";
import type { Session } from "@/lib/auth";
import Image from "next/image";
import logoSquare from "@/assets/logo-square.png";
import { UserDropdown } from "./user-dropdown";

export function LayoutContent({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border/40 sticky top-0 z-50 backdrop-blur-sm bg-card/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-fintech group-hover:scale-105 transition-transform duration-200">
                <Image
                  src={logoSquare}
                  alt="AutoRemind Logo"
                  width={80}
                  height={80}
                  className="mx-auto"
                  priority
                />
              </div>
              <span className="text-lg font-semibold text-foreground tracking-tight ">
                {t("autoremind")}
              </span>
            </Link>

            <div className="flex items-center gap-1.5">
              <UserDropdown session={session} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <AppFooter />
    </div>
  );
}
