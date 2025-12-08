"use client";

import Link from "next/link";
import {
  ArrowRight,
  Upload,
  Settings,
  Bell,
  Check,
  Star,
  Zap,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { AppLogo } from "@/components/app-logo";
import { LandingFooter } from "@/components/landing-footer";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <AppLogo />
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
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Bell className="h-3 w-3" />
                  {t("slogan")}
                </div>
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

              {/* Visual Element */}
              <div className="hidden lg:block">
                <div className="relative">
                  {/* Background decoration */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-3xl" />

                  {/* Mock phone/dashboard preview */}
                  <div className="relative bg-card border border-border/40 rounded-2xl p-6 shadow-xl">
                    <div className="space-y-4">
                      {/* Mock client row 1 */}
                      <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            JD
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="h-3 w-24 bg-foreground/80 rounded mb-2" />
                          <div className="h-2 w-32 bg-muted-foreground/50 rounded" />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                          <Bell className="h-3 w-3 text-primary" />
                          <div className="h-2 w-8 bg-primary/50 rounded" />
                        </div>
                      </div>

                      {/* Mock client row 2 */}
                      <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            MS
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="h-3 w-28 bg-foreground/80 rounded mb-2" />
                          <div className="h-2 w-36 bg-muted-foreground/50 rounded" />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <div className="h-2 w-8 bg-green-500/50 rounded" />
                        </div>
                      </div>

                      {/* Mock client row 3 */}
                      <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            AL
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="h-3 w-20 bg-foreground/80 rounded mb-2" />
                          <div className="h-2 w-28 bg-muted-foreground/50 rounded" />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                          <Bell className="h-3 w-3 text-primary" />
                          <div className="h-2 w-8 bg-primary/50 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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

          {/* Pricing Section */}
          <div className="py-16 sm:py-24 border-t border-border/40">
            <div className="mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                {t("pricingTitle")}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t("pricingSubtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Free Plan */}
              <div className="relative bg-card border border-border/40 rounded-2xl p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Star className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("planFree")}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">€0</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  {t("planFreeDescription")}
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{t("planFreeFeature1")}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{t("planFreeFeature2")}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{t("planFreeFeature3")}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{t("planFreeFeature4")}</span>
                  </li>
                </ul>
                <Link href="/sign-up" className="block">
                  <Button variant="outline" className="w-full">
                    {t("getStarted")}
                  </Button>
                </Link>
              </div>

              {/* Starter Plan */}
              <div className="relative bg-card border-2 border-primary rounded-2xl p-6">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  {t("popular")}
                </div>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("planStarter")}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">€5</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  {t("planStarterDescription")}
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{t("planStarterFeature1")}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{t("planStarterFeature2")}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{t("planStarterFeature3")}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{t("planStarterFeature4")}</span>
                  </li>
                </ul>
                <Link href="/sign-up" className="block">
                  <Button className="w-full">{t("getStarted")}</Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="relative bg-card border border-border/40 rounded-2xl p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Crown className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("planPro")}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">€15</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  {t("planProDescription")}
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{t("planProFeature1")}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{t("planProFeature2")}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{t("planProFeature3")}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{t("planProFeature4")}</span>
                  </li>
                </ul>
                <Link href="/sign-up" className="block">
                  <Button variant="outline" className="w-full">
                    {t("getStarted")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="py-16 sm:py-24 border-t border-border/40">
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                {t("readyToStart")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t("readyToStartSubtitle")}
              </p>
              <Link href="/sign-up">
                <Button size="lg" className="h-12 px-8">
                  {t("getStartedFree")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
