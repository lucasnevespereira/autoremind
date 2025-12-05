"use server";

import { db } from "@/db";
import { clients, settings } from "@/db/schema";
import { sendSMS, formatPhone } from "@/lib/twilio";
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
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const resource = formData.get("resource") as string;
    const reminderDate = formData.get("reminderDate") as string;

    if (!name || !phone || !resource || !reminderDate) {
      return { success: false, errorKey: "allFieldsRequired" };
    }

    const formattedPhone = formatPhone(phone);

    await db.insert(clients).values({
      userId: session.user.id,
      name,
      email: email || null,
      phone: formattedPhone,
      resource,
      reminderDate: new Date(reminderDate),
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
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const resource = formData.get("resource") as string;
    const reminderDate = formData.get("reminderDate") as string;

    if (!name || !phone || !resource || !reminderDate) {
      return { success: false, errorKey: "allFieldsRequired" };
    }

    const formattedPhone = formatPhone(phone);
    const newReminderDate = new Date(reminderDate);

    // Get the existing client to check if date changed
    const existingClient = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, id), eq(clients.userId, session.user.id)));

    if (existingClient.length === 0) {
      return { success: false, errorKey: "clientNotFound" };
    }

    // Check if reminder date has changed
    const dateChanged =
      existingClient[0].reminderDate.getTime() !== newReminderDate.getTime();

    // Reset reminderSent if date changed, so a new reminder can be sent
    await db
      .update(clients)
      .set({
        name,
        email: email || null,
        phone: formattedPhone,
        resource,
        reminderDate: newReminderDate,
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
    const businessName = formData.get("businessName") as string;
    const businessContact = formData.get("businessContact") as string;
    const reminderDaysBefore = formData.get("reminderDaysBefore") as string;
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
    if (businessName?.trim()) {
      configs.push({ key: "business_name", value: businessName.trim() });
    }
    if (businessContact?.trim()) {
      configs.push({ key: "business_contact", value: businessContact.trim() });
    }
    if (reminderDaysBefore?.trim()) {
      configs.push({
        key: "reminder_days_before",
        value: reminderDaysBefore.trim(),
      });
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

    // Get SMS template and business info from settings for this user
    const configs = await db
      .select()
      .from(settings)
      .where(eq(settings.userId, session.user.id));
    const businessName =
      configs.find((config) => config.key === "business_name")?.value ||
      "Auto Service";
    const businessContact =
      configs.find((config) => config.key === "business_contact")?.value || "";
    const smsTemplate =
      configs.find((config) => config.key === "sms_template")?.value ||
      "Hello {client_name}, your {resource} is scheduled for {date}. Please contact {business_name} to confirm. Thank you!";

    const formattedDate = format(c.reminderDate, "dd/MM/yyyy", { locale: pt });

    // Replace variables in template
    const message = smsTemplate
      .replace(/{client_name}/g, c.name)
      .replace(/{resource}/g, c.resource)
      .replace(/{date}/g, formattedDate)
      .replace(/{business_name}/g, businessName)
      .replace(/{business_contact}/g, businessContact);

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
      .filter((r) => r.name && r.phone && r.resource && r.reminderDate)
      .map((r) => ({
        userId,
        name: r.name.trim(),
        email: r.email?.trim() || null,
        phone: r.phone.trim(),
        resource: r.resource.trim(),
        reminderDate: new Date(r.reminderDate),
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
  let rowHeaders = [
    "Name",
    "Email",
    "Phone",
    "Resource",
    "ReminderDate",
    "Sent",
  ];
  if (lang === "pt") {
    sheetName = "autoremind-clientes";
    rowHeaders = ["Nome", "Email", "Telefone", "Recurso", "Data", "Enviado"];
  }

  // Create workbook
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  sheet.addRow(rowHeaders);

  data.forEach((c) => {
    sheet.addRow([
      c.name,
      c.email || "",
      c.phone,
      c.resource,
      c.reminderDate ? new Date(c.reminderDate) : "",
      c.reminderSent ? "Sim" : "Não",
    ]);
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return {
    success: true,
    file: Buffer.from(buffer).toString("base64"),
  };
}
