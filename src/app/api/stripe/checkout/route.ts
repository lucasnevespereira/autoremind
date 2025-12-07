import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCheckoutSessionUrl } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { priceId } = body;

    console.log("Creating checkout session for user:", session.user.id);

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    // Validate price ID
    const validPriceIds = [
      process.env.STRIPE_PRICE_ID_STARTER,
      process.env.STRIPE_PRICE_ID_PRO,
    ];

    if (!validPriceIds.includes(priceId)) {
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 });
    }

    const checkoutUrl = await createCheckoutSessionUrl(
      session.user.id,
      priceId
    );

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
