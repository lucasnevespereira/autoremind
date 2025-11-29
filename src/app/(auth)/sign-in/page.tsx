import { SignInForm } from "@/components/auth/sign-in-form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo and Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-5 shadow-fintech-md">
            <svg className="w-7 h-7 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
            AutoRemind
          </h1>
          <p className="text-muted-foreground text-sm">
            Maintenance reminder system
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl border border-border/40 p-8 shadow-fintech-lg">
          <h2 className="text-2xl font-bold text-foreground mb-6">Sign In</h2>
          <SignInForm />

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-primary font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
