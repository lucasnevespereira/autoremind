# 🚗 AutoRemind PT

**Lembretes de revisão automáticos para oficinas de automóveis em Portugal**

Uma aplicação simples e amigável que permite a mecânicos enviarem lembretes por SMS aos seus clientes quando a revisão do carro está a chegar.

---

## ✨ Funcionalidades

- 📱 **Envio de SMS automático** via Twilio
- 👥 **Gestão simples de clientes** (adicionar, listar, eliminar)
- 📅 **Lembretes automáticos** 7 dias antes da revisão
- ⚙️ **Configuração fácil** do Twilio
- 🇵🇹 **Interface em Português** adaptada para Portugal
- 🎨 **Design limpo e amigável** para utilizadores não técnicos

---

## 🛠️ Stack Tecnológica

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (componentes UI)
- **PostgreSQL** (base de dados)
- **Drizzle ORM**
- **Twilio** (envio de SMS)
- **Server Actions** (formulários)

---

## 📦 Instalação

### 1. Clonar o repositório ou criar a pasta

```bash
cd autoremind-pt
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar a base de dados

Crie uma base de dados PostgreSQL (pode usar um serviço como [Neon](https://neon.tech), [Supabase](https://supabase.com), ou local).

### 4. Configurar variáveis de ambiente

Copie o ficheiro `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o ficheiro `.env` e preencha:

```env
# Base de Dados PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/autoremind

# Cron Secret (gere uma string aleatória para proteger a rota)
CRON_SECRET=seu-secret-aleatorio-aqui
```

**Nota:** As configurações do Twilio serão feitas diretamente na aplicação.

### 5. Criar as tabelas na base de dados

```bash
npm run db:push
```

### 6. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Aceda a aplicação em: **http://localhost:3000**

---

## 🚀 Como usar

### 1. Configurar o Twilio

1. Aceda a **Configurações** na navegação
2. Crie uma conta em [twilio.com](https://www.twilio.com) (tem créditos grátis)
3. Obtenha as credenciais:
   - **Account SID**
   - **Auth Token**
   - **Phone Number** (número português +351)
4. Cole as credenciais na página de configurações
5. Clique em **Guardar Configurações**
6. Teste enviando um SMS de teste

### 2. Adicionar clientes

1. Na página inicial, clique em **Adicionar Cliente**
2. Preencha:
   - Nome do cliente
   - Número de telemóvel (formato português)
   - Carro/Modelo
   - Data da próxima revisão
3. Clique em **Guardar Cliente**

### 3. Enviar lembretes

**Opção 1: Manual**
- Na lista de clientes, clique em **Enviar Lembrete**

**Opção 2: Automático (Cron Job)**
- Configure um cron job para chamar: `GET /api/cron/lembretes`
- Adicione o header: `Authorization: Bearer SEU_CRON_SECRET`

Exemplo com Vercel Cron:
```json
{
  "crons": [{
    "path": "/api/cron/lembretes",
    "schedule": "0 9 * * *"
  }]
}
```

Ou use serviços como [cron-job.org](https://cron-job.org) ou [EasyCron](https://www.easycron.com).

---

## 📱 Formato do SMS

```
Olá [Nome], a revisão do seu [Carro] está marcada para [Data].
Contacte a oficina para marcar o dia. Obrigado!
```

---

## 🎨 Paleta de Cores

- **Primária:** Azul (`#0066FF`)
- **Fundo:** Gradiente azul/cinza claro
- **Texto:** Cinza escuro
- **Acentos:** Azul claro, Verde (sucesso), Amarelo (aviso), Vermelho (urgente)

---

## 📝 Scripts Disponíveis

```bash
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Iniciar servidor de produção
npm run lint         # Verificar código

npm run db:generate  # Gerar migrações Drizzle
npm run db:push      # Aplicar schema à base de dados
npm run db:studio    # Abrir Drizzle Studio (interface visual)
```

---

## 🌐 Deploy (Produção)

### Opção 1: Vercel (Recomendado)

1. Faça push do código para GitHub
2. Importe o projeto em [vercel.com](https://vercel.com)
3. Configure as variáveis de ambiente
4. Configure um Vercel Cron para lembretes automáticos

### Opção 2: Outros serviços

- **Railway**
- **Render**
- **Fly.io**

Certifique-se de:
- Configurar as variáveis de ambiente
- Ter uma base de dados PostgreSQL
- Configurar um cron job externo

---

## 🔒 Segurança

- A rota de cron (`/api/cron/lembretes`) está protegida com `CRON_SECRET`
- As configurações do Twilio são guardadas na base de dados
- Não há autenticação de utilizador nesta MVP (adicione se necessário)

---

## 🆘 Resolução de Problemas

### SMS não são enviados

1. Verifique as configurações do Twilio
2. Confirme que tem créditos na conta Twilio
3. Teste com "Enviar SMS de Teste" nas configurações
4. Verifique os logs do servidor

### Base de dados não conecta

1. Verifique a `DATABASE_URL` no `.env`
2. Confirme que a base de dados está acessível
3. Execute `npm run db:push` para criar as tabelas

### Erros de build

1. Apague a pasta `.next` e `node_modules`
2. Execute `npm install` novamente
3. Execute `npm run build`

---

## 📞 Suporte

Para ajuda ou questões:
- Abra uma issue no repositório
- Consulte a documentação do [Twilio](https://www.twilio.com/docs)
- Consulte a documentação do [Next.js](https://nextjs.org/docs)

---

## 📄 Licença

Este projeto é de uso livre para mecânicos e oficinas portuguesas.

---

## 🎁 Melhorias Futuras (Opcional)

- [ ] Autenticação de utilizador
- [ ] Múltiplas oficinas (multi-tenant)
- [ ] Histórico de SMS enviados
- [ ] Templates de mensagens personalizáveis
- [ ] Dashboard com estatísticas
- [ ] Notificações por email
- [ ] App mobile

---

**Desenvolvido com ❤️ para mecânicos portugueses**

AutoRemind PT - A sua oficina sempre em contacto com os clientes
