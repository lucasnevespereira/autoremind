import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { LayoutContent } from "@/components/layout-content";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Session is guaranteed to exist here because middleware redirects unauthenticated users
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <LayoutContent session={session!}>{children}</LayoutContent>;
}
