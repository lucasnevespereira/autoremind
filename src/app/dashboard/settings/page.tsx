import { SettingsConfigForm } from "@/components/settings-config-form";
import { db } from "@/db";
import { settings, subscriptions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/encryption";
import { PLAN } from "@/constants";
import { SettingsHeader } from "@/components/settings-header";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const userSettings = await db.query.settings.findFirst({
    where: eq(settings.userId, session.user.id),
  });

  // Get user's subscription to check plan
  const userSubscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, session.user.id),
  });

  const accountSid = userSettings?.twilioAccountSid || "";
  // Decrypt the auth token but show it masked in the UI
  const authToken = userSettings?.twilioAuthToken
    ? decrypt(userSettings.twilioAuthToken)
    : "";
  const phoneNumber = userSettings?.twilioPhoneNumber || "";
  const businessName = userSettings?.businessName || "";
  const businessContact = userSettings?.businessContact || "";
  const reminderDaysBefore =
    userSettings?.reminderDaysBefore?.toString() || "7";
  const smsTemplate =
    userSettings?.smsTemplate ||
    "Hello {client_name}, your {client_resource} is scheduled for {reminder_date}. Please contact {business_name} to confirm. Thank you!";
  const useManagedSms = userSettings?.useManagedSms || false;

  const planType = userSubscription?.planType || PLAN.FREE;
  const isPaidPlan = planType === PLAN.STARTER || planType === PLAN.PRO;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <SettingsHeader />

      <SettingsConfigForm
        initialValues={{
          accountSid,
          authToken,
          phoneNumber,
          businessName,
          businessContact,
          reminderDaysBefore,
          smsTemplate,
          useManagedSms,
        }}
        planType={planType}
        isPaidPlan={isPaidPlan}
      />
    </div>
  );
}
