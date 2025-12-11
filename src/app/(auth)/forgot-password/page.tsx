"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { requestPasswordReset } from "@/lib/auth-client";
import { AppFooter } from "@/components/app-footer";
import Link from "next/link";
import Image from "next/image";
import logoSquare from "@/assets/logo-square.png";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const result = await requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (result.error) {
        toast({
          variant: "destructive",
          title: t("error"),
          description: t("emailNotFound"),
        });
        return;
      }

      setEmailSent(true);
      toast({
        title: t("resetLinkSent"),
        description: t("resetLinkSentDescription"),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorGeneric"),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back to sign in */}
      {/* <div className="absolute top-4 left-4">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToSignIn")}
        </Link>
      </div> */}

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

          {/* Forgot Password Card */}
          <div className="bg-card rounded-2xl border border-border/40 p-8 shadow-fintech-lg">
            {emailSent ? (
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {t("resetLinkSent")}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t("resetLinkSentDescription")}
                </p>
                <Link href="/sign-in">
                  <Button className="w-full h-11 rounded-xl">
                    {t("backToSignIn")}
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {t("forgotPasswordTitle")}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {t("forgotPasswordDescription")}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground"
                    >
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

                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-fintech mt-6"
                    disabled={loading}
                  >
                    {loading ? t("sendingResetLink") : t("sendResetLink")}
                  </Button>
                </form>
              </>
            )}

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                {t("dontHaveAccount")}{" "}
                <Link
                  href="/sign-up"
                  className="text-primary font-semibold hover:underline"
                >
                  {t("signUp")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}
