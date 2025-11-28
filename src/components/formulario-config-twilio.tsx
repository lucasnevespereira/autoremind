"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveTwilioConfig, sendTestSMS } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Save, Send } from "lucide-react";

interface FormularioConfigTwilioProps {
  valorInicial: {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
  };
}

export function FormularioConfigTwilio({
  valorInicial,
}: FormularioConfigTwilioProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [telefoneTest, setTelefoneTest] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const resultado = await saveTwilioConfig(formData);
    setLoading(false);

    if (resultado.success) {
      toast({
        title: "Sucesso!",
        description: resultado.message,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: resultado.error,
      });
    }
  }

  async function handleEnviarTeste() {
    if (!telefoneTest) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira um número de telefone para teste",
      });
      return;
    }

    setTestLoading(true);
    const resultado = await sendTestSMS(telefoneTest);
    setTestLoading(false);

    if (resultado.success) {
      toast({
        title: "Sucesso!",
        description: resultado.message,
      });
      setTelefoneTest("");
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: resultado.error,
      });
    }
  }

  return (
    <div className="space-y-8">
      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="accountSid" className="text-lg">
            Twilio Account SID
          </Label>
          <Input
            id="accountSid"
            name="accountSid"
            type="text"
            placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            defaultValue={valorInicial.accountSid}
            required
            className="text-base font-mono"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="authToken" className="text-lg">
            Twilio Auth Token
          </Label>
          <Input
            id="authToken"
            name="authToken"
            type="password"
            placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            defaultValue={valorInicial.authToken}
            required
            className="text-base font-mono"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="phoneNumber" className="text-lg">
            Twilio Phone Number
          </Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="+351912345678"
            defaultValue={valorInicial.phoneNumber}
            required
            className="text-base"
          />
          <p className="text-sm text-gray-600">
            O número do Twilio de onde os SMS serão enviados
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full text-lg py-6"
          disabled={loading}
        >
          <Save className="mr-2 h-5 w-5" />
          {loading ? "A guardar..." : "Guardar Configurações"}
        </Button>
      </form>

      <div className="border-t pt-8">
        <h3 className="text-xl font-semibold mb-4">Testar Envio de SMS</h3>
        <p className="text-gray-600 mb-4">
          Envie um SMS de teste para verificar se está tudo a funcionar
        </p>
        <div className="flex gap-3">
          <Input
            type="tel"
            placeholder="Número de telefone para teste"
            value={telefoneTest}
            onChange={(e) => setTelefoneTest(e.target.value)}
            className="text-lg"
          />
          <Button
            onClick={handleEnviarTeste}
            disabled={testLoading || !telefoneTest}
            size="lg"
            variant="outline"
          >
            <Send className="mr-2 h-5 w-5" />
            {testLoading ? "A enviar..." : "Enviar Teste"}
          </Button>
        </div>
      </div>
    </div>
  );
}
