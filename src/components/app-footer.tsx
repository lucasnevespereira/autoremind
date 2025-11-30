"use client";

import { useLanguage } from "@/contexts/language-context";
import { Globe } from "lucide-react";

const APP_VERSION = "1.0.0";

export function AppFooter() {
  const { language, setLanguage } = useLanguage();

  return (
    <footer className="border-t border-border/40  backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="font-mono">v{APP_VERSION}</span>
            <span className="text-border">•</span>
            <span>AutoRemind</span>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="h-3 w-3" />
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  language === "en"
                    ? "text-foreground bg-muted"
                    : "hover:text-foreground"
                }`}
              >
                EN
              </button>
              <span className="text-border">|</span>
              <button
                onClick={() => setLanguage("pt")}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  language === "pt"
                    ? "text-foreground bg-muted"
                    : "hover:text-foreground"
                }`}
              >
                PT
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
