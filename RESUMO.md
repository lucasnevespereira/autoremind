# 🚗 AutoRemind PT - Resumo Executivo

---

## 📋 O Que É?

Uma aplicação web simples que permite a **mecânicos de automóveis** em Portugal enviarem **lembretes automáticos por SMS** aos seus clientes quando a revisão do carro está próxima.

---

## 🎯 Problema que Resolve

**Antes:**
- ❌ Clientes esquecem-se de marcar revisões
- ❌ Mecânico perde tempo a ligar para lembrar
- ❌ Perda de receita por revisões não realizadas

**Depois:**
- ✅ Clientes recebem SMS automático 7 dias antes
- ✅ Mecânico poupa tempo
- ✅ Mais revisões realizadas = mais receita

---

## 💰 Valor para o Utilizador

### Para o Mecânico

1. **Poupa tempo** - não precisa de ligar a cada cliente
2. **Aumenta receita** - mais clientes lembrados = mais revisões
3. **Profissional** - passa imagem moderna e organizada
4. **Simples** - interface pensada para não-técnicos

### Para o Cliente (do Mecânico)

1. Recebe lembrete atempado
2. Não se esquece da revisão
3. Mantém o carro em bom estado
4. Sente que a oficina se importa

---

## 📊 Modelo de Negócio

### Custos

| Item              | Custo Mensal (estimativa)     |
|-------------------|-------------------------------|
| Servidor          | **€0** (Vercel gratuito)      |
| Base de Dados     | **€0** (Neon gratuito)        |
| SMS (Twilio)      | **~€7** por 100 clientes      |
| **TOTAL**         | **~€7/mês** (100 clientes)    |

### Retorno

- Se **1 cliente extra** marcar revisão por mês:
  - Revisão média: **€100-150**
  - **ROI: 1400%** 🚀

---

## 🛠️ Tecnologia (para Técnicos)

**Stack moderno e eficiente:**
- Next.js 15 (React + TypeScript)
- PostgreSQL + Drizzle ORM
- Twilio API (SMS)
- Tailwind CSS + shadcn/ui
- Deploy em Vercel

**Vantagens:**
- ⚡ Rápido
- 🔒 Seguro
- 📈 Escalável
- 💸 Custo baixo

---

## 📱 Como Funciona? (3 Passos Simples)

### 1. Configurar (uma vez)
```
Criar conta Twilio → Configurar na app → Pronto!
```

### 2. Adicionar Clientes
```
Nome + Telefone + Carro + Data da Revisão → Guardar
```

### 3. Deixar Funcionar
```
Sistema envia SMS automaticamente 7 dias antes ✅
```

---

## 🎨 Interface

**Princípios de Design:**
- Simples e limpo
- Botões grandes e claros
- Texto em português (PT)
- Cores suaves (azul e cinza)
- Sem complexidade desnecessária

**Páginas:**
1. **Dashboard** - lista de clientes
2. **Adicionar Cliente** - formulário simples
3. **Configurações** - setup do Twilio

---

## 🚀 MVP vs. Produto Final

### ✅ MVP (Atual)
- Adicionar/listar/eliminar clientes
- Enviar SMS manual ou automático
- Configurações básicas Twilio
- Interface simples em PT

### 🔮 Futuro (se houver procura)
- Autenticação de utilizador
- Múltiplas oficinas
- Histórico de SMS
- Estatísticas
- App mobile
- Templates personalizáveis

---

## 📈 Métricas de Sucesso

### Para MVP
- ✅ Mecânico consegue adicionar clientes em < 1 min
- ✅ SMS enviado com sucesso em 99% dos casos
- ✅ Interface usável sem tutorial
- ✅ Custo < €10/mês para 100 clientes

### Para Produto
- 50+ oficinas ativas
- 5000+ clientes registados
- 10000+ SMS enviados/mês
- NPS > 8/10

---

## 🎯 Público-Alvo

### Primário
- **Mecânicos independentes** (1-3 mecânicos)
- **Pequenas oficinas** (até 10 funcionários)
- **Portugal continental**

### Características
- Não-técnicos
- Querem simplicidade
- Valorizam tempo
- Querem profissionalizar

---

## 💡 Diferenciação

| Concorrência          | AutoRemind PT           |
|-----------------------|-------------------------|
| Apps genéricos        | **Específico carros**   |
| Complexos             | **Muito simples**       |
| Caros                 | **~€7/mês**             |
| Em inglês             | **Português PT**        |
| Multi-propósito       | **Foco total em SMS**   |

---

## 📞 Próximos Passos

### Para Começar a Usar
1. Ler `GUIA_RAPIDO.md`
2. Executar `npm install`
3. Configurar `.env`
4. Fazer deploy (Vercel)

### Para Contribuir
1. Ler `CONTRIBUTING.md`
2. Fork + Pull Request
3. Manter simplicidade

---

## 🎁 Licença

**Uso livre para mecânicos e oficinas portuguesas.**

Projeto open-source para ajudar pequenos negócios a crescerem.

---

## 📊 Em Números

```
📱 1 SMS                = €0.07
⏱️ 7 dias antes         = tempo ideal para lembrar
⚡ < 1 minuto           = tempo para adicionar cliente
💰 €7/mês               = custo para 100 clientes
🚀 1400% ROI            = com apenas 1 revisão extra/mês
```

---

## ✨ Filosofia do Projeto

> **"Simplicidade é a sofisticação máxima"**
>
> Não queremos adicionar funcionalidades desnecessárias.
> Queremos resolver **um problema** da forma **mais simples** possível.

---

**AutoRemind PT - A sua oficina sempre em contacto com os clientes**

🚗 Desenvolvido com ❤️ para mecânicos portugueses
