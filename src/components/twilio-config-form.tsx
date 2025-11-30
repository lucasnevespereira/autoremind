"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveTwilioConfig, sendTestSMS } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { useState } from "react";
import {
  Save,
  Send,
  Building2,
  MessageSquare,
  Settings2,
  TestTube,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TwilioConfigFormProps {
  initialValues: {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
    garageName: string;
    smsTemplate: string;
  };
}

type Tab = "business" | "template" | "twilio" | "test";

export function TwilioConfigForm({ initialValues }: TwilioConfigFormProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("business");

  // Controlled form state
  const [formValues, setFormValues] = useState(initialValues);

  const updateFormValue = (field: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await saveTwilioConfig(formData);
    setLoading(false);

    if (result.success) {
      toast({
        title: t("success"),
        description: result.messageKey ? t(result.messageKey as any) : "",
      });
    } else {
      toast({
        variant: "destructive",
        title: t("error"),
        description: result.errorKey ? t(result.errorKey as any) : "",
      });
    }
  }

  async function handleSendTest() {
    if (!testPhone) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("testPhoneHint"),
      });
      return;
    }

    setTestLoading(true);
    const result = await sendTestSMS(testPhone);
    setTestLoading(false);

    if (result.success) {
      toast({
        title: t("success"),
        description: result.messageKey ? t(result.messageKey as any) : "",
      });
      setTestPhone("");
    } else {
      toast({
        variant: "destructive",
        title: t("error"),
        description: result.errorKey ? t(result.errorKey as any) : "",
      });
    }
  }

  const tabs = [
    { id: "business" as Tab, label: t("business"), icon: Building2 },
    { id: "template" as Tab, label: t("template"), icon: MessageSquare },
    { id: "twilio" as Tab, label: t("twilioConfig"), icon: Settings2 },
    { id: "test" as Tab, label: t("test"), icon: TestTube },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
      {/* Sidebar Navigation */}
      <div className="lg:w-64 flex-shrink-0">
        <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-fintech"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <form action={handleSubmit} className="space-y-6">
          {/* Hidden inputs to preserve values from other tabs */}
          {activeTab !== "business" && formValues.garageName && (
            <input
              type="hidden"
              name="garageName"
              value={formValues.garageName}
            />
          )}
          {activeTab !== "template" && formValues.smsTemplate && (
            <input
              type="hidden"
              name="smsTemplate"
              value={formValues.smsTemplate}
            />
          )}
          {activeTab !== "twilio" && (
            <>
              {formValues.accountSid && (
                <input
                  type="hidden"
                  name="accountSid"
                  value={formValues.accountSid}
                />
              )}
              {formValues.authToken && (
                <input
                  type="hidden"
                  name="authToken"
                  value={formValues.authToken}
                />
              )}
              {formValues.phoneNumber && (
                <input
                  type="hidden"
                  name="phoneNumber"
                  value={formValues.phoneNumber}
                />
              )}
            </>
          )}

          {/* Business Information Section */}
          {activeTab === "business" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {t("businessInformation")}
                </h2>
                <p className="text-muted-foreground mt-1.5">
                  {t("businessDetails")}
                </p>
              </div>
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-fintech space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="garageName"
                    className="text-sm font-medium text-foreground"
                  >
                    {t("businessGarageName")}
                  </Label>
                  <Input
                    id="garageName"
                    name="garageName"
                    type="text"
                    placeholder={t("businessNamePlaceholder")}
                    value={formValues.garageName}
                    onChange={(e) =>
                      updateFormValue("garageName", e.target.value)
                    }
                    required
                    className="h-11 rounded-xl border-border/40"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("businessNameHint")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SMS Template Section */}
          {activeTab === "template" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {t("smsTemplate")}
                </h2>
                <p className="text-muted-foreground mt-1.5">
                  {t("customizeMessage")}
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-fintech space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="smsTemplate"
                    className="text-sm font-medium text-foreground"
                  >
                    {t("messageTemplate")}
                  </Label>
                  <textarea
                    id="smsTemplate"
                    name="smsTemplate"
                    rows={6}
                    placeholder="Hello {client_name}, your {vehicle} is scheduled for maintenance on {date}..."
                    value={formValues.smsTemplate}
                    onChange={(e) =>
                      updateFormValue("smsTemplate", e.target.value)
                    }
                    required
                    className="flex w-full rounded-xl border border-border/40 bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <p className="text-xs font-semibold text-foreground mb-3">
                    {t("availableVariables")}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <code className="bg-card px-2.5 py-1.5 rounded-lg border border-border/40 font-mono text-primary">
                        {"{client_name}"}
                      </code>
                      <span className="text-muted-foreground">
                        {t("clientNameVar")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-card px-2.5 py-1.5 rounded-lg border border-border/40 font-mono text-primary">
                        {"{vehicle}"}
                      </code>
                      <span className="text-muted-foreground">
                        {t("carModelVar")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-card px-2.5 py-1.5 rounded-lg border border-border/40 font-mono text-primary">
                        {"{date}"}
                      </code>
                      <span className="text-muted-foreground">
                        {t("maintenanceDateVar")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-card px-2.5 py-1.5 rounded-lg border border-border/40 font-mono text-primary">
                        {"{garage_name}"}
                      </code>
                      <span className="text-muted-foreground">
                        {t("businessNameVar")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Twilio Configuration Section */}
          {activeTab === "twilio" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {t("twilioConfiguration")}
                </h2>
                <p className="text-muted-foreground mt-1.5">
                  {t("connectTwilioAccount")}
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-fintech space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="accountSid"
                    className="text-sm font-medium text-foreground"
                  >
                    {t("accountSid")}
                  </Label>
                  <Input
                    id="accountSid"
                    name="accountSid"
                    type="text"
                    placeholder="ACxxxxxxxxxxxxxxxx"
                    value={formValues.accountSid}
                    onChange={(e) =>
                      updateFormValue("accountSid", e.target.value)
                    }
                    required
                    className="font-mono text-sm h-11 rounded-xl border-border/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="authToken"
                    className="text-sm font-medium text-foreground"
                  >
                    {t("authToken")}
                  </Label>
                  <Input
                    id="authToken"
                    name="authToken"
                    type="text"
                    placeholder="Your Twilio Auth Token"
                    value={formValues.authToken}
                    onChange={(e) =>
                      updateFormValue("authToken", e.target.value)
                    }
                    required
                    className="font-mono text-sm h-11 rounded-xl border-border/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium text-foreground"
                  >
                    {t("twilioPhoneNumber")}
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="+19252906736"
                    value={formValues.phoneNumber}
                    onChange={(e) =>
                      updateFormValue("phoneNumber", e.target.value)
                    }
                    required
                    className="h-11 rounded-xl border-border/40"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("twilioPhoneHint")}
                  </p>
                </div>

                {/* Useful Links - Compact */}
                <div className="flex items-start gap-4 text-xs text-muted-foreground pt-2 border-t border-border/20">
                  <div className="flex-1">
                    <p className="font-medium text-foreground mb-1.5">{t("usefulLinks")}:</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      <a
                        href="https://console.twilio.com/us1/billing/manage-billing/billing-overview"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {t("viewBilling")}
                      </a>
                      <a
                        href="https://console.twilio.com/us1/develop/phone-numbers/manage/incoming"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {t("managePhoneNumbers")}
                      </a>
                      <a
                        href="https://console.twilio.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {t("twilioConsole")}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test SMS Section */}
          {activeTab === "test" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {t("testSms")}
                </h2>
                <p className="text-muted-foreground mt-1.5">
                  {t("sendTestMessage")}
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-fintech space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="testPhone"
                    className="text-sm font-medium text-foreground"
                  >
                    {t("testPhoneNumber")}
                  </Label>
                  <Input
                    id="testPhone"
                    type="tel"
                    placeholder="+351912345678"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="h-11 rounded-xl border-border/40"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("testPhoneHint")}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendTest}
                  disabled={testLoading || !formValues.accountSid}
                  className="w-full sm:w-auto h-10 rounded-xl border-border/40"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {testLoading ? t("sending") : t("sendTestSms")}
                </Button>
              </div>
            </div>
          )}

          {/* Save Button - Always visible at bottom */}
          <div className="flex justify-end pt-6 border-t border-border/40">
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-fintech"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? t("saving") : t("saveChanges")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
