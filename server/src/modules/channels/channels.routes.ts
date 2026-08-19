import { FastifyInstance } from 'fastify';
import { 
  listChannelsHandler, 
  toggleChannelStatusHandler, 
  webchatMessageHandler, 
  whatsappWebhookHandler 
} from './channels.controller.js';

export async function channelsRoutes(fastify: FastifyInstance) {
  // Public Webhooks for WhatsApp & Webchat Widget
  fastify.post('/whatsapp/webhook', whatsappWebhookHandler);

  // Authenticated Channel Management routes
  fastify.register(async (authScope) => {
    authScope.addHook('onRequest', async (req, reply) => {
      try {
        await req.jwtVerify();
      } catch (err) {
        reply.status(401).send({ message: 'Não autorizado' });
      }
    });

    authScope.get('/', listChannelsHandler);
    authScope.post('/:channelId/toggle', toggleChannelStatusHandler);
    authScope.post('/webchat/message', webchatMessageHandler);
  });
}
