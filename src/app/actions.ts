"use server";

import { db } from "@/db";
import { clients, settings } from "@/db/schema";
import { sendSMS, formatPortuguesePhone } from "@/lib/twilio";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function addClient(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const car = formData.get("car") as string;
    const revisionDate = formData.get("revisionDate") as string;

    if (!name || !phone || !car || !revisionDate) {
      return { success: false, error: "Todos os campos são obrigatórios" };
    }

    const formattedPhone = formatPortuguesePhone(phone);

    await db.insert(clients).values({
      userId: session.user.id,
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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const car = formData.get("car") as string;
    const revisionDate = formData.get("revisionDate") as string;

    if (!name || !phone || !car || !revisionDate) {
      return { success: false, error: "All fields are required" };
    }

    const formattedPhone = formatPortuguesePhone(phone);
    const newRevisionDate = new Date(revisionDate);

    // Get the existing client to check if date changed
    const existingClient = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, id), eq(clients.userId, session.user.id)));

    if (existingClient.length === 0) {
      return { success: false, error: "Client not found" };
    }

    // Check if revision date has changed
    const dateChanged =
      existingClient[0].revisionDate.getTime() !== newRevisionDate.getTime();

    // Reset reminderSent if date changed, so a new reminder can be sent
    await db
      .update(clients)
      .set({
        name,
        phone: formattedPhone,
        car,
        revisionDate: newRevisionDate,
        ...(dateChanged && { reminderSent: false }),
      })
      .where(and(eq(clients.id, id), eq(clients.userId, session.user.id)));

    revalidatePath("/");
    return { success: true, message: "Client updated successfully!" };
  } catch (error) {
    console.error("Error updating client:", error);
    return { success: false, error: "Error updating client" };
  }
}

export async function deleteClient(id: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .delete(clients)
      .where(and(eq(clients.id, id), eq(clients.userId, session.user.id)));
    revalidatePath("/");
    return { success: true, message: "Cliente eliminado com sucesso!" };
  } catch (error) {
    console.error("Erro ao eliminar cliente:", error);
    return { success: false, error: "Erro ao eliminar cliente" };
  }
}

export async function saveTwilioConfig(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const accountSid = formData.get("accountSid") as string;
    const authToken = formData.get("authToken") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const garageName = formData.get("garageName") as string;
    const smsTemplate = formData.get("smsTemplate") as string;

    // Build configs array only with non-empty values
    const configs = [];

    if (accountSid?.trim()) {
      configs.push({ key: "twilio_account_sid", value: accountSid.trim() });
    }
    if (authToken?.trim()) {
      configs.push({ key: "twilio_auth_token", value: authToken.trim() });
    }
    if (phoneNumber?.trim()) {
      configs.push({ key: "twilio_phone_number", value: phoneNumber.trim() });
    }
    if (garageName?.trim()) {
      configs.push({ key: "garage_name", value: garageName.trim() });
    }
    if (smsTemplate?.trim()) {
      configs.push({ key: "sms_template", value: smsTemplate.trim() });
    }

    // At least one field must be provided
    if (configs.length === 0) {
      return { success: false, error: "At least one field must be provided" };
    }

    for (const config of configs) {
      const exists = await db
        .select()
        .from(settings)
        .where(
          and(
            eq(settings.key, config.key),
            eq(settings.userId, session.user.id)
          )
        );

      if (exists.length > 0) {
        await db
          .update(settings)
          .set({ value: config.value, updatedAt: new Date() })
          .where(
            and(
              eq(settings.key, config.key),
              eq(settings.userId, session.user.id)
            )
          );
      } else {
        await db.insert(settings).values({
          userId: session.user.id,
          ...config,
        });
      }
    }

    revalidatePath("/configuracoes");
    return { success: true, message: "Settings saved successfully!" };
  } catch (error) {
    console.error("Error saving settings:", error);
    return { success: false, error: "Error saving settings" };
  }
}

export async function sendTestSMS(phone: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await sendSMS(
      phone,
      "Este é um SMS de teste do AutoRemind. Tudo a funcionar! 🚗",
      session.user.id
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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const client = await db
      .select()
      .from(clients)
      .where(
        and(eq(clients.id, clientId), eq(clients.userId, session.user.id))
      );

    if (client.length === 0) {
      return { success: false, error: "Client not found" };
    }

    const c = client[0];

    // Get SMS template and garage name from settings for this user
    const configs = await db
      .select()
      .from(settings)
      .where(eq(settings.userId, session.user.id));
    const garageName =
      configs.find((config) => config.key === "garage_name")?.value ||
      "Auto Service";
    const smsTemplate =
      configs.find((config) => config.key === "sms_template")?.value ||
      "Hello {client_name}, your {vehicle} is scheduled for maintenance on {date}. Please contact {garage_name} to confirm. Thank you!";

    const formattedDate = format(c.revisionDate, "dd/MM/yyyy", { locale: pt });

    // Replace variables in template
    const message = smsTemplate
      .replace(/{client_name}/g, c.name)
      .replace(/{vehicle}/g, c.car)
      .replace(/{date}/g, formattedDate)
      .replace(/{garage_name}/g, garageName);

    const result = await sendSMS(c.phone, message, session.user.id);

    if (result.success) {
      await db
        .update(clients)
        .set({ reminderSent: true })
        .where(
          and(eq(clients.id, clientId), eq(clients.userId, session.user.id))
        );

      revalidatePath("/");
      return { success: true, message: "Reminder sent successfully!" };
    } else {
      return {
        success: false,
        error: result.error || "Error sending reminder",
      };
    }
  } catch (error) {
    console.error("Error sending reminder:", error);
    return { success: false, error: "Error sending reminder" };
  }
}
