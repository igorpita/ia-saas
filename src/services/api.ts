const API_BASE = 'http://localhost:3001/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('moveo_saas_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('moveo_saas_token', token);
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Erro na requisição' }));
    throw new Error(errorData.message || `Erro HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // Autonomous Signup & Login
  registerTenant: (data: { companyName: string; adminName: string; adminEmail: string; plan?: string; customLlmProvider?: string }) =>
    apiRequest<{ token: string; user: any; tenant: any }>('/auth/register-tenant', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  login: (credentials: { email: string; password?: string }) =>
    apiRequest<{ token: string; user: any; tenant: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...credentials, password: credentials.password || '123456' })
    }),

  getMe: () => apiRequest<{ user: any; tenant: any }>('/auth/me'),

  // RAG Knowledge Base Engine (Sprint 2)
  addKnowledgeSource: (data: { title: string; category?: string; rawContent?: string; urlsCount?: number }) =>
    apiRequest<{ source: any }>('/knowledge/sources', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  ingestFile: (fileName: string, fileContent: string, category: 'DOCUMENT' | 'FAQ' = 'DOCUMENT') =>
    apiRequest<{ source: any; chunksCreated: number; message: string }>('/knowledge/ingest-file', {
      method: 'POST',
      body: JSON.stringify({ fileName, fileContent, category })
    }),

  scrapeUrl: (url: string) =>
    apiRequest<{ source: any; pagesCrawled: number; chunksIndexed: number; message: string }>('/knowledge/scrape-url', {
      method: 'POST',
      body: JSON.stringify({ url })
    }),

  listKnowledgeSources: () => apiRequest<{ sources: any[] }>('/knowledge/sources'),

  ragSearch: (query: string, topK = 3) =>
    apiRequest<{ query: string; citations: string[]; contextText: string; chunksCount: number }>('/knowledge/rag-search', {
      method: 'POST',
      body: JSON.stringify({ query, topK })
    }),

  // Omnichannel Live Chat
  listThreads: () => apiRequest<{ threads: any[] }>('/chats/threads'),

  sendMessage: (threadId: string, text: string, senderType: string = 'HUMAN_AGENT') =>
    apiRequest<{ message: any }>(`/chats/threads/${threadId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text, senderType })
    }),

  transferToGroup: (threadId: string, groupId: string) =>
    apiRequest<{ thread: any; group: any }>(`/chats/threads/${threadId}/transfer`, {
      method: 'POST',
      body: JSON.stringify({ groupId })
    }),

  aiCopilotSuggest: (threadId: string) =>
    apiRequest<{ suggestedText: string }>(`/chats/threads/${threadId}/ai-copilot`, {
      method: 'POST'
    })
};
