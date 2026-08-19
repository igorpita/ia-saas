import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { FlowEngineService } from '../agents/flow-engine.service.js';

const sendMessageSchema = z.object({
  text: z.string().min(1),
  senderType: z.enum(['USER', 'AGENT', 'HUMAN_AGENT', 'SYSTEM']).default('HUMAN_AGENT'),
  senderName: z.string().optional()
});

const transferGroupSchema = z.object({
  groupId: z.string()
});

const assignUserSchema = z.object({
  userId: z.string()
});

export async function listThreadsHandler(req: FastifyRequest, reply: FastifyReply) {
  const payload = req.user as { tenantId: string };
  const prisma = req.server.prisma;

  const threads = await prisma.chatThread.findMany({
    where: { tenantId: payload.tenantId },
    include: {
      assignedGroup: true,
      messages: {
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { lastMessageTime: 'desc' }
  });

  return reply.send({ threads });
}

export async function listSpecializedGroupsHandler(req: FastifyRequest, reply: FastifyReply) {
  const payload = req.user as { tenantId: string };
  const prisma = req.server.prisma;

  let groups = await prisma.specializedGroup.findMany({
    where: { tenantId: payload.tenantId },
    include: {
      _count: { select: { threads: true, groupAssignments: true } }
    }
  });

  if (groups.length === 0) {
    const defaults = [
      { tenantId: payload.tenantId, name: 'Service Desk TI', description: 'Suporte a sistemas, senhas e acesso ao portal OAB', color: '#2563eb' },
      { tenantId: payload.tenantId, name: 'Comercial & Vendas', description: 'Atendimento a novos inscritos e anuidade OAB', color: '#10b981' },
      { tenantId: payload.tenantId, name: 'Financeiro & Cobrança', description: 'Emissão de boletos, certidões e negociação de débitos', color: '#f59e0b' },
      { tenantId: payload.tenantId, name: 'Suporte Avançado N2', description: 'Casos complexos e transbordo especializado', color: '#7c3aed' }
    ];

    for (const d of defaults) {
      await prisma.specializedGroup.create({ data: d });
    }

    groups = await prisma.specializedGroup.findMany({
      where: { tenantId: payload.tenantId },
      include: {
        _count: { select: { threads: true, groupAssignments: true } }
      }
    });
  }

  return reply.send({ groups });
}

export async function sendMessageHandler(req: FastifyRequest, reply: FastifyReply) {
  const payload = req.user as { tenantId: string; userId: string };
  const { threadId } = req.params as { threadId: string };
  const body = sendMessageSchema.parse(req.body);
  const prisma = req.server.prisma;

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });

  const message = await prisma.chatMessage.create({
    data: {
      threadId,
      senderType: body.senderType,
      senderName: body.senderName || user?.name || 'Atendente Humano',
      text: body.text,
      isAiGenerated: body.senderType === 'AGENT'
    }
  });

  await prisma.chatThread.update({
    where: { id: threadId },
    data: {
      lastMessage: body.text,
      lastMessageTime: new Date()
    }
  });

  return reply.status(201).send({ message });
}

export async function transferGroupHandler(req: FastifyRequest, reply: FastifyReply) {
  const { threadId } = req.params as { threadId: string };
  const body = transferGroupSchema.parse(req.body);
  const prisma = req.server.prisma;

  const group = await prisma.specializedGroup.findUnique({ where: { id: body.groupId } });
  if (!group) return reply.status(404).send({ message: 'Grupo especializado não encontrado.' });

  const updated = await prisma.chatThread.update({
    where: { id: threadId },
    data: {
      assignedGroupId: group.id,
      status: 'INBOX'
    }
  });

  await prisma.chatMessage.create({
    data: {
      threadId,
      senderType: 'SYSTEM',
      senderName: 'Sistema',
      text: `Conversa reencaminhada para o grupo especializado: ${group.name}`
    }
  });

  return reply.send({ thread: updated, group });
}

export async function assignUserHandler(req: FastifyRequest, reply: FastifyReply) {
  const { threadId } = req.params as { threadId: string };
  const body = assignUserSchema.parse(req.body);
  const prisma = req.server.prisma;

  const user = await prisma.user.findUnique({ where: { id: body.userId } });
  if (!user) return reply.status(404).send({ message: 'Atendente não encontrado.' });

  const updated = await prisma.chatThread.update({
    where: { id: threadId },
    data: {
      assignedUserId: user.id,
      status: 'INBOX'
    }
  });

  await prisma.chatMessage.create({
    data: {
      threadId,
      senderType: 'SYSTEM',
      senderName: 'Sistema',
      text: `Atendente humano ${user.name} assumiu a conversa.`
    }
  });

  return reply.send({ thread: updated, user });
}

export async function resolveThreadHandler(req: FastifyRequest, reply: FastifyReply) {
  const { threadId } = req.params as { threadId: string };
  const prisma = req.server.prisma;

  const updated = await prisma.chatThread.update({
    where: { id: threadId },
    data: {
      status: 'RESOLVED'
    }
  });

  await prisma.chatMessage.create({
    data: {
      threadId,
      senderType: 'SYSTEM',
      senderName: 'Sistema',
      text: 'Atendimento encerrado e marcado como resolvido.'
    }
  });

  return reply.send({ thread: updated });
}

export async function aiCopilotSuggestHandler(req: FastifyRequest, reply: FastifyReply) {
  const payload = req.user as { tenantId: string };
  const { threadId } = req.params as { threadId: string };
  const prisma = req.server.prisma;

  const thread = await prisma.chatThread.findUnique({
    where: { id: threadId },
    include: { messages: true }
  });

  if (!thread) return reply.status(404).send({ message: 'Thread não encontrada.' });

  const lastUserMsg = [...thread.messages].reverse().find(m => m.senderType === 'USER')?.text || 'ajuda suporte';

  // Perform RAG search for AI Co-Pilot
  const ragResult = await FlowEngineService.executeFlow(prisma, {
    tenantId: payload.tenantId,
    agentId: 'ag-sd-ti',
    userMessage: lastUserMsg
  });

  const suggestedText = `Olá ${thread.contactName}! ${ragResult.replyText.replace(/^Com base na base de conhecimento da OAB-BA:\s*/, '')}`;

  return reply.send({
    suggestedText,
    citations: ragResult.citations
  });
}
