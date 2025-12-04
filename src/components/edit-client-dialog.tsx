"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateClient } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { useState, FormEvent } from "react";
import { Edit } from "lucide-react";

interface EditClientDialogProps {
  client: {
    id: number;
    name: string;
    email?: string | null;
    phone: string;
    resource: string;
    reminderDate: Date;
  };
}

export function EditClientDialog({ client }: EditClientDialogProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const resource = formData.get("resource") as string;
    const reminderDate = formData.get("reminderDate") as string;

    // Validate
    const newErrors: Record<string, string> = {};
    if (!name?.trim()) newErrors.name = t("nameRequired");
    if (!phone?.trim()) newErrors.phone = t("phoneRequired");
    if (!resource?.trim()) newErrors.resource = t("resourceRequired");
    if (!reminderDate) newErrors.reminderDate = t("dateRequired");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await updateClient(client.id, formData);
    setLoading(false);

    if (result.success) {
      toast({
        title: t("success"),
        description: result.messageKey ? t(result.messageKey as any) : "",
      });
      setOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: t("error"),
        description: result.errorKey ? t(result.errorKey as any) : "",
      });
    }
  }

  // Format date for input (YYYY-MM-DD)
  const formattedDate = client.reminderDate.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4 text-gray-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("editClient")}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("updateClientDetails")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              {t("clientName")}
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. John Smith"
              defaultValue={client.name}
              className={errors.name ? "border-destructive focus-visible:ring-destructive h-11 rounded-xl border-border/40" : "h-11 rounded-xl border-border/40"}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              {t("clientEmail")}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. john@example.com"
              defaultValue={client.email || ""}
              className="h-11 rounded-xl border-border/40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-foreground">
              {t("phoneNumber")}
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="e.g. +351912345678"
              defaultValue={client.phone}
              className={errors.phone ? "border-destructive focus-visible:ring-destructive h-11 rounded-xl border-border/40" : "h-11 rounded-xl border-border/40"}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resource" className="text-sm font-medium text-foreground">
              {t("resource")}
            </Label>
            <Input
              id="resource"
              name="resource"
              type="text"
              placeholder="e.g. Toyota Camry 2020"
              defaultValue={client.resource}
              className={errors.resource ? "border-destructive focus-visible:ring-destructive h-11 rounded-xl border-border/40" : "h-11 rounded-xl border-border/40"}
            />
            {errors.resource && <p className="text-sm text-destructive">{errors.resource}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminderDate" className="text-sm font-medium text-foreground">
              {t("reminderDate")}
            </Label>
            <Input
              id="reminderDate"
              name="reminderDate"
              type="date"
              defaultValue={formattedDate}
              className={errors.reminderDate ? "border-destructive focus-visible:ring-destructive h-11 rounded-xl border-border/40" : "h-11 rounded-xl border-border/40"}
            />
            {errors.reminderDate && <p className="text-sm text-destructive">{errors.reminderDate}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? t("updating") : t("updateClient")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
