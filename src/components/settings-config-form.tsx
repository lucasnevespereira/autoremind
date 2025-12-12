"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveConfig, sendTestSMS } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { useState } from "react";
import {
  Save,
  Send,
  Building2,
  MessageSquare,
  Settings2,
  ExternalLink,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsConfigFormProps {
  initialValues: {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
    businessName: string;
    businessContact: string;
    reminderDaysBefore: string;
    smsTemplate: string;
    useManagedSms: boolean;
  };
  planType: string;
  isPaidPlan: boolean;
}

type Tab = "business" | "template" | "twilio";

export function SettingsConfigForm({
  initialValues,
  planType,
  isPaidPlan,
}: SettingsConfigFormProps) {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("business");
  const [showAuthToken, setShowAuthToken] = useState(false);
  const [useManagedSms, setUseManagedSms] = useState(
    initialValues.useManagedSms
  );

  // Controlled form state
  const [formValues, setFormValues] = useState(initialValues);

  const updateFormValue = (field: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await saveConfig(formData);
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
    const businessName = formValues.businessName || "AutoRemind";
    const result = await sendTestSMS(testPhone, businessName, language);
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
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Sidebar Navigation */}
      <div className="lg:w-56 flex-shrink-0">
        <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-fintech"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <form action={handleSubmit} className="space-y-5">
          {/* Hidden inputs to preserve values from other tabs */}
          {activeTab !== "business" && (
            <>
              {formValues.businessName && (
                <input
                  type="hidden"
                  name="businessName"
                  value={formValues.businessName}
                />
              )}
              {formValues.businessContact && (
                <input
                  type="hidden"
                  name="businessContact"
                  value={formValues.businessContact}
                />
              )}
              {formValues.reminderDaysBefore && (
                <input
                  type="hidden"
                  name="reminderDaysBefore"
                  value={formValues.reminderDaysBefore}
                />
              )}
            </>
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
          {/* Always include useManagedSms value */}
          <input
            type="hidden"
            name="useManagedSms"
            value={useManagedSms ? "true" : "false"}
          />

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
              <div className="bg-card rounded-xl border border-border/40 p-4 shadow-fintech space-y-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="businessName"
                    className="text-sm font-medium text-foreground"
                  >
                    {t("businessName")}
                  </Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    type="text"
                    placeholder={t("businessNamePlaceholder")}
                    value={formValues.businessName}
                    onChange={(e) =>
                      updateFormValue("businessName", e.target.value)
                    }
                    required
                    className="h-9 rounded-xl border-border/40"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("businessNameHint")}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="businessContact"
                    className="text-sm font-medium text-foreground"
                  >
                    {t("businessContact")}
                  </Label>
                  <Input
                    id="businessContact"
                    name="businessContact"
                    type="text"
                    placeholder={t("businessContactPlaceholder")}
                    value={formValues.businessContact}
                    onChange={(e) =>
                      updateFormValue("businessContact", e.target.value)
                    }
                    className="h-9 rounded-xl border-border/40"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("businessContactHint")}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="reminderDaysBefore"
                    className="text-sm font-medium text-foreground"
                  >
                    {t("reminderDaysBefore")}
                  </Label>
                  <Input
                    id="reminderDaysBefore"
                    name="reminderDaysBefore"
                    type="number"
                    min="1"
                    max="365"
                    placeholder="7"
                    value={formValues.reminderDaysBefore}
                    onChange={(e) =>
                      updateFormValue("reminderDaysBefore", e.target.value)
                    }
                    className="h-9 rounded-xl border-border/40"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("reminderDaysBeforeHint")}
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

              <div className="bg-card rounded-xl border border-border/40 p-4 shadow-fintech space-y-3">
                <div className="space-y-1.5">
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
                    placeholder="Hello {client_name}, your {resource} is scheduled for {date}..."
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
                        {"{client_resource}"}
                      </code>
                      <span className="text-muted-foreground">
                        {t("clientResourceVar")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-card px-2.5 py-1.5 rounded-lg border border-border/40 font-mono text-primary">
                        {"{reminder_date}"}
                      </code>
                      <span className="text-muted-foreground">
                        {t("reminderDateVar")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-card px-2.5 py-1.5 rounded-lg border border-border/40 font-mono text-primary">
                        {"{business_name}"}
                      </code>
                      <span className="text-muted-foreground">
                        {t("businessNameVar")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-card px-2.5 py-1.5 rounded-lg border border-border/40 font-mono text-primary">
                        {"{business_contact}"}
                      </code>
                      <span className="text-muted-foreground">
                        {t("businessContactVar")}
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

              {/* Managed SMS Toggle - Only for Paid Plans */}
              {isPaidPlan && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground">
                          {t("managedSms")}
                        </h3>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                          {planType === "starter" ? "Starter" : "Pro"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {useManagedSms
                          ? t("managedSmsActiveDescription")
                          : t("managedSmsDescription")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="useManagedSms"
                          checked={useManagedSms}
                          onChange={(e) => setUseManagedSms(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional Rendering Based on Managed SMS */}
              {useManagedSms && isPaidPlan ? (
                // Show info banner when using managed SMS
                <div className="bg-card rounded-xl border border-border/40 p-4 shadow-fintech">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {t("managedSmsEnabled")}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t("managedSmsEnabledDescription")}
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span>{t("noTwilioAccountNeeded")}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span>{t("autoConfiguration")}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span>{t("reliableDelivery")}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                // Show Twilio configuration fields
                <div className="bg-card rounded-xl border border-border/40 p-4 shadow-fintech space-y-3">
                  <div className="space-y-1.5">
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

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="authToken"
                      className="text-sm font-medium text-foreground"
                    >
                      {t("authToken")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="authToken"
                        name="authToken"
                        type={showAuthToken ? "text" : "password"}
                        placeholder="Your Twilio Auth Token"
                        value={formValues.authToken}
                        onChange={(e) =>
                          updateFormValue("authToken", e.target.value)
                        }
                        required
                        className="pr-10 font-mono text-sm h-11 rounded-xl border-border/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAuthToken(!showAuthToken)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showAuthToken ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-500">
                      🔒 {t("authTokenEncrypted")}
                    </p>
                  </div>

                  <div className="space-y-1.5">
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
                      className="h-9 rounded-xl border-border/40"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("twilioPhoneHint")}
                    </p>
                  </div>

                  {/* Useful Links - Compact */}
                  <div className="flex items-start gap-4 text-xs text-muted-foreground pt-2 border-t border-border/20">
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-1.5">
                        {t("usefulLinks")}:
                      </p>
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

                  {/* Test SMS Section */}
                  <div className="space-y-3 pt-3 border-t border-border/20">
                    <p className="text-sm font-medium text-foreground">
                      {t("testSms")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id="testPhone"
                        type="tel"
                        placeholder="+351912345678"
                        value={testPhone}
                        onChange={(e) => setTestPhone(e.target.value)}
                        className="h-9 rounded-xl border-border/40 flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendTest}
                        disabled={testLoading}
                        className="h-9 rounded-xl border-border/40"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        {testLoading ? t("sending") : t("sendTestSms")}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("testPhoneHint")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-border/40">
            <Button
              type="submit"
              disabled={loading}
              size="default"
              className="w-full sm:w-auto h-9 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-fintech"
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
