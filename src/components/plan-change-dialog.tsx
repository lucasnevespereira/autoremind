"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/contexts/language-context";
import { Loader2, TrendingUp, TrendingDown, Info } from "lucide-react";

interface PlanChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: string;
  targetPlan: string;
  targetPrice: number;
  onConfirm: () => Promise<void>;
}

export function PlanChangeDialog({
  open,
  onOpenChange,
  currentPlan,
  targetPlan,
  targetPrice,
  onConfirm,
}: PlanChangeDialogProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const planNames: Record<string, string> = {
    free: t("planFree"),
    starter: t("planStarter"),
    pro: t("planPro"),
  };

  const isUpgrade =
    (currentPlan === "free" && (targetPlan === "starter" || targetPlan === "pro")) ||
    (currentPlan === "starter" && targetPlan === "pro");

  const isDowngrade =
    (currentPlan === "pro" && (targetPlan === "starter" || targetPlan === "free")) ||
    (currentPlan === "starter" && targetPlan === "free");

  async function handleConfirm() {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {isUpgrade && (
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            )}
            {isDowngrade && (
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            )}
            <AlertDialogTitle className="text-xl">
              {isUpgrade ? t("confirmUpgrade") : t("confirmDowngrade")}
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="text-left space-y-4 pt-2">
            {/* Plan Change Summary */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{t("currentPlan")}</p>
                  <p className="font-semibold text-foreground">{planNames[currentPlan]}</p>
                </div>
                <div className="text-muted-foreground">→</div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("newPlan")}</p>
                  <p className="font-semibold text-foreground">{planNames[targetPlan]}</p>
                </div>
              </div>
            </div>

            {/* What happens next */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                {t("whatHappensNext")}
              </p>

              {/* For upgrades from paid to paid */}
              {currentPlan !== "free" && targetPlan !== "free" && isUpgrade && (
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("proratedChargeExplanation")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("immediateAccessExplanation")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("nextBillingExplanation")}</span>
                  </li>
                </ul>
              )}

              {/* For upgrades from free to paid */}
              {currentPlan === "free" && targetPlan !== "free" && (
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("paymentRequired", { price: `€${targetPrice}` })}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("immediateAccessExplanation")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("monthlyBillingExplanation")}</span>
                  </li>
                </ul>
              )}

              {/* For downgrades from paid to paid */}
              {isDowngrade && (
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                    <span>{t("downgradeCreditExplanation")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                    <span>{t("immediateAccessExplanation")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                    <span>{t("nextBillingLowerPriceExplanation")}</span>
                  </li>
                </ul>
              )}
            </div>

            {/* Price callout for paid plans */}
            {targetPlan !== "free" && !isDowngrade && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{t("newPrice")}:</span> €{targetPrice}/month
                </p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isLoading}
            className={isDowngrade ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? t("processing") : t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
