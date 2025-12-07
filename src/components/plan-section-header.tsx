"use client";

import { useLanguage } from "@/contexts/language-context";

interface PlanSectionHeaderProps {
  isPro: boolean;
}

export function PlanSectionHeader({ isPro }: PlanSectionHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-foreground">
        {isPro ? t("allPlans") : t("upgradeYourPlan")}
      </h2>
      <p className="text-sm text-muted-foreground mt-0.5">
        {isPro ? t("bestPlanDescription") : t("choosePlanDescription")}
      </p>
    </div>
  );
}
