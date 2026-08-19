import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { FlowEngineService } from './flow-engine.service.js';

const createAgentSchema = z.object({
  name: z.string().min(2),
  type: z.string().default('Suporte ao Cliente'),
  language: z.string().default('Portuguese (Brazil)'),
  systemPrompt: z.string().min(5),
  temperature: z.number().default(0.3),
  llmProvider: z.string().default('builtin'),
  modelName: z.string().default('Moveo AI Engine v3')
});

const executeFlowSchema = z.object({
  userMessage: z.string().min(1),
  chatThreadId: z.string().optional()
});

export async function listAgentsHandler(req: FastifyRequest, reply: FastifyReply) {
  const payload = req.user as { tenantId: string };
  const prisma = req.server.prisma;

  const agents = await prisma.agent.findMany({
    where: { tenantId: payload.tenantId },
    include: {
      flowNodes: true,
      _count: { select: { campaigns: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return reply.send({ agents });
}

export async function createAgentHandler(req: FastifyRequest, reply: FastifyReply) {
  const payload = req.user as { tenantId: string };
  const body = createAgentSchema.parse(req.body);
  const prisma = req.server.prisma;

  const agent = await prisma.agent.create({
    data: {
      tenantId: payload.tenantId,
      name: body.name,
      type: body.type,
      language: body.language,
      systemPrompt: body.systemPrompt,
      temperature: body.temperature,
      llmProvider: body.llmProvider,
      modelName: body.modelName,
      status: 'PUBLISHED'
    }
  });

  return reply.status(201).send({ agent });
}

export async function updateAgentHandler(req: FastifyRequest, reply: FastifyReply) {
  const { agentId } = req.params as { agentId: string };
  const body = req.body as any;
  const prisma = req.server.prisma;

  const agent = await prisma.agent.update({
    where: { id: agentId },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.systemPrompt && { systemPrompt: body.systemPrompt }),
      ...(body.temperature !== undefined && { temperature: body.temperature }),
      ...(body.llmProvider && { llmProvider: body.llmProvider }),
      ...(body.modelName && { modelName: body.modelName }),
      ...(body.status && { status: body.status }),
      updatedAt: new Date()
    }
  });

  return reply.send({ agent });
}

export async function executeFlowHandler(req: FastifyRequest, reply: FastifyReply) {
  const payload = req.user as { tenantId: string };
  const { agentId } = req.params as { agentId: string };
  const body = executeFlowSchema.parse(req.body);
  const prisma = req.server.prisma;

  const result = await FlowEngineService.executeFlow(prisma, {
    tenantId: payload.tenantId,
    agentId,
    userMessage: body.userMessage,
    chatThreadId: body.chatThreadId
  });

  return reply.send(result);
}
