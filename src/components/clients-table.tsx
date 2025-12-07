"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Search, Copy, Trash2, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { DeleteClientButton } from "@/components/delete-client-button";
import { SendReminderButton } from "@/components/send-reminder-button";
import { AddClientDialog } from "@/components/add-client-dialog";
import { EditClientDialog } from "@/components/edit-client-dialog";
import { ImportClientsDialog } from "@/components/import-clients-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { useLanguage } from "@/contexts/language-context";
import { ExportClientsButton } from "./export-clients-button";
import { useToast } from "@/hooks/use-toast";
import { bulkDeleteClients } from "@/app/actions";

interface Client {
  id: number;
  name: string;
  email?: string | null;
  phone: string;
  resource: string;
  reminderDate: Date;
  reminderSent: boolean;
  createdAt: Date;
}

export function ClientsTable({ clients }: { clients: Client[] }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: t("success"),
        description: "Copied to clipboard!",
        duration: 2000,
      });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(clients.map((c) => c.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (clientId: number, checked: boolean) => {
    const newSelection = new Set(selectedRows);
    if (checked) {
      newSelection.add(clientId);
    } else {
      newSelection.delete(clientId);
    }
    setSelectedRows(newSelection);
  };

  const handleBulkDelete = async () => {
    if (selectedRows.size === 0) return;

    const confirmed = confirm(
      `Are you sure you want to delete ${selectedRows.size} client(s)?`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    const result = await bulkDeleteClients(Array.from(selectedRows));
    setIsDeleting(false);

    if (result.success) {
      toast({
        title: t("success"),
        description: result.messageKey
          ? t(result.messageKey as any)
          : "Deleted successfully",
      });
      setSelectedRows(new Set());
    } else {
      toast({
        variant: "destructive",
        title: t("error"),
        description: result.errorKey
          ? t(result.errorKey as any)
          : "Error deleting clients",
      });
    }
  };

  const columns: ColumnDef<Client>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={selectedRows.size === clients.length && clients.length > 0}
          onCheckedChange={handleSelectAll}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedRows.has(row.original.id)}
          onCheckedChange={(checked) =>
            handleSelectRow(row.original.id, checked as boolean)
          }
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: t("client"),
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        return (
          <div
            className="font-medium text-foreground cursor-pointer hover:text-primary flex items-center gap-2 group"
            onClick={() => copyToClipboard(name)}
            title="Click to copy"
          >
            {name}
            <Copy className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: t("email"),
      cell: ({ row }) => {
        const email = row.getValue("email") as string | null;
        if (!email) return <div className="text-sm text-foreground/70">-</div>;
        return (
          <div
            className="text-sm text-foreground/70 cursor-pointer hover:text-primary flex items-center gap-2 group"
            onClick={() => copyToClipboard(email)}
            title="Click to copy"
          >
            {email}
            <Copy className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: t("phone"),
      cell: ({ row }) => {
        const phone = row.getValue("phone") as string;
        return (
          <div
            className="font-mono text-sm text-foreground/70 cursor-pointer hover:text-primary flex items-center gap-2 group"
            onClick={() => copyToClipboard(phone)}
            title="Click to copy"
          >
            {phone}
            <Copy className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
          </div>
        );
      },
    },
    {
      accessorKey: "resource",
      header: t("resource"),
      cell: ({ row }) => {
        const resource = row.getValue("resource") as string;
        return (
          <div
            className="text-foreground/80 cursor-pointer hover:text-primary flex items-center gap-2 group"
            onClick={() => copyToClipboard(resource)}
            title="Click to copy"
          >
            {resource}
            <Copy className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
          </div>
        );
      },
    },
    {
      accessorKey: "reminderDate",
      header: t("reminderDate"),
      cell: ({ row }) => {
        const date = row.getValue("reminderDate") as Date;
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
                email: client.email,
                phone: client.phone,
                resource: client.resource,
                reminderDate: client.reminderDate,
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("clients")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("manageReminders")}
          </p>
        </div>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("searchBy")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-card border-border/40 rounded-xl focus-visible:ring-primary"
          />
        </div>
        {selectedRows.size > 0 && (
          <Button
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={isDeleting}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting
              ? t("deleting")
              : `${t("delete")} ${selectedRows.size} ${t("selected")}`}
          </Button>
        )}
        <AddClientDialog />
        <ImportClientsDialog />
        {clients.length > 0 && (
          <div className="flex-1 flex justify-end">
            <ExportClientsButton />
          </div>
        )}
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
