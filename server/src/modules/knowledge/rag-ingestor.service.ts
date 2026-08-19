export interface ChunkResult {
  content: string;
  chunkIndex: number;
  metadata: Record<string, any>;
}

export class RagIngestorService {
  /**
   * Text Chunking Engine: divides long text into chunks with configurable overlap
   */
  public static chunkText(text: string, chunkSize = 600, overlap = 100): string[] {
    if (!text || text.trim().length === 0) return [];
    
    const cleanText = text.replace(/\s+/g, ' ').trim();
    const chunks: string[] = [];
    let start = 0;

    while (start < cleanText.length) {
      const end = Math.min(start + chunkSize, cleanText.length);
      let chunk = cleanText.slice(start, end);

      // Try to break at paragraph or sentence boundary if possible
      if (end < cleanText.length) {
        const lastPeriod = chunk.lastIndexOf('.');
        if (lastPeriod > chunkSize * 0.5) {
          chunk = chunk.slice(0, lastPeriod + 1);
        }
      }

      chunks.push(chunk.trim());
      start += chunk.length - overlap;
      if (start >= cleanText.length || chunk.length === 0) break;
    }

    return chunks;
  }

  /**
   * Simulates Web Crawler for domain indexing (e.g. oab-ba.org.br)
   */
  public static async crawlWebsite(url: string, depth = 2): Promise<{ pages: Array<{ title: string; url: string; content: string }> }> {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    
    const simulatedPages = [
      {
        title: `Página Principal ${domain}`,
        url: `https://${domain}/`,
        content: `Portal Institucional ${domain}. Informações sobre anuidades, agendamento de atendimentos, certidões de quitação e canal do advogado. Horário de funcionamento: Segunda a Sexta das 08h às 18h.`
      },
      {
        title: `Serviços & Sistemas PJe - ${domain}`,
        url: `https://${domain}/sistemas-pje`,
        content: `Manual de Acesso ao PJe e Certificado Digital. Em caso de inconsistência no token ou falha de assinatura, certifique-se de que a extensão Java OAB está instalada. Caso o erro persista, transfira para o Service Desk TI.`
      },
      {
        title: `Tabela de Anuidades & Parcelamento - ${domain}`,
        url: `https://${domain}/anuidades-2026`,
        content: `Tabela de Valores de Anuidade 2026. Desconto de 10% para pagamento em cota única até o dia 28 de Fevereiro. Opções de parcelamento em até 10x sem juros no cartão de crédito ou boleto bancário.`
      }
    ];

    return { pages: simulatedPages };
  }
}
