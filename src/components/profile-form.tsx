"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormProps {
  initialValues: {
    name: string;
    email: string;
  };
}

export function ProfileForm({ initialValues }: ProfileFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initialValues.name);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    setLoading(false);

    if (result.success) {
      toast({
        title: t("success"),
        description: t("profileUpdatedSuccess"),
      });
    } else {
      toast({
        title: t("error"),
        description: result.errorKey ? t(result.errorKey as any) : t("errorGeneric"),
        variant: "destructive",
      });
    }
  }

  const hasChanges = name !== initialValues.name;

  // Generate avatar initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-card rounded-lg border border-border/40 shadow-sm overflow-hidden">
      {/* Avatar Section */}
      <div className="px-4 pt-5 pb-4 border-b border-border/40">
        <div className="flex items-center gap-4">
          {/* Large Avatar */}
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/20">
            <span className="text-xl font-bold text-primary">
              {getInitials(name)}
            </span>
          </div>

          {/* Name and Email Display */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground truncate">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
              <Mail className="h-3.5 w-3.5" />
              {initialValues.email}
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        {/* Name Field */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-medium text-foreground">
            {t("name")}
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("namePlaceholder")}
            className="h-9 rounded-xl border-border/40 text-sm"
            required
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={loading || !hasChanges}
            size="sm"
            className="h-9 rounded-xl gap-2"
          >
            <Check className="h-4 w-4" />
            {loading ? t("saving") : t("saveChanges")}
          </Button>
        </div>
      </form>
    </div>
  );
}
