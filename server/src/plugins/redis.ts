import fp from 'fastify-plugin';
import Redis from 'ioredis';

declare module 'fastify' {
  interface FastifyInstance {
    redis: any;
  }
}

export default fp(async (fastify) => {
  const redisHost = process.env.REDIS_HOST || 'localhost';
  const redisPort = Number(process.env.REDIS_PORT) || 6379;

  const redis = new Redis({
    host: redisHost,
    port: redisPort,
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    retryStrategy() {
      return null;
    }
  });

  redis.on('error', () => {
    // Suppress unhandled event crashes when redis container is not running locally yet
  });

  try {
    await redis.connect();
    fastify.log.info('Redis connected successfully');
  } catch (err) {
    fastify.log.warn('Redis connection deferred/offline mode');
  }

  fastify.decorate('redis', redis);

  fastify.addHook('onClose', async (server) => {
    try {
      await server.redis.quit();
    } catch (e) {}
  });
});
