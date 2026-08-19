import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Search, 
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SuperAdminView: React.FC = () => {
  const { adminTenants, setWorkspace, setCurrentView } = useApp();
  const [search, setSearch] = useState('');

  const totalMrr = adminTenants.reduce((acc, t) => acc + t.mrr, 0);
  const activeTenantsCount = adminTenants.filter(t => t.status === 'active').length;

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: '1400px', margin: '0 auto', minHeight: 'calc(100vh - 56px)' }}>
      
      {/* Superadmin Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <ShieldCheck size={16} /> Portal de Superadministração SaaS OmniFlow AI
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            Painel Geral de Gestão da Plataforma OmniFlow SaaS
          </h2>
        </div>

        <div style={{ backgroundColor: '#10b981', color: '#ffffff', padding: '0.4rem 0.85rem', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: 700 }}>
          SuperAdmin Master Auth
        </div>
      </div>

      {/* SaaS Key Metrics Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>MRR (Receita Recorrente Mensal)</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', margin: '0.2rem 0' }}>
            R$ {totalMrr.toLocaleString('pt-BR')}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>+18.4% este mês</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Clientes / Tenants Ativos</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
            {activeTenantsCount} / {adminTenants.length}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Workspaces corporativos</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Tokens Processados (SaaS LLM)</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#06b6d4', margin: '0.2rem 0' }}>
            1.08M
          </div>
          <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 600 }}>Modelo OmniFlow Engine v4</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Infraestrutura &amp; Webhooks</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', margin: '0.2rem 0' }}>
            99.98%
          </div>
          <span style={{ fontSize: '0.72rem', color: '#10b981' }}>Gateway Multicanal Online</span>
        </div>

      </div>

      {/* Global LLM Central Hub Banner */}
      <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '0.75rem', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Cpu size={24} color="#047857" />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#065f46' }}>
              Vault Global de LLM para Modelo Embutido OmniFlow Engine v4
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#047857' }}>
              As chaves globais da infraestrutura SaaS alimentam o modelo embutido dos clientes que não optarem por BYO-LLM.
            </p>
          </div>
        </div>
        <button style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.375rem', padding: '0.45rem 1rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
          Gerenciar Vault Global
        </button>
      </div>

      {/* Tenant Management Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
            Gestão de Clientes / Tenants
          </h3>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar tenant por nome..."
              style={{ width: '100%', padding: '0.4rem 0.6rem 0.4rem 2rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontSize: '0.8rem' }}
            />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', fontWeight: 700 }}>
              <th style={{ padding: '0.75rem 1.25rem' }}>Cliente / Empresa</th>
              <th style={{ padding: '0.75rem 1.25rem' }}>Plano</th>
              <th style={{ padding: '0.75rem 1.25rem' }}>MRR</th>
              <th style={{ padding: '0.75rem 1.25rem' }}>Tokens Mês</th>
              <th style={{ padding: '0.75rem 1.25rem' }}>Agentes / Membros</th>
              <th style={{ padding: '0.75rem 1.25rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1.25rem' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {adminTenants
              .filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
              .map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <strong style={{ color: '#0f172a', display: 'block' }}>{t.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.email}</span>
                  </td>

                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span style={{ textTransform: 'uppercase', backgroundColor: '#ecfdf5', color: '#047857', padding: '0.15rem 0.5rem', borderRadius: '0.2rem', fontWeight: 700, fontSize: '0.75rem' }}>
                      {t.plan}
                    </span>
                  </td>

                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#10b981' }}>
                    R$ {t.mrr} /mês
                  </td>

                  <td style={{ padding: '0.85rem 1.25rem', color: '#64748b' }}>
                    {t.tokensUsedThisMonth.toLocaleString('pt-BR')} tokens
                  </td>

                  <td style={{ padding: '0.85rem 1.25rem', color: '#334155' }}>
                    {t.agentsCount} agentes • {t.usersCount} usuários
                  </td>

                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span style={{
                      backgroundColor: t.status === 'active' ? '#dcfce7' : '#fef3c7',
                      color: t.status === 'active' ? '#166534' : '#92400e',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '0.2rem',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {t.status === 'active' ? 'Ativo' : 'Período de Testes'}
                    </span>
                  </td>

                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <button
                      onClick={() => {
                        setWorkspace({
                          id: t.id,
                          name: t.name,
                          slug: t.name.toLowerCase().replace(/\s+/g, '-'),
                          plan: t.plan as any,
                          trialDaysLeft: 4,
                          activeChannelsCount: 2,
                          builtInLlmTokensUsed: t.tokensUsedThisMonth,
                          monthlyLimitTokens: 1000000,
                          customLlmConfig: { enabled: false, provider: 'builtin', modelName: 'OmniFlow AI Engine v4' }
                        });
                        setCurrentView('home');
                      }}
                      style={{
                        backgroundColor: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        color: '#10b981',
                        borderRadius: '0.25rem',
                        padding: '0.3rem 0.6rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <ExternalLink size={12} /> Entrar no Workspace
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
