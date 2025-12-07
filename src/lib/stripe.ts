import Stripe from "stripe";
import { db } from "@/db";
import { subscriptions, user } from "@/db/schema";
import { eq } from "drizzle-orm";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

/**
 * Get or create a Stripe customer ID for a user
 */
export async function getStripeCustomerId(userId: string): Promise<string> {
  // Check if user already has a Stripe customer ID
  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  });

  if (subscription?.stripeCustomerId) {
    return subscription.stripeCustomerId;
  }

  // Get user details for creating customer
  const userRecord = await db.query.user.findFirst({
    where: eq(user.id, userId),
  });

  if (!userRecord) {
    throw new Error("User not found");
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email: userRecord.email,
    name: userRecord.name,
    metadata: {
      userId: userId,
    },
  });

  // Update subscription record with customer ID
  if (subscription) {
    await db
      .update(subscriptions)
      .set({
        stripeCustomerId: customer.id,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.userId, userId));
  } else {
    // Create subscription record if it doesn't exist
    await db.insert(subscriptions).values({
      userId: userId,
      stripeCustomerId: customer.id,
      planType: "free",
      status: "active",
    });
  }

  return customer.id;
}

/**
 * Create a Stripe Checkout session URL for subscription OR update existing subscription
 */
export async function createCheckoutSessionUrl(
  userId: string,
  priceId: string
): Promise<string> {
  try {
    const customerId = await getStripeCustomerId(userId);

    // Check if user has an existing active subscription
    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
    });

    console.log("Processing subscription change:", {
      userId,
      customerId,
      priceId,
      hasExistingSubscription: !!subscription?.stripeSubscriptionId,
      currentPlanType: subscription?.planType,
    });

    // If user has an active Stripe subscription, update it (works for both upgrades AND downgrades)
    if (subscription?.stripeSubscriptionId && subscription.planType !== "free") {
      console.log("User has existing subscription - updating instead of creating new one");
      return await updateSubscriptionPlan(userId, subscription.stripeSubscriptionId, priceId);
    }

    // Otherwise, create a new checkout session (for free → paid)
    console.log("Creating Stripe checkout session:", {
      userId,
      customerId,
      priceId,
    });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      metadata: {
        userId: userId,
      },
      // Allow promotion codes
      allow_promotion_codes: true,
      // Automatically apply taxes
      automatic_tax: {
        enabled: false, // Set to true if you have tax settings in Stripe
      },
    });

    if (!session.url) {
      throw new Error("Failed to create checkout session URL");
    }

    console.log("Checkout session created successfully:", session.id);
    return session.url;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

/**
 * Update an existing subscription to a new plan
 */
export async function updateSubscriptionPlan(
  userId: string,
  subscriptionId: string,
  newPriceId: string
): Promise<string> {
  try {
    console.log("Updating existing subscription:", {
      userId,
      subscriptionId,
      newPriceId,
    });

    // Retrieve the current subscription
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Get the subscription item ID (first item)
    const subscriptionItemId = stripeSubscription.items.data[0]?.id;

    if (!subscriptionItemId) {
      throw new Error("No subscription item found");
    }

    // Update the subscription to the new price
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscriptionItemId,
          price: newPriceId,
        },
      ],
      proration_behavior: "create_prorations", // Prorate the charges
    });

    console.log("Subscription updated successfully:", updatedSubscription.id);

    // Determine the new plan type
    const planType = getPlanTypeFromPriceId(newPriceId);

    // Update the database
    await db
      .update(subscriptions)
      .set({
        stripePriceId: newPriceId,
        planType: planType,
        status: updatedSubscription.status,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.userId, userId));

    console.log("Database updated with new plan type:", planType);

    // Return to billing page with success message
    return `${process.env.NEXT_PUBLIC_APP_URL}/billing?updated=true`;
  } catch (error) {
    console.error("Error updating subscription:", error);
    throw error;
  }
}

/**
 * Helper function to determine plan type from price ID
 */
function getPlanTypeFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_PRICE_ID_STARTER) {
    return "starter";
  }
  if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
    return "pro";
  }
  return "free";
}

/**
 * Create a Stripe Customer Portal session URL
 */
export async function createPortalSessionUrl(
  customerId: string
): Promise<string> {
  try {
    console.log("Creating Stripe customer portal session:", customerId);

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    });

    console.log("Customer portal session created successfully");
    return session.url;
  } catch (error) {
    console.error("Error creating customer portal session:", error);
    throw error;
  }
}
