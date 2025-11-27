import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clientes } from "@/db/schema";
import { and, eq, lte, gte } from "drizzle-orm";
import { enviarSMS } from "@/lib/twilio";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export async function GET(request: NextRequest) {
  try {
    // Verificar se o request tem o secret correto (segurança básica)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
    }

    // Obter a data de hoje e de amanhã
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 7); // Enviar lembretes 7 dias antes

    // Buscar clientes cuja revisão está entre hoje e 7 dias
    // e que ainda não receberam o lembrete
    const clientesParaLembrar = await db
      .select()
      .from(clientes)
      .where(
        and(
          eq(clientes.lembreteEnviado, false),
          gte(clientes.dataRevisao, hoje),
          lte(clientes.dataRevisao, amanha)
        )
      );

    console.log(`Encontrados ${clientesParaLembrar.length} clientes para lembrar`);

    const resultados = [];

    for (const cliente of clientesParaLembrar) {
      const dataFormatada = format(cliente.dataRevisao, "dd/MM/yyyy", { locale: pt });

      const mensagem = `Olá ${cliente.nome}, a revisão do seu ${cliente.carro} está marcada para ${dataFormatada}. Contacte a oficina para marcar o dia. Obrigado!`;

      const resultado = await enviarSMS(cliente.telefone, mensagem);

      if (resultado.sucesso) {
        // Marcar como enviado
        await db
          .update(clientes)
          .set({ lembreteEnviado: true })
          .where(eq(clientes.id, cliente.id));

        resultados.push({
          cliente: cliente.nome,
          telefone: cliente.telefone,
          sucesso: true,
        });
      } else {
        resultados.push({
          cliente: cliente.nome,
          telefone: cliente.telefone,
          sucesso: false,
          erro: resultado.erro,
        });
      }
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: `Processados ${clientesParaLembrar.length} clientes`,
      resultados,
    });
  } catch (error) {
    console.error("Erro no cron de lembretes:", error);
    return NextResponse.json(
      {
        sucesso: false,
        erro: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
