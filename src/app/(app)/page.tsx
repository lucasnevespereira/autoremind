import { db } from "@/db";
import { clients } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ClientsTable } from "@/components/clients-table";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allClients = await db.select().from(clients).orderBy(desc(clients.revisionDate));

  return <ClientsTable clients={allClients} />;
}
