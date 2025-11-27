# 🚀 Guia Rápido - AutoRemind PT

Este guia vai ajudá-lo a começar em **5 minutos**.

---

## 📋 Antes de Começar

Precisa de ter instalado:
- [Node.js](https://nodejs.org) (versão 18 ou superior)
- Uma conta [Twilio](https://www.twilio.com) (gratuita para testar)
- Uma base de dados PostgreSQL (recomendo [Neon.tech](https://neon.tech) - grátis)

---

## ⚡ Início Rápido

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar a base de dados

Crie um ficheiro `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
CRON_SECRET=qualquer-string-aleatoria-aqui
```

### 3. Criar as tabelas
```bash
npm run db:push
```

### 4. Iniciar a aplicação
```bash
npm run dev
```

Abra: **http://localhost:3000**

---

## 🎯 Próximos Passos

### 1. Configurar o Twilio

1. Vá para **Configurações** na aplicação
2. Crie uma conta em [twilio.com](https://www.twilio.com)
3. Copie as suas credenciais:
   - Account SID
   - Auth Token
   - Número de telefone (compre um número +351)
4. Cole na aplicação e clique em **Guardar**
5. Teste com **Enviar SMS de Teste**

### 2. Adicionar o primeiro cliente

1. Clique em **Adicionar Cliente**
2. Preencha os dados:
   - Nome: João Silva
   - Telefone: 912345678
   - Carro: Renault Clio 2020
   - Data da Revisão: (escolha uma data próxima para testar)
3. Clique em **Guardar Cliente**

### 3. Testar o envio de SMS

Na página inicial, clique em **Enviar Lembrete** para o cliente que acabou de adicionar.

---

## 🔧 Configurar Lembretes Automáticos

Para enviar lembretes automaticamente todos os dias às 9h da manhã:

### Opção A: Vercel (mais fácil)

Se fizer deploy na Vercel, os lembretes automáticos já estão configurados! ✅

### Opção B: Serviço Cron Externo

Use [cron-job.org](https://cron-job.org) (grátis):

1. Crie uma conta
2. Adicione um novo cron job:
   - **URL:** `https://seu-site.com/api/cron/lembretes`
   - **Frequência:** Todos os dias às 09:00
   - **Header:** `Authorization: Bearer SEU_CRON_SECRET`

---

## 📱 Como Funciona?

1. **Adiciona clientes** com a data da revisão
2. **7 dias antes** da revisão, o sistema envia automaticamente um SMS
3. O cliente recebe:
   ```
   Olá João Silva, a revisão do seu Renault Clio 2020
   está marcada para 15/12/2024.
   Contacte a oficina para marcar o dia. Obrigado!
   ```

---

## 💡 Dicas

- **Teste primeiro:** Use o seu próprio número para testar
- **Números portugueses:** O sistema aceita 912345678 ou +351912345678
- **Créditos Twilio:** A conta gratuita dá créditos para testar
- **Custos:** Cada SMS custa cerca de €0.07 (depende do país)

---

## ❓ Problemas Comuns

### "Erro ao enviar SMS"
- Verifique se tem créditos no Twilio
- Confirme que as configurações estão corretas
- Use "Enviar SMS de Teste" para diagnosticar

### "Base de dados não conecta"
- Verifique a `DATABASE_URL` no ficheiro `.env`
- Confirme que a base de dados está online

### "Página não carrega"
- Execute `npm install` novamente
- Apague a pasta `.next` e reinicie com `npm run dev`

---

## 🎉 Está Pronto!

Agora já pode:
- ✅ Adicionar clientes
- ✅ Enviar lembretes manualmente
- ✅ Deixar o sistema enviar automaticamente

---

**Bom trabalho! A sua oficina está agora mais organizada. 🚗**
