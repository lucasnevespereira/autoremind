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
    <div className="flex gap-6 min-h-[600px]">
      {/* Sidebar Navigation */}
      <div className="w-64 flex-shrink-0">
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  activeTab === tab.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
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
                <h2 className="text-2xl font-bold text-gray-900">
                  Business Information
                </h2>
                <p className="text-gray-600 mt-1">
                  Your business details used in SMS messages
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="garageName" className="text-sm font-medium">
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
                  />
                  <p className="text-xs text-gray-500">
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
                <h2 className="text-2xl font-bold text-gray-900">
                  SMS Template
                </h2>
                <p className="text-gray-600 mt-1">
                  Customize the message sent to your clients
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smsTemplate" className="text-sm font-medium">
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
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-blue-900 mb-3">
                    Available Variables:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-2 py-1 rounded border border-blue-300 font-mono">
                        {"{client_name}"}
                      </code>
                      <span>Client's name</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-2 py-1 rounded border border-blue-300 font-mono">
                        {"{vehicle}"}
                      </code>
                      <span>Car model</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-2 py-1 rounded border border-blue-300 font-mono">
                        {"{date}"}
                      </code>
                      <span>Maintenance date</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-2 py-1 rounded border border-blue-300 font-mono">
                        {"{garage_name}"}
                      </code>
                      <span>Your business name</span>
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
                <h2 className="text-2xl font-bold text-gray-900">
                  Twilio Configuration
                </h2>
                <p className="text-gray-600 mt-1">
                  Connect your Twilio account to send SMS
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    Requirements
                  </h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Phone number must be purchased from Twilio</li>
                    <li>• Trial accounts can only send to verified numbers</li>
                    <li>• Use E.164 format: +[country][number]</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountSid" className="text-sm font-medium">
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
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authToken" className="text-sm font-medium">
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
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">
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
                  />
                  <p className="text-xs text-gray-500">
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
                <h2 className="text-2xl font-bold text-gray-900">Test SMS</h2>
                <p className="text-gray-600 mt-1">
                  Send a test message to verify your configuration
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testPhone" className="text-sm font-medium">
                    Test Phone Number
                  </Label>
                  <Input
                    id="testPhone"
                    type="tel"
                    placeholder="+351912345678"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Enter a phone number to receive a test SMS
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendTest}
                  disabled={testLoading || !formValues.accountSid}
                  className="w-full sm:w-auto"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {testLoading ? "Sending..." : "Send Test SMS"}
                </Button>
              </div>
            </div>
          )}

          {/* Save Button - Always visible at bottom */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
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
