# Stripe Subscription Integration Guide

## 🎯 Overview

This guide covers the complete Stripe subscription flow for AutoRemind with 3 pricing tiers:
- **Free**: €0/month - 10 clients, Own Twilio
- **Starter**: €5/month - 100 clients, Managed SMS
- **Pro**: €15/month - Unlimited clients, Managed SMS

## 📋 Prerequisites

1. **Stripe Account**: Create at https://dashboard.stripe.com
2. **Stripe CLI**: Install for local webhook testing
3. **Environment Variables**: All Stripe keys configured in `.env`

## 🔧 Environment Setup

### Required Environment Variables

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs (from Stripe Dashboard → Products)
STRIPE_PRICE_ID_STARTER=price_...
STRIPE_PRICE_ID_PRO=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER=price_...  # Same as above
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_...      # Same as above

# Platform Twilio for Managed SMS
PLATFORM_TWILIO_ACCOUNT_SID=...
PLATFORM_TWILIO_AUTH_TOKEN=...
PLATFORM_TWILIO_PHONE_NUMBER=...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🏗️ Architecture

### Database Schema

**subscriptions** table:
- `user_id`: Foreign key to user
- `stripe_customer_id`: Stripe customer ID
- `stripe_subscription_id`: Stripe subscription ID
- `stripe_price_id`: Current price ID
- `plan_type`: "free" | "starter" | "pro"
- `status`: "active" | "canceled" | "past_due" | "incomplete"
- `current_period_end`: Subscription end date
- `cancel_at_period_end`: Boolean for cancellation

### Key Files

1. **`src/lib/stripe.ts`** - Stripe client & utilities
   - `getStripeCustomerId()` - Get or create customer
   - `createCheckoutSessionUrl()` - Create checkout session
   - `createPortalSessionUrl()` - Create billing portal session

2. **`src/lib/subscription.ts`** - Subscription helpers
   - `getUserSubscription()` - Fetch subscription from DB
   - `canAddClients()` - Check client limits
   - `getCurrentClientCount()` - Count user's clients

3. **`src/app/api/stripe/webhook/route.ts`** - Webhook handler
   - Handles all Stripe events
   - Updates database based on subscription changes
   - Revalidates Next.js cache

4. **`src/app/actions.ts`** - Server actions
   - `createCheckoutSession()` - Trigger upgrade
   - `createPortalSession()` - Open billing portal
   - `addClient()` / `importClients()` - Enforce limits

## 🔄 Subscription Flow

### 1. User Upgrades

```
User clicks "Upgrade Plan"
  ↓
PlanSelector calls createCheckoutSession(priceId)
  ↓
Server action calls createCheckoutSessionUrl()
  ↓
Stripe Checkout opens (hosted)
  ↓
User completes payment
  ↓
Stripe redirects to /billing?success=true
  ↓
BillingNotifications shows success toast
  ↓
Router.refresh() updates UI
```

### 2. Webhook Processing

```
Stripe sends webhook event
  ↓
Webhook handler verifies signature
  ↓
Event type determines handler:
  - checkout.session.completed → handleCheckoutCompleted()
  - customer.subscription.created → handleSubscriptionUpdated()
  - customer.subscription.updated → handleSubscriptionUpdated()
  - customer.subscription.deleted → handleSubscriptionDeleted()
  ↓
Database updated with new plan/status
  ↓
revalidatePath() clears Next.js cache
```

### 3. Client Limit Enforcement

```
User tries to add client
  ↓
addClient() calls canAddClients(userId, 1)
  ↓
Check: currentCount + 1 <= limit
  ↓
If exceeded: Return error "clientLimitReached"
  ↓
UI shows upgrade prompt
```

## 🧪 Testing Locally

### 1. Start Stripe Webhook Listener

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret and update `.env`:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Start Dev Server

```bash
npm run dev
```

### 3. Test Upgrade Flow

1. Go to http://localhost:3000/billing
2. Click "Upgrade Plan" on Starter or Pro
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify redirect to `/billing?success=true`
6. Check database - `plan_type` should update

### 4. Monitor Logs

In the Stripe webhook terminal, you should see:

```
================================================================================
🚀 WEBHOOK HANDLER STARTED - NEW VERSION WITH LOGGING
================================================================================
✅ Webhook secret and signature present
✅ Webhook signature verified successfully
📨 Processing event type: checkout.session.completed
📝 checkout.session.completed event received
🔔 Checkout completed: { customerId: '...', subscriptionId: '...' }
📡 Fetching subscription from Stripe: sub_...
📦 Stripe subscription retrieved: { ... }
🔍 Looking up user by customer ID: cus_...
👤 Found user subscription: { userId: '...', currentPlan: 'free' }
🔍 Determining plan type from price ID: price_...
✅ Matched STARTER plan
✅ Subscription updated successfully: [...]
🎉 Checkout completed successfully!
```

## 🐛 Troubleshooting

### Issue: Webhook events received but database not updating

**Symptoms**: Stripe dashboard shows active subscription, but database still shows "free"

**Solution**:
1. Restart dev server: `Ctrl+C` then `npm run dev`
2. Restart Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
3. Clear Next.js cache: `rm -rf .next && npm run dev`
4. Check logs for the banner: `🚀 WEBHOOK HANDLER STARTED`
5. If banner doesn't appear, code isn't reloading

### Issue: "Contact Sales" button instead of "Upgrade"

**Cause**: Price IDs not accessible on client-side

**Solution**:
1. Verify `NEXT_PUBLIC_STRIPE_PRICE_ID_*` in `.env`
2. Restart dev server for env vars to load
3. Check browser console for undefined price IDs

### Issue: TypeScript errors in webhook handler

**Cause**: Stripe API version mismatch

**Solution**:
- Updated to `apiVersion: "2025-11-17.clover"` in `src/lib/stripe.ts`
- Properly handle nullable `current_period_end`

### Issue: Subscription created but not found in webhook

**Cause**: Customer ID mismatch

**Debug**:
```sql
-- Check subscriptions table
SELECT * FROM subscriptions WHERE stripe_customer_id = 'cus_...';

-- Check if customer ID matches
SELECT user_id, stripe_customer_id FROM subscriptions;
```

## 📊 Database Queries

### Check user's subscription

```sql
SELECT
  user_id,
  plan_type,
  status,
  stripe_customer_id,
  stripe_subscription_id,
  current_period_end
FROM subscriptions
WHERE user_id = 'YOUR_USER_ID';
```

### Manually update plan (for testing)

```sql
UPDATE subscriptions
SET
  plan_type = 'starter',
  stripe_subscription_id = 'sub_test123',
  stripe_price_id = 'price_1SbggZHn0vAXsCtaI0qvCBKE',
  status = 'active',
  current_period_end = NOW() + INTERVAL '1 month'
WHERE user_id = 'YOUR_USER_ID';
```

### Reset to free plan

```sql
UPDATE subscriptions
SET
  plan_type = 'free',
  stripe_subscription_id = NULL,
  stripe_price_id = NULL,
  status = 'active',
  current_period_end = NULL
WHERE user_id = 'YOUR_USER_ID';
```

## 🚀 Production Deployment

### 1. Configure Stripe Products

In Stripe Dashboard:
1. Go to Products → Create product
2. Create "AutoRemind Starter" - €5/month recurring
3. Create "AutoRemind Pro" - €15/month recurring
4. Copy price IDs to production environment variables

### 2. Set Up Webhook Endpoint

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook signing secret to production env

### 3. Configure Customer Portal

1. Go to Settings → Customer Portal
2. Enable subscription management
3. Configure cancellation policies
4. Set allowed actions (update payment method, cancel, etc.)

### 4. Test in Production

1. Use test mode first
2. Create test subscription
3. Verify webhooks are received
4. Check database updates
5. Test billing portal
6. Switch to live mode when ready

## 🔒 Security Considerations

1. ✅ Always verify webhook signatures
2. ✅ Validate price IDs against whitelist
3. ✅ Check user ownership before updates
4. ✅ Use HTTPS in production
5. ✅ Never expose secret keys client-side
6. ✅ Log all subscription changes for audit

## 📝 Best Practices

1. **Idempotency**: Webhooks may be sent multiple times - use event IDs to prevent duplicates
2. **Error Handling**: Always wrap Stripe calls in try-catch
3. **Logging**: Comprehensive logs help debug production issues
4. **Testing**: Use Stripe test mode extensively before going live
5. **Monitoring**: Set up alerts for failed webhooks in Stripe Dashboard
6. **Graceful Degradation**: Don't block users if payment fails - give grace period

## 🆘 Support Resources

- Stripe Documentation: https://stripe.com/docs
- Stripe Test Cards: https://stripe.com/docs/testing
- Webhook Testing: https://stripe.com/docs/webhooks/test
- API Reference: https://stripe.com/docs/api
