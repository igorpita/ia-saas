import { FastifyInstance } from 'fastify';
import { registerTenantHandler, loginHandler, meHandler } from './auth.controller.js';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register-tenant', registerTenantHandler);
  fastify.post('/login', loginHandler);

  fastify.get('/me', {
    onRequest: [async (req, reply) => {
      try {
        await req.jwtVerify();
      } catch (err) {
        reply.status(401).send({ message: 'Não autorizado' });
      }
    }]
  }, meHandler);
}
