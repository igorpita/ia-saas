import React, { useState } from 'react';
import { 
  Zap, 
  ChevronDown, 
  Play, 
  UserPlus, 
  ShieldCheck, 
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    currentWorkspace, 
    workspaces, 
    setWorkspace, 
    setIsTestDrawerOpen,
    currentUser
  } = useApp();

  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);

  const mainNavItems = [
    { id: 'home', label: 'Início' },
    { id: 'agents', label: 'Agentes de IA' },
    { id: 'knowledge', label: 'Conhecimento' },
    { id: 'campaigns', label: 'Campanhas' },
    { id: 'contacts', label: 'Contatos CRM' },
    { id: 'analytics', label: 'Análises' },
    { id: 'chats', label: 'Bate-papo ao vivo' },
    { id: 'deploy', label: 'Implantar & Canais' }
  ];

  return (
    <header style={{
      backgroundColor: '#0f172a',
      color: '#ffffff',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      userSelect: 'none',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      
      {/* Left section: Brand & Workspace Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        
        {/* Brand Logo - OmniFlow AI */}
        <div 
          onClick={() => setCurrentView('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(16,185,129,0.4)'
          }}>
            <Zap size={18} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
            omni<span style={{ color: '#10b981' }}>flow.ai</span>
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: '20px', width: '1px', backgroundColor: 'rgba(255,255,255,0.15)' }} />

        {/* Workspace Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '0.375rem',
              padding: '0.35rem 0.75rem',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <span style={{ maxWidth: '180px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {currentWorkspace?.name || 'Selecione o Workspace'}
            </span>
            <ChevronDown size={14} color="#94a3b8" />
          </button>

          {isWorkspaceDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              width: '240px',
              zIndex: 50,
              overflow: 'hidden',
              padding: '0.35rem 0'
            }}>
              <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Seus Workspaces
              </div>
              
              {workspaces.map(ws => (
                <div
                  key={ws.id}
                  onClick={() => {
                    setWorkspace(ws);
                    setIsWorkspaceDropdownOpen(false);
                  }}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.82rem',
                    color: ws.id === currentWorkspace?.id ? '#10b981' : '#cbd5e1',
                    backgroundColor: ws.id === currentWorkspace?.id ? 'rgba(16,185,129,0.15)' : 'transparent',
                    cursor: 'pointer',
                    fontWeight: ws.id === currentWorkspace?.id ? 700 : 400
                  }}
                >
                  {ws.name}
                </div>
              ))}

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '0.35rem', paddingTop: '0.35rem' }}>
                <div 
                  onClick={() => {
                    setCurrentView('settings');
                    setIsWorkspaceDropdownOpen(false);
                  }}
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', color: '#10b981', cursor: 'pointer', fontWeight: 600 }}
                >
                  + Gerenciar Workspaces
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Main Navigation Tabs */}
      <nav style={{ display: 'flex', gap: '0.25rem', height: '100%' }}>
        {mainNavItems.map(item => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid #10b981' : '2px solid transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                padding: '0 0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Right action bar: Test drawer, Admin portal, Site, User Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        
        <button
          onClick={() => setIsTestDrawerOpen(true)}
          style={{
            backgroundColor: '#10b981',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.375rem',
            padding: '0.4rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: '0 0 10px rgba(16,185,129,0.3)'
          }}
        >
          <Play size={14} fill="#ffffff" />
          Testar
        </button>

        <button
          onClick={() => setCurrentView('admin')}
          style={{
            backgroundColor: currentView === 'admin' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
            color: currentView === 'admin' ? '#10b981' : '#cbd5e1',
            border: currentView === 'admin' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.15)',
            borderRadius: '0.375rem',
            padding: '0.4rem 0.75rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <ShieldCheck size={14} />
          SaaS Admin
        </button>

        <button
          onClick={() => setCurrentView('landing')}
          style={{
            backgroundColor: 'transparent',
            color: '#94a3b8',
            border: 'none',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <Globe size={14} />
          Site
        </button>

        <button
          onClick={() => setCurrentView('settings')}
          style={{
            backgroundColor: 'transparent',
            color: '#cbd5e1',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '0.375rem',
            padding: '0.4rem 0.65rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <UserPlus size={14} />
          Convidar
        </button>

        {/* User Profile Avatar */}
        <div 
          onClick={() => setCurrentView('settings')}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '2px solid rgba(255,255,255,0.2)'
          }}
          title={currentUser?.name}
        >
          {currentUser?.name ? currentUser.name.charAt(0) : 'F'}
        </div>

      </div>

    </header>
  );
};
