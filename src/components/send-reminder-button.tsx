"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { sendManualReminder } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { useState } from "react";

export function SendReminderButton({
  clientId,
  disabled,
}: {
  clientId: number;
  disabled?: boolean;
}) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setLoading(true);
    const result = await sendManualReminder(clientId);
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

  return (
    <Button
      onClick={handleSend}
      disabled={disabled || loading}
      size="sm"
      variant="ghost"
      className="gap-2"
    >
      <Send className="h-4 w-4" />
      {loading ? t("sending") : disabled ? t("sent") : t("send")}
    </Button>
  );
}
