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
          <div className="flex items-center gap-3">
            <a
              href="https://www.producthunt.com/products/autoremind?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-autoremind"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1049400&theme=neutral&t=1765530139836"
                alt="AutoRemind on Product Hunt"
                width="150"
                height="32"
                className="h-8 w-auto"
              />
            </a>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </footer>
  );
}
