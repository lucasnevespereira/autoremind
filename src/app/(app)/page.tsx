import { db } from "@/db";
import { clients } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ClientsTable } from "@/components/clients-table";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const allClients = await db
    .select()
    .from(clients)
    .where(eq(clients.userId, session.user.id))
    .orderBy(desc(clients.reminderDate));

  return <ClientsTable clients={allClients} />;
}
