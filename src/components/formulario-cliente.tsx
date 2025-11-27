"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adicionarCliente } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function FormularioCliente() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const resultado = await adicionarCliente(formData);
    setLoading(false);

    if (resultado.sucesso) {
      toast({
        title: "Sucesso!",
        description: resultado.mensagem,
      });
      router.push("/");
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: resultado.erro,
      });
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="nome" className="text-lg">
          Nome do Cliente
        </Label>
        <Input
          id="nome"
          name="nome"
          type="text"
          placeholder="Ex: João Silva"
          required
          className="text-lg"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="telefone" className="text-lg">
          Número de Telemóvel
        </Label>
        <Input
          id="telefone"
          name="telefone"
          type="tel"
          placeholder="Ex: 912345678 ou +351912345678"
          required
          className="text-lg"
        />
        <p className="text-sm text-gray-600">
          Formato português: 9XXXXXXXX ou +351 9XXXXXXXX
        </p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="carro" className="text-lg">
          Carro / Modelo
        </Label>
        <Input
          id="carro"
          name="carro"
          type="text"
          placeholder="Ex: Renault Clio 2018"
          required
          className="text-lg"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="dataRevisao" className="text-lg">
          Data da Próxima Revisão
        </Label>
        <Input
          id="dataRevisao"
          name="dataRevisao"
          type="date"
          required
          className="text-lg"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full text-lg py-6"
        disabled={loading}
      >
        {loading ? "A guardar..." : "Guardar Cliente"}
      </Button>
    </form>
  );
}
