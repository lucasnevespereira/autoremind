"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addClient } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export function ClientForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const car = formData.get("car") as string;
    const revisionDate = formData.get("revisionDate") as string;

    // Validate
    const newErrors: Record<string, string> = {};
    if (!name?.trim()) newErrors.name = "Nome é obrigatório";
    if (!phone?.trim()) newErrors.phone = "Telemóvel é obrigatório";
    if (!car?.trim()) newErrors.car = "Carro é obrigatório";
    if (!revisionDate) newErrors.revisionDate = "Data é obrigatória";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await addClient(formData);
    setLoading(false);

    if (result.success) {
      toast({
        title: "Sucesso!",
        description: result.message,
      });
      router.push("/");
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: result.error,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Nome do Cliente
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Ex: João Silva"
          className={
            errors.name ? "border-red-300 focus-visible:ring-red-500" : ""
          }
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium">
          Número de Telemóvel
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Ex: 912345678"
          className={
            errors.phone ? "border-red-300 focus-visible:ring-red-500" : ""
          }
        />
        {errors.phone ? (
          <p className="text-sm text-red-600">{errors.phone}</p>
        ) : (
          <p className="text-xs text-gray-500">
            Formato: 9XXXXXXXX ou +351 9XXXXXXXX
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="car" className="text-sm font-medium">
          Carro / Modelo
        </Label>
        <Input
          id="car"
          name="car"
          type="text"
          placeholder="Ex: Renault Clio 2018"
          className={
            errors.car ? "border-red-300 focus-visible:ring-red-500" : ""
          }
        />
        {errors.car && <p className="text-sm text-red-600">{errors.car}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="revisionDate" className="text-sm font-medium">
          Data da Próxima Revisão
        </Label>
        <Input
          id="revisionDate"
          name="revisionDate"
          type="date"
          className={
            errors.revisionDate
              ? "border-red-300 focus-visible:ring-red-500"
              : ""
          }
        />
        {errors.revisionDate && (
          <p className="text-sm text-red-600">{errors.revisionDate}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "A guardar..." : "Guardar Cliente"}
      </Button>
    </form>
  );
}
