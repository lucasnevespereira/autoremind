import { db } from "@/db";
import { subscriptions, clients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { canAddClient, getPlanLimit, usesManagedSMS } from "./plans";
import type { Subscription } from "@/db/schema";

/**
 * Get user's subscription from database
 * Creates a free subscription if none exists
 */
export async function getUserSubscription(
  userId: string
): Promise<Subscription> {
  let subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  });

  // Create free subscription if none exists
  if (!subscription) {
    const [newSubscription] = await db
      .insert(subscriptions)
      .values({
        userId: userId,
        planType: "free",
        status: "active",
      })
      .returning();

    subscription = newSubscription;
  }

  return subscription;
}

/**
 * Ensure user has a subscription record (creates free plan if missing)
 */
export async function getOrCreateSubscription(
  userId: string
): Promise<Subscription> {
  return getUserSubscription(userId);
}

/**
 * Get count of user's clients
 */
export async function getCurrentClientCount(userId: string): Promise<number> {
  const userClients = await db
    .select()
    .from(clients)
    .where(eq(clients.userId, userId));

  return userClients.length;
}

/**
 * Check if user can add N more clients based on their plan
 */
export async function canAddClients(
  userId: string,
  count: number
): Promise<{ canAdd: boolean; currentCount: number; limit: number | null }> {
  const subscription = await getUserSubscription(userId);
  const currentCount = await getCurrentClientCount(userId);
  const limit = getPlanLimit(subscription.planType);

  const canAdd = canAddClient(currentCount + count - 1, subscription.planType);

  return {
    canAdd,
    currentCount,
    limit,
  };
}

/**
 * Check if user should use managed SMS (platform Twilio)
 */
export async function shouldUseManagedSms(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  return usesManagedSMS(subscription.planType);
}

/**
 * Get plan display info
 */
export function getPlanDisplayInfo(planType: string) {
  const planMap: Record<
    string,
    { name: string; price: number; clientLimit: number | null }
  > = {
    free: { name: "Free", price: 0, clientLimit: 10 },
    starter: { name: "Starter", price: 5, clientLimit: 100 },
    pro: { name: "Pro", price: 15, clientLimit: null },
  };

  return planMap[planType] || planMap.free;
}
