"use client";

import Link from "next/link";
import { ArrowRight, Upload, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logoSquare from "@/assets/logo-square.png";
import { LanguageSelector } from "@/components/language-selector";
import { APP_VERSION } from "@/version";
import { useLanguage } from "@/contexts/language-context";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Image
                  src={logoSquare}
                  alt="AutoRemind"
                  width={32}
                  height={32}
                />
              </div>
              <span className="font-semibold text-lg">{t("autoremind")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  {t("signIn")}
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">{t("getStarted")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="pt-20 pb-16 sm:pt-32 sm:pb-24">
            <div className="max-w-3xl">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                {t("landingHeadline")}
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl">
                {t("landingSubheadline")}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/sign-up">
                  <Button size="lg" className="h-12 px-8">
                    {t("getStarted")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    {t("signIn")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="py-16 sm:py-24 border-t border-border/40">
            <div className="mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                {t("howItWorks")}
              </h2>
              <p className="text-lg text-muted-foreground">
                3 simple steps to automated reminders
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Step 1 */}
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {t("step1Title")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("step1Description")}
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Settings className="h-6 w-6" />
                </div>
                <div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {t("step2Title")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("step2Description")}
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Bell className="h-6 w-6" />
                </div>
                <div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {t("step3Title")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("step3Description")}
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="py-16 sm:py-24 border-t border-border/40">
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Ready to get started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start sending automated SMS reminders today
              </p>
              <Link href="/sign-up">
                <Button size="lg" className="h-12 px-8">
                  {t("getStarted")} - It's Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
              <span>{t("copyright")}</span>
              <span>•</span>
              <span>v{APP_VERSION}</span>
              <span>•</span>
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                {t("privacy")}
              </Link>
              <span>•</span>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors"
              >
                {t("terms")}
              </Link>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </footer>
    </div>
  );
}
