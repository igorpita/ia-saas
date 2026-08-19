import { FastifyInstance } from 'fastify';
import { 
  createKnowledgeSourceHandler, 
  listKnowledgeSourcesHandler, 
  ragSearchHandler,
  ingestFileHandler,
  scrapeUrlHandler
} from './knowledge.controller.js';

export async function knowledgeRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.status(401).send({ message: 'Não autorizado' });
    }
  });

  fastify.post('/sources', createKnowledgeSourceHandler);
  fastify.get('/sources', listKnowledgeSourcesHandler);
  fastify.post('/ingest-file', ingestFileHandler);
  fastify.post('/scrape-url', scrapeUrlHandler);
  fastify.post('/rag-search', ragSearchHandler);
}
