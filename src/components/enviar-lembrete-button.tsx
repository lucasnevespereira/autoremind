"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { enviarLembreteManual } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function EnviarLembreteButton({
  clienteId,
  disabled,
}: {
  clienteId: number;
  disabled?: boolean;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleEnviar() {
    setLoading(true);
    const resultado = await enviarLembreteManual(clienteId);
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
      onClick={handleEnviar}
      disabled={disabled || loading}
      size="lg"
      className="flex-1"
    >
      <Send className="mr-2 h-5 w-5" />
      {loading ? "A enviar..." : disabled ? "Já Enviado" : "Enviar Lembrete"}
    </Button>
  );
}
