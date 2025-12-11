import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const EMAIL_FROM = "AutoRemind <noreply@autoremind.app>";

// AutoRemind brand colors
const BRAND = {
  primary: "#6366f1", // Indigo - matches --primary: 239 84% 67%
  primaryDark: "#4f46e5",
  background: "#ffffff",
  foreground: "#0a0a0a",
  muted: "#737373",
  border: "#e5e5e5",
  success: "#22c55e",
};

function getEmailLayout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AutoRemind</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: ${BRAND.background}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px; text-align: center; border-bottom: 1px solid ${BRAND.border};">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="vertical-align: middle;">
                    <span style="font-size: 24px; font-weight: 700; color: ${BRAND.foreground}; letter-spacing: -0.5px;">AutoRemind</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; border-top: 1px solid ${BRAND.border};">
              <p style="margin: 0; font-size: 13px; color: ${BRAND.muted}; text-align: center;">
                AutoRemind - Easy reminders for busy professionals
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: ${BRAND.muted}; text-align: center;">
                <a href="https://autoremind.app" style="color: ${BRAND.primary}; text-decoration: none;">autoremind.app</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function getButton(text: string, url: string): string {
  return `
    <table role="presentation" style="margin: 32px auto;">
      <tr>
        <td style="border-radius: 12px; background: linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 100%);">
          <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 12px;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `;
}

export function getPasswordResetEmailHtml(
  userName: string,
  resetUrl: string
): string {
  const content = `
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: ${
      BRAND.foreground
    }; text-align: center;">
      Reset Your Password
    </h1>
    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: ${
      BRAND.muted
    }; text-align: center;">
      Hi ${userName}, we received a request to reset your password.
    </p>

    ${getButton("Reset Password", resetUrl)}

    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: ${
      BRAND.muted
    }; text-align: center;">
      This link will expire in <strong style="color: ${
        BRAND.foreground
      };">1 hour</strong>.
    </p>
    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: ${
      BRAND.muted
    }; text-align: center;">
      If you didn't request this, you can safely ignore this email.
    </p>

    <div style="padding: 16px; background-color: #f5f5f5; border-radius: 8px; margin-top: 24px;">
      <p style="margin: 0 0 8px 0; font-size: 12px; color: ${BRAND.muted};">
        Or copy and paste this link into your browser:
      </p>
      <p style="margin: 0; font-size: 12px; word-break: break-all;">
        <a href="${resetUrl}" style="color: ${
    BRAND.primary
  }; text-decoration: none;">${resetUrl}</a>
      </p>
    </div>
  `;

  return getEmailLayout(content);
}

export async function sendPasswordResetEmail(
  to: string,
  userName: string,
  resetUrl: string
): Promise<{ success: boolean; error?: string }> {
  console.log("[Password Reset] Attempting to send email to:", to);

  if (!resend) {
    console.error(
      "[Password Reset] Resend not configured - RESEND_API_KEY missing"
    );
    return { success: false, error: "Email service not configured" };
  }

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: "Reset your password - AutoRemind",
      html: getPasswordResetEmailHtml(userName, resetUrl),
    });

    console.log("[Password Reset] Email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("[Password Reset] Failed to send email:", error);
    return { success: false, error: String(error) };
  }
}
