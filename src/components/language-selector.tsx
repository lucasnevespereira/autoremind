"use client";

import { useLanguage } from "@/contexts/language-context";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-xl border border-border/40 p-1 bg-muted/30">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage("en")}
        className={`h-7 px-3 rounded-lg text-xs font-semibold transition-all ${
          language === "en"
            ? "bg-card text-foreground shadow-fintech"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        }`}
      >
        EN
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage("pt")}
        className={`h-7 px-3 rounded-lg text-xs font-semibold transition-all ${
          language === "pt"
            ? "bg-card text-foreground shadow-fintech"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        }`}
      >
        PT
      </Button>
    </div>
  );
}
