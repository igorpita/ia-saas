import React, { useState } from 'react';
import { X, Send, Bot, RefreshCw, Sparkles, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TestDrawer: React.FC = () => {
  const { isTestDrawerOpen, setIsTestDrawerOpen, selectedAgent } = useApp();
  
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'agent'; text: string; time: string; citations?: string[] }>>([
    {
      id: '1',
      sender: 'agent',
      text: `Olá 👋 Sou o ${selectedAgent?.name || 'Agente de IA'}. Como posso ajudar você hoje? (Ambiente de Testes OmniFlow AI Sandbox)`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: ['oab-ba.org.br site', 'Manual do Usuário Sistemas OAB.pdf']
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isTestDrawerOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: String(Date.now()),
      sender: 'user' as const,
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const userQuery = input;
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = `Com base nas informações da base de conhecimento da OAB-BA (OmniFlow Pgvector), posso te instruir sobre como proceder com "${userQuery}".`;
      let citations = ['oab-ba.org.br site'];

      if (userQuery.toLowerCase().includes('humano') || userQuery.toLowerCase().includes('atendente')) {
        replyText = 'Estou acionando o nó de transbordo humano! Esta conversa seria direcionada para a fila "Service Desk TI".';
        citations = ['Diretriz de Transbordo Humano'];
      }

      setMessages(prev => [...prev, {
        id: String(Date.now() + 1),
        sender: 'agent',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations
      }]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div style={{
        width: '440px',
        height: '100%',
        backgroundColor: '#ffffff',
        boxShadow: '-10px 0 25px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 0.2s ease'
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#0f172a',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Simulação OmniFlow Sandbox</h3>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Modelo: {selectedAgent?.modelName || 'OmniFlow AI Engine v4'}
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setMessages([{
                id: '1',
                sender: 'agent',
                text: `Sessão reiniciada. Teste o agente novamente.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }])}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              title="Reiniciar chat"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() => setIsTestDrawerOpen(false)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Config Summary Banner */}
        <div style={{ padding: '0.6rem 1rem', backgroundColor: '#ecfdf5', borderBottom: '1px solid #a7f3d0', fontSize: '0.75rem', color: '#047857', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span><strong>LLM:</strong> {selectedAgent?.llmProvider === 'builtin' ? 'OmniFlow Engine v4 (Embutido)' : 'BYO-LLM Cliente'}</span>
          <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.1rem 0.4rem', borderRadius: '0.2rem', fontWeight: 600 }}>RAG Pgvector</span>
        </div>

        {/* Chat Messages Timeline */}
        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', backgroundColor: '#f8fafc' }}>
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              <div style={{
                backgroundColor: msg.sender === 'user' ? '#10b981' : '#ffffff',
                color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                borderTopRightRadius: msg.sender === 'user' ? '0.1rem' : '0.75rem',
                borderTopLeftRadius: msg.sender === 'agent' ? '0.1rem' : '0.75rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: msg.sender === 'agent' ? '1px solid #e2e8f0' : 'none',
                fontSize: '0.85rem',
                lineHeight: 1.4
              }}>
                {msg.text}

                {msg.citations && msg.citations.length > 0 && (
                  <div style={{ marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: '1px solid #f1f5f9', fontSize: '0.7rem', color: '#64748b' }}>
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.2rem' }}>
                      <FileText size={10} color="#10b981" /> Fontes RAG utilizadas:
                    </div>
                    {msg.citations.map((c, i) => (
                      <span key={i} style={{ display: 'inline-block', backgroundColor: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '0.2rem', marginRight: '0.25rem' }}>
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.2rem', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                {msg.time}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ alignSelf: 'flex-start', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '0.5rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={14} className="animate-spin" color="#10b981" />
              OmniFlow Agente gerando resposta...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '0.85rem', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua mensagem para testar no OmniFlow..."
            style={{
              flex: 1,
              border: '1px solid #cbd5e1',
              borderRadius: '0.375rem',
              padding: '0.55rem 0.75rem',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSend}
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
