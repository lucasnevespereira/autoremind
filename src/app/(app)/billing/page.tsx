import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserSubscription, getCurrentClientCount } from "@/lib/subscription";
import { UsageStats } from "@/components/usage-stats";
import { SubscriptionCard } from "@/components/subscription-card";
import { PlanSelector } from "@/components/plan-selector";
import { getPlanLimit } from "@/lib/plans";
import { BillingNotifications } from "@/components/billing-notifications";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  // Get subscription and client count
  const subscription = await getUserSubscription(session.user.id);
  const clientCount = await getCurrentClientCount(session.user.id);
  const isPro = subscription.planType === "pro";

  return (
    <div className="space-y-6">
      <BillingNotifications />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your subscription and billing
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        {/* Left Sidebar - Current Plan & Usage */}
        <div className="space-y-4">
          {/* Current Subscription Card */}
          <SubscriptionCard subscription={subscription} />

          {/* Usage Stats */}
          <UsageStats
            currentCount={clientCount}
            limit={getPlanLimit(subscription.planType)}
            planType={subscription.planType}
          />
        </div>

        {/* Right Panel - Plan Selection */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {isPro ? "All Plans" : "Upgrade Your Plan"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isPro
                ? "You're on the best plan. Manage your subscription on the left."
                : "Choose the plan that fits your needs"}
            </p>
          </div>

          {/* Plan Selector */}
          <PlanSelector currentPlan={subscription.planType} />
        </div>
      </div>
    </div>
  );
}
