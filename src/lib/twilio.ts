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

export function formatPortuguesePhone(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // If starts with 351, return with +
  if (digits.startsWith("351")) {
    return `+${digits}`;
  }

  // If starts with 9 and has 9 digits, add +351
  if (digits.startsWith("9") && digits.length === 9) {
    return `+351${digits}`;
  }

  // Otherwise, return as is (might be international)
  return `+${digits}`;
}
