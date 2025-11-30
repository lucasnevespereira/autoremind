"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { DeleteClientButton } from "@/components/delete-client-button";
import { SendReminderButton } from "@/components/send-reminder-button";
import { AddClientDialog } from "@/components/add-client-dialog";
import { EditClientDialog } from "@/components/edit-client-dialog";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { useLanguage } from "@/contexts/language-context";

interface Client {
  id: number;
  name: string;
  phone: string;
  car: string;
  revisionDate: Date;
  reminderSent: boolean;
  createdAt: Date;
}

export function ClientsTable({ clients }: { clients: Client[] }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "name",
      header: t("client"),
      cell: ({ row }) => {
        return (
          <div className="font-medium text-foreground">{row.getValue("name")}</div>
        );
      },
    },
    {
      accessorKey: "car",
      header: t("vehicle"),
      cell: ({ row }) => {
        return <div className="text-foreground/80">{row.getValue("car")}</div>;
      },
    },
    {
      accessorKey: "phone",
      header: t("phone"),
      cell: ({ row }) => {
        return (
          <div className="font-mono text-sm text-foreground/70">
            {row.getValue("phone")}
          </div>
        );
      },
    },
    {
      accessorKey: "revisionDate",
      header: t("maintenance"),
      cell: ({ row }) => {
        const date = row.getValue("revisionDate") as Date;
        const formattedDate = format(date, "MMM dd, yyyy");
        const today = new Date();
        const daysRemaining = Math.ceil(
          (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        const reminderSent = row.original.reminderSent;

        let statusColor = "bg-blue-50 text-blue-700 border-blue-200";
        let statusText = t("scheduled");

        if (reminderSent) {
          statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
          statusText = t("sent");
        } else if (daysRemaining <= 0) {
          statusColor = "bg-red-50 text-red-700 border-red-200";
          statusText = t("overdue");
        } else if (daysRemaining <= 7) {
          statusColor = "bg-amber-50 text-amber-700 border-amber-200";
          statusText = t("dueSoon");
        }

        return (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">
              {formattedDate}
            </span>
            <span
              className={`inline-flex items-center self-start rounded-lg border px-2.5 py-1 text-xs font-semibold ${statusColor}`}
            >
              {statusText}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">{t("actions")}</div>,
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="flex justify-end gap-1.5">
            <SendReminderButton
              clientId={client.id}
              disabled={client.reminderSent}
            />
            <EditClientDialog
              client={{
                id: client.id,
                name: client.name,
                phone: client.phone,
                car: client.car,
                revisionDate: client.revisionDate,
              }}
            />
            <DeleteClientButton clientId={client.id} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t("clients")}
          </h1>
          <p className="text-muted-foreground mt-1.5">
            {t("manageMaintenanceReminders")}
          </p>
        </div>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("searchByNameCarPhone")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-card border-border/40 rounded-xl focus-visible:ring-primary"
          />
        </div>
        <AddClientDialog />
      </div>

      {/* Data Table */}
      {clients.length === 0 && !searchQuery ? (
        <div className="bg-card rounded-2xl border border-border/40 shadow-fintech p-16 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t("noClientsYet")}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t("addFirstClient")}
            </p>
            <AddClientDialog />
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={clients}
          searchKey="name"
          searchValue={searchQuery}
        />
      )}
    </div>
  );
}
