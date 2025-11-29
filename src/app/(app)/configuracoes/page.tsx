import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TwilioConfigForm } from "@/components/twilio-config-form";
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

  const isConfigured = accountSid && authToken && phoneNumber;

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1.5">
            Configure your business information and SMS notifications
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2 rounded-xl h-9 border-border/40">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

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
