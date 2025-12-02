# 🤝 Como Contribuir - AutoRemind PT

Obrigado por considerar contribuir para o AutoRemind PT!

---

## 🎯 Objetivos do Projeto

Este projeto foi criado para ser:

- **Simples** - fácil de usar para mecânicos não técnicos
- **Funcional** - resolve um problema real de forma eficaz
- **Amigável** - interface limpa e em português de Portugal

---

## 💡 Como Pode Ajudar

### Reportar Bugs

Se encontrou um problema:

1. Verifique se já não foi reportado nas [Issues](../../issues)
2. Crie uma nova issue com:
   - Descrição do problema
   - Passos para reproduzir
   - Comportamento esperado vs. real
   - Screenshots (se aplicável)

### Sugerir Melhorias

Tem uma ideia para melhorar a aplicação?

1. Abra uma issue com a etiqueta `enhancement`
2. Descreva a funcionalidade e o problema que resolve
3. Explique como beneficiaria os utilizadores

### Contribuir com Código

1. Faça fork do repositório
2. Crie um branch para a sua funcionalidade:
   ```bash
   git checkout -b feature/minha-funcionalidade
   ```
3. Faça as suas alterações
4. Teste localmente
5. Commit com mensagens descritivas:
   ```bash
   git commit -m "Adicionar: funcionalidade X para Y"
   ```
6. Faça push e abra um Pull Request

---

## 📝 Diretrizes de Código

### Estilo

- Use **TypeScript** para todo o código
- Siga as convenções do projeto (ESLint)
- Mantenha o código simples e legível
- Comente apenas quando necessário

### Componentes

- Use **Server Components** quando possível
- Reserve **Client Components** para interatividade
- Mantenha componentes pequenos e focados
- Nomes em português quando faz sentido

### Server Actions

- Sempre validar inputs
- Retornar objetos com `{ sucesso, mensagem, erro }`
- Use `revalidatePath()` quando necessário

---

## 🧪 Testes

Antes de submeter:

- [ ] A aplicação compila sem erros (`npm run build`)
- [ ] Testou localmente a funcionalidade
- [ ] Não quebra funcionalidades existentes
- [ ] O código está formatado corretamente

---

## 🌍 Traduções e Textos

- **Mantenha tudo em Português de Portugal**
- Use linguagem simples e clara
- Evite jargão técnico
- Seja amigável e prestável nos textos

---

## 📦 Pull Requests

Um bom PR deve:

- Resolver apenas um problema/adicionar uma funcionalidade
- Ter uma descrição clara do que faz
- Incluir screenshots se houver mudanças visuais
- Estar pronto para merge (sem conflitos)

---

## 🎨 Design

Se contribuir com mudanças visuais:

- Mantenha a simplicidade
- Use a paleta de cores existente (azul, cinza)
- Garanta que é responsivo (mobile-friendly)
- Botões grandes e fáceis de clicar

---

## 🔐 Segurança

Se encontrou uma vulnerabilidade:

- **NÃO** abra uma issue pública
- Contacte os maintainers diretamente
- Aguarde correção antes de divulgar

---

## 📄 Licença

Ao contribuir, concorda que o seu código será licenciado sob a mesma licença do projeto.

---

## ❤️ Reconhecimento

Todos os contribuidores serão reconhecidos no README.

---

## 🙏 Obrigado!

Cada contribuição, por mais pequena que seja, ajuda a melhorar a vida dos mecânicos portugueses!
