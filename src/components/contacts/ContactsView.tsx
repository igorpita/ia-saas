import React from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ContactsView: React.FC = () => {
  const { contacts } = useApp();

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: '1400px', margin: '0 auto', minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Base de Contatos & CRM
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Gerencie perfis de clientes, tags de segmentação e histórico de interações multicanal.
          </p>
        </div>

        <button
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.375rem',
            padding: '0.5rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Plus size={16} /> Adicionar Contato
        </button>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', fontWeight: 700 }}>
              <th style={{ padding: '0.75rem 1.25rem' }}>Nome do Contato</th>
              <th style={{ padding: '0.75rem 1.25rem' }}>Telefone</th>
              <th style={{ padding: '0.75rem 1.25rem' }}>E-mail</th>
              <th style={{ padding: '0.75rem 1.25rem' }}>Canal Principal</th>
              <th style={{ padding: '0.75rem 1.25rem' }}>Etiquetas (Tags)</th>
              <th style={{ padding: '0.75rem 1.25rem' }}>Última Interação</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#0f172a' }}>{c.name}</td>
                <td style={{ padding: '0.85rem 1.25rem', color: '#64748b' }}>{c.phone}</td>
                <td style={{ padding: '0.85rem 1.25rem', color: '#64748b' }}>{c.email}</td>
                <td style={{ padding: '0.85rem 1.25rem' }}>
                  <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.15rem 0.5rem', borderRadius: '0.2rem', fontWeight: 600, fontSize: '0.75rem' }}>
                    {c.channel}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    {c.tags.map((t, i) => (
                      <span key={i} style={{ fontSize: '0.7rem', backgroundColor: '#f1f5f9', color: '#334155', padding: '0.1rem 0.4rem', borderRadius: '0.2rem' }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1.25rem', color: '#64748b' }}>{c.lastInteraction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
