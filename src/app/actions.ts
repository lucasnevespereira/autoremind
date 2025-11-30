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
import ExcelJS from "exceljs";

export async function addClient(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, errorKey: "unauthorized" };
    }

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const car = formData.get("car") as string;
    const revisionDate = formData.get("revisionDate") as string;

    if (!name || !phone || !car || !revisionDate) {
      return { success: false, errorKey: "allFieldsRequired" };
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
    return { success: true, messageKey: "clientAddedSuccess" };
  } catch (error) {
    console.error("Erro ao adicionar cliente:", error);
    return { success: false, errorKey: "clientAddError" };
  }
}

export async function updateClient(id: number, formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, errorKey: "unauthorized" };
    }

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const car = formData.get("car") as string;
    const revisionDate = formData.get("revisionDate") as string;

    if (!name || !phone || !car || !revisionDate) {
      return { success: false, errorKey: "allFieldsRequired" };
    }

    const formattedPhone = formatPortuguesePhone(phone);
    const newRevisionDate = new Date(revisionDate);

    // Get the existing client to check if date changed
    const existingClient = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, id), eq(clients.userId, session.user.id)));

    if (existingClient.length === 0) {
      return { success: false, errorKey: "clientNotFound" };
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
    return { success: true, messageKey: "clientUpdatedSuccess" };
  } catch (error) {
    console.error("Error updating client:", error);
    return { success: false, errorKey: "clientUpdateError" };
  }
}

export async function deleteClient(id: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, errorKey: "unauthorized" };
    }

    await db
      .delete(clients)
      .where(and(eq(clients.id, id), eq(clients.userId, session.user.id)));
    revalidatePath("/");
    return { success: true, messageKey: "clientDeletedSuccess" };
  } catch (error) {
    console.error("Erro ao eliminar cliente:", error);
    return { success: false, errorKey: "clientDeleteError" };
  }
}

export async function saveTwilioConfig(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, errorKey: "unauthorized" };
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
      return { success: false, errorKey: "atLeastOneField" };
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

    revalidatePath("/settings");
    return { success: true, messageKey: "settingsSavedSuccess" };
  } catch (error) {
    console.error("Error saving settings:", error);
    return { success: false, errorKey: "settingsSaveError" };
  }
}

export async function sendTestSMS(phone: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, errorKey: "unauthorized" };
    }

    const result = await sendSMS(
      phone,
      "Este é um SMS de teste do AutoRemind. Tudo a funcionar! 🚗",
      session.user.id
    );

    if (result.success) {
      return { success: true, messageKey: "testSmsSentSuccess" };
    } else {
      return {
        success: false,
        errorKey: result.error ? "smsError" : "smsError",
      };
    }
  } catch (error) {
    console.error("Erro ao enviar SMS de teste:", error);
    return { success: false, errorKey: "testSmsError" };
  }
}

export async function sendManualReminder(clientId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, errorKey: "unauthorized" };
    }

    const client = await db
      .select()
      .from(clients)
      .where(
        and(eq(clients.id, clientId), eq(clients.userId, session.user.id))
      );

    if (client.length === 0) {
      return { success: false, errorKey: "clientNotFound" };
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
      return { success: true, messageKey: "reminderSentSuccess" };
    } else {
      return {
        success: false,
        errorKey: "reminderSendError",
      };
    }
  } catch (error) {
    console.error("Error sending reminder:", error);
    return { success: false, errorKey: "reminderSendError" };
  }
}

export async function importClients(rows: any[]) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, errorKey: "unauthorized" };
    }

    const userId = session.user.id;

    const cleanedRows = rows
      .filter((r) => r.name && r.phone && r.car && r.revisionDate)
      .map((r) => ({
        userId,
        name: r.name.trim(),
        phone: r.phone.trim(),
        car: r.car.trim(),
        revisionDate: new Date(r.revisionDate),
        reminderSent: false,
      }));

    if (cleanedRows.length === 0) {
      return { success: false, errorKey: "noValidRows" };
    }

    await db.insert(clients).values(cleanedRows);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Import error:", error);
    return { success: false, errorKey: "importFailed" };
  }
}

export async function exportClients(lang: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, errorKey: "unauthorized" };
  }

  const userId = session.user.id;

  const data = await db.query.clients.findMany({
    where: (t, { eq }) => eq(t.userId, userId),
  });

  let sheetName = "autoremind-clients";
  let rowHeaders = ["Name", "Phone", "Car", "RevisionDate", "Sent"];
  if (lang === "pt") {
    sheetName = "autoremind-clientes";
    rowHeaders = ["Nome", "Telefone", "Carro", "Validade", "Enviado"];
  }

  // Create workbook
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  sheet.addRow(rowHeaders);

  data.forEach((c) => {
    sheet.addRow([
      c.name,
      c.phone,
      c.car,
      c.revisionDate ? new Date(c.revisionDate) : "",
      c.reminderSent ? "Sim" : "Não",
    ]);
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return {
    success: true,
    file: Buffer.from(buffer).toString("base64"),
  };
}
