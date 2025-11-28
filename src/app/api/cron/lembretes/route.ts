import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clients } from "@/db/schema";
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

    // Find clients whose revision is between today and 7 days
    // and who haven't received reminder yet
    const clientsToRemind = await db
      .select()
      .from(clients)
      .where(
        and(
          eq(clients.reminderSent, false),
          gte(clients.revisionDate, today),
          lte(clients.revisionDate, sevenDaysLater)
        )
      );

    console.log(`Found ${clientsToRemind.length} clients to remind`);

    const results = [];

    for (const client of clientsToRemind) {
      const formattedDate = format(client.revisionDate, "dd/MM/yyyy", { locale: pt });

      const message = `Olá ${client.name}, a revisão do seu ${client.car} está marcada para ${formattedDate}. Contacte a oficina para marcar o dia. Obrigado!`;

      const result = await sendSMS(client.phone, message);

      if (result.success) {
        // Mark as sent
        await db
          .update(clients)
          .set({ reminderSent: true })
          .where(eq(clients.id, client.id));

        results.push({
          client: client.name,
          phone: client.phone,
          success: true,
        });
      } else {
        results.push({
          client: client.name,
          phone: client.phone,
          success: false,
          error: result.error,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${clientsToRemind.length} clients`,
      results,
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
