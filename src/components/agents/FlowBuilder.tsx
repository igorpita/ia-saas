import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Sparkles, 
  Compass, 
  HelpCircle, 
  Shuffle, 
  UserCheck, 
  Pause, 
  Code, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  MoreVertical, 
  Layers,
  Image,
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FlowBuilder: React.FC = () => {
  const { dialogs, setDialogs } = useApp();
  const [selectedDialogId, setSelectedDialogId] = useState<string>('dlg-greetings');
  const [leftTab, setLeftTab] = useState<'dialogs' | 'intents' | 'entities' | 'webhooks'>('dialogs');

  const selectedDialog = dialogs.find(d => d.id === selectedDialogId) || dialogs[0];

  const handleAddTextNode = () => {
    if (!selectedDialog) return;
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'text' as const,
      title: 'Mensagem de texto',
      content: 'Digite a resposta do agente...'
    };
    
    setDialogs(prev => prev.map(d => {
      if (d.id === selectedDialog.id) {
        return { ...d, nodes: [...d.nodes, newNode] };
      }
      return d;
    }));
  };

  const handleAddAiResponseNode = () => {
    if (!selectedDialog) return;
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'ai_response' as const,
      title: 'Resposta de IA (LLM RAG)',
      content: 'Resposta gerada dinamicamente com base nas fontes da Base de Conhecimento RAG.'
    };
    
    setDialogs(prev => prev.map(d => {
      if (d.id === selectedDialog.id) {
        return { ...d, nodes: [...d.nodes, newNode] };
      }
      return d;
    }));
  };

  const handleAddTransferNode = () => {
    if (!selectedDialog) return;
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'transfer' as const,
      title: 'Transferir Atendimento',
      content: 'Direcionar conversa para o grupo especializado: Service Desk TI'
    };
    
    setDialogs(prev => prev.map(d => {
      if (d.id === selectedDialog.id) {
        return { ...d, nodes: [...d.nodes, newNode] };
      }
      return d;
    }));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 300px', height: 'calc(100vh - 160px)', backgroundColor: '#f8fafc' }}>
      
      {/* Left Column: Dialogs & Intents Tree */}
      <div style={{ backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        
        {/* Navigation sub-tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          {(['dialogs', 'intents', 'entities', 'webhooks'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setLeftTab(tab)}
              style={{
                flex: 1,
                padding: '0.6rem 0.2rem',
                fontSize: '0.75rem',
                fontWeight: leftTab === tab ? 700 : 500,
                color: leftTab === tab ? '#2563eb' : '#64748b',
                borderBottom: leftTab === tab ? '2px solid #2563eb' : 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'dialogs' ? 'Diálogos' : tab === 'intents' ? 'Intenções' : tab === 'entities' ? 'Entidades' : 'Webhooks'}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div style={{ padding: '0.85rem', flex: 1, overflowY: 'auto' }}>
          <button 
            style={{
              width: '100%',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.5rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <Plus size={16} /> Criar diálogo
          </button>

          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Lista de Diálogos
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {dialogs.map(dlg => (
              <div
                key={dlg.id}
                onClick={() => setSelectedDialogId(dlg.id)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.82rem',
                  fontWeight: selectedDialogId === dlg.id ? 700 : 500,
                  backgroundColor: selectedDialogId === dlg.id ? '#eff6ff' : 'transparent',
                  color: selectedDialogId === dlg.id ? '#2563eb' : '#334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Compass size={14} />
                <span>{dlg.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '0.75rem', borderTop: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
          Arraste e solte para organizar em pastas
        </div>
      </div>

      {/* Center Canvas Area */}
      <div style={{
        position: 'relative',
        backgroundColor: '#f1f5f9',
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        overflow: 'auto',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Canvas Header bar */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          backgroundColor: '#ffffff',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          fontSize: '0.85rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>Fluxo Atual: <strong>{selectedDialog?.name}</strong></span>
        </div>

        {/* Node Flow sequence */}
        <div style={{ width: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', marginTop: '2.5rem' }}>
          
          {selectedDialog?.nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              {/* Connector line */}
              {index > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '2px', height: '24px', backgroundColor: '#94a3b8' }} />
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
                </div>
              )}

              {/* Node Card */}
              <div style={{
                width: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '0.5rem',
                border: node.type === 'intent' ? '1px solid #3b82f6' : node.type === 'transfer' ? '1px solid #7c3aed' : '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                overflow: 'hidden'
              }}>
                <div style={{
                  backgroundColor: node.type === 'intent' ? '#eff6ff' : node.type === 'transfer' ? '#f3e8ff' : '#f8fafc',
                  padding: '0.5rem 0.85rem',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: node.type === 'intent' ? '#1d4ed8' : node.type === 'transfer' ? '#6b21a8' : '#334155'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {node.type === 'intent' && <Compass size={14} />}
                    {node.type === 'text' && <MessageSquare size={14} />}
                    {node.type === 'ai_response' && <Sparkles size={14} color="#7c3aed" />}
                    {node.type === 'transfer' && <UserCheck size={14} color="#7c3aed" />}
                    <span>{node.title}</span>
                  </div>
                  <MoreVertical size={14} style={{ cursor: 'pointer', color: '#64748b' }} />
                </div>

                <div style={{ padding: '0.85rem', fontSize: '0.82rem', color: '#0f172a', lineHeight: 1.4 }}>
                  {node.type === 'intent' ? (
                    <div style={{ backgroundColor: '#f1f5f9', padding: '0.4rem 0.6rem', borderRadius: '0.25rem', fontSize: '0.78rem', color: '#2563eb', fontWeight: 600 }}>
                      Intenção selecionada: {node.content}
                    </div>
                  ) : (
                    <div>{node.content}</div>
                  )}
                </div>
              </div>
            </React.Fragment>
          ))}

        </div>

        {/* Floating Canvas Controls */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '0.375rem',
          display: 'flex',
          alignItems: 'center',
          padding: '0.25rem 0.5rem',
          gap: '0.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          fontSize: '0.75rem'
        }}>
          <ZoomIn size={14} style={{ cursor: 'pointer' }} />
          <span>100%</span>
          <ZoomOut size={14} style={{ cursor: 'pointer' }} />
          <Maximize2 size={14} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      {/* Right Palette Column: Ferramentas / Blocks */}
      <div style={{ backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0', padding: '1rem', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          Ferramentas de Nós
        </h3>

        {/* Group 1: Comece Com */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>
            Comece Com
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            <button style={{ padding: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
              <Compass size={13} color="#2563eb" /> Intenção
            </button>
            <button style={{ padding: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
              <Sparkles size={13} color="#f59e0b" /> Evento
            </button>
            <button style={{ padding: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
              <HelpCircle size={13} color="#64748b" /> Fallback
            </button>
          </div>
        </div>

        {/* Group 2: Responder Com */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>
            Responder Com
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            <button onClick={handleAddTextNode} style={{ padding: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
              <MessageSquare size={13} color="#2563eb" /> Texto
            </button>
            <button onClick={handleAddAiResponseNode} style={{ padding: '0.5rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
              <Sparkles size={13} color="#2563eb" /> Resposta IA
            </button>
            <button style={{ padding: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
              <Image size={13} color="#10b981" /> Imagem
            </button>
            <button style={{ padding: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
              <Layers size={13} color="#7c3aed" /> Carrossel
            </button>
          </div>
        </div>

        {/* Group 3: Operações & Human Transfer */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>
            Operações
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            <button style={{ padding: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
              <HelpCircle size={13} color="#2563eb" /> Pergunta
            </button>
            <button style={{ padding: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
              <Shuffle size={13} color="#f59e0b" /> Condição
            </button>
            <button onClick={handleAddTransferNode} style={{ padding: '0.5rem', backgroundColor: '#f3e8ff', border: '1px solid #d8b4fe', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 700, color: '#6b21a8', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
              <UserCheck size={13} color="#7c3aed" /> Transferir
            </button>
            <button style={{ padding: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
              <Pause size={13} color="#ef4444" /> Pausa
            </button>
          </div>
        </div>

        {/* Group 4: Ferramentas Externas / MCP */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>
            Ferramentas Externas & MCPs
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button style={{ padding: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <Code size={13} color="#2563eb" /> Requisição HTTP REST API
            </button>
            <button style={{ padding: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <Sliders size={13} color="#7c3aed" /> Chamada MCP Tool Server
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
