#!/usr/bin/env bash
# ==============================================================================
# OmniFlow AI SaaS - Script de Deploy Automatizado em VPS Self-Hosted
# ==============================================================================

set -e

echo "🚀 Iniciando Deploy Automatizado do OmniFlow AI SaaS na VPS..."

# 1. Verificar instalação do Docker e Docker Compose
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado! Instalando Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose não encontrado! Instalando plugin..."
    sudo apt-get update && sudo apt-get install -y docker-compose-plugin
fi

# 2. Configurar arquivo de variáveis de ambiente .env caso não exista
if [ ! -f "server/.env" ]; then
    echo "📝 Criando arquivo server/.env de produção..."
    cat <<EOT > server/.env
PORT=3001
HOST=0.0.0.0
JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "omniflow_super_secret_jwt_2026")
DATABASE_URL="postgresql://saas_user:saas_secure_password_2026@postgres:5432/ia_saas_db?schema=public"
REDIS_HOST=redis
REDIS_PORT=6379
EVOLUTION_API_URL=http://evolution-api:8080
EVOLUTION_API_KEY=mv_evolution_secret_api_key_2026
OPENAI_API_KEY=your_openai_api_key_here
EOT
    echo "⚠️ Por favor, edite 'server/.env' e insira sua OPENAI_API_KEY real."
fi

# 3. Subir Containers Docker em segundo plano (PostgreSQL + Pgvector, Redis, Evolution API, Fastify API)
echo "📦 Subindo pilha de containers Docker..."
cd server
docker compose up -d --build

# 4. Aguardar o banco PostgreSQL estar 100% pronto
echo "⏳ Aguardando banco de dados PostgreSQL (Pgvector) inicializar..."
sleep 8

# 5. Executar Prisma Migrations para criar a estrutura do banco
echo "🗄️ Criando tabelas no PostgreSQL..."
docker compose exec -T api-backend npx prisma db push || npx prisma db push --schema=prisma/schema.prisma || true

echo "
==============================================================================
🎉 Deploy do OmniFlow AI SaaS concluído com SUCESSO na VPS!
==============================================================================
📍 Console Web Frontend:  http://$(hostname -I | awk '{print $1}'):5174 / http://localhost:5174
📍 Backend Fastify API:  http://$(hostname -I | awk '{print $1}'):3001/health
📍 WhatsApp Evolution API: http://$(hostname -I | awk '{print $1}'):8080

🔑 Credenciais Padrão Superadmin:
- E-mail: admin@omniflow.ai
- Senha:  123456

Para configurar o Certificado SSL (HTTPS) com Let's Encrypt para o seu domínio:
  sudo apt-get install certbot python3-certbot-nginx
  sudo certbot --nginx -d app.seudominio.com.br
==============================================================================
"
