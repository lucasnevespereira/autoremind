import twilio from "twilio";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getTwilioConfig() {
  const configs = await db.select().from(settings);

  const accountSid = configs.find((c) => c.key === "twilio_account_sid")?.value;
  const authToken = configs.find((c) => c.key === "twilio_auth_token")?.value;
  const phoneNumber = configs.find(
    (c) => c.key === "twilio_phone_number"
  )?.value;

  return { accountSid, authToken, phoneNumber };
}

export async function sendSMS(to: string, message: string) {
  try {
    const { accountSid, authToken, phoneNumber } = await getTwilioConfig();

    if (!accountSid || !authToken || !phoneNumber) {
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

    let errorMessage = error instanceof Error ? error.message : "Erro desconhecido";

    // Provide more helpful error messages for common Twilio errors
    if (errorMessage.includes("not a valid")) {
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
