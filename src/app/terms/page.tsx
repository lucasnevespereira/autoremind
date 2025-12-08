import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logoSquare from "@/assets/logo-square.png";
import { LandingFooter } from "@/components/landing-footer";

export const metadata = {
  title: "Terms of Service | AutoRemind",
  description: "Terms of Service for AutoRemind",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-fintech">
              <Image
                src={logoSquare}
                alt="AutoRemind Logo"
                width={32}
                height={32}
                priority
              />
            </div>
            <span className="text-xl font-semibold tracking-tight">
              AutoRemind
            </span>
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
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Last updated: December 2024
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground">
                By accessing and using AutoRemind ("the Service"), you accept
                and agree to be bound by these Terms of Service. If you do not
                agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                2. Description of Service
              </h2>
              <p className="text-muted-foreground">
                AutoRemind is an automated SMS reminder service designed to help
                businesses send appointment reminders to their clients. The
                Service allows you to schedule, manage, and send SMS
                notifications to your client list.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                3. User Responsibilities
              </h2>
              <p className="text-muted-foreground mb-2">
                As a user of AutoRemind, you agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  Provide accurate and complete information when creating your
                  account
                </li>
                <li>Maintain the security of your account credentials</li>
                <li>
                  Only send SMS reminders to clients who have consented to
                  receive them
                </li>
                <li>
                  Comply with all applicable laws and regulations, including
                  telecommunications and anti-spam laws
                </li>
                <li>
                  Not use the Service for any illegal or unauthorized purpose
                </li>
                <li>
                  Not transmit spam, malware, or any harmful content through the
                  Service
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                4. Subscription Plans and Billing
              </h2>
              <p className="text-muted-foreground mb-2">
                AutoRemind offers multiple subscription plans:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>Free Plan:</strong> Up to 50 clients, requires your
                  own Twilio account
                </li>
                <li>
                  <strong>Starter Plan (€5/month):</strong> Up to 100 clients,
                  managed SMS included
                </li>
                <li>
                  <strong>Pro Plan (€15/month):</strong> Unlimited clients,
                  managed SMS included
                </li>
              </ul>
              <p className="text-muted-foreground mt-2">
                All paid subscriptions are billed monthly. You may cancel your
                subscription at any time, and you will continue to have access
                until the end of your current billing period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Payments</h2>
              <p className="text-muted-foreground">
                All payments are processed securely through Stripe. By
                subscribing to a paid plan, you authorize us to charge your
                payment method on a recurring basis. If payment fails, we may
                suspend your access to paid features until payment is received.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Refund Policy</h2>
              <p className="text-muted-foreground">
                We offer a 14-day money-back guarantee for first-time
                subscribers. If you are not satisfied with the Service within
                the first 14 days of your subscription, contact us for a full
                refund. Refunds are not available for renewals or subsequent
                billing periods.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                7. SMS Delivery and Limitations
              </h2>
              <p className="text-muted-foreground">
                While we strive for reliable SMS delivery, we cannot guarantee
                100% delivery rates. Factors affecting delivery include carrier
                restrictions, phone number validity, and network conditions. We
                are not responsible for SMS delivery failures outside of our
                control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                8. Third-Party Services
              </h2>
              <p className="text-muted-foreground">
                The Service relies on third-party providers, including Twilio
                for SMS delivery and Stripe for payment processing. You
                acknowledge that these third-party services have their own terms
                and conditions, which you must also comply with.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                9. Intellectual Property
              </h2>
              <p className="text-muted-foreground">
                All content, features, and functionality of AutoRemind,
                including but not limited to text, graphics, logos, and
                software, are owned by AutoRemind and are protected by
                intellectual property laws. You may not copy, modify,
                distribute, or reverse engineer any part of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                10. Limitation of Liability
              </h2>
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, AutoRemind shall not be
                liable for any indirect, incidental, special, or consequential
                damages arising out of or related to your use of the Service.
                Our total liability shall not exceed the amount you paid for the
                Service in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                11. Service Availability
              </h2>
              <p className="text-muted-foreground">
                We aim to provide 99.9% uptime but do not guarantee
                uninterrupted access to the Service. We may perform maintenance,
                updates, or experience outages that temporarily affect
                availability. We will provide notice of scheduled maintenance
                when possible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">12. Termination</h2>
              <p className="text-muted-foreground">
                We reserve the right to suspend or terminate your account if you
                violate these Terms of Service, engage in fraudulent activity,
                or use the Service in a manner that harms others. You may
                terminate your account at any time by contacting us or canceling
                your subscription through the billing portal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                13. Changes to Terms
              </h2>
              <p className="text-muted-foreground">
                We may modify these Terms of Service at any time. We will notify
                you of significant changes by email or through the Service.
                Continued use of the Service after changes constitutes
                acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">14. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms of Service are governed by and construed in
                accordance with the laws of Portugal. Any disputes arising from
                these terms shall be resolved in the courts of Portugal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">15. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please
                contact us at:{" "}
                <a
                  href="mailto:support@autoremind.app"
                  className="text-primary hover:underline"
                >
                  support@autoremind.app
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
