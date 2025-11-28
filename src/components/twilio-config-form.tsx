"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveTwilioConfig, sendTestSMS } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Save, Send } from "lucide-react";

interface TwilioConfigFormProps {
  initialValues: {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
  };
}

export function TwilioConfigForm({ initialValues }: TwilioConfigFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testPhone, setTestPhone] = useState("");

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

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Twilio Setup Requirements</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• <strong>From Number:</strong> Must be a phone number purchased from Twilio</li>
          <li>• <strong>Trial Accounts:</strong> Can only send SMS to verified phone numbers</li>
          <li>• <strong>Format:</strong> Use E.164 format with country code (e.g., +19252906736)</li>
        </ul>
      </div>

      <form action={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="accountSid" className="text-sm font-medium text-gray-700">
            Twilio Account SID
          </Label>
          <Input
            id="accountSid"
            name="accountSid"
            type="text"
            placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            defaultValue={initialValues.accountSid}
            required
            className="font-mono text-sm"
          />
          <p className="text-xs text-gray-500">
            Your Twilio Account SID from your Twilio dashboard
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="authToken" className="text-sm font-medium text-gray-700">
            Twilio Auth Token
          </Label>
          <Input
            id="authToken"
            name="authToken"
            type="password"
            placeholder="••••••••••••••••••••••••••••••••"
            defaultValue={initialValues.authToken}
            required
            className="font-mono text-sm"
          />
          <p className="text-xs text-gray-500">
            Your Twilio Auth Token (kept secure and encrypted)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
            From Phone Number
          </Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="+19252906736"
            defaultValue={initialValues.phoneNumber}
            required
          />
          <p className="text-xs text-gray-500">
            Your Twilio phone number in E.164 format (e.g., +19252906736). This must be a phone number you purchased from Twilio.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-5">
          <div className="space-y-2">
            <Label htmlFor="testPhone" className="text-sm font-medium text-gray-700">
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
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSendTest}
            disabled={testLoading || !initialValues.accountSid}
            className="flex-1"
          >
            <Send className="mr-2 h-4 w-4" />
            {testLoading ? "Sending..." : "Send Test SMS"}
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
