"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

export function SettingsHeader() {
  const { t } = useLanguage();

  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t("settingsTitle")}
        </h1>
        <p className="text-muted-foreground mt-1.5">
          {t("configureBusinessInfo")}
        </p>
      </div>
      <Link href="/">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-xl h-9 border-border/40"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToDashboard")}
        </Button>
      </Link>
    </div>
  );
}
