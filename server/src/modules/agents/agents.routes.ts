import { FastifyInstance } from 'fastify';
import { 
  listAgentsHandler, 
  createAgentHandler, 
  updateAgentHandler, 
  executeFlowHandler 
} from './agents.controller.js';

export async function agentsRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.status(401).send({ message: 'Não autorizado' });
    }
  });

  fastify.get('/', listAgentsHandler);
  fastify.post('/', createAgentHandler);
  fastify.put('/:agentId', updateAgentHandler);
  fastify.post('/:agentId/execute-flow', executeFlowHandler);
}
