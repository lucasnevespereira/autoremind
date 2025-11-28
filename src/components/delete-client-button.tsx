"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteClient } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function DeleteClientButton({ clientId }: { clientId: number }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirm = window.confirm("Tem a certeza que deseja eliminar este cliente?");
    if (!confirm) return;

    setLoading(true);
    const result = await deleteClient(clientId);
    setLoading(false);

    if (result.success) {
      toast({
        title: "Sucesso!",
        description: result.message,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: result.error,
      });
    }
  }

  return (
    <Button
      variant="ghost"
      onClick={handleDelete}
      disabled={loading}
      size="sm"
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
