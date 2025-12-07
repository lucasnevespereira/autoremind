/**
 * Test script to manually update a subscription
 * Usage: npx tsx scripts/test-subscription-update.ts <userId> <planType>
 */

import { db } from "../src/db";
import { subscriptions } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function updateSubscription(
  userId: string,
  planType: "free" | "starter" | "pro"
) {
  console.log(`🔄 Updating subscription for user ${userId} to ${planType}...`);

  const priceIds: Record<string, string | null> = {
    free: null,
    starter: process.env.STRIPE_PRICE_ID_STARTER || null,
    pro: process.env.STRIPE_PRICE_ID_PRO || null,
  };

  const result = await db
    .update(subscriptions)
    .set({
      planType: planType,
      stripePriceId: priceIds[planType],
      status: "active",
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, userId))
    .returning();

  if (result.length === 0) {
    console.error("❌ No subscription found for user:", userId);
    process.exit(1);
  }

  console.log("✅ Subscription updated successfully:");
  console.log(JSON.stringify(result[0], null, 2));
  process.exit(0);
}

const userId = process.argv[2];
const planType = process.argv[3] as "free" | "starter" | "pro";

if (!userId || !planType) {
  console.error(
    "Usage: npx tsx scripts/test-subscription-update.ts <userId> <planType>"
  );
  console.error(
    "Example: npx tsx scripts/test-subscription-update.ts 0Bo6d2fonfSv2B7bHrm2JhFagD5fsBUt starter"
  );
  process.exit(1);
}

if (!["free", "starter", "pro"].includes(planType)) {
  console.error("Plan type must be one of: free, starter, pro");
  process.exit(1);
}

updateSubscription(userId, planType).catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
