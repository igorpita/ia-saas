import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  companyName: z.string().min(2),
  adminName: z.string().min(2),
  adminEmail: z.string().email(),
  password: z.string().min(6).default('123456'),
  plan: z.enum(['STARTER', 'PRO', 'ENTERPRISE', 'TRIAL']).default('TRIAL'),
  customLlmProvider: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export async function registerTenantHandler(req: FastifyRequest, reply: FastifyReply) {
  const body = registerSchema.parse(req.body);
  const prisma = req.server.prisma;

  // Check existing user
  const existingUser = await prisma.user.findUnique({ where: { email: body.adminEmail } });
  if (existingUser) {
    return reply.status(400).send({ message: 'E-mail já cadastrado na plataforma.' });
  }

  const slug = body.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const passwordHash = await bcrypt.hash(body.password, 10);

  // Transaction: Create Tenant, Groups, Admin User & Default Agent
  const result = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name: body.companyName,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        plan: body.plan,
        trialDaysLeft: 14,
        customLlmProvider: body.customLlmProvider || 'builtin',
        customLlmModel: body.customLlmProvider !== 'builtin' ? 'GPT-4o (BYO-LLM)' : 'Moveo AI Engine v3'
      }
    });

    const adminUser = await tx.user.create({
      data: {
        tenantId: tenant.id,
        name: body.adminName,
        email: body.adminEmail,
        passwordHash,
        role: 'WORKSPACE_ADMIN',
        status: 'ONLINE',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      }
    });

    // Create Default Specialized Groups
    const groupTi = await tx.specializedGroup.create({
      data: { tenantId: tenant.id, name: 'Service Desk TI', description: 'Suporte a sistemas e senhas', color: '#2563eb' }
    });
    await tx.specializedGroup.create({
      data: { tenantId: tenant.id, name: 'Comercial & Vendas', description: 'Atendimento a novos associados', color: '#10b981' }
    });
    await tx.specializedGroup.create({
      data: { tenantId: tenant.id, name: 'Financeiro & Cobrança', description: 'Emissão de boletos e anuidades', color: '#f59e0b' }
    });

    // Assign admin to TI group
    await tx.userGroupAssignment.create({
      data: { userId: adminUser.id, groupId: groupTi.id }
    });

    // Create Default AI Agent
    const agent = await tx.agent.create({
      data: {
        tenantId: tenant.id,
        name: 'Suporte ao Cliente Agente SD TI',
        type: 'Suporte ao Cliente',
        systemPrompt: 'Você é o Agente Virtual do Service Desk TI. Responda cortês e objetivamente com base na base de conhecimento.',
        status: 'PUBLISHED'
      }
    });

    // Create Default Flow Nodes for Greetings & Transfer
    await tx.flowNode.create({
      data: {
        agentId: agent.id,
        type: 'intent',
        title: 'Greetings',
        content: '#greetings'
      }
    });

    await tx.flowNode.create({
      data: {
        agentId: agent.id,
        type: 'text',
        title: 'Mensagem de Texto',
        content: 'Olá! Sou o Agente de IA do Service Desk. Como posso te ajudar hoje?'
      }
    });

    return { tenant, adminUser };
  });

  const token = req.server.jwt.sign({
    userId: result.adminUser.id,
    tenantId: result.tenant.id,
    role: result.adminUser.role
  });

  return reply.status(201).send({
    token,
    user: {
      id: result.adminUser.id,
      name: result.adminUser.name,
      email: result.adminUser.email,
      role: result.adminUser.role
    },
    tenant: result.tenant
  });
}

export async function loginHandler(req: FastifyRequest, reply: FastifyReply) {
  const body = loginSchema.parse(req.body);
  const prisma = req.server.prisma;

  const user = await prisma.user.findUnique({
    where: { email: body.email },
    include: { tenant: true }
  });

  if (!user) {
    return reply.status(401).send({ message: 'Credenciais inválidas.' });
  }

  const isValidPassword = await bcrypt.compare(body.password, user.passwordHash);
  if (!isValidPassword) {
    return reply.status(401).send({ message: 'Credenciais inválidas.' });
  }

  const token = req.server.jwt.sign({
    userId: user.id,
    tenantId: user.tenantId,
    role: user.role
  });

  return reply.send({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl
    },
    tenant: user.tenant
  });
}

export async function meHandler(req: FastifyRequest, reply: FastifyReply) {
  const payload = req.user as { userId: string; tenantId: string; role: string };
  const prisma = req.server.prisma;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { tenant: true }
  });

  if (!user) return reply.status(404).send({ message: 'Usuário não encontrado.' });

  return reply.send({ user, tenant: user.tenant });
}
