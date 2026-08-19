import React, { useState } from 'react';
import { 
  Bot, 
  Play, 
  Wrench, 
  Sparkles, 
  History, 
  Settings, 
  Plus, 
  Zap,
  Globe,
  Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FlowBuilder } from './FlowBuilder';
import type { Agent } from '../../types';

export const AgentsView: React.FC = () => {
  const { agents, selectedAgent, setSelectedAgent, addAgent, updateAgent, setIsTestDrawerOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'directives' | 'workflows' | 'logs'>('overview');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentType, setNewAgentType] = useState('Suporte ao Cliente');
  const [newAgentLlm, setNewAgentLlm] = useState<Agent['llmProvider']>('builtin');

  const currentAgent = selectedAgent || agents[0];

  const handleCreateAgent = () => {
    if (!newAgentName.trim()) return;
    const newAg: Agent = {
      id: `agent-${Date.now()}`,
      name: newAgentName,
      type: newAgentType,
      language: 'Portuguese (Brazil)',
      lastTrainedAt: 'Agora mesmo',
      status: 'draft',
      llmProvider: newAgentLlm,
      modelName: newAgentLlm === 'builtin' ? 'Moveo AI Engine v3 (SaaS Embutido)' : 'GPT-4o (BYO-LLM)',
      systemPrompt: 'Você é um agente virtual prestativo.',
      temperature: 0.3,
      knowledgeBaseConnected: true,
      activeConnections: ['Webchat'],
      dialogsCount: 3
    };
    addAgent(newAg);
    setIsCreateModalOpen(false);
    setNewAgentName('');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', backgroundColor: '#f8fafc' }}>
      
      {/* Top Agent Header Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bot size={20} color="#2563eb" />
            <select
              value={currentAgent?.id}
              onChange={(e) => {
                const found = agents.find(a => a.id === e.target.value);
                if (found) setSelectedAgent(found);
              }}
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#0f172a',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Sub-tab Navigation */}
          <nav style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#f1f5f9', padding: '0.2rem', borderRadius: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                padding: '0.35rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: activeTab === 'overview' ? 700 : 500,
                color: activeTab === 'overview' ? '#0f172a' : '#64748b',
                backgroundColor: activeTab === 'overview' ? '#ffffff' : 'transparent',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                boxShadow: activeTab === 'overview' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              Visão geral
            </button>
            <button
              onClick={() => setActiveTab('directives')}
              style={{
                padding: '0.35rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: activeTab === 'directives' ? 700 : 500,
                color: activeTab === 'directives' ? '#0f172a' : '#64748b',
                backgroundColor: activeTab === 'directives' ? '#ffffff' : 'transparent',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Diretrizes & LLM
            </button>
            <button
              onClick={() => setActiveTab('workflows')}
              style={{
                padding: '0.35rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: activeTab === 'workflows' ? 700 : 500,
                color: activeTab === 'workflows' ? '#0f172a' : '#64748b',
                backgroundColor: activeTab === 'workflows' ? '#ffffff' : 'transparent',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Fluxos de trabalho
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              style={{
                padding: '0.35rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: activeTab === 'logs' ? 700 : 500,
                color: activeTab === 'logs' ? '#0f172a' : '#64748b',
                backgroundColor: activeTab === 'logs' ? '#ffffff' : 'transparent',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Conversas
            </button>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#334155',
              borderRadius: '0.375rem',
              padding: '0.4rem 0.75rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Plus size={14} /> Novo Agente
          </button>

          <button
            onClick={() => setIsTestDrawerOpen(true)}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#2563eb',
              borderRadius: '0.375rem',
              padding: '0.4rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Play size={14} /> Testar
          </button>

          <button
            onClick={() => {
              if (currentAgent) {
                updateAgent({ ...currentAgent, status: 'published' });
                alert(`Agente "${currentAgent.name}" publicado com sucesso!`);
              }
            }}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.4rem 1rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Publicar
          </button>
        </div>
      </div>

      {/* Main Content Render */}
      {activeTab === 'workflows' ? (
        <FlowBuilder />
      ) : activeTab === 'directives' ? (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Configuração de Diretrizes & Provedor LLM
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Defina as instruções de sistema (System Prompt) e escolha se o agente usará o modelo padrão do SaaS ou seu próprio modelo LLM (Bring Your Own LLM).
            </p>

            {/* Model Selector Card */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Cpu size={18} color="#2563eb" /> Provedor e Modelo LLM
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div 
                  onClick={() => currentAgent && updateAgent({ ...currentAgent, llmProvider: 'builtin', modelName: 'Moveo AI Engine v3 (SaaS Embutido)' })}
                  style={{
                    backgroundColor: currentAgent?.llmProvider === 'builtin' ? '#eff6ff' : '#ffffff',
                    border: currentAgent?.llmProvider === 'builtin' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e40af' }}>Modelo Embutido SaaS</span>
                    <span style={{ fontSize: '0.7rem', backgroundColor: '#dcfce7', color: '#166534', padding: '0.1rem 0.4rem', borderRadius: '0.2rem', fontWeight: 700 }}>Incluso no Plano</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                    Moveo AI Engine v3 com RAG nativo otimizado, sem custos adicionais de tokens.
                  </p>
                </div>

                <div 
                  onClick={() => currentAgent && updateAgent({ ...currentAgent, llmProvider: 'openai', modelName: 'GPT-4o (BYO-LLM Cliente)' })}
                  style={{
                    backgroundColor: currentAgent?.llmProvider !== 'builtin' ? '#eff6ff' : '#ffffff',
                    border: currentAgent?.llmProvider !== 'builtin' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Usar Próprio Modelo (BYO-LLM)</span>
                    <span style={{ fontSize: '0.7rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '0.1rem 0.4rem', borderRadius: '0.2rem', fontWeight: 700 }}>API Key do Cliente</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                    Conecte chaves da OpenAI (GPT-4o), Anthropic (Claude 3.5), Gemini, Groq ou Ollama local.
                  </p>
                </div>
              </div>
            </div>

            {/* System Prompt Box */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Diretrizes de Sistema (System Prompt)
              </label>
              <textarea
                rows={6}
                value={currentAgent?.systemPrompt}
                onChange={(e) => currentAgent && updateAgent({ ...currentAgent, systemPrompt: e.target.value })}
                style={{
                  width: '100%',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.375rem',
                  padding: '0.75rem',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  outline: 'none'
                }}
              />
            </div>

            <button 
              onClick={() => alert('Diretrizes salvas com sucesso!')}
              style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '0.375rem', padding: '0.55rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Salvar Diretrizes
            </button>
          </div>
        </div>
      ) : activeTab === 'logs' ? (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            Histórico de Execuções e Diálogos do Agente
          </h3>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', padding: '2rem' }}>
              Todas as 142 sessões de atendimento ativas e recentes deste agente estão registradas na caixa de entrada.
            </div>
          </div>
        </div>
      ) : (
        /* Overview Sub-tab matching screenshot 2 */
        <div style={{ padding: '2rem 2.5rem', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}>
          
          {/* Left Column: Agent Card & Sidebar Menu */}
          <div>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              marginBottom: '1.25rem'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.85rem' }}>
                {currentAgent?.name}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Tipo de agente de IA</span>
                  <strong style={{ color: '#0f172a' }}>{currentAgent?.type}</strong>
                </div>

                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Idioma</span>
                  <strong style={{ color: '#0f172a' }}>🇧🇷 {currentAgent?.language}</strong>
                </div>

                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Último treinamento</span>
                  <strong style={{ color: '#0f172a' }}>⏱ {currentAgent?.lastTrainedAt}</strong>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                  <span style={{ color: '#64748b', display: 'block' }}>Regras</span>
                  <button 
                    onClick={() => setActiveTab('directives')}
                    style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    + Editar Regras e Prompt
                  </button>
                </div>
              </div>
            </div>

            {/* Agent Sidebar options matching Moveo shortcuts */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0',
              padding: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              {[
                { label: 'Ferramentas', shortcut: 'Alt M', icon: <Wrench size={16} /> },
                { label: 'Insights', shortcut: 'Alt I', icon: <Sparkles size={16} /> },
                { label: 'Simulações', shortcut: 'Alt R', icon: <Play size={16} /> },
                { label: 'Melhorias', shortcut: 'Alt N', icon: <Zap size={16} /> },
                { label: 'Versões', shortcut: 'Alt V', icon: <History size={16} /> },
                { label: 'Configurações', shortcut: 'Alt S', icon: <Settings size={16} /> }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span style={{ fontSize: '0.65rem', backgroundColor: '#f1f5f9', color: '#64748b', padding: '0.1rem 0.35rem', borderRadius: '0.2rem', fontFamily: 'monospace' }}>
                    {item.shortcut}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.2rem' }}>
                Geral
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.5rem'
              }}>
                <div style={{ padding: '0.5rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem', color: '#2563eb' }}>
                    <Plus size={16} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Personalização</span>
                </div>

                <div style={{ padding: '0.5rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem', color: '#2563eb' }}>
                    <Plus size={16} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Conhecimento</span>
                </div>

                <div style={{ padding: '0.5rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', border: '1px solid #bfdbfe' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem' }}>
                    <Bot size={16} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8' }}>Agente de IA</span>
                </div>

                <div style={{ padding: '0.5rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem' }}>
                    <Globe size={16} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Conexões</span>
                </div>

                <div style={{ padding: '0.5rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>0</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Conversas em andamento</span>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', textAlign: 'left', marginBottom: '1rem' }}>
                Desempenho
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', padding: '1.5rem 0' }}>
                Publique seu agente para começar a ver métricas de interação e desempenho em tempo real.
              </p>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Atividade</h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b', border: '1px solid #e2e8f0', padding: '0.2rem 0.6rem', borderRadius: '0.25rem' }}>
                  📅 ago 01, 2026 - ago 18, 2026
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.82rem' }}>
                  <span style={{ color: '#64748b', width: '70px' }}>3m atrás</span>
                  <div>
                    <strong>Você atualizou agente de IA {currentAgent?.name}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.82rem' }}>
                  <span style={{ color: '#64748b', width: '70px' }}>23m atrás</span>
                  <div>
                    <strong>Você atualizou estratégia de modelo (BYO-LLM Config)</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Modal Novo Agente */}
      {isCreateModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.75rem', width: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Criar Novo Agente de IA</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Nome do Agente</label>
                <input
                  type="text"
                  placeholder="ex: Agente de Suporte Financeiro"
                  value={newAgentName}
                  onChange={e => setNewAgentName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Tipo do Agente</label>
                <select
                  value={newAgentType}
                  onChange={e => setNewAgentType(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                >
                  <option value="Suporte ao Cliente">Suporte ao Cliente</option>
                  <option value="Vendas e SDR">Vendas e SDR</option>
                  <option value="Financeiro e Cobrança">Financeiro e Cobrança</option>
                  <option value="Triagem e Recepção">Triagem e Recepção</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Modelo LLM Inicial</label>
                <select
                  value={newAgentLlm}
                  onChange={e => setNewAgentLlm(e.target.value as any)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                >
                  <option value="builtin">Modelo Embutido SaaS (Moveo Engine v3)</option>
                  <option value="openai">OpenAI (GPT-4o - BYO LLM)</option>
                  <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
                  <option value="gemini">Google Gemini 1.5 Pro</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifySelf: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button onClick={() => setIsCreateModalOpen(false)} style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', background: 'none', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={handleCreateAgent} style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}>
                Criar Agente
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
