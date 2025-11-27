import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormularioConfigTwilio } from "@/components/formulario-config-twilio";
import { db } from "@/db";
import { configuracoes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const configs = await db.select().from(configuracoes);

  const accountSid = configs.find((c) => c.chave === "twilio_account_sid")?.valor || "";
  const authToken = configs.find((c) => c.chave === "twilio_auth_token")?.valor || "";
  const phoneNumber = configs.find((c) => c.chave === "twilio_phone_number")?.valor || "";

  const configurado = accountSid && authToken && phoneNumber;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h2>
        <p className="text-lg text-gray-600">
          Configure as definições do Twilio para enviar SMS
        </p>
      </div>

      {!configurado && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex gap-4">
          <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-2">
              Configure o Twilio para começar
            </h3>
            <p className="text-yellow-800">
              Para enviar SMS aos seus clientes, precisa de configurar uma conta Twilio.
              Preencha os campos abaixo com as suas credenciais.
            </p>
          </div>
        </div>
      )}

      <Card className="shadow-lg">
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="text-2xl">Configurações do Twilio</CardTitle>
          <CardDescription className="text-base">
            Configure as credenciais da sua conta Twilio
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <FormularioConfigTwilio
            valorInicial={{
              accountSid,
              authToken,
              phoneNumber,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como obter as credenciais do Twilio?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>
              Aceda a{" "}
              <a
                href="https://www.twilio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                twilio.com
              </a>{" "}
              e crie uma conta (tem créditos grátis para testar)
            </li>
            <li>
              No painel de controlo, encontre o <strong>Account SID</strong> e{" "}
              <strong>Auth Token</strong>
            </li>
            <li>
              Compre um número de telefone português (+351) ou use o número de teste
            </li>
            <li>Cole as credenciais nos campos acima e clique em "Guardar"</li>
            <li>
              Teste o envio clicando em "Enviar SMS de Teste" após guardar
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
