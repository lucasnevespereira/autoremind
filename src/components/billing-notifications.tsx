"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";

export function BillingNotifications() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    const updated = searchParams.get("updated");

    if (success === "true") {
      // Force a hard refresh to get latest subscription data from server
      router.refresh();

      toast({
        title: t("success"),
        description: t("subscriptionUpdated"),
      });

      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState({}, "", url.toString());
    }

    if (updated === "true") {
      // Force a hard refresh to get latest subscription data from server
      router.refresh();

      toast({
        title: t("success"),
        description: t("subscriptionUpdated"),
      });

      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete("updated");
      window.history.replaceState({}, "", url.toString());
    }

    if (canceled === "true") {
      toast({
        title: t("canceled"),
        description: t("checkoutCanceled"),
      });

      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete("canceled");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, toast, t, router]);

  return null;
}
