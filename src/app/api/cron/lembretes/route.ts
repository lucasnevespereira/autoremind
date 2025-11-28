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

    // Get today and 7 days from now
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    // Get all users
    const allUsers = await db.select().from(user);

    console.log(`Processing reminders for ${allUsers.length} users`);

    const allResults = [];
    let totalClientsProcessed = 0;

    // Process each user separately
    for (const currentUser of allUsers) {
      // Get this user's settings
      const userConfigs = await db
        .select()
        .from(settings)
        .where(eq(settings.userId, currentUser.id));

      const garageName =
        userConfigs.find((config) => config.key === "garage_name")?.value ||
        "Auto Service";
      const smsTemplate =
        userConfigs.find((config) => config.key === "sms_template")?.value ||
        "Hello {client_name}, your {vehicle} is scheduled for maintenance on {date}. Please contact {garage_name} to confirm. Thank you!";

      // Find this user's clients whose revision is between today and 7 days
      // and who haven't received reminder yet
      const clientsToRemind = await db
        .select()
        .from(clients)
        .where(
          and(
            eq(clients.userId, currentUser.id),
            eq(clients.reminderSent, false),
            gte(clients.revisionDate, today),
            lte(clients.revisionDate, sevenDaysLater)
          )
        );

      console.log(
        `User ${currentUser.email}: Found ${clientsToRemind.length} clients to remind`
      );

      for (const client of clientsToRemind) {
        const formattedDate = format(client.revisionDate, "dd/MM/yyyy", {
          locale: pt,
        });

        // Replace variables in template
        const message = smsTemplate
          .replace(/{client_name}/g, client.name)
          .replace(/{vehicle}/g, client.car)
          .replace(/{date}/g, formattedDate)
          .replace(/{garage_name}/g, garageName);

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
