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
import { addClient } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { useState, FormEvent } from "react";
import { Plus } from "lucide-react";

export function AddClientDialog() {
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
    const phone = formData.get("phone") as string;
    const car = formData.get("car") as string;
    const revisionDate = formData.get("revisionDate") as string;

    // Validate
    const newErrors: Record<string, string> = {};
    if (!name?.trim()) newErrors.name = t("nameRequired");
    if (!phone?.trim()) newErrors.phone = t("phoneRequired");
    if (!car?.trim()) newErrors.car = t("carRequired");
    if (!revisionDate) newErrors.revisionDate = t("dateRequired");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await addClient(formData);
    setLoading(false);

    if (result.success) {
      toast({
        title: t("success"),
        description: result.messageKey ? t(result.messageKey as any) : "",
      });
      setOpen(false);
      // Reset form
      (e.target as HTMLFormElement).reset();
    } else {
      toast({
        variant: "destructive",
        title: t("error"),
        description: result.errorKey ? t(result.errorKey as any) : "",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 h-11 px-5">
          <Plus className="h-4 w-4" />
          {t("addClient")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("addNewClient")}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("enterClientDetails")}
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
              className={errors.name ? "border-destructive focus-visible:ring-destructive h-11 rounded-xl border-border/40" : "h-11 rounded-xl border-border/40"}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
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
              className={errors.phone ? "border-destructive focus-visible:ring-destructive h-11 rounded-xl border-border/40" : "h-11 rounded-xl border-border/40"}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="car" className="text-sm font-medium text-foreground">
              {t("carModel")}
            </Label>
            <Input
              id="car"
              name="car"
              type="text"
              placeholder="e.g. Toyota Camry 2020"
              className={errors.car ? "border-destructive focus-visible:ring-destructive h-11 rounded-xl border-border/40" : "h-11 rounded-xl border-border/40"}
            />
            {errors.car && <p className="text-sm text-destructive">{errors.car}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="revisionDate" className="text-sm font-medium text-foreground">
              {t("maintenanceDate")}
            </Label>
            <Input
              id="revisionDate"
              name="revisionDate"
              type="date"
              className={errors.revisionDate ? "border-destructive focus-visible:ring-destructive h-11 rounded-xl border-border/40" : "h-11 rounded-xl border-border/40"}
            />
            {errors.revisionDate && <p className="text-sm text-destructive">{errors.revisionDate}</p>}
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
              {loading ? t("saving") : t("saveClient")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
