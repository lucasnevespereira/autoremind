"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveTwilioConfig, sendTestSMS } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Save,
  Send,
  Building2,
  MessageSquare,
  Settings2,
  TestTube,
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
        title: "Sucesso!",
        description: result.message,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: result.error,
      });
    }
  }

  async function handleSendTest() {
    if (!testPhone) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira um número de telefone para teste",
      });
      return;
    }

    setTestLoading(true);
    const result = await sendTestSMS(testPhone);
    setTestLoading(false);

    if (result.success) {
      toast({
        title: "Sucesso!",
        description: result.message,
      });
      setTestPhone("");
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: result.error,
      });
    }
  }

  const tabs = [
    { id: "business" as Tab, label: "Business", icon: Building2 },
    { id: "template" as Tab, label: "SMS Template", icon: MessageSquare },
    { id: "twilio" as Tab, label: "Twilio Config", icon: Settings2 },
    { id: "test" as Tab, label: "Test SMS", icon: TestTube },
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
                  Business Information
                </h2>
                <p className="text-muted-foreground mt-1.5">
                  Your business details used in SMS messages
                </p>
              </div>
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-fintech space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="garageName" className="text-sm font-medium text-foreground">
                    Business/Garage Name
                  </Label>
                  <Input
                    id="garageName"
                    name="garageName"
                    type="text"
                    placeholder="e.g., Auto Service Center"
                    value={formValues.garageName}
                    onChange={(e) =>
                      updateFormValue("garageName", e.target.value)
                    }
                    required
                    className="h-11 rounded-xl border-border/40"
                  />
                  <p className="text-xs text-muted-foreground">
                    This name will appear in your SMS messages as{" "}
                    {"{garage_name}"}
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
                  SMS Template
                </h2>
                <p className="text-muted-foreground mt-1.5">
                  Customize the message sent to your clients
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-fintech space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smsTemplate" className="text-sm font-medium text-foreground">
                    Message Template
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
                    Available Variables:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <code className="bg-card px-2.5 py-1.5 rounded-lg border border-border/40 font-mono text-primary">
                        {"{client_name}"}
                      </code>
                      <span className="text-muted-foreground">Client's name</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-card px-2.5 py-1.5 rounded-lg border border-border/40 font-mono text-primary">
                        {"{vehicle}"}
                      </code>
                      <span className="text-muted-foreground">Car model</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-card px-2.5 py-1.5 rounded-lg border border-border/40 font-mono text-primary">
                        {"{date}"}
                      </code>
                      <span className="text-muted-foreground">Maintenance date</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-card px-2.5 py-1.5 rounded-lg border border-border/40 font-mono text-primary">
                        {"{garage_name}"}
                      </code>
                      <span className="text-muted-foreground">Your business name</span>
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
                  Twilio Configuration
                </h2>
                <p className="text-muted-foreground mt-1.5">
                  Connect your Twilio account to send SMS
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-fintech space-y-5">
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Requirements
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1.5">
                    <li>• Phone number must be purchased from Twilio</li>
                    <li>• Trial accounts can only send to verified numbers</li>
                    <li>• Use E.164 format: +[country][number]</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountSid" className="text-sm font-medium text-foreground">
                    Account SID
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
                  <Label htmlFor="authToken" className="text-sm font-medium text-foreground">
                    Auth Token
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
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">
                    Phone Number
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
                    Must be a Twilio number in E.164 format
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Test SMS Section */}
          {activeTab === "test" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Test SMS</h2>
                <p className="text-muted-foreground mt-1.5">
                  Send a test message to verify your configuration
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-fintech space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testPhone" className="text-sm font-medium text-foreground">
                    Test Phone Number
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
                    Enter a phone number to receive a test SMS
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
                  {testLoading ? "Sending..." : "Send Test SMS"}
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
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
