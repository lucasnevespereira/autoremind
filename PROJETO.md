# 📊 Visão Geral do Projeto - AutoRemind PT

---

## 🎯 Resumo

**AutoRemind PT** é uma aplicação web MVP (Minimum Viable Product) criada especificamente para mecânicos de automóveis em Portugal.

O objetivo é **simples**: enviar lembretes automáticos por SMS aos clientes quando a revisão do carro está a chegar.

---

## 🧩 Arquitetura

```
┌─────────────────────────────────────────────────┐
│              UTILIZADOR (Mecânico)              │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│          FRONTEND (Next.js 15 + React)          │
│  - Dashboard de clientes                        │
│  - Formulário de adicionar clientes             │
│  - Configurações Twilio                         │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│        BACKEND (Next.js Server Actions)         │
│  - Lógica de negócio                            │
│  - Validação de dados                           │
│  - Integração com Twilio                        │
└────────────────────┬────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│   PostgreSQL     │    │   Twilio API     │
│  (Drizzle ORM)   │    │   (Envio SMS)    │
└──────────────────┘    └──────────────────┘
```

---

## 📁 Estrutura de Ficheiros

```
autoremind-pt/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout principal
│   │   ├── page.tsx                # Dashboard (lista clientes)
│   │   ├── actions.ts              # Server Actions
│   │   ├── adicionar/
│   │   │   └── page.tsx            # Adicionar cliente
│   │   ├── configuracoes/
│   │   │   └── page.tsx            # Configurações Twilio
│   │   └── api/
│   │       └── cron/
│   │           └── lembretes/
│   │               └── route.ts    # Rota cron automática
│   ├── components/
│   │   ├── ui/                     # Componentes shadcn/ui
│   │   ├── logo.tsx                # Logo SVG
│   │   ├── formulario-cliente.tsx
│   │   ├── formulario-config-twilio.tsx
│   │   ├── eliminar-cliente-button.tsx
│   │   └── enviar-lembrete-button.tsx
│   ├── db/
│   │   ├── schema.ts               # Schema Drizzle
│   │   └── index.ts                # Conexão DB
│   ├── lib/
│   │   ├── utils.ts                # Utilitários
│   │   └── twilio.ts               # Integração Twilio
│   └── hooks/
│       └── use-toast.ts            # Hook para toasts
├── drizzle.config.ts               # Config Drizzle
├── tailwind.config.ts              # Config Tailwind
├── next.config.ts                  # Config Next.js
├── package.json
├── .env.example
├── README.md
├── GUIA_RAPIDO.md
├── DEPLOY.md
└── CONTRIBUTING.md
```

---

## 🗄️ Schema da Base de Dados

### Tabela: `clientes`

| Coluna            | Tipo      | Descrição                          |
|-------------------|-----------|------------------------------------|
| id                | serial    | ID único (chave primária)          |
| nome              | text      | Nome do cliente                    |
| telefone          | text      | Número de telefone (+351...)       |
| carro             | text      | Modelo do carro                    |
| dataRevisao       | timestamp | Data da próxima revisão            |
| lembreteEnviado   | boolean   | Se o lembrete já foi enviado       |
| criadoEm          | timestamp | Data de criação do registo         |

### Tabela: `configuracoes`

| Coluna         | Tipo      | Descrição                          |
|----------------|-----------|------------------------------------|
| id             | serial    | ID único (chave primária)          |
| chave          | text      | Nome da configuração (único)       |
| valor          | text      | Valor da configuração              |
| atualizadoEm   | timestamp | Última atualização                 |

**Configurações guardadas:**
- `twilio_account_sid`
- `twilio_auth_token`
- `twilio_phone_number`

---

## 🔄 Fluxo de Dados

### 1. Adicionar Cliente

```
Utilizador preenche formulário
         ↓
Server Action valida dados
         ↓
Telefone é formatado (+351)
         ↓
Cliente guardado na BD
         ↓
Dashboard atualizado (revalidatePath)
```

### 2. Envio Manual de Lembrete

```
Utilizador clica "Enviar Lembrete"
         ↓
Server Action busca dados do cliente
         ↓
Mensagem SMS é montada
         ↓
Twilio API envia SMS
         ↓
Cliente marcado como "lembreteEnviado: true"
         ↓
Dashboard atualizado
```

### 3. Envio Automático (Cron)

```
Cron job executado diariamente (9h)
         ↓
API busca clientes com revisão em 7 dias
         ↓
Para cada cliente:
  - Montar mensagem
  - Enviar via Twilio
  - Marcar como enviado
         ↓
Retornar resultados
```

---

## 🎨 Design System

### Cores

- **Primária:** `#3B82F6` (Azul)
- **Secundária:** `#F3F4F6` (Cinza claro)
- **Sucesso:** `#10B981` (Verde)
- **Aviso:** `#F59E0B` (Amarelo)
- **Erro:** `#EF4444` (Vermelho)
- **Texto:** `#111827` (Cinza escuro)

### Tipografia

- **Font:** Inter (Google Fonts)
- **Tamanhos:**
  - Título: `text-3xl` (30px)
  - Subtítulo: `text-xl` (20px)
  - Corpo: `text-base` (16px)
  - Pequeno: `text-sm` (14px)

### Componentes

- **Botões:** Grandes (`h-14`), bordas arredondadas (`rounded-md`)
- **Inputs:** Altura de `h-12`, texto grande para fácil leitura
- **Cards:** Sombra suave, bordas arredondadas
- **Espaçamento:** Generoso (mínimo `p-6`)

---

## 📱 Mensagem SMS Padrão

```
Olá [Nome], a revisão do seu [Carro] está marcada para [Data].
Contacte a oficina para marcar o dia. Obrigado!
```

**Exemplo real:**
```
Olá João Silva, a revisão do seu Renault Clio 2020 está marcada
para 25/12/2024. Contacte a oficina para marcar o dia. Obrigado!
```

**Caracteres:** ~120 (cabe num SMS padrão de 160 caracteres)

---

## 🔐 Segurança

### Proteção da Rota Cron

```typescript
const authHeader = request.headers.get("authorization");
const cronSecret = process.env.CRON_SECRET;

if (authHeader !== `Bearer ${cronSecret}`) {
  return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
}
```

### Validação de Inputs

Todos os formulários validam:
- Campos obrigatórios
- Formato de telefone português
- Datas válidas

### Variáveis Sensíveis

- `DATABASE_URL` - apenas em `.env` (nunca no código)
- `CRON_SECRET` - apenas em `.env`
- Credenciais Twilio - guardadas encriptadas na BD

---

## 📊 Métricas de Performance

### Tempo de Carregamento

- **Dashboard:** ~500ms (com 100 clientes)
- **Adicionar cliente:** ~200ms
- **Envio de SMS:** ~1-3s (depende do Twilio)

### Limites

- **Clientes:** Ilimitado (depende da BD)
- **SMS/dia:** Depende do plano Twilio
- **Cron jobs:** 1x por dia (configurável)

---

## 🚀 Roadmap de Melhorias

### Curto Prazo
- [ ] Histórico de SMS enviados
- [ ] Estatísticas simples (dashboard)
- [ ] Exportar lista de clientes (CSV)

### Médio Prazo
- [ ] Autenticação de utilizador
- [ ] Múltiplas oficinas
- [ ] Templates de mensagens personalizáveis
- [ ] Notificações por email

### Longo Prazo
- [ ] App mobile (React Native)
- [ ] Integração com calendário
- [ ] Pagamentos online
- [ ] API pública

---

## 📞 Contacto e Suporte

Para questões técnicas:
- Consulte o `README.md`
- Abra uma issue no GitHub
- Consulte a documentação do Twilio

---

**Projeto criado com ❤️ para mecânicos portugueses**
