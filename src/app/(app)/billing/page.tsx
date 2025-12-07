import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserSubscription, getCurrentClientCount } from "@/lib/subscription";
import { SubscriptionCard } from "@/components/subscription-card";
import { PlanSelector } from "@/components/plan-selector";
import { BillingNotifications } from "@/components/billing-notifications";
import { PlanSectionHeader } from "@/components/plan-section-header";

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
    <div className="space-y-6 animate-fade-in">
      <BillingNotifications />

      {/* Two Column Layout - Wider left column */}
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">
        {/* Left Sidebar - Current Plan with integrated Usage */}
        <div className="h-full">
          <SubscriptionCard
            subscription={subscription}
            clientCount={clientCount}
          />
        </div>

        {/* Right Panel - Plan Selection */}
        <div className="h-full">
          <PlanSectionHeader isPro={isPro} />
          <PlanSelector currentPlan={subscription.planType} />
        </div>
      </div>
    </div>
  );
}
