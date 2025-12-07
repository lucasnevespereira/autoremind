import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserSubscription, getCurrentClientCount } from "@/lib/subscription";
import { SubscriptionCard } from "@/components/subscription-card";
import { PlanSelector } from "@/components/plan-selector";
import { BillingNotifications } from "@/components/billing-notifications";
import { PlanSectionHeader } from "@/components/plan-section-header";
import { BillingHeader } from "@/components/billing-header";

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
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <BillingNotifications />

      <BillingHeader />

      {/* Current Plan Summary - Top Banner Style */}
      <SubscriptionCard subscription={subscription} clientCount={clientCount} />

      {/* Plan Selection Section */}
      <div>
        <PlanSectionHeader isPro={isPro} />
        <PlanSelector currentPlan={subscription.planType} />
      </div>
    </div>
  );
}
