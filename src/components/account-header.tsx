"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";

export function AccountHeader() {
  const { t } = useLanguage();

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("accountManagement")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("manageAccountDescription")}
        </p>
      </div>
      <Link href="/dashboard">
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
