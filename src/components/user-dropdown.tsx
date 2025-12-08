"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, LogOut, CreditCard, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/language-context";
import { signOut } from "@/lib/auth-client";
import type { Session } from "@/lib/auth";

interface UserDropdownProps {
  session: Session;
}

export function UserDropdown({ session }: UserDropdownProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    window.location.href = "/";
  }

  const userName = session.user?.name || session.user?.email || "User";
  const userEmail = session.user?.email || "";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted/50 transition-colors duration-200 group outline-none">
          {/* User Avatar */}
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-200">
            <span className="text-sm font-semibold text-primary">
              {userInitials}
            </span>
          </div>

          {/* User Info - Hidden on mobile */}
          <div className="hidden sm:flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground leading-none">
                {userName}
              </span>
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2">
        {/* User Info Section */}
        <DropdownMenuLabel className="p-3 pb-2">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-primary">
                {userInitials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {userName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userEmail}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem
          onClick={() => {
            router.push("/dashboard/account");
            setIsOpen(false);
          }}
          className="cursor-pointer rounded-lg py-2.5 px-3"
        >
          <User className="h-4 w-4 mr-3 text-muted-foreground" />
          <span className="text-sm font-medium">{t("account")}</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            router.push("/dashboard/settings");
            setIsOpen(false);
          }}
          className="cursor-pointer rounded-lg py-2.5 px-3"
        >
          <Settings className="h-4 w-4 mr-3 text-muted-foreground" />
          <span className="text-sm font-medium">{t("settings")}</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            router.push("/dashboard/billing");
            setIsOpen(false);
          }}
          className="cursor-pointer rounded-lg py-2.5 px-3"
        >
          <CreditCard className="h-4 w-4 mr-3 text-muted-foreground" />
          <span className="text-sm font-medium">{t("billing")}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer rounded-lg py-2.5 px-3 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20"
        >
          <LogOut className="h-4 w-4 mr-3" />
          <span className="text-sm font-medium">{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
