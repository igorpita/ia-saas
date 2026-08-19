import { FastifyInstance } from 'fastify';
import { 
  superadminMetricsHandler, 
  superadminTenantsHandler, 
  impersonateTenantHandler 
} from './superadmin.controller.js';

export async function superadminRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.status(401).send({ message: 'Não autorizado' });
    }
  });

  fastify.get('/metrics', superadminMetricsHandler);
  fastify.get('/tenants', superadminTenantsHandler);
  fastify.post('/tenants/:tenantId/impersonate', impersonateTenantHandler);
}
