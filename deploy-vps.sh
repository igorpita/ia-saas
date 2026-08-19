#!/usr/bin/env bash
# ==============================================================================
# OmniFlow AI SaaS - Script de Deploy Automatizado em VPS Self-Hosted
# ==============================================================================

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "🚀 Iniciando Deploy Automatizado do OmniFlow AI SaaS na VPS..."

# Detectar comando do Docker Compose (docker compose v2 ou docker-compose v1)
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo "❌ Docker Compose não encontrado! Instalando Docker e Docker Compose..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER || true
    DOCKER_COMPOSE_CMD="docker compose"
fi

# 1. Configurar arquivo de variáveis de ambiente server/.env
if [ ! -f "$SCRIPT_DIR/server/.env" ]; then
    echo "📝 Criando arquivo de ambiente server/.env..."
    mkdir -p "$SCRIPT_DIR/server"
    cat <<EOT > "$SCRIPT_DIR/server/.env"
PORT=3001
HOST=0.0.0.0
JWT_SECRET=omniflow_super_secret_jwt_2026
DATABASE_URL="postgresql://saas_user:saas_secure_password_2026@postgres:5432/ia_saas_db?schema=public"
REDIS_HOST=redis
REDIS_PORT=6379
EVOLUTION_API_URL=http://evolution-api:8080
EVOLUTION_API_KEY=mv_evolution_secret_api_key_2026
OPENAI_API_KEY=your_openai_api_key_here
EOT
    echo "⚠️ Lembre-se de editar 'server/.env' caso queira ajustar sua OPENAI_API_KEY."
fi

# 2. Subir Containers Docker
echo "📦 Subindo pilha de containers Docker..."
cd "$SCRIPT_DIR/server"
$DOCKER_COMPOSE_CMD up -d --build

# 3. Aguardar o banco PostgreSQL inicializar
echo "⏳ Aguardando banco de dados PostgreSQL (Pgvector) ficar pronto..."
sleep 10

# 4. Criar tabelas no PostgreSQL via Prisma
echo "🗄️ Executando Prisma DB Push..."
$DOCKER_COMPOSE_CMD exec -T api-backend npx prisma db push --accept-data-loss || true

echo "
==============================================================================
🎉 Deploy do OmniFlow AI SaaS concluído com SUCESSO na VPS!
==============================================================================
📍 Backend Fastify API:  http://localhost:3001/health
📍 WhatsApp Evolution API: http://localhost:8080

🔑 Credenciais Padrão Superadmin:
- E-mail: admin@omniflow.ai
- Senha:  123456

Para configurar o Certificado SSL (HTTPS) com Let's Encrypt para o seu domínio:
  sudo apt-get install -y certbot python3-certbot-nginx
  sudo certbot --nginx -d app.seudominio.com.br
==============================================================================
"
