export type ViewMode = 
  | 'landing' 
  | 'home' 
  | 'agents' 
  | 'knowledge' 
  | 'campaigns' 
  | 'contacts' 
  | 'analytics' 
  | 'chats' 
  | 'deploy' 
  | 'settings' 
  | 'admin';

export type UserRole = 'superadmin' | 'workspace_admin' | 'supervisor' | 'attendant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  specializedGroupIds?: string[];
  status: 'online' | 'busy' | 'offline';
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'trial' | 'starter' | 'pro' | 'enterprise';
  trialDaysLeft: number;
  activeChannelsCount: number;
  builtInLlmTokensUsed: number;
  monthlyLimitTokens: number;
  customLlmConfig: {
    enabled: boolean;
    provider: 'builtin' | 'openai' | 'anthropic' | 'gemini' | 'groq' | 'ollama';
    apiKey?: string;
    modelName: string;
  };
}

export interface SpecializedGroup {
  id: string;
  name: string;
  description: string;
  color: string;
  membersCount: number;
  activeChatsCount: number;
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  language: string;
  lastTrainedAt: string;
  status: 'draft' | 'published';
  llmProvider: 'builtin' | 'openai' | 'anthropic' | 'gemini' | 'groq' | 'ollama';
  modelName: string;
  systemPrompt: string;
  temperature: number;
  knowledgeBaseConnected: boolean;
  activeConnections: string[];
  dialogsCount: number;
}

export interface FlowNode {
  id: string;
  type: 'intent' | 'text' | 'ai_response' | 'question' | 'condition' | 'transfer' | 'mcp_tool' | 'pause' | 'set_variable';
  title: string;
  content: string;
  config?: any;
  nextNodes?: string[];
}

export interface DialogItem {
  id: string;
  name: string;
  intent?: string;
  category?: string;
  nodes: FlowNode[];
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: 'faq' | 'documents' | 'webpages' | 'external';
  status: 'active' | 'indexing' | 'failed' | 'draft';
  creator: string;
  updatedAt: string;
  detailInfo: string;
  urlsCount?: number;
  fileSizeBytes?: number;
  rawContent?: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'outreach' | 'payment_recovery';
  status: 'active' | 'paused' | 'draft' | 'completed';
  channel: string;
  targetCount: number;
  deliveredCount: number;
  aiEngagementRate: number;
  createdAt: string;
  agentId: string;
}

export interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  channel: string;
  tags: string[];
  lastInteraction: string;
  status: 'active' | 'lead' | 'customer';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'human_agent' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  isAiGenerated?: boolean;
  metadata?: any;
}

export interface ChatThread {
  id: string;
  contactName: string;
  contactChannel: 'whatsapp' | 'webchat' | 'email' | 'telegram' | 'instagram' | 'twilio_voice' | 'webhook';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'inbox' | 'unassigned' | 'spam' | 'trash';
  assignedAgentId?: string;
  assignedGroupId?: string;
  assignedGroupTitle?: string;
  assignedHumanName?: string;
  tags: string[];
  messages: ChatMessage[];
  customerPhone?: string;
  customerEmail?: string;
}

export interface ChannelConnection {
  id: string;
  name: string;
  type: 'webchat' | 'whatsapp' | 'email' | 'infobip_sms' | 'infobip_rcs' | 'telegram' | 'instagram' | 'twilio_voice' | 'webhook';
  status: 'active' | 'missing_credentials' | 'disabled';
  lastActivity: string;
  iconName: string;
}

export interface SuperAdminTenant {
  id: string;
  name: string;
  email: string;
  plan: 'starter' | 'pro' | 'enterprise';
  mrr: number;
  status: 'active' | 'trial' | 'suspended';
  tokensUsedThisMonth: number;
  usersCount: number;
  agentsCount: number;
  createdAt: string;
}
