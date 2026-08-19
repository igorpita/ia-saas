import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { WhatsAppService } from './whatsapp.service.js';
import { FlowEngineService } from '../agents/flow-engine.service.js';

const webchatMessageSchema = z.object({
  contactName: z.string().default('Visitante Web'),
  messageText: z.string().min(1),
  threadId: z.string().optional()
});

const whatsappWebhookSchema = z.object({
  event: z.string().optional(),
  instance: z.string().optional(),
  data: z.object({
    key: z.object({
      remoteJid: z.string(),
      fromMe: z.boolean().optional()
    }),
    pushName: z.string().optional(),
    message: z.object({
      conversation: z.string().optional(),
      extendedTextMessage: z.object({ text: z.string() }).optional()
    }).optional()
  }).optional()
});

export async function listChannelsHandler(req: FastifyRequest, reply: FastifyReply) {
  const payload = req.user as { tenantId: string };
  const prisma = req.server.prisma;

  let channels = await prisma.channelConfig.findMany({
    where: { tenantId: payload.tenantId }
  });

  if (channels.length === 0) {
    const defaults = [
      { tenantId: payload.tenantId, name: 'Webchat Widget', type: 'webchat', status: 'ACTIVE' },
      { tenantId: payload.tenantId, name: 'WhatsApp Oficial Evolution API', type: 'whatsapp', status: 'ACTIVE' },
      { tenantId: payload.tenantId, name: 'E-mail Corporativo OAB', type: 'email', status: 'ACTIVE' },
      { tenantId: payload.tenantId, name: 'Telegram Bot', type: 'telegram', status: 'ACTIVE' },
      { tenantId: payload.tenantId, name: 'Instagram Direct', type: 'instagram', status: 'MISSING_CREDENTIALS' },
      { tenantId: payload.tenantId, name: 'Twilio Voice Bot', type: 'twilio_voice', status: 'ACTIVE' }
    ];

    for (const d of defaults) {
      await prisma.channelConfig.create({ data: d as any });
    }

    channels = await prisma.channelConfig.findMany({ where: { tenantId: payload.tenantId } });
  }

  return reply.send({ channels });
}

export async function toggleChannelStatusHandler(req: FastifyRequest, reply: FastifyReply) {
  const { channelId } = req.params as { channelId: string };
  const prisma = req.server.prisma;

  const current = await prisma.channelConfig.findUnique({ where: { id: channelId } });
  if (!current) return reply.status(404).send({ message: 'Canal não encontrado.' });

  const updated = await prisma.channelConfig.update({
    where: { id: channelId },
    data: {
      status: current.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE',
      lastActivity: new Date()
    }
  });

  return reply.send({ channel: updated });
}

export async function webchatMessageHandler(req: FastifyRequest, reply: FastifyReply) {
  const payload = req.user as { tenantId: string };
  const body = webchatMessageSchema.parse(req.body);
  const prisma = req.server.prisma;

  // Find or Create ChatThread
  let thread = body.threadId ? await prisma.chatThread.findUnique({ where: { id: body.threadId } }) : null;

  if (!thread) {
    const groupTi = await prisma.specializedGroup.findFirst({
      where: { tenantId: payload.tenantId, name: { contains: 'TI' } }
    });

    thread = await prisma.chatThread.create({
      data: {
        tenantId: payload.tenantId,
        contactName: body.contactName,
        contactChannel: 'webchat',
        lastMessage: body.messageText,
        assignedGroupId: groupTi?.id,
        status: 'INBOX'
      }
    });
  }

  // Create User Message
  await prisma.chatMessage.create({
    data: {
      threadId: thread.id,
      senderType: 'USER',
      senderName: body.contactName,
      text: body.messageText
    }
  });

  // Get active agent for tenant
  const agent = await prisma.agent.findFirst({
    where: { tenantId: payload.tenantId, status: 'PUBLISHED' }
  });

  if (!agent) {
    return reply.send({
      thread,
      replyText: 'Olá! Não há nenhum agente de IA publicado no momento.'
    });
  }

  // Execute Flow Engine RAG
  const flowResult = await FlowEngineService.executeFlow(prisma, {
    tenantId: payload.tenantId,
    agentId: agent.id,
    userMessage: body.messageText,
    chatThreadId: thread.id
  });

  // Save Agent Reply Message
  const agentMsg = await prisma.chatMessage.create({
    data: {
      threadId: thread.id,
      senderType: 'AGENT',
      senderName: agent.name,
      text: flowResult.replyText,
      isAiGenerated: true
    }
  });

  return reply.send({
    threadId: thread.id,
    agentMessage: agentMsg,
    citations: flowResult.citations,
    isHumanHandoff: flowResult.isHumanHandoff
  });
}

export async function whatsappWebhookHandler(req: FastifyRequest, reply: FastifyReply) {
  const body = whatsappWebhookSchema.parse(req.body);
  const prisma = req.server.prisma;

  if (!body.data || body.data.key?.fromMe) {
    return reply.send({ status: 'ignored' });
  }

  const senderJid = body.data.key.remoteJid;
  const pushName = body.data.pushName || 'Contato WhatsApp';
  const textMessage = body.data.message?.conversation || body.data.message?.extendedTextMessage?.text || '';

  if (!textMessage) return reply.send({ status: 'no_text' });

  // Get default tenant
  const tenant = await prisma.tenant.findFirst({ where: { status: 'ACTIVE' } });
  if (!tenant) return reply.send({ status: 'no_tenant' });

  // Find or Create Thread for WhatsApp contact
  let thread = await prisma.chatThread.findFirst({
    where: { tenantId: tenant.id, externalChatId: senderJid }
  });

  if (!thread) {
    const groupTi = await prisma.specializedGroup.findFirst({
      where: { tenantId: tenant.id, name: { contains: 'TI' } }
    });

    thread = await prisma.chatThread.create({
      data: {
        tenantId: tenant.id,
        contactName: `${pushName} (${senderJid.split('@')[0]})`,
        contactChannel: 'whatsapp',
        customerPhone: senderJid.split('@')[0],
        externalChatId: senderJid,
        lastMessage: textMessage,
        assignedGroupId: groupTi?.id,
        status: 'INBOX'
      }
    });
  }

  // Create User Message
  await prisma.chatMessage.create({
    data: {
      threadId: thread.id,
      senderType: 'USER',
      senderName: pushName,
      text: textMessage
    }
  });

  const agent = await prisma.agent.findFirst({
    where: { tenantId: tenant.id, status: 'PUBLISHED' }
  });

  if (agent) {
    const flowResult = await FlowEngineService.executeFlow(prisma, {
      tenantId: tenant.id,
      agentId: agent.id,
      userMessage: textMessage,
      chatThreadId: thread.id
    });

    await prisma.chatMessage.create({
      data: {
        threadId: thread.id,
        senderType: 'AGENT',
        senderName: agent.name,
        text: flowResult.replyText,
        isAiGenerated: true
      }
    });

    // Send WhatsApp Reply via Evolution API
    await WhatsAppService.sendMessage(body.instance || 'oab_ba_instance', senderJid, flowResult.replyText);
  }

  return reply.send({ status: 'success' });
}
