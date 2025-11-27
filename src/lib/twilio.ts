import twilio from "twilio";
import { db } from "@/db";
import { configuracoes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function obterConfigTwilio() {
  const configs = await db
    .select()
    .from(configuracoes)
    .where(eq(configuracoes.chave, "twilio_account_sid"));

  const accountSid = configs.find((c) => c.chave === "twilio_account_sid")?.valor;
  const authToken = configs.find((c) => c.chave === "twilio_auth_token")?.valor;
  const phoneNumber = configs.find((c) => c.chave === "twilio_phone_number")?.valor;

  return { accountSid, authToken, phoneNumber };
}

export async function enviarSMS(para: string, mensagem: string) {
  try {
    const { accountSid, authToken, phoneNumber } = await obterConfigTwilio();

    if (!accountSid || !authToken || !phoneNumber) {
      throw new Error("Configurações do Twilio não encontradas. Configure nas Definições.");
    }

    const client = twilio(accountSid, authToken);

    const message = await client.messages.create({
      body: mensagem,
      from: phoneNumber,
      to: para,
    });

    return { sucesso: true, messageId: message.sid };
  } catch (error) {
    console.error("Erro ao enviar SMS:", error);
    return {
      sucesso: false,
      erro: error instanceof Error ? error.message : "Erro desconhecido"
    };
  }
}

export function formatarTelefonePortugues(telefone: string): string {
  // Remove todos os caracteres que não são dígitos
  const digitos = telefone.replace(/\D/g, "");

  // Se já começa com 351, retorna com +
  if (digitos.startsWith("351")) {
    return `+${digitos}`;
  }

  // Se começa com 9 e tem 9 dígitos, adiciona +351
  if (digitos.startsWith("9") && digitos.length === 9) {
    return `+351${digitos}`;
  }

  // Caso contrário, retorna como está (pode ser internacional)
  return `+${digitos}`;
}
