import React, { useState } from 'react';
import { 
  Globe, 
  MessageCircle, 
  Code, 
  Mail, 
  Send, 
  Share2, 
  PhoneCall, 
  Key
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DeployView: React.FC = () => {
  const { toggleChannelStatus } = useApp();
  const [activeTab, setActiveTab] = useState<'connections' | 'rules' | 'dev_tools'>('connections');
  const [copiedScript, setCopiedScript] = useState(false);

  const embedScriptCode = `<script src="https://cdn.moveo.ai/webchat/v3/widget.js" data-agent-id="aebd4f57-220d-4aad-98d0-fae59501d944" data-tenant-id="oab-ba" async></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: '1200px', margin: '0 auto', minHeight: 'calc(100vh - 56px)' }}>
      
      {/* Top Header & Sub-tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.2rem' }}>
            Implantar &gt; <strong>Conexões e Canais</strong>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Canais de Atendimento e Integrações
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#e2e8f0', padding: '0.25rem', borderRadius: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('connections')}
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'connections' ? 700 : 500,
              backgroundColor: activeTab === 'connections' ? '#ffffff' : 'transparent',
              color: activeTab === 'connections' ? '#0f172a' : '#64748b',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Conexões
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'rules' ? 700 : 500,
              backgroundColor: activeTab === 'rules' ? '#ffffff' : 'transparent',
              color: activeTab === 'rules' ? '#0f172a' : '#64748b',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Regras de Horário
          </button>
          <button
            onClick={() => setActiveTab('dev_tools')}
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'dev_tools' ? 700 : 500,
              backgroundColor: activeTab === 'dev_tools' ? '#ffffff' : 'transparent',
              color: activeTab === 'dev_tools' ? '#0f172a' : '#64748b',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Ferramentas de Dev
          </button>
        </div>
      </div>

      {activeTab === 'dev_tools' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Embed Webchat Box */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Code size={18} color="#2563eb" /> Código Embed para Webchat Widget
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
              Cole o trecho JavaScript abaixo antes da tag de fechamento <code>&lt;/body&gt;</code> do seu site para ativar o chat flutuante do Agente de IA.
            </p>

            <div style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.82rem', position: 'relative', overflowX: 'auto' }}>
              {embedScriptCode}
              <button
                onClick={copyToClipboard}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {copiedScript ? 'Copiado!' : 'Copiar Código'}
              </button>
            </div>
          </div>

          {/* API Keys */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Key size={18} color="#7c3aed" /> Chaves de API do Workspace
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
              Utilize estas chaves de API para integrar webhooks de entrada/saída com sistemas externos (CRM, ERP, Zapier, N8N).
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="text"
                readOnly
                value="mv_live_sk_99a8b7c6d5e4f3a2b10111213"
                style={{ width: '380px', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontSize: '0.85rem', fontFamily: 'monospace' }}
              />
              <button style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}>
                Gerar Nova Chave
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === 'rules' ? (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Regras de Horário e Atendimento
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Configure o horário comercial em que a IA responde automaticamente e a janela de transbordo para atendentes humanos.
          </p>
          <div style={{ padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', color: '#1e40af', fontSize: '0.85rem' }}>
            ● Horário Comercial Configurado: Segunda a Sexta, das 08:00 às 18:00 (Fuso Horário Brasília GMT-3).
          </div>
        </div>
      ) : (
        /* Connections / Channels matching screenshot 8 */
        <div>
          
          {/* Help Info Box matching Screenshot 8 */}
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '0.5rem',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            position: 'relative'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e40af', marginBottom: '0.3rem' }}>
              O que são conexões?
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#1e3a8a', lineHeight: 1.4 }}>
              Com este sistema você pode conectar seu AI Agent a diferentes canais de comunicação através dos quais ele será capaz de interagir com seus usuários, como o seu site ou aplicativos de mensagens.
            </p>
          </div>

          {/* Section 1: Conectado */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              Conectado
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              
              {/* Webchat */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Webchat</h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Última conversa: há 26 dias</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#166534', padding: '0.15rem 0.5rem', borderRadius: '0.2rem', fontWeight: 700 }}>
                    ● ativo
                  </span>
                  <button onClick={() => toggleChannelStatus('chn-webchat')} style={{ padding: '0.3rem 0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', background: '#fff', fontSize: '0.75rem', cursor: 'pointer' }}>
                    Desativar
                  </button>
                </div>
              </div>

              {/* WhatsApp */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>WhatsApp</h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Conecte via Evolution API QR Code ou Meta Official API</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '0.15rem 0.5rem', borderRadius: '0.2rem', fontWeight: 700 }}>
                    ● credenciais faltando
                  </span>
                  <button onClick={() => alert('Escaneie o QR Code do WhatsApp para parear seu número!')} style={{ padding: '0.35rem 0.75rem', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                    Conectar WhatsApp
                  </button>
                </div>
              </div>

              {/* HTTP Webhook */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Code size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>HTTP Personalizado</h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Nenhuma conversa ainda</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', color: '#64748b', padding: '0.15rem 0.5rem', borderRadius: '0.2rem', fontWeight: 700 }}>
                  ● Desabilitado
                </span>
              </div>

            </div>
          </div>

          {/* Section 2: Disponível */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              Disponível
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={22} color="#2563eb" />
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>E-mail</h4>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Integrar via SMTP / IMAP</span>
                  </div>
                </div>
                <button style={{ padding: '0.3rem 0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', background: '#fff', fontSize: '0.75rem', cursor: 'pointer' }}>Configurar</button>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Send size={22} color="#0088cc" />
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>Telegram Bot</h4>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Conectar via BotFather Token</span>
                  </div>
                </div>
                <button style={{ padding: '0.3rem 0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', background: '#fff', fontSize: '0.75rem', cursor: 'pointer' }}>Configurar</button>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Share2 size={22} color="#e1306c" />
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>Instagram Direct</h4>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Automação de DMs</span>
                  </div>
                </div>
                <button style={{ padding: '0.3rem 0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', background: '#fff', fontSize: '0.75rem', cursor: 'pointer' }}>Configurar</button>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <PhoneCall size={22} color="#f59e0b" />
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>Twilio Voice</h4>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Agente de IA para chamadas de voz</span>
                  </div>
                </div>
                <button style={{ padding: '0.3rem 0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', background: '#fff', fontSize: '0.75rem', cursor: 'pointer' }}>Configurar</button>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
