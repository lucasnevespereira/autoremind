import { pgTable, text, timestamp, boolean, serial } from "drizzle-orm/pg-core";

export const clientes = pgTable("clientes", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  telefone: text("telefone").notNull(),
  carro: text("carro").notNull(),
  dataRevisao: timestamp("data_revisao", { mode: "date" }).notNull(),
  lembreteEnviado: boolean("lembrete_enviado").default(false).notNull(),
  criadoEm: timestamp("criado_em", { mode: "date" }).defaultNow().notNull(),
});

export const configuracoes = pgTable("configuracoes", {
  id: serial("id").primaryKey(),
  chave: text("chave").notNull().unique(),
  valor: text("valor").notNull(),
  atualizadoEm: timestamp("atualizado_em", { mode: "date" }).defaultNow().notNull(),
});

export type Cliente = typeof clientes.$inferSelect;
export type NovoCliente = typeof clientes.$inferInsert;
export type Configuracao = typeof configuracoes.$inferSelect;
