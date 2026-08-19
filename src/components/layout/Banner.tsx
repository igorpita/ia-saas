import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Banner: React.FC = () => {
  const { currentWorkspace, setIsCheckoutOpen } = useApp();

  if (!currentWorkspace || currentWorkspace.plan !== 'trial') return null;

  return (
    <div style={{
      backgroundColor: '#ecfdf5',
      borderBottom: '1px solid #a7f3d0',
      color: '#065f46',
      padding: '0.4rem 1.5rem',
      fontSize: '0.8rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontWeight: 500
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Sparkles size={15} color="#10b981" />
        <span>
          Seu período de avaliação gratuita do <strong>OmniFlow AI</strong> expira em <strong>{currentWorkspace.trialDaysLeft} dias</strong>. Assine agora para manter o atendimento multicanal sem interrupções.
        </span>
      </div>

      <button
        onClick={() => setIsCheckoutOpen(true)}
        style={{
          backgroundColor: '#10b981',
          color: '#ffffff',
          border: 'none',
          borderRadius: '0.25rem',
          padding: '0.25rem 0.75rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem'
        }}
      >
        Fazer Upgrade <ArrowRight size={12} />
      </button>
    </div>
  );
};
