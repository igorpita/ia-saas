import { FastifyInstance } from 'fastify';
import { 
  listCampaignsHandler, 
  createCampaignHandler, 
  triggerCampaignJobHandler 
} from './campaigns.controller.js';

export async function campaignsRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.status(401).send({ message: 'Não autorizado' });
    }
  });

  fastify.get('/', listCampaignsHandler);
  fastify.post('/', createCampaignHandler);
  fastify.post('/:campaignId/trigger', triggerCampaignJobHandler);
}
