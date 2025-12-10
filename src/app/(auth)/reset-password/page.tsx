"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { resetPassword } from "@/lib/auth-client";
import { AppFooter } from "@/components/app-footer";
import Link from "next/link";
import Image from "next/image";
import logoSquare from "@/assets/logo-square.png";
import { ArrowLeft, Eye, EyeOff, KeyRound, CheckCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("passwordsDoNotMatch"),
      });
      setLoading(false);
      return;
    }

    if (!token) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("invalidResetLink"),
      });
      setLoading(false);
      return;
    }

    try {
      const result = await resetPassword({
        newPassword,
        token,
      });

      if (result.error) {
        toast({
          variant: "destructive",
          title: t("passwordResetFailed"),
          description: t("passwordResetError"),
        });
        return;
      }

      setResetSuccess(true);
      toast({
        title: t("passwordResetSuccess"),
        description: t("passwordResetSuccessDescription"),
      });

      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("passwordResetFailed"),
        description: t("passwordResetError"),
      });
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <KeyRound className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t("invalidResetLink")}
        </h2>
        <p className="text-muted-foreground mb-6">{t("passwordResetError")}</p>
        <Link href="/forgot-password">
          <Button className="w-full h-11 rounded-xl">
            {t("forgotPasswordTitle")}
          </Button>
        </Link>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t("passwordResetSuccess")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("passwordResetSuccessDescription")}
        </p>
        <Link href="/sign-in">
          <Button className="w-full h-11 rounded-xl">{t("signIn")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <KeyRound className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t("resetPassword")}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t("resetPasswordDescription")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            {t("newPassword")}
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("minimumCharacters")}
              required
              minLength={8}
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

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-foreground"
          >
            {t("confirmPassword")}
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("confirmPassword")}
              required
              minLength={8}
              className="pr-10 h-11 rounded-xl border-border/40"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
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
          {loading ? t("resettingPassword") : t("resetPasswordButton")}
        </Button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back to sign in */}
      <div className="absolute top-4 left-4">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToSignIn")}
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo and Title */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-block mb-4">
              <div>
                <Image
                  src={logoSquare}
                  alt="AutoRemind Logo"
                  width={80}
                  height={80}
                  className="mx-auto"
                  priority
                />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
              {t("autoremind")}
            </h1>
            <p className="text-muted-foreground text-sm">{t("slogan")}</p>
          </div>

          {/* Reset Password Card */}
          <div className="bg-card rounded-2xl border border-border/40 p-8 shadow-fintech-lg">
            <Suspense
              fallback={<div className="text-center py-8">{t("loading")}</div>}
            >
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}
