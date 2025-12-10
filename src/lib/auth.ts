import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const auth = betterAuth({
  allowedOrigins: [
    "https://autoremind.app",
    "https://www.autoremind.app",
    "http://localhost:3000",
    "https://autoremind.vercel.app",
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      console.log("[Password Reset] Attempting to send email to:", user.email);
      console.log("[Password Reset] Reset URL:", url);

      if (!resend) {
        console.error(
          "[Password Reset] Resend not configured - RESEND_API_KEY missing"
        );
        return;
      }

      try {
        const result = await resend.emails.send({
          from: "AutoRemind <noreply@autoremind.app>",
          to: user.email,
          subject: "Reset your password - AutoRemind",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Reset Your Password</h2>
              <p>Hi ${user.name},</p>
              <p>You requested to reset your password. Click the button below to create a new password:</p>
              <p style="margin: 30px 0;">
                <a href="${url}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                  Reset Password
                </a>
              </p>
              <p style="color: #666; font-size: 14px;">
                If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.
              </p>
              <p style="color: #666; font-size: 14px;">
                Or copy and paste this link into your browser:<br/>
                <a href="${url}" style="color: #0070f3;">${url}</a>
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="color: #999; font-size: 12px;">AutoRemind - Easy reminders for busy professionals</p>
            </div>
          `,
        });
        console.log("[Password Reset] Email sent successfully:", result);
      } catch (error) {
        console.error("[Password Reset] Failed to send email:", error);
      }
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  advanced: {
    cookiePrefix: "autoremind",
  },
});

export type Session = {
  session: typeof auth.$Infer.Session.session;
  user: typeof auth.$Infer.Session.user;
};
