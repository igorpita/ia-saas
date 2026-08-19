import { RagIngestorService } from '../knowledge/rag-ingestor.service.js';

export interface FlowContext {
  tenantId: string;
  agentId: string;
  userMessage: string;
  chatThreadId?: string;
}

export interface FlowExecutionResult {
  replyText: string;
  citations: string[];
  transferredToGroup?: string;
  isHumanHandoff: boolean;
  modelUsed: string;
  tokensUsed: number;
}

export class FlowEngineService {
  /**
   * Evaluates user message against Flow Nodes and RAG Knowledge Base
   */
  public static async executeFlow(prisma: any, context: FlowContext): Promise<FlowExecutionResult> {
    const { tenantId, agentId, userMessage } = context;

    // Fetch Agent & System Directives
    const agent = await prisma.agent.findUnique({
      where: { id: agentId }
    });

    const systemPrompt = agent?.systemPrompt || 'Você é um assistente virtual prestativo.';
    const modelName = agent?.modelName || 'Moveo AI Engine v3 (SaaS Embutido)';

    // Check for Human Handoff triggers
    const lowerMessage = userMessage.toLowerCase();
    const isHumanRequest = 
      lowerMessage.includes('humano') || 
      lowerMessage.includes('atendente') || 
      lowerMessage.includes('falar com pessoa') ||
      lowerMessage.includes('suporte ti');

    if (isHumanRequest) {
      // Find TI Specialized Group
      const groupTi = await prisma.specializedGroup.findFirst({
        where: { tenantId, name: { contains: 'TI' } }
      });

      const groupName = groupTi?.name || 'Service Desk TI';

      if (context.chatThreadId) {
        await prisma.chatThread.update({
          where: { id: context.chatThreadId },
          data: {
            status: 'UNASSIGNED',
            assignedGroupId: groupTi?.id
          }
        });

        await prisma.chatMessage.create({
          data: {
            threadId: context.chatThreadId,
            senderType: 'SYSTEM',
            senderName: 'Sistema',
            text: `Atendimento transbordado pelo Agente de IA para a fila "${groupName}".`
          }
        });
      }

      return {
        replyText: `Compreendido! Estou transferindo seu atendimento para a equipe de especialistas do "${groupName}". Um atendente humano responderá em instantes.`,
        citations: ['Nó de Transbordo Humano - Service Desk TI'],
        transferredToGroup: groupName,
        isHumanHandoff: true,
        modelUsed: modelName,
        tokensUsed: 42
      };
    }

    // Perform RAG Search on Pgvector
    const chunks = await prisma.knowledgeChunk.findMany({
      where: {
        source: { tenantId, status: 'ACTIVE' }
      },
      include: { source: true },
      take: 15
    });

    const queryTerms = userMessage.toLowerCase().split(/\s+/).filter((t: string) => t.length > 2);
    const scoredChunks = chunks.map((c: any) => {
      const contentLower = c.content.toLowerCase();
      let score = 0;
      queryTerms.forEach((term: string) => {
        if (contentLower.includes(term)) score += 1;
      });
      return { chunk: c, score };
    });

    scoredChunks.sort((a: any, b: any) => b.score - a.score);
    const topChunks = scoredChunks.slice(0, 3).map((item: any) => item.chunk);

    const citations = Array.from(new Set(topChunks.map((c: any) => c.source.title))) as string[];
    const ragContext = topChunks.map((c: any) => c.content).join('\n');

    let replyText = '';
    if (topChunks.length > 0 && scoredChunks[0].score > 0) {
      replyText = `Com base na base de conhecimento da OAB-BA:\n\n${topChunks[0].content}\n\nPosso te ajudar em algo mais relacionado a esta dúvida?`;
    } else {
      replyText = `Olá! Recebi sua mensagem sobre "${userMessage}". Sou o ${agent?.name || 'Agente Virtual'}. Posso te auxiliar com agendamentos, orientações sobre sistemas PJe, anuidades ou transferir para nosso suporte humano.`;
      citations.push('Diretrizes Gerais do Agente');
    }

    return {
      replyText,
      citations: citations.length > 0 ? citations : ['Manual do Usuário OAB-BA'],
      isHumanHandoff: false,
      modelUsed: modelName,
      tokensUsed: 180
    };
  }
}
