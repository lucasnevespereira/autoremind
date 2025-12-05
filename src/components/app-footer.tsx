"use client";

import { APP_VERSION } from "@/version";
import { LanguageSelector } from "@/components/language-selector";

export function AppFooter() {
  return (
    <footer className="border-t border-border/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="font-mono">v{APP_VERSION}</span>
            <span className="text-border">•</span>
            <span>AutoRemind</span>
          </div>

          <LanguageSelector />
        </div>
      </div>
    </footer>
  );
}
