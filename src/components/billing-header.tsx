"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";

interface BillingHeaderProps {
  isPro: boolean;
}

export function BillingHeader({ isPro }: BillingHeaderProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("billing")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("manageBillingDescription")}
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

      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          {isPro ? t("allPlans") : t("upgradeYourPlan")}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isPro ? t("bestPlanDescription") : t("choosePlanDescription")}
        </p>
      </div>
    </>
  );
}
