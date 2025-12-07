"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DeleteClientDialog } from "@/components/delete-client-dialog";

interface DeleteClientButtonProps {
  clientId: number;
  clientName: string;
}

export function DeleteClientButton({ clientId, clientName }: DeleteClientButtonProps) {
  return (
    <DeleteClientDialog
      clientId={clientId}
      clientName={clientName}
      trigger={
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      }
    />
  );
}
