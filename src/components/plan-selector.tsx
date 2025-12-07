"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { createCheckoutSession, createPortalSession } from "@/app/actions";
import { useState } from "react";
import { Check, Zap, Crown, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PlanChangeDialog } from "@/components/plan-change-dialog";

interface PlanSelectorProps {
  currentPlan: string;
}

export function PlanSelector({ currentPlan }: PlanSelectorProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    priceId: string | null;
    planType: string;
    price: number;
  } | null>(null);

  async function handlePlanClick(priceId: string | null, planType: string, price: number) {
    // Show confirmation dialog for both upgrades and downgrades
    setSelectedPlan({ priceId, planType, price });
    setDialogOpen(true);
  }

  async function handleConfirmPlanChange() {
    if (!selectedPlan) return;

    const { priceId, planType } = selectedPlan;

    // For all plan changes: process via Stripe API (works for both upgrades and downgrades)
    if (!priceId) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("invalidPriceId"),
      });
      return;
    }

    setLoading(planType);
    const result = await createCheckoutSession(priceId);
    setLoading(null);
    setDialogOpen(false);

    if (result.success && result.url) {
      window.location.href = result.url;
    } else {
      toast({
        variant: "destructive",
        title: t("error"),
        description: result.errorKey
          ? t(result.errorKey as any)
          : t("checkoutError"),
      });
    }
  }

  // Get price IDs from environment (client-side)
  const starterPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER;
  const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO;

  const plans = [
    {
      id: "free",
      name: t("planFree"),
      price: "€0",
      priceNum: 0,
      period: "",
      description: t("planFreeDescription"),
      icon: Star,
      features: [
        t("feature10Clients"),
        t("featureOwnTwilio"),
        t("featureBasicSupport"),
      ],
      color: "text-gray-600",
      bgColor: "bg-gray-100 dark:bg-gray-800",
      borderColor: "border-gray-300 dark:border-gray-700",
      priceId: null,
    },
    {
      id: "starter",
      name: t("planStarter"),
      price: "€5",
      priceNum: 5,
      period: t("perMonth"),
      description: t("planStarterDescription"),
      icon: Zap,
      features: [
        t("feature100Clients"),
        t("featureManagedSms"),
        t("featurePrioritySupport"),
      ],
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      borderColor: "border-blue-300 dark:border-blue-700",
      priceId: starterPriceId,
    },
    {
      id: "pro",
      name: t("planPro"),
      price: "€15",
      priceNum: 15,
      period: t("perMonth"),
      description: t("planProDescription"),
      icon: Crown,
      features: [
        t("featureUnlimitedClients"),
        t("featureManagedSms"),
        t("featurePremiumSupport"),
      ],
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      borderColor: "border-purple-300 dark:border-purple-700",
      priceId: proPriceId,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.id;
          const canChange = plan.id !== currentPlan;
          const isLoading = loading === plan.id;

          // Determine if it's an upgrade or downgrade
          const isUpgrade =
            (currentPlan === "free" && (plan.id === "starter" || plan.id === "pro")) ||
            (currentPlan === "starter" && plan.id === "pro");

          const isDowngrade =
            (currentPlan === "pro" && (plan.id === "starter" || plan.id === "free")) ||
            (currentPlan === "starter" && plan.id === "free");

          return (
            <div
              key={plan.id}
              className={cn(
                "relative bg-card rounded-lg border p-5 shadow-sm transition-all duration-200 flex flex-col",
                isCurrent
                  ? "border-primary ring-1 ring-primary"
                  : "border-border/40 hover:border-border/60"
              )}
            >
              {/* Minimal Current Badge */}
              {isCurrent && (
                <div className="absolute -top-2 -right-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground shadow-sm">
                    <Check className="h-3 w-3" />
                  </span>
                </div>
              )}

              {/* Compact Icon */}
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                  plan.bgColor
                )}
              >
                <Icon className={cn("h-5 w-5", plan.color)} />
              </div>

              {/* Plan Name & Price Together */}
              <div className="mb-3">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Compact Features */}
              <ul className="space-y-2 mb-3 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs">
                    <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground leading-tight">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Action Button - Only show for non-current plans with priceId */}
              <div className="mt-auto">
                {isCurrent ? (
                  <div className="text-center py-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {t("currentPlan")}
                    </span>
                  </div>
                ) : plan.priceId ? (
                  <Button
                    onClick={() => handlePlanClick(plan.priceId!, plan.id, plan.priceNum)}
                    disabled={isLoading}
                    size="sm"
                    variant={isDowngrade ? "outline" : "default"}
                    className="w-full h-9 rounded-lg text-sm"
                  >
                    {isLoading
                      ? t("loading")
                      : isUpgrade
                      ? t("upgradePlan")
                      : t("downgradePlan")}
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Dialog */}
      {selectedPlan && (
        <PlanChangeDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          currentPlan={currentPlan}
          targetPlan={selectedPlan.planType}
          targetPrice={selectedPlan.price}
          onConfirm={handleConfirmPlanChange}
        />
      )}
    </>
  );
}
