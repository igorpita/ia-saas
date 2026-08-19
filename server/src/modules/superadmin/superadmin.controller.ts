import { FastifyRequest, FastifyReply } from 'fastify';

export async function superadminMetricsHandler(req: FastifyRequest, reply: FastifyReply) {
  const prisma = req.server.prisma;

  const tenants = await prisma.tenant.findMany({
    include: {
      _count: { select: { agents: true, users: true } }
    }
  });

  const totalMrr = tenants.reduce((acc: number, t: any) => {
    const planMrr = t.plan === 'ENTERPRISE' ? 3990 : t.plan === 'PRO' ? 1490 : t.plan === 'STARTER' ? 490 : 0;
    return acc + planMrr;
  }, 0);

  const activeCount = tenants.filter((t: any) => t.status === 'ACTIVE').length;
  const totalTokens = tenants.reduce((acc: number, t: any) => acc + (t.builtInTokensUsed || 0), 0);

  return reply.send({
    metrics: {
      totalMrr,
      activeTenantsCount: activeCount,
      totalTenantsCount: tenants.length,
      builtInTokensProcessed: totalTokens,
      infrastructureUptimePercentage: 99.98
    }
  });
}

export async function superadminTenantsHandler(req: FastifyRequest, reply: FastifyReply) {
  const prisma = req.server.prisma;

  const tenants = await prisma.tenant.findMany({
    include: {
      _count: { select: { agents: true, users: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const formattedTenants = tenants.map((t: any) => ({
    id: t.id,
    name: t.name,
    email: `${t.slug}@empresa.com.br`,
    plan: t.plan.toLowerCase(),
    mrr: t.plan === 'ENTERPRISE' ? 3990 : t.plan === 'PRO' ? 1490 : t.plan === 'STARTER' ? 490 : 0,
    tokensUsedThisMonth: t.builtInTokensUsed,
    agentsCount: t._count.agents,
    usersCount: t._count.users,
    status: t.status.toLowerCase(),
    createdAt: new Date(t.createdAt).toLocaleDateString('pt-BR')
  }));

  return reply.send({ tenants: formattedTenants });
}

export async function impersonateTenantHandler(req: FastifyRequest, reply: FastifyReply) {
  const { tenantId } = req.params as { tenantId: string };
  const prisma = req.server.prisma;

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { users: true }
  });

  if (!tenant) return reply.status(404).send({ message: 'Tenant não encontrado.' });

  const adminUser = tenant.users[0];

  const token = req.server.jwt.sign({
    userId: adminUser?.id || 'impersonated-user-id',
    tenantId: tenant.id,
    role: 'SUPERADMIN'
  });

  return reply.send({
    token,
    tenant,
    impersonatedUser: adminUser
  });
}
