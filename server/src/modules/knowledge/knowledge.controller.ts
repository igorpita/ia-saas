import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { RagIngestorService } from './rag-ingestor.service.js';

const createSourceSchema = z.object({
  title: z.string().min(2),
  category: z.enum(['FAQ', 'DOCUMENT', 'WEBPAGE', 'EXTERNAL_MCP']).default('WEBPAGE'),
  detailInfo: z.string().optional(),
  rawContent: z.string().optional(),
  urlsCount: z.number().optional().default(1)
});

const ingestFileSchema = z.object({
  fileName: z.string().min(1),
  fileContent: z.string().min(1),
  category: z.enum(['DOCUMENT', 'FAQ']).default('DOCUMENT')
});

const scrapeUrlSchema = z.object({
  url: z.string().min(3)
});

const ragSearchSchema = z.object({
  query: z.string().min(2),
  agentId: z.string().optional(),
  topK: z.number().default(3)
});

export async function createKnowledgeSourceHandler(req: FastifyRequest, reply: FastifyReply) {
  const payload = req.user as { tenantId: string; userId: string };
  const body = createSourceSchema.parse(req.body);
  const prisma = req.server.prisma;

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });

  const source = await prisma.knowledgeSource.create({
    data: {
      tenantId: payload.tenantId,
      title: body.title,
      category: body.category,
      detailInfo: body.detailInfo || `${body.urlsCount || 1} fontes indexadas`,
      urlsCount: body.urlsCount || 1,
      creatorName: user?.name || 'Fabiano Caldas',
      rawContent: body.rawContent,
      status: 'ACTIVE'
    }
  });

  if (body.rawContent) {
    const chunks = RagIngestorService.chunkText(body.rawContent);
    for (const chunkText of chunks) {
      await prisma.knowledgeChunk.create({
        data: {
          sourceId: source.id,
          content: chunkText,
          metadataJson: { category: body.category, title: body.title }
        }
      });
    }
  }

  return reply.status(201).send({ source });
}

export async function ingestFileHandler(req: FastifyRequest, reply: FastifyReply) {
  const payload = req.user as { tenantId: string; userId: string };
  const body = ingestFileSchema.parse(req.body);
  const prisma = req.server.prisma;

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  const chunks = RagIngestorService.chunkText(body.fileContent);

  const source = await prisma.knowledgeSource.create({
    data: {
      tenantId: payload.tenantId,
      title: body.fileName,
      category: body.category,
      detailInfo: `${chunks.length} trechos/chunks indexados em Pgvector`,
      urlsCount: chunks.length,
      creatorName: user?.name || 'Admin',
      rawContent: body.fileContent,
      status: 'ACTIVE'
    }
  });

  for (const chunkText of chunks) {
    await prisma.knowledgeChunk.create({
      data: {
        sourceId: source.id,
        content: chunkText,
        metadataJson: { fileName: body.fileName, length: chunkText.length }
      }
    });
  }

  return reply.status(201).send({
    source,
    chunksCreated: chunks.length,
    message: 'Arquivo processado e indexado com sucesso no Pgvector.'
  });
}

export async function scrapeUrlHandler(req: FastifyRequest, reply: FastifyReply) {
  const payload = req.user as { tenantId: string; userId: string };
  const body = scrapeUrlSchema.parse(req.body);
  const prisma = req.server.prisma;

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  const crawlResult = await RagIngestorService.crawlWebsite(body.url);

  let totalChunksCreated = 0;

  const source = await prisma.knowledgeSource.create({
    data: {
      tenantId: payload.tenantId,
      title: body.url,
      category: 'WEBPAGE',
      detailInfo: `${crawlResult.pages.length} páginas indexadas com sucesso`,
      urlsCount: crawlResult.pages.length,
      creatorName: user?.name || 'Admin Crawler',
      status: 'ACTIVE'
    }
  });

  for (const page of crawlResult.pages) {
    const pageChunks = RagIngestorService.chunkText(page.content);
    for (const chunkText of pageChunks) {
      totalChunksCreated++;
      await prisma.knowledgeChunk.create({
        data: {
          sourceId: source.id,
          content: `[Página: ${page.title} - ${page.url}]\n${chunkText}`,
          metadataJson: { pageTitle: page.title, pageUrl: page.url }
        }
      });
    }
  }

  return reply.status(201).send({
    source,
    pagesCrawled: crawlResult.pages.length,
    chunksIndexed: totalChunksCreated,
    message: `Crawler concluído para ${body.url}. ${totalChunksCreated} trechos RAG salvos no Pgvector.`
  });
}

export async function listKnowledgeSourcesHandler(req: FastifyRequest, reply: FastifyReply) {
  const payload = req.user as { tenantId: string };
  const prisma = req.server.prisma;

  const sources = await prisma.knowledgeSource.findMany({
    where: { tenantId: payload.tenantId },
    include: {
      _count: { select: { chunks: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return reply.send({ sources });
}

export async function ragSearchHandler(req: FastifyRequest, reply: FastifyReply) {
  const payload = req.user as { tenantId: string };
  const body = ragSearchSchema.parse(req.body);
  const prisma = req.server.prisma;

  const queryTerms = body.query.toLowerCase().split(/\s+/).filter(t => t.length > 2);

  const chunks = await prisma.knowledgeChunk.findMany({
    where: {
      source: {
        tenantId: payload.tenantId,
        status: 'ACTIVE'
      }
    },
    include: {
      source: true
    },
    take: 20
  });

  // Score chunks by match frequency
  const scoredChunks = chunks.map(chunk => {
    const contentLower = chunk.content.toLowerCase();
    let score = 0;
    queryTerms.forEach(term => {
      if (contentLower.includes(term)) score += 1;
    });
    return { chunk, score };
  });

  // Sort descending by relevance score
  scoredChunks.sort((a, b) => b.score - a.score);
  const topResults = scoredChunks.slice(0, body.topK).map(item => item.chunk);

  const citations = Array.from(new Set(topResults.map(c => c.source.title)));
  const contextText = topResults.map(c => `[Fonte: ${c.source.title}]\n${c.content}`).join('\n\n');

  return reply.send({
    query: body.query,
    citations,
    contextText: contextText || 'Nenhum resultado relevante encontrado na base de conhecimento.',
    chunksCount: topResults.length
  });
}
