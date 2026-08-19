import { FastifyInstance } from 'fastify';
import { 
  listThreadsHandler, 
  listSpecializedGroupsHandler,
  sendMessageHandler, 
  transferGroupHandler, 
  assignUserHandler,
  resolveThreadHandler,
  aiCopilotSuggestHandler 
} from './chats.controller.js';

export async function chatsRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.status(401).send({ message: 'Não autorizado' });
    }
  });

  fastify.get('/threads', listThreadsHandler);
  fastify.get('/specialized-groups', listSpecializedGroupsHandler);
  fastify.post('/threads/:threadId/messages', sendMessageHandler);
  fastify.post('/threads/:threadId/transfer', transferGroupHandler);
  fastify.post('/threads/:threadId/assign-user', assignUserHandler);
  fastify.post('/threads/:threadId/resolve', resolveThreadHandler);
  fastify.post('/threads/:threadId/ai-copilot', aiCopilotSuggestHandler);
}
