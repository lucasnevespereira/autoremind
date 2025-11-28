import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TwilioConfigForm } from "@/components/twilio-config-form";
import { db } from "@/db";
import { settings } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const configs = await db.select().from(settings);

  const accountSid =
    configs.find((c) => c.key === "twilio_account_sid")?.value || "";
  const authToken =
    configs.find((c) => c.key === "twilio_auth_token")?.value || "";
  const phoneNumber =
    configs.find((c) => c.key === "twilio_phone_number")?.value || "";

  const isConfigured = accountSid && authToken && phoneNumber;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure SMS notifications and templates</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Twilio Configuration
          </h3>
          <p className="text-sm text-gray-600">
            Connect your Twilio account to send SMS reminders
          </p>
        </div>

        <TwilioConfigForm
          initialValues={{
            accountSid,
            authToken,
            phoneNumber,
          }}
        />
      </div>
    </div>
  );
}
