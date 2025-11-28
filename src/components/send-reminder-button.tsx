"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { sendManualReminder } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function SendReminderButton({
  clientId,
  disabled,
}: {
  clientId: number;
  disabled?: boolean;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setLoading(true);
    const result = await sendManualReminder(clientId);
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

  return (
    <Button
      onClick={handleSend}
      disabled={disabled || loading}
      size="sm"
      variant="ghost"
      className="gap-2"
    >
      <Send className="h-4 w-4" />
      {loading ? "Sending..." : disabled ? "Sent" : "Send"}
    </Button>
  );
}
