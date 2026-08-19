import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Workspace, 
  Agent, 
  KnowledgeItem, 
  Campaign, 
  ChatThread, 
  SpecializedGroup, 
  ChannelConnection, 
  SuperAdminTenant,
  User,
  Contact 
} from '../types';
import { api } from '../services/api';

interface AppContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  workspace: Workspace;
  setWorkspace: (ws: Workspace) => void;
  currentWorkspace: Workspace;
  workspaces: Workspace[];
  currentUser: User;
  setCurrentUser: (u: User) => void;
  agents: Agent[];
  selectedAgent: Agent | null;
  setSelectedAgent: (ag: Agent | null) => void;
  addAgent: (ag: Agent) => void;
  updateAgent: (ag: Agent) => void;
  dialogs: Array<{ id: string; name: string; nodes: any[] }>;
  setDialogs: React.Dispatch<React.SetStateAction<Array<{ id: string; name: string; nodes: any[] }>>>;
  knowledgeItems: KnowledgeItem[];
  addKnowledgeItem: (item: KnowledgeItem) => void;
  campaigns: Campaign[];
  addCampaign: (cmp: Campaign) => void;
  chatThreads: ChatThread[];
  selectedThread: ChatThread | null;
  setSelectedThread: (t: ChatThread | null) => void;
  sendMessageToThread: (threadId: string, text: string, sender: 'human_agent' | 'user' | 'system') => void;
  specializedGroups: SpecializedGroup[];
  transferThreadToGroup: (threadId: string, groupId: string, groupName: string) => void;
  channels: ChannelConnection[];
  toggleChannelStatus: (channelId: string) => void;
  adminTenants: SuperAdminTenant[];
  contacts: Contact[];
  isTestDrawerOpen: boolean;
  setIsTestDrawerOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
}

const initialWorkspace: Workspace = {
  id: 'ws-demo-01',
  name: 'Ordem dos Advogados do Brasil - BA',
  slug: 'oab-ba',
  plan: 'pro',
  trialDaysLeft: 14,
  activeChannelsCount: 3,
  builtInLlmTokensUsed: 142050,
  monthlyLimitTokens: 2000000,
  customLlmConfig: {
    enabled: false,
    provider: 'builtin',
    modelName: 'Moveo AI Engine v3 (SaaS Embutido)'
  }
};

const initialUser: User = {
  id: 'usr-admin-01',
  name: 'Fabiano Caldas',
  email: 'fabiano@oab-ba.org.br',
  role: 'workspace_admin',
  status: 'online',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  specializedGroupIds: ['grp-ti-01']
};

const initialGroups: SpecializedGroup[] = [
  {
    id: 'grp-ti-01',
    name: 'Service Desk TI',
    description: 'Suporte a sistemas, senhas e acesso ao portal OAB',
    membersCount: 4,
    activeChatsCount: 2,
    color: '#2563eb'
  },
  {
    id: 'grp-comercial-02',
    name: 'Comercial & Vendas',
    description: 'Atendimento a novos inscritos e anuidade OAB',
    membersCount: 3,
    activeChatsCount: 5,
    color: '#10b981'
  },
  {
    id: 'grp-financeiro-03',
    name: 'Financeiro & Cobrança',
    description: 'Emissão de boletos, certidões e negociação de débitos',
    membersCount: 2,
    activeChatsCount: 1,
    color: '#f59e0b'
  },
  {
    id: 'grp-n2-04',
    name: 'Suporte Avançado N2',
    description: 'Casos complexos e transbordo especializado',
    membersCount: 2,
    activeChatsCount: 0,
    color: '#7c3aed'
  }
];

const initialAgents: Agent[] = [
  {
    id: 'ag-sd-ti',
    name: 'Suporte ao Cliente Agente SD TI',
    type: 'Suporte ao Cliente',
    language: 'Portuguese (Brazil)',
    lastTrainedAt: 'há 10 minutos',
    status: 'published',
    llmProvider: 'builtin',
    modelName: 'Moveo AI Engine v3 (SaaS Embutido)',
    systemPrompt: 'Você é um assistente virtual do Service Desk da OAB-BA. Responda cortês e objetivamente com base na base de conhecimento.',
    temperature: 0.3,
    knowledgeBaseConnected: true,
    activeConnections: ['Webchat', 'WhatsApp'],
    dialogsCount: 8
  },
  {
    id: 'ag-vendas-02',
    name: 'Assistente de Vendas & Inscrição',
    type: 'Vendas e SDR',
    language: 'Portuguese (Brazil)',
    lastTrainedAt: 'há 2 horas',
    status: 'published',
    llmProvider: 'builtin',
    modelName: 'Moveo AI Engine v3',
    systemPrompt: 'Você é um assistente de vendas responsável por guiar novos bacharéis na inscrição da OAB.',
    temperature: 0.5,
    knowledgeBaseConnected: true,
    activeConnections: ['Webchat', 'Instagram'],
    dialogsCount: 4
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState('home');
  const [workspace, setWorkspace] = useState<Workspace>(initialWorkspace);
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(initialAgents[0]);
  const [specializedGroups] = useState<SpecializedGroup[]>(initialGroups);

  const [dialogs, setDialogs] = useState<Array<{ id: string; name: string; nodes: any[] }>>([
    {
      id: 'dlg-greetings',
      name: 'Greetings & Onboarding',
      nodes: [
        { id: 'n1', type: 'intent', title: 'Intenção do Cliente', content: '#greetings (#cumprimento)' },
        { id: 'n2', type: 'text', title: 'Mensagem de Texto', content: 'Olá! Seja bem-vindo ao Service Desk da OAB-BA. Como posso te ajudar hoje?' },
        { id: 'n3', type: 'ai_response', title: 'Resposta IA (RAG)', content: 'Pesquisando na base de conhecimento com LLM Moveo Engine...' },
        { id: 'n4', type: 'transfer', title: 'Nó de Transbordo Humano', content: 'Transferir atendimento para o grupo especializado: Service Desk TI' }
      ]
    }
  ]);

  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: 'kb-01',
      title: 'oab-ba.org.br',
      category: 'webpages',
      status: 'active',
      detailInfo: '2.648 URLs indexadas no Pgvector',
      urlsCount: 2648,
      updatedAt: '18/08/2026',
      creator: 'Fabiano Caldas'
    },
    {
      id: 'kb-02',
      title: 'Manual do Usuário Sistemas OAB-BA.pdf',
      category: 'documents',
      status: 'active',
      detailInfo: '48 trechos RAG indexados',
      urlsCount: 48,
      updatedAt: '12/08/2026',
      creator: 'Fabiano Caldas'
    },
    {
      id: 'kb-03',
      title: 'FAQ - Dúvidas Frequentes Anuidade',
      category: 'faq',
      status: 'active',
      detailInfo: '15 trechos RAG indexados',
      urlsCount: 15,
      updatedAt: '15/08/2026',
      creator: 'Fabiano Caldas'
    }
  ]);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'cmp-01',
      name: 'Disparo Lembrete Anuidade OAB 2026',
      type: 'payment_recovery',
      status: 'active',
      channel: 'WhatsApp',
      targetCount: 1250,
      deliveredCount: 1180,
      aiEngagementRate: 84.5,
      createdAt: '18/08/2026',
      agentId: 'ag-sd-ti'
    }
  ]);

  const [chatThreads, setChatThreads] = useState<ChatThread[]>([
    {
      id: 'th-01',
      contactName: 'Dra. Maria Silva (Advogada OAB/BA 45.123)',
      contactChannel: 'whatsapp',
      lastMessage: 'Estou com erro ao assinar a petição no sistema do PJe.',
      lastMessageTime: '15:42',
      unreadCount: 2,
      status: 'inbox',
      assignedGroupTitle: 'Service Desk TI',
      assignedHumanName: 'Fabiano Caldas',
      customerPhone: '+55 71 99888-1234',
      customerEmail: 'maria.silva@adv.oab-ba.org.br',
      tags: ['PJe', 'Certificado Digital', 'Urgente'],
      messages: [
        { id: 'm1', sender: 'user', senderName: 'Dra. Maria Silva', text: 'Boa tarde, preciso emitir a certidão de quitação e o sistema dá erro de token.', timestamp: '15:40' },
        { id: 'm2', sender: 'agent', senderName: 'Agente de IA SD TI', text: 'Olá Dra. Maria! Verifiquei em nossa base que erros de token costumam ser resolvidos reiniciando a extensão Java da OAB.', timestamp: '15:41' },
        { id: 'm3', sender: 'user', senderName: 'Dra. Maria Silva', text: 'Tentei e não funcionou, por favor me transfira para um atendente humano.', timestamp: '15:42' },
        { id: 'm4', sender: 'system', senderName: 'Sistema', text: 'Atendimento transferido para a fila "Service Desk TI". Atendente Fabiano Caldas assumiu a conversa.', timestamp: '15:42' }
      ]
    }
  ]);

  const [contacts] = useState<Contact[]>([
    {
      id: 'ct-01',
      name: 'Dra. Maria Silva',
      phone: '+55 71 99888-1234',
      email: 'maria.silva@adv.oab-ba.org.br',
      channel: 'WhatsApp',
      status: 'active',
      tags: ['OAB/BA', 'PJe', 'VIP'],
      lastInteraction: '18/08/2026 15:42'
    },
    {
      id: 'ct-02',
      name: 'Dr. João Pedro Souza',
      phone: '+55 71 98765-4321',
      email: 'joao.pedro@adv.com.br',
      channel: 'Webchat',
      status: 'active',
      tags: ['Anuidade', 'Financeiro'],
      lastInteraction: '18/08/2026 14:20'
    }
  ]);

  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(chatThreads[0]);
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [channels, setChannels] = useState<ChannelConnection[]>([
    { id: 'ch-1', name: 'Webchat Widget', type: 'webchat', status: 'active', lastActivity: 'há 10 min', iconName: 'Globe' },
    { id: 'ch-2', name: 'WhatsApp Oficial Evolution API', type: 'whatsapp', status: 'active', lastActivity: 'há 2 min', iconName: 'MessageCircle' },
    { id: 'ch-3', name: 'E-mail Corporativo OAB', type: 'email', status: 'active', lastActivity: 'há 1 hora', iconName: 'Mail' },
    { id: 'ch-4', name: 'Telegram Bot', type: 'telegram', status: 'active', lastActivity: 'há 3 horas', iconName: 'Send' },
    { id: 'ch-5', name: 'Instagram Direct', type: 'instagram', status: 'missing_credentials', lastActivity: 'desconectado', iconName: 'Instagram' },
    { id: 'ch-6', name: 'Twilio Voice Bot', type: 'twilio_voice', status: 'active', lastActivity: 'há 4 horas', iconName: 'Phone' }
  ]);

  const [adminTenants] = useState<SuperAdminTenant[]>([
    { id: 'tn-01', name: 'Ordem dos Advogados do Brasil - BA', email: 'admin@oab-ba.org.br', plan: 'pro', mrr: 1490, tokensUsedThisMonth: 142050, agentsCount: 4, usersCount: 12, status: 'active', createdAt: '01/08/2026' },
    { id: 'tn-02', name: 'Grupo Hospitalar Santa Isabel', email: 'ti@santaisabel.com.br', plan: 'enterprise', mrr: 3990, tokensUsedThisMonth: 680900, agentsCount: 10, usersCount: 35, status: 'active', createdAt: '05/08/2026' },
    { id: 'tn-03', name: 'Fintech CrediMais', email: 'atendimento@credimais.com', plan: 'pro', mrr: 1490, tokensUsedThisMonth: 210400, agentsCount: 3, usersCount: 8, status: 'active', createdAt: '10/08/2026' },
    { id: 'tn-04', name: 'Advocacia Andrade & Associados', email: 'contato@andradeadv.com.br', plan: 'starter', mrr: 490, tokensUsedThisMonth: 45000, agentsCount: 1, usersCount: 3, status: 'trial', createdAt: '15/08/2026' }
  ]);

  // Sync with real Fastify backend when available
  useEffect(() => {
    api.listKnowledgeSources()
      .then(res => {
        if (res.sources && res.sources.length > 0) {
          const mapped: KnowledgeItem[] = res.sources.map(s => ({
            id: s.id,
            title: s.title,
            category: s.category.toLowerCase().includes('page') ? 'webpages' : s.category.toLowerCase().includes('doc') ? 'documents' : 'faq',
            status: s.status.toLowerCase() as any,
            detailInfo: s.detailInfo || `${s.urlsCount || 1} fontes indexadas no Pgvector`,
            urlsCount: s.urlsCount || 1,
            updatedAt: new Date(s.createdAt).toLocaleDateString('pt-BR'),
            creator: s.creatorName || 'Admin'
          }));
          setKnowledgeItems(prev => [...mapped, ...prev]);
        }
      })
      .catch(() => {});
  }, []);

  const toggleChannelStatus = (channelId: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === channelId) {
        return {
          ...c,
          status: c.status === 'active' ? 'disabled' : 'active'
        };
      }
      return c;
    }));
  };

  const addAgent = (newAg: Agent) => {
    setAgents(prev => [newAg, ...prev]);
    setSelectedAgent(newAg);
  };

  const updateAgent = (updatedAg: Agent) => {
    setAgents(prev => prev.map(a => a.id === updatedAg.id ? updatedAg : a));
    if (selectedAgent?.id === updatedAg.id) {
      setSelectedAgent(updatedAg);
    }
  };

  const addKnowledgeItem = (item: KnowledgeItem) => {
    setKnowledgeItems(prev => [item, ...prev]);
    api.addKnowledgeSource({
      title: item.title,
      category: item.category.toUpperCase(),
      urlsCount: item.urlsCount
    }).catch(() => {});
  };

  const addCampaign = (cmp: Campaign) => {
    setCampaigns(prev => [cmp, ...prev]);
  };

  const sendMessageToThread = (threadId: string, text: string, sender: 'human_agent' | 'user' | 'system') => {
    const newMsg = {
      id: String(Date.now()),
      sender,
      senderName: sender === 'human_agent' ? currentUser.name : sender === 'user' ? 'Cliente' : 'Sistema',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        const updated = {
          ...t,
          lastMessage: text,
          lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          messages: [...t.messages, newMsg]
        };
        if (selectedThread?.id === threadId) {
          setSelectedThread(updated);
        }
        return updated;
      }
      return t;
    }));

    api.sendMessage(threadId, text, sender === 'human_agent' ? 'HUMAN_AGENT' : 'USER').catch(() => {});
  };

  const transferThreadToGroup = (threadId: string, groupId: string, groupName: string) => {
    setChatThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        const systemMsg = {
          id: String(Date.now()),
          sender: 'system' as const,
          senderName: 'Sistema',
          text: `Atendimento transferido para o grupo especializado: ${groupName}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const updated = {
          ...t,
          assignedGroupTitle: groupName,
          messages: [...t.messages, systemMsg]
        };
        if (selectedThread?.id === threadId) {
          setSelectedThread(updated);
        }
        return updated;
      }
      return t;
    }));

    api.transferToGroup(threadId, groupId).catch(() => {});
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        workspace,
        setWorkspace,
        currentWorkspace: workspace,
        workspaces: [workspace],
        currentUser,
        setCurrentUser,
        agents,
        selectedAgent,
        setSelectedAgent,
        addAgent,
        updateAgent,
        dialogs,
        setDialogs,
        knowledgeItems,
        addKnowledgeItem,
        campaigns,
        addCampaign,
        chatThreads,
        selectedThread,
        setSelectedThread,
        sendMessageToThread,
        specializedGroups,
        transferThreadToGroup,
        channels,
        toggleChannelStatus,
        adminTenants,
        contacts,
        isTestDrawerOpen,
        setIsTestDrawerOpen,
        isCheckoutOpen,
        setIsCheckoutOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
