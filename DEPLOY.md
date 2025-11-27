# 🌐 Guia de Deploy - AutoRemind PT

Este guia explica como colocar a aplicação online (em produção).

---

## 🚀 Deploy na Vercel (Recomendado)

A Vercel é a forma mais simples e tem suporte nativo para Next.js.

### Passo 1: Preparar o código

```bash
git init
git add .
git commit -m "Initial commit - AutoRemind PT"
```

Faça push para GitHub, GitLab ou Bitbucket.

### Passo 2: Importar na Vercel

1. Aceda a [vercel.com](https://vercel.com)
2. Clique em **"New Project"**
3. Importe o seu repositório
4. Configure as variáveis de ambiente:
   - `DATABASE_URL` - URL da sua base de dados PostgreSQL
   - `CRON_SECRET` - Uma string aleatória para proteger o cron

### Passo 3: Deploy

Clique em **Deploy**. A Vercel vai:
- Instalar dependências
- Fazer build do projeto
- Colocar online automaticamente

### Passo 4: Configurar a Base de Dados

Recomendo usar **Neon** (PostgreSQL gratuito):

1. Crie uma conta em [neon.tech](https://neon.tech)
2. Crie um novo projeto
3. Copie a **Connection String**
4. Cole em `DATABASE_URL` nas variáveis de ambiente da Vercel

### Passo 5: Aplicar Schema

Na Vercel, vá para **Settings > Functions** e execute:
```bash
npm run db:push
```

Ou use o terminal localmente com a `DATABASE_URL` de produção.

### Passo 6: Cron Automático

A Vercel já está configurada com o `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/lembretes",
    "schedule": "0 9 * * *"
  }]
}
```

Isto envia lembretes automaticamente **todos os dias às 09:00 UTC**.

**Nota:** Para ajustar o horário para Portugal (GMT+0 ou GMT+1):
- `0 8 * * *` = 08:00 (inverno)
- `0 7 * * *` = 08:00 (verão)

---

## 🛤️ Deploy na Railway

### 1. Criar conta em [railway.app](https://railway.app)

### 2. Novo Projeto

- **New Project** > **Deploy from GitHub repo**
- Selecione o seu repositório

### 3. Adicionar PostgreSQL

- Clique em **+ New** > **Database** > **PostgreSQL**
- Copie a `DATABASE_URL`

### 4. Configurar Variáveis

No painel do projeto:
- `DATABASE_URL` - (copiada do PostgreSQL)
- `CRON_SECRET` - string aleatória

### 5. Deploy

O Railway faz deploy automaticamente.

### 6. Cron Externo

Como o Railway não tem cron nativo, use [cron-job.org](https://cron-job.org):

1. Crie uma tarefa com:
   - URL: `https://seu-app.railway.app/api/cron/lembretes`
   - Header: `Authorization: Bearer SEU_CRON_SECRET`
   - Schedule: `0 9 * * *` (diário às 9h)

---

## 🐳 Deploy com Docker (Avançado)

### 1. Criar Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### 2. Build e Run

```bash
docker build -t autoremind-pt .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e CRON_SECRET="..." \
  autoremind-pt
```

---

## 📊 Bases de Dados Recomendadas

### Neon (Gratuito)
- ✅ PostgreSQL serverless
- ✅ 0.5 GB grátis
- ✅ Backups automáticos
- 🔗 [neon.tech](https://neon.tech)

### Supabase (Gratuito)
- ✅ PostgreSQL completo
- ✅ 500 MB grátis
- ✅ Interface visual
- 🔗 [supabase.com](https://supabase.com)

### Render (Gratuito)
- ✅ PostgreSQL gerido
- ⚠️ Desliga após inatividade
- 🔗 [render.com](https://render.com)

---

## ⚙️ Checklist Pós-Deploy

Depois de fazer deploy, verifique:

- [ ] A aplicação abre sem erros
- [ ] Consegue adicionar clientes
- [ ] As configurações do Twilio funcionam
- [ ] O SMS de teste é enviado
- [ ] O cron job está a funcionar (verifique nos logs)
- [ ] A base de dados está persistente

---

## 🔒 Segurança em Produção

### Proteger Variáveis de Ambiente

Nunca faça commit de:
- `DATABASE_URL`
- `CRON_SECRET`
- Credenciais do Twilio (guardadas na BD)

### HTTPS

A Vercel e Railway fornecem HTTPS automático. ✅

### Headers de Segurança

Adicione ao `next.config.ts`:

```ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};
```

---

## 📈 Monitorização

### Logs

**Vercel:**
- Aceda ao painel > Deployments > Logs

**Railway:**
- Clique no serviço > View Logs

### Alertas

Configure alertas para:
- Erros no envio de SMS
- Falhas no cron job
- Problemas de conexão à base de dados

---

## 💰 Custos Estimados

### Infraestrutura
- **Vercel:** Grátis (até 100GB bandwidth/mês)
- **Railway:** Grátis ($5 crédito/mês)
- **Base de dados:** Grátis (Neon ou Supabase)

### Twilio (SMS)
- **Portugal:** ~€0.07 por SMS
- **100 clientes/mês:** ~€7/mês
- **500 clientes/mês:** ~€35/mês

**Nota:** Preços aproximados, verifique em [twilio.com/pricing](https://www.twilio.com/pricing)

---

## 🎉 Deploy Completo!

A sua aplicação está agora online e a enviar lembretes automaticamente! 🚀

Se tiver problemas, consulte os logs ou abra uma issue no repositório.
