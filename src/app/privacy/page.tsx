import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingFooter } from "@/components/landing-footer";
import { AppLogo } from "@/components/app-logo";

export const metadata = {
  title: "Privacy Policy | AutoRemind",
  description: "Privacy Policy for AutoRemind",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <AppLogo />
          </Link>
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl h-9 px-4 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Last updated: December 2025
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground">
                AutoRemind, operated by Lucas Neves Pereira (&ldquo;we&rdquo;,
                &ldquo;our&rdquo;, or &ldquo;us&rdquo;), is committed to
                protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                use our automated SMS reminder service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                2. Information We Collect
              </h2>
              <p className="text-muted-foreground mb-2">
                We collect information that you provide directly to us,
                including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Account information (name, email address, password)</li>
                <li>Business information (business name, contact details)</li>
                <li>
                  Client information (names, phone numbers, appointment dates)
                </li>
                <li>Payment information (processed securely via Stripe)</li>
                <li>
                  SMS provider credentials (if using your own Twilio account)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                3. How We Use Your Information
              </h2>
              <p className="text-muted-foreground mb-2">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Send SMS reminders to your clients</li>
                <li>Process payments and manage subscriptions</li>
                <li>
                  Communicate with you about your account and our services
                </li>
                <li>Ensure the security and integrity of our platform</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational security
                measures to protect your personal information. All data is
                encrypted in transit and at rest. However, no method of
                transmission over the internet is 100% secure, and we cannot
                guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your information for as long as your account is active
                or as needed to provide you services. If you wish to delete your
                account, please contact us, and we will delete your data within
                30 days, except where we are required to retain it for legal
                purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                6. Third-Party Services
              </h2>
              <p className="text-muted-foreground mb-2">
                We use the following third-party services:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Stripe for payment processing</li>
                <li>Twilio for SMS delivery (managed or user-provided)</li>
                <li>Vercel for hosting and infrastructure</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                These services have their own privacy policies, and we encourage
                you to review them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Your Rights</h2>
              <p className="text-muted-foreground mb-2">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Access, update, or delete your personal information</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to processing of your personal information</li>
                <li>Request restriction of processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                8. Changes to This Policy
              </h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &ldquo;Last updated&rdquo; date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please
                contact us at:{" "}
                <a
                  href="mailto:lnevespereira@proton.me"
                  className="text-primary hover:underline"
                >
                  lnevespereira@proton.me
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
