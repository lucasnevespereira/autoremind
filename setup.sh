#!/bin/bash

# Script de setup automático para AutoRemind PT
# Execute: bash setup.sh

echo "🚗 AutoRemind PT - Setup Automático"
echo "===================================="
echo ""

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "❌ Node.js não está instalado!"
    echo "   Instale em: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js encontrado: $(node -v)"
echo ""

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null
then
    echo "❌ npm não está instalado!"
    exit 1
fi

echo "✅ npm encontrado: $(npm -v)"
echo ""

# Instalar dependências
echo "📦 A instalar dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências!"
    exit 1
fi

echo "✅ Dependências instaladas com sucesso!"
echo ""

# Criar ficheiro .env se não existir
if [ ! -f .env ]; then
    echo "📝 A criar ficheiro .env..."
    cat > .env << 'EOF'
# Base de Dados PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/autoremind

# Cron Secret (mude para algo seguro em produção)
CRON_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "mude-isto-por-favor")
EOF
    echo "✅ Ficheiro .env criado!"
    echo "   ⚠️  ATENÇÃO: Configure a DATABASE_URL no ficheiro .env"
else
    echo "ℹ️  Ficheiro .env já existe, a manter..."
fi

echo ""
echo "======================================"
echo "✨ Setup completo!"
echo ""
echo "Próximos passos:"
echo ""
echo "1️⃣  Configure a DATABASE_URL no ficheiro .env"
echo "2️⃣  Execute: npm run db:push"
echo "3️⃣  Execute: npm run dev"
echo "4️⃣  Abra: http://localhost:3000"
echo ""
echo "📚 Consulte o GUIA_RAPIDO.md para mais informações"
echo "======================================"
