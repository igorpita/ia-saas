import React, { useState } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  X,
  CreditCard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setWorkspace, isCheckoutOpen, setIsCheckoutOpen } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'enterprise'>('pro');

  const [companyName, setCompanyName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [llmOption, setLlmOption] = useState<'builtin' | 'byo'>('builtin');

  const handleCompleteCheckout = () => {
    if (!companyName.trim() || !adminEmail.trim()) {
      alert('Por favor, preencha o nome da empresa e e-mail.');
      return;
    }

    const newWorkspace = {
      id: `ws-${Date.now()}`,
      name: companyName,
      slug: companyName.toLowerCase().replace(/\s+/g, '-'),
      plan: selectedPlan,
      trialDaysLeft: 14,
      activeChannelsCount: 3,
      builtInLlmTokensUsed: 0,
      monthlyLimitTokens: selectedPlan === 'starter' ? 500000 : selectedPlan === 'pro' ? 2000000 : 10000000,
      customLlmConfig: {
        enabled: llmOption === 'byo',
        provider: llmOption === 'byo' ? 'openai' as const : 'builtin' as const,
        modelName: llmOption === 'byo' ? 'GPT-4o (BYO-LLM)' : 'OmniFlow AI Engine v4'
      }
    };

    setWorkspace(newWorkspace);
    setIsCheckoutOpen(false);
    setCurrentView('home');
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      
      {/* Top Navbar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 4rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.25rem', fontWeight: 800 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} color="#ffffff" />
          </div>
          <span>omni<span style={{ color: '#10b981' }}>flow.ai</span></span>
        </div>

        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
          <a href="#recursos" style={{ color: 'inherit', textDecoration: 'none' }}>Recursos</a>
          <a href="#canais" style={{ color: 'inherit', textDecoration: 'none' }}>Canais Multicanal</a>
          <a href="#precos" style={{ color: 'inherit', textDecoration: 'none' }}>Preços & Assinatura</a>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentView('home')}
            style={{
              backgroundColor: 'transparent',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Entrar no Console
          </button>

          <button
            onClick={() => setIsCheckoutOpen(true)}
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.5rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16,185,129,0.4)'
            }}
          >
            Assinar Agora
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '6rem 4rem 4rem', textAlign: 'center', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '999px', padding: '0.35rem 1rem', fontSize: '0.82rem', color: '#34d399', marginBottom: '1.5rem', fontWeight: 600 }}>
          <Sparkles size={16} /> Plataforma SaaS Autônoma de Agentes de IA Multicanal
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
          Atendimento Inteligente Multicanal com <span style={{ background: 'linear-gradient(135deg, #34d399, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Agentes de IA OmniFlow</span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto 2.5rem' }}>
          Automação de atendimento via WhatsApp, E-mail, Webchat, Telegram, Instagram e Twilio Voice. Com RAG embutido (Pgvector), transbordo para equipes humanas especializadas e opção BYO-LLM.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button
            onClick={() => setIsCheckoutOpen(true)}
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.85rem 2rem',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 10px 25px rgba(16,185,129,0.4)'
            }}
          >
            Contratar SaaS OmniFlow <ArrowRight size={18} />
          </button>
          
          <button
            onClick={() => setCurrentView('home')}
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '0.5rem',
              padding: '0.85rem 1.75rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Explorar Console de Testes
          </button>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" style={{ padding: '4rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Planos & Assinatura Autônoma</h2>
          <p style={{ color: '#94a3b8' }}>Escolha o plano ideal para sua empresa. Cancele ou altere a qualquer momento.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          
          {/* Starter */}
          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Starter</h3>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '1rem 0' }}>
                R$ 490 <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>/mês</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <li><CheckCircle2 size={16} color="#10b981" style={{ display: 'inline', marginRight: '6px' }} /> 2 Agentes de IA</li>
                <li><CheckCircle2 size={16} color="#10b981" style={{ display: 'inline', marginRight: '6px' }} /> 2 Canais Conectados</li>
                <li><CheckCircle2 size={16} color="#10b981" style={{ display: 'inline', marginRight: '6px' }} /> Modelo LLM Embutido SaaS</li>
                <li><CheckCircle2 size={16} color="#10b981" style={{ display: 'inline', marginRight: '6px' }} /> Transbordo Humano com Grupos</li>
              </ul>
            </div>
            <button onClick={() => { setSelectedPlan('starter'); setIsCheckoutOpen(true); }} style={{ marginTop: '2rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer' }}>
              Assinar Starter
            </button>
          </div>

          {/* Pro */}
          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.95)', border: '2px solid #10b981', borderRadius: '1rem', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 0 30px rgba(16,185,129,0.3)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', right: '2rem', backgroundColor: '#10b981', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '999px', textTransform: 'uppercase' }}>
              Mais Popular
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Pro Corporate</h3>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '1rem 0', color: '#34d399' }}>
                R$ 1.490 <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>/mês</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <li><CheckCircle2 size={16} color="#10b981" style={{ display: 'inline', marginRight: '6px' }} /> 10 Agentes de IA</li>
                <li><CheckCircle2 size={16} color="#10b981" style={{ display: 'inline', marginRight: '6px' }} /> Todos os Canais (WhatsApp, Email, Webchat)</li>
                <li><CheckCircle2 size={16} color="#10b981" style={{ display: 'inline', marginRight: '6px' }} /> BYO-LLM Opcional (OpenAI / Claude / Gemini)</li>
                <li><CheckCircle2 size={16} color="#10b981" style={{ display: 'inline', marginRight: '6px' }} /> RAG Ilimitado com Pgvector</li>
                <li><CheckCircle2 size={16} color="#10b981" style={{ display: 'inline', marginRight: '6px' }} /> Gestão de Campanhas de Disparo</li>
              </ul>
            </div>
            <button onClick={() => { setSelectedPlan('pro'); setIsCheckoutOpen(true); }} style={{ marginTop: '2rem', backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer' }}>
              Assinar Pro Corporate
            </button>
          </div>

          {/* Enterprise */}
          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Enterprise</h3>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '1rem 0' }}>
                R$ 3.990 <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>/mês</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <li><CheckCircle2 size={16} color="#10b981" style={{ display: 'inline', marginRight: '6px' }} /> Agentes e Canais Ilimitados</li>
                <li><CheckCircle2 size={16} color="#10b981" style={{ display: 'inline', marginRight: '6px' }} /> Suporte a MCP Tools & REST APIs</li>
                <li><CheckCircle2 size={16} color="#10b981" style={{ display: 'inline', marginRight: '6px' }} /> SLA 99.99% & Account Manager</li>
              </ul>
            </div>
            <button onClick={() => { setSelectedPlan('enterprise'); setIsCheckoutOpen(true); }} style={{ marginTop: '2rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer' }}>
              Contratar Enterprise
            </button>
          </div>

        </div>
      </section>

      {/* Autonomous Checkout Modal */}
      {isCheckoutOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#ffffff', color: '#0f172a', borderRadius: '1rem', padding: '2rem', width: '540px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
            
            <button onClick={() => setIsCheckoutOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.2rem' }}>
              Contratação Autônoma OmniFlow - Plano {selectedPlan.toUpperCase()}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Preencha os dados do seu workspace para receber acesso imediato ao ambiente console.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Nome da Empresa / Workspace</label>
                <input
                  type="text"
                  placeholder="ex: Minha Empresa SaaS"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Nome do Administrador</label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={adminName}
                    onChange={e => setAdminName(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>E-mail Corporativo</label>
                  <input
                    type="email"
                    placeholder="admin@empresa.com"
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Escolha do Modelo LLM Inicial</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div
                    onClick={() => setLlmOption('builtin')}
                    style={{
                      border: llmOption === 'builtin' ? '2px solid #10b981' : '1px solid #cbd5e1',
                      borderRadius: '0.375rem',
                      padding: '0.65rem',
                      cursor: 'pointer',
                      backgroundColor: llmOption === 'builtin' ? '#ecfdf5' : '#fff'
                    }}
                  >
                    <strong style={{ fontSize: '0.82rem', color: '#047857', display: 'block' }}>Modelo SaaS Embutido</strong>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Incluso no valor da assinatura</span>
                  </div>

                  <div
                    onClick={() => setLlmOption('byo')}
                    style={{
                      border: llmOption === 'byo' ? '2px solid #10b981' : '1px solid #cbd5e1',
                      borderRadius: '0.375rem',
                      padding: '0.65rem',
                      cursor: 'pointer',
                      backgroundColor: llmOption === 'byo' ? '#ecfdf5' : '#fff'
                    }}
                  >
                    <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block' }}>Usar LLM Própria</strong>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>BYO-LLM (OpenAI / Claude)</span>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={18} color="#10b981" />
                <span>Simulação de Pagamento Stripe/Pix: Assinatura autônoma liberada instantaneamente.</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button onClick={() => setIsCheckoutOpen(false)} style={{ padding: '0.6rem 1.2rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', background: 'none', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={handleCompleteCheckout} style={{ padding: '0.6rem 1.5rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: 700, cursor: 'pointer' }}>
                Confirmar Assinatura &amp; Acessar Console
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
