import { db } from "../src/db";
import { subscriptions } from "../src/db/schema";

async function checkSubscriptions() {
  console.log("🔍 Checking subscriptions in database...\n");

  const allSubscriptions = await db.select().from(subscriptions);

  if (allSubscriptions.length === 0) {
    console.log("❌ No subscriptions found in database");
    return;
  }

  console.log(`Found ${allSubscriptions.length} subscription(s):\n`);

  allSubscriptions.forEach((sub, index) => {
    console.log(`Subscription ${index + 1}:`);
    console.log(`  User ID: ${sub.userId}`);
    console.log(`  Plan Type: ${sub.planType}`);
    console.log(`  Status: ${sub.status}`);
    console.log(`  Stripe Customer ID: ${sub.stripeCustomerId || 'N/A'}`);
    console.log(`  Stripe Subscription ID: ${sub.stripeSubscriptionId || 'N/A'}`);
    console.log(`  Stripe Price ID: ${sub.stripePriceId || 'N/A'}`);
    console.log(`  Current Period End: ${sub.currentPeriodEnd || 'N/A'}`);
    console.log(`  Updated At: ${sub.updatedAt}`);
    console.log('');
  });

  process.exit(0);
}

checkSubscriptions().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
