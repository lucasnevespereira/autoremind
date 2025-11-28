"use server";

import { db } from "@/db";
import { clients, settings } from "@/db/schema";
import { sendSMS, formatPortuguesePhone } from "@/lib/twilio";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export async function addClient(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const car = formData.get("car") as string;
    const revisionDate = formData.get("revisionDate") as string;

    if (!name || !phone || !car || !revisionDate) {
      return { success: false, error: "Todos os campos são obrigatórios" };
    }

    const formattedPhone = formatPortuguesePhone(phone);

    await db.insert(clients).values({
      name,
      phone: formattedPhone,
      car,
      revisionDate: new Date(revisionDate),
      reminderSent: false,
    });

    revalidatePath("/");
    return { success: true, message: "Cliente adicionado com sucesso!" };
  } catch (error) {
    console.error("Erro ao adicionar cliente:", error);
    return { success: false, error: "Erro ao adicionar cliente" };
  }
}

export async function updateClient(id: number, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const car = formData.get("car") as string;
    const revisionDate = formData.get("revisionDate") as string;

    if (!name || !phone || !car || !revisionDate) {
      return { success: false, error: "All fields are required" };
    }

    const formattedPhone = formatPortuguesePhone(phone);

    await db
      .update(clients)
      .set({
        name,
        phone: formattedPhone,
        car,
        revisionDate: new Date(revisionDate),
      })
      .where(eq(clients.id, id));

    revalidatePath("/");
    return { success: true, message: "Client updated successfully!" };
  } catch (error) {
    console.error("Error updating client:", error);
    return { success: false, error: "Error updating client" };
  }
}

export async function deleteClient(id: number) {
  try {
    await db.delete(clients).where(eq(clients.id, id));
    revalidatePath("/");
    return { success: true, message: "Cliente eliminado com sucesso!" };
  } catch (error) {
    console.error("Erro ao eliminar cliente:", error);
    return { success: false, error: "Erro ao eliminar cliente" };
  }
}

export async function saveTwilioConfig(formData: FormData) {
  try {
    const accountSid = formData.get("accountSid") as string;
    const authToken = formData.get("authToken") as string;
    const phoneNumber = formData.get("phoneNumber") as string;

    if (!accountSid || !authToken || !phoneNumber) {
      return { success: false, error: "Todos os campos são obrigatórios" };
    }

    const configs = [
      { key: "twilio_account_sid", value: accountSid },
      { key: "twilio_auth_token", value: authToken },
      { key: "twilio_phone_number", value: phoneNumber },
    ];

    for (const config of configs) {
      const exists = await db
        .select()
        .from(settings)
        .where(eq(settings.key, config.key));

      if (exists.length > 0) {
        await db
          .update(settings)
          .set({ value: config.value, updatedAt: new Date() })
          .where(eq(settings.key, config.key));
      } else {
        await db.insert(settings).values(config);
      }
    }

    revalidatePath("/configuracoes");
    return { success: true, message: "Configurações guardadas com sucesso!" };
  } catch (error) {
    console.error("Erro ao guardar configurações:", error);
    return { success: false, error: "Erro ao guardar configurações" };
  }
}

export async function sendTestSMS(phone: string) {
  try {
    const formattedPhone = formatPortuguesePhone(phone);
    const result = await sendSMS(
      formattedPhone,
      "Este é um SMS de teste do AutoRemind PT. Tudo a funcionar! 🚗"
    );

    if (result.success) {
      return { success: true, message: "SMS de teste enviado com sucesso!" };
    } else {
      return { success: false, error: result.error || "Erro ao enviar SMS" };
    }
  } catch (error) {
    console.error("Erro ao enviar SMS de teste:", error);
    return { success: false, error: "Erro ao enviar SMS de teste" };
  }
}

export async function sendManualReminder(clientId: number) {
  try {
    const client = await db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId));

    if (client.length === 0) {
      return { success: false, error: "Cliente não encontrado" };
    }

    const c = client[0];
    const formattedDate = format(c.revisionDate, "dd/MM/yyyy", { locale: pt });

    const message = `Olá ${c.name}, a revisão do seu ${c.car} está marcada para ${formattedDate}. Contacte a oficina para marcar o dia. Obrigado!`;

    const result = await sendSMS(c.phone, message);

    if (result.success) {
      await db
        .update(clients)
        .set({ reminderSent: true })
        .where(eq(clients.id, clientId));

      revalidatePath("/");
      return { success: true, message: "Lembrete enviado com sucesso!" };
    } else {
      return {
        success: false,
        error: result.error || "Erro ao enviar lembrete",
      };
    }
  } catch (error) {
    console.error("Erro ao enviar lembrete:", error);
    return { success: false, error: "Erro ao enviar lembrete" };
  }
}
