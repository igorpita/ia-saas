import React, { useState } from 'react';
import { 
  Megaphone, 
  CreditCard, 
  Plus, 
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Campaign } from '../../types';

export const CampaignsView: React.FC = () => {
  const { campaigns, addCampaign, agents } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaignType, setCampaignType] = useState<'outreach' | 'payment_recovery'>('outreach');

  const [name, setName] = useState('');
  const [targetCount, setTargetCount] = useState(500);
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || '');
  const [selectedChannel, setSelectedChannel] = useState('WhatsApp');

  const handleCreateCampaign = () => {
    if (!name.trim()) return;
    const newCamp: Campaign = {
      id: `cmp-${Date.now()}`,
      name,
      type: campaignType,
      status: 'active',
      channel: selectedChannel,
      targetCount: Number(targetCount),
      deliveredCount: 0,
      aiEngagementRate: 0,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      agentId: selectedAgentId
    };
    addCampaign(newCamp);
    setIsModalOpen(false);
    setName('');
  };

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: '1400px', margin: '0 auto', minHeight: 'calc(100vh - 56px)' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Gerenciador de Campanhas Multicanal
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Dispare conversas ativas acionadas por Agentes de IA via WhatsApp, E-mail e SMS.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.375rem',
            padding: '0.5rem 1.25rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Plus size={16} /> Criar Campanha
        </button>
      </div>

      {/* Choice Cards matching Screenshot 5 */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
          Escolha o tipo de campanha
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.75rem', maxWidth: '900px', margin: '0 auto' }}>
          
          {/* Card 1: Divulgação */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
              marginBottom: '1.25rem'
            }}>
              <Megaphone size={32} />
            </div>

            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Divulgação
            </h4>

            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.5rem', height: '60px' }}>
              Transforme a campanha em conversas dinâmicas com Agentes de IA que engajam, respondem e fazem acompanhamento dos seus clientes em tempo real.
            </p>

            <button
              onClick={() => { setCampaignType('outreach'); setIsModalOpen(true); }}
              style={{
                backgroundColor: 'transparent',
                color: '#2563eb',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              Criar &gt;
            </button>
          </div>

          {/* Card 2: Recuperação de pagamentos */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
              marginBottom: '1.25rem'
            }}>
              <CreditCard size={32} />
            </div>

            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Recuperação de pagamentos
            </h4>

            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.5rem', height: '60px' }}>
              Conversas multicanal sem esforço com Agentes de IA que respondem, fazem acompanhamento, enviam lembretes de pagamento e se adaptam ao seu público.
            </p>

            <button
              onClick={() => { setCampaignType('payment_recovery'); setIsModalOpen(true); }}
              style={{
                backgroundColor: 'transparent',
                color: '#2563eb',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              Criar &gt;
            </button>
          </div>

        </div>
      </div>

      {/* Existing Campaigns List */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          Campanhas Ativas e Histórico
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', fontWeight: 700 }}>
              <th style={{ padding: '0.75rem' }}>Nome da Campanha</th>
              <th style={{ padding: '0.75rem' }}>Tipo</th>
              <th style={{ padding: '0.75rem' }}>Canal</th>
              <th style={{ padding: '0.75rem' }}>Público Alvo</th>
              <th style={{ padding: '0.75rem' }}>Disparados</th>
              <th style={{ padding: '0.75rem' }}>Engajamento IA</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(cmp => (
              <tr key={cmp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: '#0f172a' }}>{cmp.name}</td>
                <td style={{ padding: '0.85rem 0.75rem', color: '#64748b' }}>
                  {cmp.type === 'outreach' ? 'Divulgação' : 'Cobrança & Recuperação'}
                </td>
                <td style={{ padding: '0.85rem 0.75rem' }}>
                  <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.15rem 0.5rem', borderRadius: '0.2rem', fontWeight: 600, fontSize: '0.75rem' }}>
                    {cmp.channel}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 0.75rem' }}>{cmp.targetCount} contatos</td>
                <td style={{ padding: '0.85rem 0.75rem' }}>{cmp.deliveredCount} ({Math.round((cmp.deliveredCount / cmp.targetCount) * 100)}%)</td>
                <td style={{ padding: '0.85rem 0.75rem', color: '#16a34a', fontWeight: 700 }}>
                  <Sparkles size={13} style={{ display: 'inline', marginRight: '3px' }} />
                  {cmp.aiEngagementRate}%
                </td>
                <td style={{ padding: '0.85rem 0.75rem' }}>
                  <span style={{
                    backgroundColor: cmp.status === 'active' ? '#dcfce7' : '#f1f5f9',
                    color: cmp.status === 'active' ? '#166534' : '#64748b',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '0.2rem',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {cmp.status === 'active' ? 'Em andamento' : 'Concluído'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Criar Campanha */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.75rem', width: '480px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>
              Nova Campanha: {campaignType === 'outreach' ? 'Divulgação' : 'Recuperação de Pagamento'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Nome da Campanha</label>
                <input
                  type="text"
                  placeholder="ex: Disparo Lembrete Anuidade OAB 2026"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Canal de Disparo</label>
                <select
                  value={selectedChannel}
                  onChange={e => setSelectedChannel(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                >
                  <option value="WhatsApp">WhatsApp (Evolution API / Meta)</option>
                  <option value="E-mail">E-mail (SMTP / SendGrid)</option>
                  <option value="Telegram">Telegram Bot</option>
                  <option value="Infobip SMS">SMS Infobip</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Agente de IA Responsável pelo Atendimento</label>
                <select
                  value={selectedAgentId}
                  onChange={e => setSelectedAgentId(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                >
                  {agents.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Quantidade de Contatos (Audiência)</label>
                <input
                  type="number"
                  value={targetCount}
                  onChange={e => setTargetCount(Number(e.target.value))}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', background: 'none', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={handleCreateCampaign} style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}>
                Iniciar Disparos
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
