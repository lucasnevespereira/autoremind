"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { createPortalSession } from "@/app/actions";
import { useState } from "react";
import { ExternalLink, Sparkles, AlertCircle, Check, Users } from "lucide-react";
import { format } from "date-fns";
import type { Subscription } from "@/db/schema";
import { getPlanLimit } from "@/lib/plans";

interface SubscriptionCardProps {
  subscription: Subscription;
  clientCount?: number;
}

// Helper to check if a price ID is annual
function isAnnualPriceId(priceId: string | null): boolean {
  if (!priceId) return false;
  return (
    priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER_ANNUAL ||
    priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_ANNUAL
  );
}

export function SubscriptionCard({ subscription, clientCount = 0 }: SubscriptionCardProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  async function handleManageBilling() {
    setLoading(true);
    const result = await createPortalSession();
    setLoading(false);

    if (result.success && result.url) {
      window.location.href = result.url;
    }
  }

  const isPaidPlan = subscription.planType !== "free";
  const isActive = subscription.status === "active";
  const isCanceled = subscription.cancelAtPeriodEnd;
  const isPastDue = subscription.status === "past_due";
  const isAnnual = isAnnualPriceId(subscription.stripePriceId);

  // Get client limit
  const limit = getPlanLimit(subscription.planType);
  const usagePercentage = limit ? Math.round((clientCount / limit) * 100) : 0;
  const isApproachingLimit = limit && usagePercentage >= 80;

  // Plan display info
  const planNames: Record<string, string> = {
    free: t("planFree"),
    starter: t("planStarter"),
    pro: t("planPro"),
  };

  // Prices based on billing interval
  const planPrices: Record<string, string> = {
    free: "€0",
    starter: isAnnual ? "€60" : "€5",
    pro: isAnnual ? "€180" : "€15",
  };

  return (
    <div className="space-y-3">
      {/* Status Alert */}
      {isPastDue && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg px-3 py-2.5 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-red-900 dark:text-red-200">
              {t("pastDue")}
            </p>
            <p className="text-[11px] text-red-700 dark:text-red-400 mt-0.5">
              {t("paymentFailedMessage")}
            </p>
          </div>
        </div>
      )}

      {isCanceled && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg px-3 py-2.5 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-amber-900 dark:text-amber-200">
              {t("canceledAtPeriodEnd")}
            </p>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
              {t("subscriptionCanceledMessage")}
            </p>
          </div>
        </div>
      )}

      {/* Main Plan Banner - Horizontal Compact Layout */}
      <div className="bg-card rounded-lg border border-border/40 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: Plan Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                  {t("currentPlan")}
                </p>
                {isActive && !isCanceled && (
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-full px-2 py-0.5">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-green-600 dark:bg-green-400 animate-pulse" />
                      <span className="text-[10px] font-medium text-green-700 dark:text-green-400">
                        {t("active")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-lg font-bold text-foreground">
                  {planNames[subscription.planType]}
                </h3>
                <span className="text-base font-semibold text-muted-foreground">
                  {planPrices[subscription.planType]}
                  {isPaidPlan && (
                    <span className="text-xs">{isAnnual ? t("perYear") : t("perMonth")}</span>
                  )}
                </span>
              </div>
              {isPaidPlan && subscription.currentPeriodEnd && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isCanceled ? t("expiresOn") : t("renewsOn")}:{" "}
                  <span className="font-medium text-foreground">
                    {format(new Date(subscription.currentPeriodEnd), "MMM dd, yyyy")}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Middle: Usage Stats */}
          <div className="flex-grow lg:max-w-xs">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">
                  {t("clientUsageTracking")}
                </span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {clientCount}
                {limit && (
                  <span className="text-muted-foreground font-normal text-xs"> / {limit}</span>
                )}
                {!limit && (
                  <span className="text-muted-foreground font-normal text-xs ml-1">
                    ({t("unlimitedClients")})
                  </span>
                )}
              </span>
            </div>

            {/* Progress Bar */}
            {limit && (
              <>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isApproachingLimit
                        ? "bg-amber-500"
                        : usagePercentage >= 100
                        ? "bg-red-500"
                        : "bg-primary"
                    }`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>

                {isApproachingLimit && usagePercentage < 100 && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                    {t("approachingLimit")}
                  </p>
                )}

                {usagePercentage >= 100 && (
                  <p className="text-[10px] text-red-600 dark:text-red-400 mt-1">
                    {t("clientLimitReached")}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Right: Manage Billing Button */}
          {isPaidPlan && subscription.stripeCustomerId && (
            <Button
              onClick={handleManageBilling}
              disabled={loading}
              variant="outline"
              size="sm"
              className="lg:w-auto w-full h-9 rounded-lg text-sm flex-shrink-0"
            >
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              {loading ? t("loading") : t("manageBilling")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
