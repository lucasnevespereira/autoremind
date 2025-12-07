"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteAccount } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

export function DangerZone() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const CONFIRM_TEXT = "DELETE";

  async function handleDeleteAccount() {
    if (confirmText !== CONFIRM_TEXT) {
      return;
    }

    setLoading(true);

    const result = await deleteAccount();

    if (result.success) {
      toast({
        title: t("success"),
        description: t("accountDeletedSuccess"),
      });

      // Wait a moment for toast to show, then redirect to sign-in
      setTimeout(() => {
        window.location.href = "/sign-in";
      }, 1000);
    } else {
      setLoading(false);
      toast({
        title: t("error"),
        description: result.errorKey ? t(result.errorKey as any) : t("errorGeneric"),
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <div className="bg-card rounded-lg border border-border/40 shadow-sm overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-border/40">
          <h2 className="text-sm font-medium text-muted-foreground">
            {t("dangerZone")}
          </h2>
        </div>

        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  {t("deleteAccount")}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("deleteAccountWarning")}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="h-8 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 sm:w-auto w-full text-xs font-medium"
            >
              {t("delete")}
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              {t("deleteAccountConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-2">
              <p className="text-sm text-foreground">
                {t("deleteAccountConfirmMessage")}
              </p>

              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>{t("deleteAccountItem1")}</li>
                <li>{t("deleteAccountItem2")}</li>
                <li>{t("deleteAccountItem3")}</li>
                <li>{t("deleteAccountItem4")}</li>
              </ul>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3 mt-3">
                <p className="text-xs font-medium text-amber-900 dark:text-amber-200">
                  {t("deleteAccountWarningFinal")}
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <Label htmlFor="confirm" className="text-xs font-medium text-foreground">
                  {t("typeToConfirm").replace("{text}", CONFIRM_TEXT)}
                </Label>
                <Input
                  id="confirm"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={CONFIRM_TEXT}
                  className="h-9 rounded-xl border-border/40 text-sm font-mono"
                  autoComplete="off"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel
              className="rounded-xl h-9"
              disabled={loading}
            >
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={confirmText !== CONFIRM_TEXT || loading}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-9"
            >
              {loading ? t("deleting") : t("deleteAccountPermanently")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
