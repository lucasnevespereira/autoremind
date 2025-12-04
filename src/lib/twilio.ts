import twilio from "twilio";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getTwilioConfig(userId: string) {
  const configs = await db
    .select()
    .from(settings)
    .where(eq(settings.userId, userId));

  const accountSid = configs.find((c) => c.key === "twilio_account_sid")?.value?.trim();
  const authToken = configs.find((c) => c.key === "twilio_auth_token")?.value?.trim();
  const apiKeySid = configs.find((c) => c.key === "twilio_api_key_sid")?.value?.trim();
  const apiKeySecret = configs.find((c) => c.key === "twilio_api_key_secret")?.value?.trim();
  const phoneNumber = configs.find(
    (c) => c.key === "twilio_phone_number"
  )?.value?.trim();

  return { accountSid, authToken, apiKeySid, apiKeySecret, phoneNumber };
}

export async function sendSMS(to: string, message: string, userId: string) {
  try {
    const { accountSid, authToken, apiKeySid, apiKeySecret, phoneNumber } = await getTwilioConfig(userId);

    if (!phoneNumber) {
      throw new Error("Phone number not configured");
    }

    // Use API Key if available, otherwise use Auth Token
    let client;
    if (apiKeySid && apiKeySecret && accountSid) {
      client = twilio(apiKeySid, apiKeySecret, { accountSid });
    } else if (accountSid && authToken) {
      client = twilio(accountSid, authToken);
    } else {
      throw new Error(
        "Configurações do Twilio não encontradas. Configure nas Definições."
      );
    }

    const messageResponse = await client.messages.create({
      body: message,
      from: phoneNumber,
      to: to,
    });

    return { success: true, messageId: messageResponse.sid };
  } catch (error: any) {
    console.error("Erro ao enviar SMS:", error);

    let errorMessage = error instanceof Error ? error.message : "Erro desconhecido";

    // Provide more helpful error messages for common Twilio errors
    if (error.code === 20003 || errorMessage.includes("Authenticate")) {
      errorMessage = "Authentication failed. Please verify your Twilio Account SID and Auth Token in Settings. Make sure you're using live credentials (not test credentials) from https://console.twilio.com/";
    } else if (errorMessage.includes("not a valid")) {
      errorMessage = "The 'From' phone number must be a valid Twilio number you purchased. Check your Twilio console.";
    } else if (errorMessage.includes("trial") || errorMessage.includes("Trial")) {
      errorMessage = "Trial accounts can only send to verified numbers. Verify the destination number in Twilio console or upgrade your account.";
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export function formatPhone(phone: string): string {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, "");

  // 00XX → +XX
  if (cleaned.startsWith("00")) {
    cleaned = "+" + cleaned.slice(2);
  }

  // Already has +, return as is
  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  // If starts with known country codes (351, 33, 41), add +
  if (cleaned.startsWith("351") || cleaned.startsWith("33") || cleaned.startsWith("41")) {
    return `+${cleaned}`;
  }

  // Detect country by mobile prefix patterns
  // French mobile: 06 or 07 or 09 (10 digits total with leading 0)
  if (/^0[6-7,9]\d{8}$/.test(cleaned)) {
    return "+33" + cleaned.slice(1); // Remove leading 0 and add +33
  }

  // Swiss mobile: 079 or 078 or 077 or 076 (10 digits total with leading 0)
  if (/^07[6-9]\d{7}$/.test(cleaned)) {
    return "+41" + cleaned.slice(1); // Remove leading 0 and add +41
  }

  // Portuguese mobile: 91, 92, 93, 96 (9 digits)
  if (/^9[1-3,6]\d{7}$/.test(cleaned)) {
    return `+351${cleaned}`;
  }

  // Default: assume it's complete and add +
  return `+${cleaned}`;
}
