"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signIn.email({
        email,
        password,
      });

      toast({
        title: t("success"),
        description: t("signedInSuccess"),
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("signInFailed"),
        description: t("invalidCredentials"),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          {t("email")}
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t("yourEmail")}
          required
          className="h-11 rounded-xl border-border/40"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-foreground">
          {t("password")}
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("password")}
            required
            className="pr-10 h-11 rounded-xl border-border/40"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-fintech mt-6"
        disabled={loading}
      >
        {loading ? t("signingIn") : t("signIn")}
      </Button>
    </form>
  );
}
