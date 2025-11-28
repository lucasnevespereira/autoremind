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
    <div className="space-y-4">
      {/* Search and Add */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <AddClientDialog />
      </div>

      {/* Table */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">
            {searchQuery ? "No clients found matching your search" : "No clients added yet"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Car Brand/Model</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Maintenance Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => {
                const formattedDate = format(client.revisionDate, "MMM dd, yyyy");
                const today = new Date();
                const daysRemaining = Math.ceil(
                  (client.revisionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                );

                let statusColor = "text-gray-600 bg-gray-100";
                let statusText = "Scheduled";

                if (client.reminderSent) {
                  statusColor = "text-green-700 bg-green-100";
                  statusText = "Sent";
                } else if (daysRemaining <= 0) {
                  statusColor = "text-red-700 bg-red-100";
                  statusText = "Overdue";
                } else if (daysRemaining <= 7) {
                  statusColor = "text-amber-700 bg-amber-100";
                  statusText = "Urgent";
                }

                return (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell className="text-gray-600">{client.car}</TableCell>
                    <TableCell className="text-gray-600">{client.phone}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-gray-900">{formattedDate}</span>
                        <span className={`inline-flex items-center self-start rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}>
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
