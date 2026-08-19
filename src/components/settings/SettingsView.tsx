import React, { useState } from 'react';
import { 
  Cpu, 
  Save, 
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { currentWorkspace, setWorkspace, currentUser, setIsCheckoutOpen } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'team' | 'llm_keys' | 'billing'>('llm_keys');

  const [provider, setProvider] = useState<'builtin' | 'openai' | 'anthropic' | 'gemini' | 'groq' | 'ollama'>(
    currentWorkspace.customLlmConfig.provider
  );
  const [apiKey, setApiKey] = useState(currentWorkspace.customLlmConfig.apiKey || '');
  const [modelName, setModelName] = useState(currentWorkspace.customLlmConfig.modelName);

  const handleSaveLlmConfig = () => {
    setWorkspace({
      ...currentWorkspace,
      customLlmConfig: {
        enabled: provider !== 'builtin',
        provider,
        apiKey,
        modelName
      }
    });
    alert('Configuração de LLM atualizada com sucesso!');
  };

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: '1200px', margin: '0 auto', minHeight: 'calc(100vh - 56px)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Configurações do Ambiente ({currentWorkspace.name})
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Gerencie membros da equipe, modelos de LLM e assinatura do workspace.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#e2e8f0', padding: '0.25rem', borderRadius: '0.5rem' }}>
          <button
            onClick={() => setActiveSubTab('llm_keys')}
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: activeSubTab === 'llm_keys' ? 700 : 500,
              backgroundColor: activeSubTab === 'llm_keys' ? '#ffffff' : 'transparent',
              color: activeSubTab === 'llm_keys' ? '#0f172a' : '#64748b',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Modelos LLM & API Keys
          </button>
          <button
            onClick={() => setActiveSubTab('team')}
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: activeSubTab === 'team' ? 700 : 500,
              backgroundColor: activeSubTab === 'team' ? '#ffffff' : 'transparent',
              color: activeSubTab === 'team' ? '#0f172a' : '#64748b',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Membros e Grupos
          </button>
          <button
            onClick={() => setActiveSubTab('billing')}
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: activeSubTab === 'billing' ? 700 : 500,
              backgroundColor: activeSubTab === 'billing' ? '#ffffff' : 'transparent',
              color: activeSubTab === 'billing' ? '#0f172a' : '#64748b',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Plano & Faturamento
          </button>
        </div>
      </div>

      {activeSubTab === 'llm_keys' ? (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={20} color="#2563eb" /> Provedor de Inteligência Artificial (LLM)
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
            O SaaS inclui um modelo de LLM proprietário embutido por padrão. Caso prefira, configure sua própria chave de API para utilizar modelos da OpenAI, Anthropic, Gemini, Groq ou Ollama.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
            
            <div
              onClick={() => { setProvider('builtin'); setModelName('Moveo AI Engine v3 (SaaS Embutido)'); }}
              style={{
                border: provider === 'builtin' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                backgroundColor: provider === 'builtin' ? '#eff6ff' : '#ffffff',
                borderRadius: '0.5rem',
                padding: '1rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <strong style={{ fontSize: '0.9rem', color: '#1e40af' }}>Modelo Embutido SaaS</strong>
                <span style={{ fontSize: '0.65rem', backgroundColor: '#dcfce7', color: '#166534', padding: '0.1rem 0.35rem', borderRadius: '0.2rem', fontWeight: 700 }}>Padrao SaaS</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Moveo AI Engine v3 com RAG nativo e sem cobranças extras.</p>
            </div>

            <div
              onClick={() => { setProvider('openai'); setModelName('gpt-4o'); }}
              style={{
                border: provider === 'openai' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                backgroundColor: provider === 'openai' ? '#eff6ff' : '#ffffff',
                borderRadius: '0.5rem',
                padding: '1rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>OpenAI (BYO-LLM)</strong>
                <span style={{ fontSize: '0.65rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '0.1rem 0.35rem', borderRadius: '0.2rem', fontWeight: 700 }}>API Key</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>GPT-4o, GPT-4o-mini ou modelos customizados.</p>
            </div>

            <div
              onClick={() => { setProvider('anthropic'); setModelName('claude-3-5-sonnet-20240620'); }}
              style={{
                border: provider === 'anthropic' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                backgroundColor: provider === 'anthropic' ? '#eff6ff' : '#ffffff',
                borderRadius: '0.5rem',
                padding: '1rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>Anthropic Claude</strong>
                <span style={{ fontSize: '0.65rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '0.1rem 0.35rem', borderRadius: '0.2rem', fontWeight: 700 }}>API Key</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Claude 3.5 Sonnet ou Claude 3 Haiku.</p>
            </div>

          </div>

          {provider !== 'builtin' && (
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Chave de API do Provedor ({provider.toUpperCase()})
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Nome exato do Modelo
                </label>
                <input
                  type="text"
                  value={modelName}
                  onChange={e => setModelName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleSaveLlmConfig}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.55rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Save size={16} /> Salvar Configurações de LLM
          </button>
        </div>
      ) : activeSubTab === 'team' ? (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              Membros da Equipe e Papéis (RBAC)
            </h3>
            <button style={{ padding: '0.45rem 0.85rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
              + Convidar Membro
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', fontWeight: 700 }}>
                <th style={{ padding: '0.75rem' }}>Usuário</th>
                <th style={{ padding: '0.75rem' }}>E-mail</th>
                <th style={{ padding: '0.75rem' }}>Papel (Role)</th>
                <th style={{ padding: '0.75rem' }}>Grupos Atribuídos</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700 }}>{currentUser.name}</td>
                <td style={{ padding: '0.85rem 0.75rem', color: '#64748b' }}>{currentUser.email}</td>
                <td style={{ padding: '0.85rem 0.75rem' }}>
                  <span style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '0.15rem 0.5rem', borderRadius: '0.2rem', fontWeight: 700, fontSize: '0.75rem' }}>
                    Workspace Admin
                  </span>
                </td>
                <td style={{ padding: '0.85rem 0.75rem' }}>Service Desk TI, Comercial</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        /* Billing Sub-tab */
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            Plano & Consumo de Recursos
          </h3>

          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#2563eb', fontWeight: 700 }}>Plano Atual</span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e40af' }}>{currentWorkspace.plan.toUpperCase()} (Período de Testes)</h4>
              <p style={{ fontSize: '0.82rem', color: '#1e3a8a' }}>{currentWorkspace.trialDaysLeft} dias restantes no teste gratuito.</p>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              style={{ padding: '0.55rem 1.25rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Zap size={16} /> Fazer Upgrade do Plano
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
