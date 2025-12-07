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

  const planPrices: Record<string, string> = {
    free: "€0",
    starter: "€5",
    pro: "€15",
  };

  return (
    <div className="space-y-3 h-full flex flex-col">
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

      {/* Main Plan Card - Matching App Style */}
      <div className="bg-card rounded-lg border border-border/40 p-5 shadow-sm flex-grow flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                {t("currentPlan")}
              </p>
              <h3 className="text-base font-semibold text-foreground">
                {planNames[subscription.planType]}
              </h3>
            </div>
          </div>

          {isActive && !isCanceled && (
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full px-2.5 py-1">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400 animate-pulse" />
                <span className="text-[11px] font-medium text-green-700 dark:text-green-400">
                  {t("active")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">
              {planPrices[subscription.planType]}
            </span>
            {isPaidPlan && (
              <span className="text-sm text-muted-foreground">/month</span>
            )}
          </div>
        </div>

        {/* Renewal Date */}
        {isPaidPlan && subscription.currentPeriodEnd && (
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 pb-3 border-b border-border/40">
            <span>
              {isCanceled ? t("expiresOn") : t("renewsOn")}:
            </span>
            <span className="font-medium text-foreground">
              {format(new Date(subscription.currentPeriodEnd), "MMMM dd, yyyy")}
            </span>
          </div>
        )}

        {/* SMS Handling */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
          <span>
            {isPaidPlan ? t("managedSms") : t("ownTwilio")}
          </span>
        </div>

        {/* Usage Stats - Integrated */}
        <div className="bg-muted/30 rounded-lg p-3 mb-3 flex-grow flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">
                {t("clientUsageTracking")}
              </span>
            </div>
            <span className="text-xs font-semibold text-foreground">
              {clientCount}
              {limit && (
                <span className="text-muted-foreground font-normal"> / {limit}</span>
              )}
              {!limit && (
                <span className="text-muted-foreground font-normal ml-1">
                  {t("unlimitedClients")}
                </span>
              )}
            </span>
          </div>

          {/* Progress Bar */}
          {limit && (
            <>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
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
                <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1.5">
                  {t("approachingLimit")}
                </p>
              )}

              {usagePercentage >= 100 && (
                <p className="text-[10px] text-red-600 dark:text-red-400 mt-1.5">
                  {t("clientLimitReached")}
                </p>
              )}
            </>
          )}
        </div>

        {/* Manage Billing Button */}
        {isPaidPlan && subscription.stripeCustomerId && (
          <Button
            onClick={handleManageBilling}
            disabled={loading}
            variant="outline"
            size="sm"
            className="w-full h-9 rounded-lg text-sm"
          >
            <ExternalLink className="mr-2 h-3.5 w-3.5" />
            {loading ? t("loading") : t("manageBilling")}
          </Button>
        )}
      </div>
    </div>
  );
}
