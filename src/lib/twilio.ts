import twilio from "twilio";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { decrypt } from "./encryption";

export async function getTwilioConfig(userId: string) {
  const userSettings = await db.query.settings.findFirst({
    where: eq(settings.userId, userId),
  });

  const accountSid = userSettings?.twilioAccountSid?.trim();
  // Decrypt the auth token before using it
  const authToken = userSettings?.twilioAuthToken
    ? decrypt(userSettings.twilioAuthToken).trim()
    : undefined;
  const phoneNumber = userSettings?.twilioPhoneNumber?.trim();

  return { accountSid, authToken, phoneNumber };
}

export async function sendSMS(to: string, message: string, userId: string) {
  try {
    const { accountSid, authToken, phoneNumber } = await getTwilioConfig(
      userId
    );

    if (!phoneNumber) {
      throw new Error("Phone number not configured");
    }

    if (!accountSid || !authToken) {
      throw new Error(
        "Configurações do Twilio não encontradas. Configure nas Definições."
      );
    }

    const client = twilio(accountSid, authToken);

    const messageResponse = await client.messages.create({
      body: message,
      from: phoneNumber,
      to: to,
    });

    return { success: true, messageId: messageResponse.sid };
  } catch (error: any) {
    console.error("Erro ao enviar SMS:", error);

    let errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    // Provide more helpful error messages for common Twilio errors
    if (error.code === 20003 || errorMessage.includes("Authenticate")) {
      errorMessage =
        "Authentication failed. Please verify your Twilio Account SID and Auth Token in Settings. Make sure you're using live credentials (not test credentials) from https://console.twilio.com/";
    } else if (errorMessage.includes("not a valid")) {
      errorMessage =
        "The 'From' phone number must be a valid Twilio number you purchased. Check your Twilio console.";
    } else if (
      errorMessage.includes("trial") ||
      errorMessage.includes("Trial")
    ) {
      errorMessage =
        "Trial accounts can only send to verified numbers. Verify the destination number in Twilio console or upgrade your account.";
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export function formatPhone(phone: string): string {
  const SUPPORTED_CODES = [
    "+351",
    "+33",
    "+41",
    "+44",
    "+49",
    "+34",
    "+39",
    "+1",
  ];

  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, "");

  // Handle 00XX international prefix → +XX
  if (cleaned.startsWith("00")) {
    cleaned = "+" + cleaned.slice(2);
  }

  // Already in E.164 format with +
  if (cleaned.startsWith("+") && /^\+\d{7,15}$/.test(cleaned)) {
    return cleaned;
  }

  // Country-specific patterns with leading 0 (national format)
  // Priority order matters - check most specific patterns first
  // IMPORTANT: Check these BEFORE country code matching to avoid false positives

  // Swiss mobile: 074-079 (10 digits total: 0 + 9 digits)
  // Must check BEFORE French to avoid 07X being matched as French
  if (/^07[4-9]\d{7}$/.test(cleaned)) {
    return "+41" + cleaned.slice(1); // Remove leading 0, add +41
  }

  // French mobile: 06, 07, 09 (10 digits total with leading 0)
  if (/^0[6-7,9]\d{8}$/.test(cleaned)) {
    return "+33" + cleaned.slice(1); // Remove leading 0, add +33
  }

  // Missing '+' but starts with a known country code (without +)
  // Check for FULL country codes with proper length validation
  // Order matters: Check longer prefixes first (351 before 33)
  if (cleaned.startsWith("351") && cleaned.length === 12) {
    return "+" + cleaned;
  }
  if (cleaned.startsWith("44") && cleaned.length === 13) {
    return "+" + cleaned;
  }
  if (cleaned.startsWith("49") && cleaned.length >= 13) {
    return "+" + cleaned;
  }
  if (cleaned.startsWith("41") && cleaned.length === 11) {
    return "+" + cleaned;
  }
  if (
    cleaned.startsWith("39") &&
    cleaned.length >= 11 &&
    cleaned.length <= 13
  ) {
    return "+" + cleaned;
  }
  if (cleaned.startsWith("34") && cleaned.length === 11) {
    return "+" + cleaned;
  }
  if (cleaned.startsWith("33") && cleaned.length === 11) {
    return "+" + cleaned;
  }
  if (cleaned.startsWith("1") && cleaned.length === 11) {
    return "+" + cleaned;
  }

  // UK mobile: 07 (11 digits total with leading 0)
  if (/^07\d{9}$/.test(cleaned)) {
    return "+44" + cleaned.slice(1); // Remove leading 0, add +44
  }

  // German mobile: 015, 016, 017 (11-12 digits total with leading 0)
  if (/^0(15|16|17)\d{8,9}$/.test(cleaned)) {
    return "+49" + cleaned.slice(1); // Remove leading 0, add +49
  }

  // Italian mobile: 3XX (10 digits total with leading 3, no leading 0)
  if (/^3\d{8,9}$/.test(cleaned)) {
    return "+39" + cleaned;
  }

  // Spanish mobile: 6, 7 (9 digits total, no leading 0)
  // Note: This is valid Spanish format, but could be confused with French if Excel drops leading 0
  if (/^[67]\d{8}$/.test(cleaned)) {
    // Check if it could be French (06/07 with dropped 0) or Spanish
    // Default to French as it's more likely Excel dropped the 0
    return "+33" + cleaned;
  }

  // Portuguese mobile: 91, 92, 93, 96 (9 digits, no leading 0)
  if (/^9[1-3,6]\d{7}$/.test(cleaned)) {
    return "+351" + cleaned;
  }

  // US/Canada: 10 digits (no leading 0 or 1)
  if (/^\d{10}$/.test(cleaned)) {
    return "+1" + cleaned;
  }

  // Generic: any 9-digit number without prefix → assume Portugal
  if (/^\d{9}$/.test(cleaned)) {
    return "+351" + cleaned;
  }

  // If we can't determine format, add + and return (might need manual correction)
  return cleaned.startsWith("+") ? cleaned : "+" + cleaned;
}
