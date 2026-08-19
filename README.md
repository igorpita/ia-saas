# ⚡ OmniFlow AI SaaS - Plataforma de Atendimento Multicanal com Agentes de IA

OmniFlow AI é uma solução **SaaS Full-Stack Multi-tenant** para atendimento automatizado omnichannel via **WhatsApp**, **Webchat**, **E-mail**, **Telegram**, **Instagram** e **Twilio Voice**, integrando RAG (Pgvector), transbordo humano para grupos especializados (*Service Desk TI*, *Comercial*, *Financeiro*, *N2*), checkout autônomo e suporte BYO-LLM (OpenAI, Anthropic, Gemini, Groq, Ollama).

---

## 🚀 Instalação Rápida em 1 Comando (Linux VPS)

Abra o terminal da sua VPS e execute o comando abaixo:

```bash
bash <(curl -sSL https://raw.githubusercontent.com/igorpita/ia-saas/main/install.sh)
```

> **Nota**: Se tiver um domínio próprio configurado (ex: `setup.omniflow.ai`), você pode redirecioná-lo para a URL do `install.sh` acima e utilizar:
> ```bash
> bash <(curl -sSL setup.omniflow.ai)
> ```

---

## 🛠️ O que o Instalador `install.sh` Faz Autonomamente:

1. Instala Docker e Docker Compose na VPS (caso necessário).
2. Clona o repositório em `/opt/omniflow-saas`.
3. Gera o arquivo de ambiente `server/.env`.
4. Inicializa os containers Docker em segundo plano:
   - `omniflow_postgres` (PostgreSQL 16 com extensão `pgvector`).
   - `omniflow_redis` (Redis 7 para filas BullMQ).
   - `omniflow_evolution_api` (Evolution API v2 para WhatsApp).
   - `omniflow_api_backend` (Backend Fastify Node.js na porta 3001).
5. Executa as Migrations do Banco de Dados via Prisma.
6. Exibe a tela de confirmação e credenciais administrativas.

---

## 🔒 Certificado SSL / HTTPS para Domínio Próprio

Para publicar seu SaaS com HTTPS seguro:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d app.seudominio.com.br
```

---

## 🔑 Credenciais Padrão do Superadmin

- **E-mail**: `admin@omniflow.ai`
- **Senha**: `123456`
