import { db } from "@/db";
import { clientes } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, Phone, Car, Send, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { EliminarClienteButton } from "@/components/eliminar-cliente-button";
import { EnviarLembreteButton } from "@/components/enviar-lembrete-button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const todosClientes = await db.select().from(clientes).orderBy(desc(clientes.dataRevisao));

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Bem-vindo ao AutoRemind PT
          </h2>
          <p className="text-lg text-gray-600">
            Envie lembretes de revisão aos seus clientes automaticamente por SMS
          </p>
          <Link href="/adicionar">
            <Button size="lg" className="mt-4 text-lg px-8 py-6">
              <Plus className="mr-2 h-6 w-6" />
              Adicionar Cliente
            </Button>
          </Link>
        </div>
      </div>

      {/* Clientes List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            Os Seus Clientes ({todosClientes.length})
          </h3>
        </div>

        {todosClientes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg text-gray-600 mb-4">
                Ainda não tem clientes adicionados
              </p>
              <Link href="/adicionar">
                <Button>
                  <Plus className="mr-2 h-5 w-5" />
                  Adicionar o Primeiro Cliente
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {todosClientes.map((cliente) => {
              const dataFormatada = format(cliente.dataRevisao, "dd 'de' MMMM 'de' yyyy", {
                locale: pt,
              });
              const hoje = new Date();
              const diasRestantes = Math.ceil(
                (cliente.dataRevisao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
              );

              let corEstado = "bg-gray-100 text-gray-700";
              let textoEstado = "Agendado";

              if (cliente.lembreteEnviado) {
                corEstado = "bg-green-100 text-green-700";
                textoEstado = "Lembrete Enviado";
              } else if (diasRestantes <= 0) {
                corEstado = "bg-red-100 text-red-700";
                textoEstado = "Atrasado";
              } else if (diasRestantes <= 7) {
                corEstado = "bg-yellow-100 text-yellow-700";
                textoEstado = "Urgente";
              }

              return (
                <Card key={cliente.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {cliente.nome}
                        </CardTitle>
                        <CardDescription className="space-y-2 text-base">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{cliente.telefone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4" />
                            <span>{cliente.carro}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{dataFormatada}</span>
                            {diasRestantes > 0 && !cliente.lembreteEnviado && (
                              <span className="text-sm">
                                ({diasRestantes} {diasRestantes === 1 ? "dia" : "dias"})
                              </span>
                            )}
                          </div>
                        </CardDescription>
                      </div>
                      <div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-medium ${corEstado}`}
                        >
                          {textoEstado}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <EnviarLembreteButton
                        clienteId={cliente.id}
                        disabled={cliente.lembreteEnviado}
                      />
                      <EliminarClienteButton clienteId={cliente.id} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
