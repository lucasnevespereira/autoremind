"use server";

import { db } from "@/db";
import {
  clients,
  settings,
  user,
  subscriptions,
  session as sessionTable,
  account as accountTable,
  verification,
} from "@/db/schema";
import { sendSMS, formatPhone } from "@/lib/twilio";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ExcelJS from "exceljs";
import { LANG } from "@/constants";
import { encrypt } from "@/lib/encryption";
import { canAddClients } from "@/lib/subscription";

// User Actions
export async function getUserClientCount() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, errorKey: "unauthorized" };
    }

    const countResult = await db
      .select()
      .from(clients)
      .where(eq(clients.userId, session.user.id));

    return { success: true, count: countResult.length };
  } catch (error) {
    console.error("Error getting user client count:", error);
    return { success: false, errorKey: "countError" };
  }
}

// Client Actions

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

    // Check client limit before adding
    const limitCheck = await canAddClients(session.user.id, 1);
    if (!limitCheck.canAdd) {
      return {
        success: false,
        errorKey: "clientLimitReached",
        limit: limitCheck.limit,
        currentCount: limitCheck.currentCount,
      };
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

export async function bulkDeleteClients(ids: number[]) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, errorKey: "unauthorized" };
    }

    if (ids.length === 0) {
      return { success: false, errorKey: "allFieldsRequired" };
    }

    // Delete all clients with matching IDs for this user
    for (const id of ids) {
      await db
        .delete(clients)
        .where(and(eq(clients.id, id), eq(clients.userId, session.user.id)));
    }

    revalidatePath("/");
    return { success: true, messageKey: "clientDeletedSuccess" };
  } catch (error) {
    console.error("Error bulk deleting clients:", error);
    return { success: false, errorKey: "clientDeleteError" };
  }
}

export async function saveConfig(formData: FormData) {
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
    const useManagedSms =
      formData.get("useManagedSms") === "on" ||
      formData.get("useManagedSms") === "true";

    // Build update object with only provided values
    const updateData: any = {
      updatedAt: new Date(),
      useManagedSms: useManagedSms, // Always update this field
    };

    if (accountSid?.trim()) updateData.twilioAccountSid = accountSid.trim();
    if (authToken?.trim())
      updateData.twilioAuthToken = encrypt(authToken.trim());
    if (phoneNumber?.trim()) updateData.twilioPhoneNumber = phoneNumber.trim();
    if (businessName?.trim()) updateData.businessName = businessName.trim();
    if (businessContact?.trim())
      updateData.businessContact = businessContact.trim();
    if (reminderDaysBefore?.trim()) {
      updateData.reminderDaysBefore = parseInt(reminderDaysBefore.trim()) || 7;
    }
    if (smsTemplate?.trim()) updateData.smsTemplate = smsTemplate.trim();

    // Check if settings row exists for this user
    const existing = await db
      .select()
      .from(settings)
      .where(eq(settings.userId, session.user.id));

    if (existing.length > 0) {
      // Update existing settings
      await db
        .update(settings)
        .set(updateData)
        .where(eq(settings.userId, session.user.id));
    } else {
      // Insert new settings row
      await db.insert(settings).values({
        userId: session.user.id,
        ...updateData,
      });
    }

    revalidatePath("/dashboard/settings");
    return { success: true, messageKey: "settingsSavedSuccess" };
  } catch (error) {
    console.error("Error saving settings:", error);
    return { success: false, errorKey: "settingsSaveError" };
  }
}

export async function sendTestSMS(
  phone: string,
  businessName: string,
  lang: string
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, errorKey: "unauthorized" };
    }

    const formattedPhone = formatPhone(phone);

    const message =
      lang === LANG.PT
        ? `Ola! Mensagem de teste do ${businessName}. Se recebeu isto, tudo esta a funcionar corretamente.`
        : lang === LANG.FR
        ? `Bonjour! Message de test de ${businessName}. Si vous recevez ceci, tout fonctionne correctement.`
        : `Hello! Test message from ${businessName}. If you received this, everything is working correctly.`;

    const result = await sendSMS(formattedPhone, message, session.user.id);

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
    const userSettings = await db.query.settings.findFirst({
      where: eq(settings.userId, session.user.id),
    });

    const businessName = userSettings?.businessName || "AutoRemind";
    const businessContact = userSettings?.businessContact || "";
    const smsTemplate =
      userSettings?.smsTemplate ||
      "Hello {client_name}, your {client_resource} is scheduled for {reminder_date}. Please contact {business_name} to confirm. Thank you!";

    const formattedDate = format(c.reminderDate, "dd/MM/yyyy", { locale: pt });

    // Replace variables in template
    const message = smsTemplate
      .replace(/{client_name}/g, c.name)
      .replace(/{client_resource}/g, c.resource)
      .replace(/{reminder_date}/g, formattedDate)
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

    // Check client limit before importing
    const limitCheck = await canAddClients(userId, cleanedRows.length);
    if (!limitCheck.canAdd) {
      return {
        success: false,
        errorKey: "clientLimitReached",
        limit: limitCheck.limit,
        currentCount: limitCheck.currentCount,
        attemptedToAdd: cleanedRows.length,
      };
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
  if (lang === LANG.PT) {
    sheetName = "autoremind-clientes";
    rowHeaders = ["Nome", "Email", "Telefone", "Recurso", "Data", "Enviado"];
  } else if (lang === LANG.FR) {
    sheetName = "autoremind-clients";
    rowHeaders = [
      "Nom",
      "Email",
      "Téléphone",
      "Ressource",
      "Date de rappel",
      "Envoyé",
    ];
  }

  const yes = lang === LANG.FR ? "Oui" : lang === LANG.PT ? "Sim" : "Yes";
  const no = lang === LANG.FR ? "Non" : lang === LANG.PT ? "Não" : "No";

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
      c.reminderSent ? yes : no,
    ]);
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return {
    success: true,
    file: Buffer.from(buffer).toString("base64"),
  };
}

// Subscription Actions

export async function createCheckoutSession(priceId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, errorKey: "unauthorized" };
    }

    // Validate price ID (monthly and annual)
    const validPriceIds = [
      process.env.STRIPE_PRICE_ID_STARTER,
      process.env.STRIPE_PRICE_ID_PRO,
      process.env.STRIPE_PRICE_ID_STARTER_ANNUAL,
      process.env.STRIPE_PRICE_ID_PRO_ANNUAL,
    ];

    if (!validPriceIds.includes(priceId)) {
      return { success: false, errorKey: "invalidPriceId" };
    }

    // Import Stripe utilities directly
    const { createCheckoutSessionUrl } = await import("@/lib/stripe");
    const checkoutUrl = await createCheckoutSessionUrl(
      session.user.id,
      priceId
    );

    return { success: true, url: checkoutUrl };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return { success: false, errorKey: "checkoutError" };
  }
}

export async function createPortalSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, errorKey: "unauthorized" };
    }

    // Import utilities directly
    const { getUserSubscription } = await import("@/lib/subscription");
    const { createPortalSessionUrl } = await import("@/lib/stripe");

    const subscription = await getUserSubscription(session.user.id);

    if (!subscription.stripeCustomerId) {
      return { success: false, errorKey: "noStripeCustomer" };
    }

    const portalUrl = await createPortalSessionUrl(
      subscription.stripeCustomerId
    );

    return { success: true, url: portalUrl };
  } catch (error) {
    console.error("Error creating portal session:", error);
    return { success: false, errorKey: "portalError" };
  }
}

// Account Management Actions

export async function updateProfile(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, errorKey: "unauthorized" };
    }

    const name = formData.get("name") as string;

    if (!name?.trim()) {
      return { success: false, errorKey: "allFieldsRequired" };
    }

    // Update user name only
    await db
      .update(user)
      .set({
        name: name.trim(),
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    revalidatePath("/dashboard/account");
    revalidatePath("/dashboard");
    return { success: true, messageKey: "profileUpdatedSuccess" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, errorKey: "profileUpdateError" };
  }
}

export async function deleteAccount() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, errorKey: "unauthorized" };
    }

    const userId = session.user.id;

    // Delete all user data in order (to respect foreign key constraints)
    // 1. Delete clients
    await db.delete(clients).where(eq(clients.userId, userId));

    // 2. Delete settings
    await db.delete(settings).where(eq(settings.userId, userId));

    // 3. Delete subscription
    await db.delete(subscriptions).where(eq(subscriptions.userId, userId));

    // 4. Delete sessions
    await db.delete(sessionTable).where(eq(sessionTable.userId, userId));

    // 5. Delete accounts
    await db.delete(accountTable).where(eq(accountTable.userId, userId));

    // 6. Delete verification records
    await db
      .delete(verification)
      .where(eq(verification.identifier, session.user.email));

    // 7. Finally, delete the user
    await db.delete(user).where(eq(user.id, userId));

    // Sign out and redirect to home page
    // Note: The redirect will be handled in the UI after successful deletion
    return { success: true, messageKey: "accountDeletedSuccess" };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, errorKey: "accountDeleteError" };
  }
}
