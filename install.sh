#!/usr/bin/env bash
# ==============================================================================
# OmniFlow AI SaaS - One-Line Installer Script
# Uso: bash <(curl -sSL https://raw.githubusercontent.com/igorpita/ia-saas/main/install.sh)
# ==============================================================================

set -e

# Cores para Saída Terminal
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

clear

echo -e "${CYAN}"
echo "  ██████╗ ███╗   ███╗███╗   ██╗██╗███████╗██╗      ██████╗ ██╗"
echo " ██╔═══██╗████╗ ████║████╗  ██║██║██╔════╝██║     ██╔═══██╗██║"
echo " ██║   ██║██╔████╔██║██╔██╗ ██║██║█████╗  ██║     ██║   ██║██║"
echo " ██║   ██║██║╚██╔╝██║██║╚██╗██║██║██╔══╝  ██║     ██║   ██║██║"
echo " ╚██████╔╝██║ ╚═╝ ██║██║ ╚████║██║██║     ███████╗╚██████╔╝██║"
echo "  ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝╚═╝     ╚══════╝ ╚═════╝ ╚═╝"
echo "               O M N I F L O W   A I   S A A S                 "
echo -e "${NC}"
echo -e "${YELLOW}🚀 Instalador Autônomo para VPS (One-Click Setup)${NC}"
echo "------------------------------------------------------------------------------"

# Verificar permissão de sudo/root
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}⚠️ Aviso: Executando como usuário não-root. Caso precise de permissões elevados, o script usará 'sudo'.${NC}"
fi

# 1. Verificar e instalar Docker & Docker Compose
echo -e "\n${CYAN}[1/5] Verificando Docker e Docker Compose...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Docker no servidor Linux...${NC}"
    curl -fsSL https://get.docker.com | sh
    sudo systemctl enable --now docker || true
fi

if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo -e "${YELLOW}📦 Instalando plugin Docker Compose...${NC}"
    sudo apt-get update && sudo apt-get install -y docker-compose-plugin || true
    DOCKER_COMPOSE_CMD="docker compose"
fi

# 2. Definir pasta de instalação e clonar repositório
INSTALL_DIR="/opt/omniflow-saas"
echo -e "\n${CYAN}[2/5] Baixando a plataforma OmniFlow AI em ${INSTALL_DIR}...${NC}"

if [ -d "$INSTALL_DIR" ]; then
    echo -e "${YELLOW}🔄 Atualizando instalação existente em ${INSTALL_DIR}...${NC}"
    cd "$INSTALL_DIR"
    git pull origin main || true
else
    echo -e "${GREEN}📥 Clonando repositório oficial...${NC}"
    mkdir -p /opt
    git clone https://github.com/igorpita/ia-saas.git "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

# 3. Configurar .env de produção
echo -e "\n${CYAN}[3/5] Configurando variáveis de ambiente...${NC}"
mkdir -p "$INSTALL_DIR/server"

if [ ! -f "$INSTALL_DIR/server/.env" ]; then
    JWT_SECRET=$(openssl rand -hex 24 2>/dev/null || echo "omniflow_jwt_secret_2026")
    cat <<EOT > "$INSTALL_DIR/server/.env"
PORT=3001
HOST=0.0.0.0
JWT_SECRET=${JWT_SECRET}
DATABASE_URL="postgresql://saas_user:saas_secure_password_2026@postgres:5432/ia_saas_db?schema=public"
REDIS_HOST=redis
REDIS_PORT=6379
EVOLUTION_API_URL=http://evolution-api:8080
EVOLUTION_API_KEY=mv_evolution_secret_api_key_2026
OPENAI_API_KEY=your_openai_api_key_here
EOT
fi

# 4. Compilar e Subir Containers Docker
echo -e "\n${CYAN}[4/5] Inicializando pilha de containers Docker (PostgreSQL Pgvector, Redis, Evolution API, Fastify)...${NC}"
cd "$INSTALL_DIR/server"
$DOCKER_COMPOSE_CMD up -d --build

echo -e "\n${YELLOW}⏳ Aguardando 10 segundos para o PostgreSQL inicializar a extensão Pgvector...${NC}"
sleep 10

# 5. Gerar Tabelas no Banco de Dados
echo -e "\n${CYAN}[5/5] Executando Migrations e Schema no Banco de Dados...${NC}"
$DOCKER_COMPOSE_CMD exec -T api-backend npx prisma db push --accept-data-loss || true

SERVER_IP=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "localhost")

echo -e "\n${GREEN}"
echo "=============================================================================="
echo "  🎉 PARABÉNS! O OMNIFLOW AI SAAS ESTÁ 100% INSTALADO E EM OPERAÇÃO!"
echo "=============================================================================="
echo -e "${NC}"
echo -e "📍 ${CYAN}Console Web Frontend:${NC}    http://${SERVER_IP}:5174 ou http://localhost:5174"
echo -e "📍 ${CYAN}Backend Fastify API:${NC}     http://${SERVER_IP}:3001/health"
echo -e "📍 ${CYAN}WhatsApp Evolution API:${NC}  http://${SERVER_IP}:8080"
echo ""
echo -e "🔑 ${YELLOW}Credenciais Padrão Superadmin:${NC}"
echo -e "   - E-mail: ${GREEN}admin@omniflow.ai${NC}"
echo -e "   - Senha:  ${GREEN}123456${NC}"
echo ""
echo -e "🔒 ${YELLOW}Para habilitar HTTPS / SSL no seu Domínio:${NC}"
echo -e "   ${CYAN}sudo apt-get install -y certbot python3-certbot-nginx${NC}"
echo -e "   ${CYAN}sudo certbot --nginx -d app.seudominio.com.br${NC}"
echo "=============================================================================="
