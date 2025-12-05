import { TwilioConfigForm } from "@/components/twilio-config-form";
import { SettingsHeader } from "@/components/settings-header";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/encryption";

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

  const accountSid = userSettings?.twilioAccountSid || "";
  // Decrypt the auth token but show it masked in the UI
  const authToken = userSettings?.twilioAuthToken
    ? decrypt(userSettings.twilioAuthToken)
    : "";
  const phoneNumber = userSettings?.twilioPhoneNumber || "";
  const businessName = userSettings?.businessName || "";
  const businessContact = userSettings?.businessContact || "";
  const reminderDaysBefore = userSettings?.reminderDaysBefore?.toString() || "7";
  const smsTemplate =
    userSettings?.smsTemplate ||
    "Hello {client_name}, your {resource} is scheduled for {date}. Please contact {business_name} to confirm. Thank you!";

  return (
    <div className="max-w-6xl animate-fade-in">
      <SettingsHeader />

      <TwilioConfigForm
        initialValues={{
          accountSid,
          authToken,
          phoneNumber,
          businessName,
          businessContact,
          reminderDaysBefore,
          smsTemplate,
        }}
      />
    </div>
  );
}
