"use client";

import { useLanguage } from "@/contexts/language-context";
import { Users, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UsageStatsProps {
  currentCount: number;
  limit: number | null;
  planType: string;
}

export function UsageStats({
  currentCount,
  limit,
  planType,
}: UsageStatsProps) {
  const { t } = useLanguage();

  // Calculate usage percentage
  const usagePercentage = limit !== null ? (currentCount / limit) * 100 : 0;
  const isNearLimit = usagePercentage >= 80;
  const isAtLimit = limit !== null && currentCount >= limit;
  const isUnlimited = limit === null;

  // Progress bar color based on usage
  const getProgressColor = () => {
    if (isAtLimit) return "bg-red-500";
    if (isNearLimit) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <div className="bg-card rounded-2xl border border-border/40 p-5 shadow-sm">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">
            {t("usageStats")}
          </h3>
        </div>
        {isNearLimit && !isUnlimited && (
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        )}
      </div>

      {/* Minimal Usage Display */}
      <div className="space-y-3">
        {/* Inline Numbers and Progress */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-semibold text-foreground">
                {currentCount}
              </span>
              {!isUnlimited && (
                <>
                  <span className="text-sm text-muted-foreground">/</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {limit}
                  </span>
                </>
              )}
              {isUnlimited && (
                <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-full">
                  {t("unlimitedClients")}
                </span>
              )}
            </div>

            {/* Slim Progress Bar */}
            {!isUnlimited && (
              <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 transition-all duration-500 rounded-full",
                    getProgressColor()
                  )}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            )}
          </div>

          {!isUnlimited && (
            <div className="text-right">
              <p
                className={cn(
                  "text-lg font-semibold tabular-nums",
                  isAtLimit
                    ? "text-red-600 dark:text-red-400"
                    : isNearLimit
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-muted-foreground"
                )}
              >
                {Math.round(usagePercentage)}%
              </p>
            </div>
          )}
        </div>

        {/* Compact Status Messages - Only show when needed */}
        {isAtLimit && (
          <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-xs font-medium text-red-800 dark:text-red-400">
                {t("clientLimitReached")}
              </p>
            </div>
            <Link href="/settings?tab=billing">
              <Button size="sm" className="h-7 px-3 text-xs rounded-lg bg-red-600 hover:bg-red-700 text-white">
                {t("upgradePlan")}
              </Button>
            </Link>
          </div>
        )}

        {isNearLimit && !isAtLimit && (
          <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg px-3 py-2">
            <p className="text-xs text-amber-800 dark:text-amber-400">
              {t("approachingLimit")}
            </p>
            <Link href="/settings?tab=billing">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-3 text-xs rounded-lg text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
              >
                {t("viewPlans")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
