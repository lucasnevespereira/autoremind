"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { eliminarCliente } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function EliminarClienteButton({ clienteId }: { clienteId: number }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleEliminar() {
    const confirmar = confirm("Tem a certeza que deseja eliminar este cliente?");
    if (!confirmar) return;

    setLoading(true);
    const resultado = await eliminarCliente(clienteId);
    setLoading(false);

    if (resultado.sucesso) {
      toast({
        title: "Sucesso!",
        description: resultado.mensagem,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: resultado.erro,
      });
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleEliminar}
      disabled={loading}
      size="lg"
    >
      <Trash2 className="mr-2 h-5 w-5" />
      {loading ? "A eliminar..." : "Eliminar"}
    </Button>
  );
}
