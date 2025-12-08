"use client";

import { APP_VERSION } from "@/version";
import { LanguageSelector } from "@/components/language-selector";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left side: Version and links */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-mono">v{APP_VERSION}</span>
              <span className="text-border">•</span>
              <span>AutoRemind</span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-3 text-xs">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-border">•</span>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Right side: Language Selector */}
          <LanguageSelector />
        </div>
      </div>
    </footer>
  );
}
