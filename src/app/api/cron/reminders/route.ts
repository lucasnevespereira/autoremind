import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clients, settings, user } from "@/db/schema";
import { and, eq, lte, gte } from "drizzle-orm";
import { sendSMS } from "@/lib/twilio";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export async function GET(request: NextRequest) {
  try {
    // Check if request has the correct secret (basic security)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all users
    const allUsers = await db.select().from(user);

    console.log(`Processing reminders for ${allUsers.length} users`);

    const allResults = [];
    let totalClientsProcessed = 0;

    // Process each user separately
    for (const currentUser of allUsers) {
      // Get this user's settings
      const userSettings = await db.query.settings.findFirst({
        where: eq(settings.userId, currentUser.id),
      });

      const businessName = userSettings?.businessName || "Auto Service";
      const businessContact = userSettings?.businessContact || "";
      const reminderDaysBefore = userSettings?.reminderDaysBefore || 7;
      const smsTemplate =
        userSettings?.smsTemplate ||
        "Hello {client_name}, your {resource} is scheduled for {date}. Please contact {business_name} to confirm. Thank you!";

      // Calculate the reminder window based on user's settings
      const laterDate = new Date(today);
      laterDate.setDate(laterDate.getDate() + reminderDaysBefore);

      // Find this user's clients whose reminder date is between today and N days
      // and who haven't received reminder yet
      const clientsToRemind = await db
        .select()
        .from(clients)
        .where(
          and(
            eq(clients.userId, currentUser.id),
            eq(clients.reminderSent, false),
            gte(clients.reminderDate, today),
            lte(clients.reminderDate, laterDate)
          )
        );

      console.log(
        `User ${currentUser.email}: Found ${clientsToRemind.length} clients to remind`
      );

      for (const client of clientsToRemind) {
        const formattedDate = format(client.reminderDate, "dd/MM/yyyy", {
          locale: pt,
        });

        // Replace variables in template
        const message = smsTemplate
          .replace(/{client_name}/g, client.name)
          .replace(/{resource}/g, client.resource)
          .replace(/{date}/g, formattedDate)
          .replace(/{business_name}/g, businessName)
          .replace(/{business_contact}/g, businessContact);

        const result = await sendSMS(client.phone, message, currentUser.id);

        if (result.success) {
          // Mark as sent
          await db
            .update(clients)
            .set({ reminderSent: true })
            .where(eq(clients.id, client.id));

          allResults.push({
            user: currentUser.email,
            client: client.name,
            phone: client.phone,
            success: true,
          });
        } else {
          allResults.push({
            user: currentUser.email,
            client: client.name,
            phone: client.phone,
            success: false,
            error: result.error,
          });
        }
      }

      totalClientsProcessed += clientsToRemind.length;
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${totalClientsProcessed} clients across ${allUsers.length} users`,
      results: allResults,
    });
  } catch (error) {
    console.error("Error in reminders cron:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
