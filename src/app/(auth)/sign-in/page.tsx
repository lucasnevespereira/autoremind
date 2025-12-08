"use client";

import { SignInForm } from "@/components/auth/sign-in-form";
import { AppFooter } from "@/components/app-footer";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";
import Image from "next/image";
import logoSquare from "@/assets/logo-square.png";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back to home */}
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToHome")}
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

          {/* Login Card */}
          <div className="bg-card rounded-2xl border border-border/40 p-8 shadow-fintech-lg">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {t("signIn")}
            </h2>
            <SignInForm />

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
