import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormularioCliente } from "@/components/formulario-cliente";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdicionarClientePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar
        </Button>
      </Link>

      <Card className="shadow-lg">
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="text-3xl">Adicionar Novo Cliente</CardTitle>
          <CardDescription className="text-base">
            Preencha os dados do cliente para começar a enviar lembretes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <FormularioCliente />
        </CardContent>
      </Card>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="font-semibold text-lg mb-2 text-blue-900">Dica útil:</h3>
        <p className="text-blue-800">
          Depois de adicionar o cliente, o sistema enviará automaticamente um lembrete
          por SMS quando a data da revisão estiver próxima.
        </p>
      </div>
    </div>
  );
}
