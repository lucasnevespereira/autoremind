import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPortalSessionUrl } from "@/lib/stripe";
import { getUserSubscription } from "@/lib/subscription";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's subscription to find customer ID
    const subscription = await getUserSubscription(session.user.id);

    if (!subscription.stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe customer found" },
        { status: 400 }
      );
    }

    const portalUrl = await createPortalSessionUrl(
      subscription.stripeCustomerId
    );

    return NextResponse.json({ url: portalUrl });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
