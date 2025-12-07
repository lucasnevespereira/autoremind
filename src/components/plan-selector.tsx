"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { createCheckoutSession } from "@/app/actions";
import { useState } from "react";
import { Check, Zap, Crown, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PlanSelectorProps {
  currentPlan: string;
}

export function PlanSelector({ currentPlan }: PlanSelectorProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleUpgrade(priceId: string, planType: string) {
    setLoading(planType);
    const result = await createCheckoutSession(priceId);
    setLoading(null);

    if (result.success && result.url) {
      window.location.href = result.url;
    } else {
      toast({
        variant: "destructive",
        title: t("error"),
        description: result.errorKey ? t(result.errorKey as any) : t("checkoutError"),
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
      period: t("perMonth"),
      description: t("planStarterDescription"),
      icon: Zap,
      features: [
        t("feature100Clients"),
        t("featureManagedSms"),
        t("featurePrioritySupport"),
        t("featureAdvancedTemplates"),
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
      period: t("perMonth"),
      description: t("planProDescription"),
      icon: Crown,
      features: [
        t("featureUnlimitedClients"),
        t("featureManagedSms"),
        t("featurePremiumSupport"),
        t("featureAdvancedTemplates"),
        t("featureCustomBranding"),
      ],
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      borderColor: "border-purple-300 dark:border-purple-700",
      priceId: proPriceId,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {plans.map((plan) => {
        const Icon = plan.icon;
        const isCurrent = currentPlan === plan.id;
        const canUpgrade = plan.id !== "free" && !isCurrent;
        const isLoading = loading === plan.id;

        return (
          <div
            key={plan.id}
            className={cn(
              "relative bg-card rounded-xl border p-5 shadow-sm transition-all duration-200",
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
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", plan.bgColor)}>
              <Icon className={cn("h-5 w-5", plan.color)} />
            </div>

            {/* Plan Name & Price Together */}
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground mb-1">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-xs text-muted-foreground">
                    {plan.period}
                  </span>
                )}
              </div>
            </div>

            {/* Compact Features */}
            <ul className="space-y-2 mb-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-xs">
                  <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground leading-tight">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Compact Action Button */}
            {canUpgrade && plan.priceId ? (
              <Button
                onClick={() => handleUpgrade(plan.priceId!, plan.id)}
                disabled={isLoading}
                size="sm"
                className="w-full h-9 rounded-lg text-sm"
              >
                {isLoading ? t("loading") : t("upgradePlan")}
              </Button>
            ) : (
              <Button
                disabled
                variant="outline"
                size="sm"
                className="w-full h-9 rounded-lg text-sm"
              >
                {isCurrent ? t("currentPlan") : t("contactSales")}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
