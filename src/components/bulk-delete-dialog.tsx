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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bulkDeleteClients } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

interface BulkDeleteDialogProps {
  selectedIds: Set<number>;
  onSuccess: () => void;
}

export function BulkDeleteDialog({ selectedIds, onSuccess }: BulkDeleteDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const CONFIRM_TEXT = "DELETE";
  const count = selectedIds.size;

  async function handleDelete() {
    if (confirmText !== CONFIRM_TEXT) {
      return;
    }

    setLoading(true);

    const result = await bulkDeleteClients(Array.from(selectedIds));

    setLoading(false);

    if (result.success) {
      toast({
        title: t("success"),
        description: t("clientDeletedSuccess"),
      });
      setIsOpen(false);
      setConfirmText("");
      onSuccess();
    } else {
      toast({
        title: t("error"),
        description: result.errorKey ? t(result.errorKey as any) : t("errorGeneric"),
        variant: "destructive",
      });
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={count === 0}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          {`${t("delete")} ${count} ${t("selected")}`}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
            {t("bulkDeleteConfirmTitle").replace("{count}", count.toString())}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3 pt-2">
            <p className="text-sm text-foreground">
              {t("bulkDeleteConfirmMessage").replace("{count}", count.toString())}
            </p>

            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>{t("bulkDeleteItem1")}</li>
              <li>{t("bulkDeleteItem2")}</li>
            </ul>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3 mt-3">
              <p className="text-xs font-medium text-amber-900 dark:text-amber-200">
                {t("bulkDeleteWarningFinal")}
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
            onClick={() => setConfirmText("")}
          >
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={confirmText !== CONFIRM_TEXT || loading}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-9"
          >
            {loading ? t("deleting") : t("bulkDeletePermanently")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
