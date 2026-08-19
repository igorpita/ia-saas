import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import dotenv from 'dotenv';

import prismaPlugin from './plugins/prisma.js';
import redisPlugin from './plugins/redis.js';

import { authRoutes } from './modules/auth/auth.routes.js';
import { knowledgeRoutes } from './modules/knowledge/knowledge.routes.js';
import { chatsRoutes } from './modules/chats/chats.routes.js';
import { agentsRoutes } from './modules/agents/agents.routes.js';
import { channelsRoutes } from './modules/channels/channels.routes.js';
import { campaignsRoutes } from './modules/campaigns/campaigns.routes.js';
import { superadminRoutes } from './modules/superadmin/superadmin.routes.js';

dotenv.config();

const fastify = Fastify({
  logger: true
});

async function main() {
  await fastify.register(cors, { origin: true });
  await fastify.register(jwt, { secret: process.env.JWT_SECRET || 'super_secret_jwt_saas_key_2026' });
  await fastify.register(websocket);

  // Core Data Plugins
  await fastify.register(prismaPlugin);
  await fastify.register(redisPlugin);

  // Health check
  fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date() }));

  // API Module Routes
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(knowledgeRoutes, { prefix: '/api/knowledge' });
  await fastify.register(chatsRoutes, { prefix: '/api/chats' });
  await fastify.register(agentsRoutes, { prefix: '/api/agents' });
  await fastify.register(channelsRoutes, { prefix: '/api/channels' });
  await fastify.register(campaignsRoutes, { prefix: '/api/campaigns' });
  await fastify.register(superadminRoutes, { prefix: '/api/superadmin' });

  const port = Number(process.env.PORT) || 3001;
  const host = process.env.HOST || '0.0.0.0';

  try {
    await fastify.listen({ port, host });
    console.log(`🚀 Production Fastify Backend running on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
