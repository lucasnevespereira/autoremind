"use server";

import { db } from "@/db";
import { clientes, configuracoes } from "@/db/schema";
import { enviarSMS, formatarTelefonePortugues } from "@/lib/twilio";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export async function adicionarCliente(formData: FormData) {
  try {
    const nome = formData.get("nome") as string;
    const telefone = formData.get("telefone") as string;
    const carro = formData.get("carro") as string;
    const dataRevisao = formData.get("dataRevisao") as string;

    if (!nome || !telefone || !carro || !dataRevisao) {
      return { sucesso: false, erro: "Todos os campos são obrigatórios" };
    }

    const telefoneFormatado = formatarTelefonePortugues(telefone);

    await db.insert(clientes).values({
      nome,
      telefone: telefoneFormatado,
      carro,
      dataRevisao: new Date(dataRevisao),
      lembreteEnviado: false,
    });

    revalidatePath("/");
    return { sucesso: true, mensagem: "Cliente adicionado com sucesso!" };
  } catch (error) {
    console.error("Erro ao adicionar cliente:", error);
    return { sucesso: false, erro: "Erro ao adicionar cliente" };
  }
}

export async function eliminarCliente(id: number) {
  try {
    await db.delete(clientes).where(eq(clientes.id, id));
    revalidatePath("/");
    return { sucesso: true, mensagem: "Cliente eliminado com sucesso!" };
  } catch (error) {
    console.error("Erro ao eliminar cliente:", error);
    return { sucesso: false, erro: "Erro ao eliminar cliente" };
  }
}

export async function guardarConfigTwilio(formData: FormData) {
  try {
    const accountSid = formData.get("accountSid") as string;
    const authToken = formData.get("authToken") as string;
    const phoneNumber = formData.get("phoneNumber") as string;

    if (!accountSid || !authToken || !phoneNumber) {
      return { sucesso: false, erro: "Todos os campos são obrigatórios" };
    }

    // Inserir ou atualizar configurações
    const configs = [
      { chave: "twilio_account_sid", valor: accountSid },
      { chave: "twilio_auth_token", valor: authToken },
      { chave: "twilio_phone_number", valor: phoneNumber },
    ];

    for (const config of configs) {
      const existe = await db
        .select()
        .from(configuracoes)
        .where(eq(configuracoes.chave, config.chave));

      if (existe.length > 0) {
        await db
          .update(configuracoes)
          .set({ valor: config.valor, atualizadoEm: new Date() })
          .where(eq(configuracoes.chave, config.chave));
      } else {
        await db.insert(configuracoes).values(config);
      }
    }

    revalidatePath("/configuracoes");
    return { sucesso: true, mensagem: "Configurações guardadas com sucesso!" };
  } catch (error) {
    console.error("Erro ao guardar configurações:", error);
    return { sucesso: false, erro: "Erro ao guardar configurações" };
  }
}

export async function enviarSMSTeste(telefone: string) {
  try {
    const telefoneFormatado = formatarTelefonePortugues(telefone);
    const resultado = await enviarSMS(
      telefoneFormatado,
      "Este é um SMS de teste do AutoRemind PT. Tudo a funcionar! 🚗"
    );

    if (resultado.sucesso) {
      return { sucesso: true, mensagem: "SMS de teste enviado com sucesso!" };
    } else {
      return { sucesso: false, erro: resultado.erro || "Erro ao enviar SMS" };
    }
  } catch (error) {
    console.error("Erro ao enviar SMS de teste:", error);
    return { sucesso: false, erro: "Erro ao enviar SMS de teste" };
  }
}

export async function enviarLembreteManual(clienteId: number) {
  try {
    const cliente = await db
      .select()
      .from(clientes)
      .where(eq(clientes.id, clienteId));

    if (cliente.length === 0) {
      return { sucesso: false, erro: "Cliente não encontrado" };
    }

    const c = cliente[0];
    const dataFormatada = format(c.dataRevisao, "dd/MM/yyyy", { locale: pt });

    const mensagem = `Olá ${c.nome}, a revisão do seu ${c.carro} está marcada para ${dataFormatada}. Contacte a oficina para marcar o dia. Obrigado!`;

    const resultado = await enviarSMS(c.telefone, mensagem);

    if (resultado.sucesso) {
      await db
        .update(clientes)
        .set({ lembreteEnviado: true })
        .where(eq(clientes.id, clienteId));

      revalidatePath("/");
      return { sucesso: true, mensagem: "Lembrete enviado com sucesso!" };
    } else {
      return { sucesso: false, erro: resultado.erro || "Erro ao enviar lembrete" };
    }
  } catch (error) {
    console.error("Erro ao enviar lembrete:", error);
    return { sucesso: false, erro: "Erro ao enviar lembrete" };
  }
}
