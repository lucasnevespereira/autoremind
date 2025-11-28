"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { DeleteClientButton } from "@/components/delete-client-button";
import { SendReminderButton } from "@/components/send-reminder-button";
import { AddClientDialog } from "@/components/add-client-dialog";
import { EditClientDialog } from "@/components/edit-client-dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = useMemo(() => {
    if (!searchQuery) return clients;

    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.phone.includes(query) ||
        client.car.toLowerCase().includes(query)
    );
  }, [clients, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">Manage your maintenance reminders</p>
        </div>
      </div>

      {/* Search and Add */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, car, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <AddClientDialog />
      </div>

      {/* Table */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-900 font-medium text-base mb-1">
            {searchQuery ? "No matches found" : "No clients yet"}
          </p>
          <p className="text-gray-500 text-sm">
            {searchQuery ? "Try a different search term" : "Add your first client to get started"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Vehicle</TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
                <TableHead className="font-semibold">Maintenance</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => {
                const formattedDate = format(client.revisionDate, "MMM dd, yyyy");
                const today = new Date();
                const daysRemaining = Math.ceil(
                  (client.revisionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                );

                let statusColor = "text-blue-700 bg-blue-50";
                let statusText = "Scheduled";

                if (client.reminderSent) {
                  statusColor = "text-green-700 bg-green-50";
                  statusText = "Sent";
                } else if (daysRemaining <= 0) {
                  statusColor = "text-red-700 bg-red-50";
                  statusText = "Overdue";
                } else if (daysRemaining <= 7) {
                  statusColor = "text-amber-700 bg-amber-50";
                  statusText = "Due Soon";
                }

                return (
                  <TableRow key={client.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-900">{client.name}</TableCell>
                    <TableCell className="text-gray-700">{client.car}</TableCell>
                    <TableCell className="text-gray-700 font-mono text-sm">{client.phone}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-gray-900 text-sm">{formattedDate}</span>
                        <span className={`inline-flex items-center self-start rounded-md px-2 py-0.5 text-xs font-medium ${statusColor}`}>
                          {statusText}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
