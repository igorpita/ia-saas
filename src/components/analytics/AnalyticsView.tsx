import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Filter, 
  Calendar
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [subTab, setSubTab] = useState<'overview' | 'ai_agents' | 'human_agents'>('overview');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 56px)', backgroundColor: '#f8fafc' }}>
      
      {/* Left Sub-nav Sidebar matching Screenshot 6 */}
      <div style={{ backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0', padding: '1.25rem 1rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Análises
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setSubTab('overview')}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.82rem',
              fontWeight: subTab === 'overview' ? 700 : 500,
              backgroundColor: subTab === 'overview' ? '#eff6ff' : 'transparent',
              color: subTab === 'overview' ? '#2563eb' : '#334155',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            Visão geral
          </button>
          <button
            onClick={() => setSubTab('ai_agents')}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.82rem',
              fontWeight: subTab === 'ai_agents' ? 700 : 500,
              backgroundColor: subTab === 'ai_agents' ? '#eff6ff' : 'transparent',
              color: subTab === 'ai_agents' ? '#2563eb' : '#334155',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            Agentes de IA
          </button>
          <button
            onClick={() => setSubTab('human_agents')}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.82rem',
              fontWeight: subTab === 'human_agents' ? 700 : 500,
              backgroundColor: subTab === 'human_agents' ? '#eff6ff' : 'transparent',
              color: subTab === 'human_agents' ? '#2563eb' : '#334155',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            Agentes humanos
          </button>
        </div>

        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Relatórios
        </div>
        <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: '#64748b', cursor: 'pointer' }}>
          Todos os relatórios
        </div>
      </div>

      {/* Main Analytics Dashboard */}
      <div style={{ padding: '2rem 2.5rem', maxWidth: '1200px' }}>
        
        {/* Header Filters */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #cbd5e1', padding: '0.35rem 0.75rem', borderRadius: '0.375rem', backgroundColor: '#fff', fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>
            <Calendar size={15} color="#2563eb" />
            <span>ago 01, 2026 - ago 18, 2026</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ padding: '0.4rem 0.85rem', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontSize: '0.82rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              Comparar
            </button>
            <button style={{ padding: '0.4rem 0.85rem', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontSize: '0.82rem', fontWeight: 600, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Filter size={14} /> Filtros
            </button>
            <button style={{ padding: '0.4rem 0.85rem', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontSize: '0.82rem', fontWeight: 600, color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Download size={14} /> Exportar
            </button>
          </div>
        </div>

        {/* Key Metrics Cards matching Screenshot 6 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.75rem' }}>
          
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Pontuação CSAT média do Agente de IA
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              4.9 <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 600 }}>/ 5.0 ★</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>+12% referente ao mês anterior</span>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>
              Contenção / Deflexão %
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>
              78.4%
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Resolvido 100% pela IA sem transbordo humano</span>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>
              Total de conversas
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
              1,480
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Omnichannel no período</span>
          </div>

        </div>

        {/* Charts & Time Performance Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
          
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              Conversas significativas
            </h4>
            
            <div style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px dashed #cbd5e1' }}>
              <BarChart3 size={32} color="#2563eb" style={{ marginBottom: '0.5rem' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                1,160 Conversas Resolvidas pela IA (78.4%) • 320 Transferidas para Atendentes
              </span>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              Desempenho baseado no tempo
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>Tempo médio de resposta</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.3rem' }}>
                  <span>Agentes de IA</span>
                  <strong style={{ color: '#16a34a' }}>1.2s</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.3rem' }}>
                  <span>Agentes humanos</span>
                  <strong style={{ color: '#2563eb' }}>1m 45s</strong>
                </div>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>Duração mediana da sessão</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.3rem' }}>
                  <span>Sessões de Agente de IA</span>
                  <strong>2m 10s</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.3rem' }}>
                  <span>Sessões de Agente humano</span>
                  <strong>6m 30s</strong>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
