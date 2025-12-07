import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { subscriptions, settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { PLAN } from "@/constants";

// Force dynamic rendering and disable static optimization
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  console.log("\n\n");
  console.log("=".repeat(80));
  console.log("🚀 WEBHOOK HANDLER STARTED - NEW VERSION WITH LOGGING");
  console.log("📍 Request URL:", req.url);
  console.log("📍 Request Method:", req.method);
  console.log("=".repeat(80));

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("❌ No signature header found");
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("❌ STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  console.log("✅ Webhook secret and signature present");

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ Webhook signature verified successfully");
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("📨 Processing event type:", event.type);
  console.log("📨 Event ID:", event.id);

  try {
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        console.log("📝 checkout.session.completed event received");
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("📝 customer.subscription.created event received");
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("🔄 customer.subscription.updated event received");
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    console.log("🔔 Checkout completed:", {
      customerId,
      subscriptionId,
      sessionId: session.id,
      mode: session.mode,
    });

    if (!subscriptionId) {
      console.error("❌ No subscription ID in checkout session");
      console.error("Session details:", JSON.stringify(session, null, 2));
      return;
    }

    // Get subscription details from Stripe
    console.log("📡 Fetching subscription from Stripe:", subscriptionId);
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscriptionId
    );
    console.log("✅ Subscription retrieved from Stripe", stripeSubscription);

    console.log("📦 Stripe subscription retrieved:", {
      id: stripeSubscription.id,
      status: stripeSubscription.status,
      priceId: stripeSubscription.items.data[0]?.price.id,
      billingCycleAnchor: stripeSubscription.billing_cycle_anchor,
      cancelAt: stripeSubscription.cancel_at,
    });

    // Log the entire subscription object to see what fields are actually available
    console.log(
      "🔍 Full subscription object keys:",
      Object.keys(stripeSubscription)
    );

    // Find user by customer ID
    console.log("🔍 Looking up user by customer ID:", customerId);
    const userSubscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.stripeCustomerId, customerId),
    });

    if (!userSubscription) {
      console.error("❌ No user found for customer:", customerId);
      console.error(
        "Available subscriptions:",
        await db.select().from(subscriptions)
      );
      return;
    }

    console.log("👤 Found user subscription:", {
      userId: userSubscription.userId,
      currentPlan: userSubscription.planType,
      subscriptionId: userSubscription.id,
    });

    // Determine plan type from price ID
    const priceId = stripeSubscription.items.data[0]?.price.id;
    const planType = getPlanTypeFromPriceId(priceId);

    console.log("🔄 Updating subscription to:", {
      planType,
      priceId,
      subscriptionId,
      status: stripeSubscription.status,
    });

    // Get the current period end from the latest invoice
    let currentPeriodEnd: Date | null = null;
    if (stripeSubscription.latest_invoice) {
      try {
        const invoiceId =
          typeof stripeSubscription.latest_invoice === "string"
            ? stripeSubscription.latest_invoice
            : stripeSubscription.latest_invoice.id;

        const invoice = await stripe.invoices.retrieve(invoiceId);
        if (invoice.period_end) {
          currentPeriodEnd = new Date(invoice.period_end * 1000);
          console.log("📅 Got period end from invoice:", currentPeriodEnd);
        }
      } catch (error) {
        console.error("⚠️  Could not retrieve invoice for period end:", error);
      }
    }

    const updateResult = await db
      .update(subscriptions)
      .set({
        stripeSubscriptionId: subscriptionId,
        stripePriceId: priceId,
        planType: planType,
        status: stripeSubscription.status,
        currentPeriodEnd: currentPeriodEnd,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.userId, userSubscription.userId))
      .returning();

    console.log("✅ Subscription updated successfully:", updateResult);

    // Verify the update
    const verifySubscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userSubscription.userId),
    });
    console.log("🔎 Verified subscription in DB:", {
      planType: verifySubscription?.planType,
      stripePriceId: verifySubscription?.stripePriceId,
      stripeSubscriptionId: verifySubscription?.stripeSubscriptionId,
    });

    // Enable managed SMS for paid plans (starter or pro)
    if (planType === PLAN.STARTER || planType === PLAN.PRO) {
      console.log("📧 Enabling managed SMS for paid plan user");

      // Check if settings exist
      const userSettings = await db.query.settings.findFirst({
        where: eq(settings.userId, userSubscription.userId),
      });

      if (userSettings) {
        // Update existing settings
        await db
          .update(settings)
          .set({
            useManagedSms: true,
            updatedAt: new Date(),
          })
          .where(eq(settings.userId, userSubscription.userId));
        console.log("✅ Updated existing settings to enable managed SMS");
      } else {
        // Create new settings with managed SMS enabled
        await db.insert(settings).values({
          userId: userSubscription.userId,
          useManagedSms: true,
        });
        console.log("✅ Created new settings with managed SMS enabled");
      }
    }

    // Revalidate billing page to show updated subscription
    revalidatePath("/billing");
    revalidatePath("/");
    revalidatePath("/settings");

    console.log("🎉 Checkout completed successfully!");
  } catch (error) {
    console.error("💥 ERROR in handleCheckoutCompleted:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "N/A");
    throw error;
  }
}

async function handleSubscriptionUpdated(
  stripeSubscription: Stripe.Subscription
) {
  try {
    const customerId = stripeSubscription.customer as string;
    const subscriptionId = stripeSubscription.id;

    console.log("🔄 Subscription updated:", {
      customerId,
      subscriptionId,
      status: stripeSubscription.status,
    });

    // Find user by customer ID
    console.log("🔍 Looking up user by customer ID:", customerId);
    const userSubscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.stripeCustomerId, customerId),
    });

    if (!userSubscription) {
      console.error("❌ No user found for customer:", customerId);
      return;
    }

    console.log("👤 Found user subscription:", {
      userId: userSubscription.userId,
      currentPlan: userSubscription.planType,
    });

    // Determine plan type from price ID
    const priceId = stripeSubscription.items.data[0]?.price.id;
    const planType = getPlanTypeFromPriceId(priceId);

    console.log("🔄 Updating subscription to:", {
      planType,
      priceId,
      status: stripeSubscription.status,
    });

    // Get the current period end from the latest invoice
    let currentPeriodEnd: Date | null = null;
    if (stripeSubscription.latest_invoice) {
      try {
        const invoiceId =
          typeof stripeSubscription.latest_invoice === "string"
            ? stripeSubscription.latest_invoice
            : stripeSubscription.latest_invoice.id;

        const invoice = await stripe.invoices.retrieve(invoiceId);
        if (invoice.period_end) {
          currentPeriodEnd = new Date(invoice.period_end * 1000);
          console.log("📅 Got period end from invoice:", currentPeriodEnd);
        }
      } catch (error) {
        console.error("⚠️  Could not retrieve invoice for period end:", error);
      }
    }

    const updateResult = await db
      .update(subscriptions)
      .set({
        stripeSubscriptionId: subscriptionId,
        stripePriceId: priceId,
        planType: planType,
        status: stripeSubscription.status,
        currentPeriodEnd: currentPeriodEnd,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.userId, userSubscription.userId))
      .returning();

    console.log("✅ Subscription updated successfully:", updateResult);

    // Enable managed SMS for paid plans (starter or pro)
    if (planType === "starter" || planType === "pro") {
      console.log("📧 Enabling managed SMS for paid plan user");

      // Check if settings exist
      const userSettings = await db.query.settings.findFirst({
        where: eq(settings.userId, userSubscription.userId),
      });

      if (userSettings) {
        // Update existing settings
        await db
          .update(settings)
          .set({
            useManagedSms: true,
            updatedAt: new Date(),
          })
          .where(eq(settings.userId, userSubscription.userId));
        console.log("✅ Updated existing settings to enable managed SMS");
      } else {
        // Create new settings with managed SMS enabled
        await db.insert(settings).values({
          userId: userSubscription.userId,
          useManagedSms: true,
        });
        console.log("✅ Created new settings with managed SMS enabled");
      }
    } else if (planType === PLAN.FREE) {
      // Disable managed SMS for free plan
      console.log("📧 Disabling managed SMS for free plan user");

      const userSettings = await db.query.settings.findFirst({
        where: eq(settings.userId, userSubscription.userId),
      });

      if (userSettings) {
        await db
          .update(settings)
          .set({
            useManagedSms: false,
            updatedAt: new Date(),
          })
          .where(eq(settings.userId, userSubscription.userId));
        console.log("✅ Disabled managed SMS for free plan user");
      }
    }

    // Revalidate billing page to show updated subscription
    revalidatePath("/billing");
    revalidatePath("/");
    revalidatePath("/settings");
  } catch (error) {
    console.error("💥 ERROR in handleSubscriptionUpdated:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "N/A");
    throw error;
  }
}

async function handleSubscriptionDeleted(
  stripeSubscription: Stripe.Subscription
) {
  const customerId = stripeSubscription.customer as string;

  // Find user by customer ID
  const userSubscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.stripeCustomerId, customerId),
  });

  if (!userSubscription) {
    console.error("No user found for customer:", customerId);
    return;
  }

  // Downgrade to free plan
  await db
    .update(subscriptions)
    .set({
      stripeSubscriptionId: null,
      stripePriceId: null,
      planType: PLAN.FREE,
      status: "canceled",
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, userSubscription.userId));

  console.log(`Subscription canceled for user ${userSubscription.userId}`);

  // Disable managed SMS for canceled subscription
  const userSettings = await db.query.settings.findFirst({
    where: eq(settings.userId, userSubscription.userId),
  });

  if (userSettings) {
    await db
      .update(settings)
      .set({
        useManagedSms: false,
        updatedAt: new Date(),
      })
      .where(eq(settings.userId, userSubscription.userId));
    console.log("✅ Disabled managed SMS for canceled subscription");
  }

  // Revalidate billing page to show updated subscription
  revalidatePath("/billing");
  revalidatePath("/");
  revalidatePath("/settings");
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  // Find user by customer ID
  const userSubscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.stripeCustomerId, customerId),
  });

  if (!userSubscription) {
    return;
  }

  // Update subscription status to active if it was past_due
  if (userSubscription.status === "past_due") {
    await db
      .update(subscriptions)
      .set({
        status: "active",
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.userId, userSubscription.userId));

    console.log(`Payment succeeded for user ${userSubscription.userId}`);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  // Find user by customer ID
  const userSubscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.stripeCustomerId, customerId),
  });

  if (!userSubscription) {
    return;
  }

  // Mark subscription as past_due
  await db
    .update(subscriptions)
    .set({
      status: "past_due",
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, userSubscription.userId));

  console.log(`Payment failed for user ${userSubscription.userId}`);
}

function getPlanTypeFromPriceId(priceId: string | undefined): string {
  console.log("🔍 Determining plan type from price ID:", priceId);
  console.log(
    "🔧 Starter price ID from env:",
    process.env.STRIPE_PRICE_ID_STARTER
  );
  console.log("🔧 Pro price ID from env:", process.env.STRIPE_PRICE_ID_PRO);

  if (!priceId) {
    console.log("⚠️  No price ID provided, defaulting to free");
    return PLAN.FREE;
  }

  if (priceId === process.env.STRIPE_PRICE_ID_STARTER) {
    console.log("✅ Matched STARTER plan");
    return PLAN.STARTER;
  }

  if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
    console.log("✅ Matched PRO plan");
    return PLAN.PRO;
  }

  console.log("⚠️  Price ID didn't match any plan, defaulting to free");
  return PLAN.FREE;
}
