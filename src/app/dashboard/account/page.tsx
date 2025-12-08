import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AccountHeader } from "@/components/account-header";
import { ProfileForm } from "@/components/profile-form";
import { DangerZone } from "@/components/danger-zone";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <AccountHeader />

      {/* Profile Section */}
      <ProfileForm
        initialValues={{
          name: session.user.name || "",
          email: session.user.email || "",
        }}
      />

      {/* Danger Zone Section */}
      <DangerZone />
    </div>
  );
}
