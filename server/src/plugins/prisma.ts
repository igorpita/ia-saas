import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: any;
  }
}

export default fp(async (fastify) => {
  let prisma: any = null;

  try {
    const pkg: any = await import('@prisma/client');
    const PrismaClientClass = pkg.PrismaClient || pkg.default?.PrismaClient;
    if (PrismaClientClass) {
      prisma = new PrismaClientClass();
    }
  } catch (e) {
    fastify.log.warn('Prisma DB connection deferred');
  }

  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async (server) => {
    if (server.prisma && typeof server.prisma.$disconnect === 'function') {
      await server.prisma.$disconnect();
    }
  });
});
