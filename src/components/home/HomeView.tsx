import React from 'react';
import { 
  Bot, 
  Globe, 
  Code, 
  MessageCircle, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Zap,
  Layers,
  Rocket
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HomeView: React.FC = () => {
  const { setCurrentView, agents, setIsTestDrawerOpen } = useApp();

  return (
    <div style={{ padding: '1.75rem 2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Topology Diagram Box */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '0.75rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        padding: '1.5rem 2rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem'
        }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Visão Geral de Conexões e Topologia - OmniFlow AI Engine
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px', backgroundColor: '#ecfdf5', color: '#059669', fontWeight: 700 }}>
              • Sistema OmniFlow Ativo
            </span>
          </div>
        </div>

        {/* Topology Map Canvas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 80px 100px 80px 1fr',
          alignItems: 'center',
          gap: '1rem',
          minHeight: '220px'
        }}>
          
          {/* Column 1: Conteúdo (Agentes) */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.75rem' }}>
              Conteúdo
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {agents.map(agent => (
                <div 
                  key={agent.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    padding: '0.85rem 1rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                      <Bot size={16} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{agent.name}</h4>
                      <span style={{ fontSize: '0.7rem', color: '#059669', backgroundColor: '#ecfdf5', padding: '0.1rem 0.4rem', borderRadius: '0.2rem', fontWeight: 600 }}>
                        {agent.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                    Último treinamento: {agent.lastTrainedAt}
                  </div>
                  <button 
                    onClick={() => setCurrentView('knowledge')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#10b981',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Conectar base de conhecimento RAG
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Connector 1: IF nodes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '0.375rem',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.8rem',
              color: '#334155'
            }}>
              IF
            </div>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '0.375rem',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.8rem',
              color: '#334155'
            }}>
              IF
            </div>
          </div>

          {/* Central Hub Icon */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981',
              boxShadow: '0 0 15px rgba(16,185,129,0.3)'
            }}>
              <Layers size={26} />
            </div>
          </div>

          {/* Connector 2 */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', height: '2px', backgroundColor: '#e2e8f0' }} />
          </div>

          {/* Column 2: Conexões (Channels) */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.75rem' }}>
              Conexões
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                padding: '0.65rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                    <Globe size={15} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.82rem', fontWeight: 700 }}>Webchat</h5>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Última utilização: há 10 min</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', backgroundColor: '#dcfce7', color: '#166534', padding: '0.1rem 0.4rem', borderRadius: '0.2rem', fontWeight: 600 }}>
                  ativo
                </span>
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                padding: '0.65rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    <Code size={15} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.82rem', fontWeight: 700 }}>HTTP Personalizado</h5>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Última utilização: -</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', backgroundColor: '#f1f5f9', color: '#64748b', padding: '0.1rem 0.4rem', borderRadius: '0.2rem', fontWeight: 600 }}>
                  Inativo
                </span>
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                padding: '0.65rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                    <MessageCircle size={15} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.82rem', fontWeight: 700 }}>WhatsApp Evolution API</h5>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Última utilização: há 2 min</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, cursor: 'pointer' }} onClick={() => setCurrentView('deploy')}>
                  Conectado
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding checklist & Action cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem' }}>
        
        {/* Onboarding OmniFlow 101 checklist */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>OmniFlow 101</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Conclua as etapas para configurar seu primeiro agente de IA.</p>
            </div>
            
            {/* Circular Progress Gauge */}
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'conic-gradient(#10b981 65%, #e2e8f0 0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#0f172a'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981' }}>65%</span>
              </div>
            </div>
          </div>

          {/* Wizard Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.2rem' }}>
            
            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Zap size={14} color="#10b981" /> Iniciar
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', paddingLeft: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> Configuração do ambiente VPS OmniFlow
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> Adicionar membros e grupos especializados
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Layers size={14} color="#06b6d4" /> Construir
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', paddingLeft: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> Indexar base de conhecimento (Pgvector)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> Conecte a base de conhecimento RAG ao Agente
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> Configurar diretrizes do Agente de IA
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#64748b', cursor: 'pointer' }} onClick={() => setIsTestDrawerOpen(true)}>
                  <Circle size={14} /> Teste seu agente no Sandbox
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Rocket size={14} color="#7c3aed" /> Conectar
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', paddingLeft: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> Integrar WhatsApp e Webchat
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Action Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
          
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                Guia de Configuração OmniFlow
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4 }}>
                Construa o seu primeiro Agente de IA e o inicie no seu website ou WhatsApp.
              </p>
            </div>
            <button 
              onClick={() => setCurrentView('agents')}
              style={{
                marginTop: '1.25rem',
                backgroundColor: '#ffffff',
                border: '1px solid #10b981',
                borderRadius: '0.375rem',
                padding: '0.5rem 1rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#10b981',
                cursor: 'pointer',
                width: 'fit-content'
              }}
            >
              Ver guia
            </button>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                Configurar mais canais
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4 }}>
                Crie uma experiência omnichannel integrada (WhatsApp, E-mail, Telegram, Instagram, Voice).
              </p>
            </div>
            <button 
              onClick={() => setCurrentView('deploy')}
              style={{
                marginTop: '1.25rem',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '0.375rem',
                padding: '0.5rem 1rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#10b981',
                cursor: 'pointer',
                width: 'fit-content'
              }}
            >
              Procurar integrações
            </button>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                Bate-papo com os clientes
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4 }}>
                Ver caixa de entrada compartilhada e transferir solicitações para atendentes humanos.
              </p>
            </div>
            <button 
              onClick={() => setCurrentView('chats')}
              style={{
                marginTop: '1.25rem',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '0.375rem',
                padding: '0.5rem 1rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#10b981',
                cursor: 'pointer',
                width: 'fit-content'
              }}
            >
              Ver bate-papo ao vivo
            </button>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                Contatar o suporte
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4 }}>
                Fale com o nosso agente de IA OmniFlow e tire suas dúvidas em tempo real.
              </p>
            </div>
            <button 
              onClick={() => setIsTestDrawerOpen(true)}
              style={{
                marginTop: '1.25rem',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '0.375rem',
                padding: '0.5rem 1rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#10b981',
                cursor: 'pointer',
                width: 'fit-content'
              }}
            >
              Contato
            </button>
          </div>

          <div style={{
            gridColumn: 'span 2',
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <BookOpen size={20} color="#10b981" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Documentação OmniFlow AI</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Recursos abrangentes para utilizar a plataforma SaaS em sua empresa.</p>
              </div>
            </div>
            <button style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '0.375rem',
              padding: '0.45rem 1rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#10b981',
              cursor: 'pointer'
            }}>
              Visualizar
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
