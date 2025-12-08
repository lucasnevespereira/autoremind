"use client";

import { APP_VERSION } from "@/version";
import { LanguageSelector } from "@/components/language-selector";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

export function LandingFooter() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            <span>© {year} AutoRemind</span>
            <span>•</span>
            <span>v{APP_VERSION}</span>
            <span>•</span>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              {t("privacy")}
            </Link>
            <span>•</span>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              {t("terms")}
            </Link>
          </div>
          <LanguageSelector />
        </div>
      </div>
    </footer>
  );
}
