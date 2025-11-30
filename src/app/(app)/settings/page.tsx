import { TwilioConfigForm } from "@/components/twilio-config-form";
import { SettingsHeader } from "@/components/settings-header";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const configs = await db
    .select()
    .from(settings)
    .where(eq(settings.userId, session.user.id));

  const accountSid =
    configs.find((c) => c.key === "twilio_account_sid")?.value || "";
  const authToken =
    configs.find((c) => c.key === "twilio_auth_token")?.value || "";
  const phoneNumber =
    configs.find((c) => c.key === "twilio_phone_number")?.value || "";
  const garageName = configs.find((c) => c.key === "garage_name")?.value || "";
  const smsTemplate =
    configs.find((c) => c.key === "sms_template")?.value ||
    "Hello {client_name}, your {vehicle} is scheduled for maintenance on {date}. Please contact {garage_name} to confirm. Thank you!";

  return (
    <div className="max-w-6xl animate-fade-in">
      <SettingsHeader />

      <TwilioConfigForm
        initialValues={{
          accountSid,
          authToken,
          phoneNumber,
          garageName,
          smsTemplate,
        }}
      />
    </div>
  );
}
