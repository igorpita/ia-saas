import React, { useState } from 'react';
import { 
  Inbox, 
  Users, 
  UserCheck, 
  Trash2, 
  AlertOctagon, 
  Send, 
  MessageSquare, 
  Sparkles, 
  ChevronDown, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ChatView: React.FC = () => {
  const { 
    chatThreads, 
    selectedThread, 
    setSelectedThread, 
    sendMessageToThread, 
    specializedGroups,
    transferThreadToGroup,
    currentUser
  } = useApp();

  const [inboxFilter, setInboxFilter] = useState<'my_inbox' | 'all' | 'unassigned' | 'spam' | 'trash'>('my_inbox');
  const [inputText, setInputText] = useState('');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const filteredThreads = chatThreads.filter(t => {
    if (inboxFilter === 'unassigned') return t.status === 'unassigned';
    if (inboxFilter === 'spam') return t.status === 'spam';
    if (inboxFilter === 'trash') return t.status === 'trash';
    return true;
  });

  const activeThread = selectedThread || filteredThreads[0];

  const handleSend = () => {
    if (!inputText.trim() || !activeThread) return;
    sendMessageToThread(activeThread.id, inputText, 'human_agent');
    setInputText('');
  };

  const handleAiCopilotSuggest = () => {
    if (!activeThread) return;
    const suggestedText = `Olá ${activeThread.contactName}, revisei seu histórico com nossa IA. Como especialista do Service Desk, estou assumindo seu atendimento para solucionar a inconsistência de acesso.`;
    setInputText(suggestedText);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 320px 1fr 300px', height: 'calc(100vh - 56px)', backgroundColor: '#ffffff' }}>
      
      {/* Column 1: Caixa de Entrada Sub-navigation matching Screenshot 7 */}
      <div style={{ backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ padding: '0.4rem 0.5rem', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span>Caixa de entrada</span>
            <ChevronDown size={14} />
          </div>

          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem', paddingLeft: '0.5rem' }}>
            Conversas
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <button
              onClick={() => setInboxFilter('my_inbox')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.6rem',
                borderRadius: '0.375rem',
                fontSize: '0.82rem',
                fontWeight: inboxFilter === 'my_inbox' ? 700 : 500,
                backgroundColor: inboxFilter === 'my_inbox' ? '#eff6ff' : 'transparent',
                color: inboxFilter === 'my_inbox' ? '#2563eb' : '#334155',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Inbox size={15} /> Minha Caixa
              </div>
              <span style={{ fontSize: '0.7rem', backgroundColor: '#e2e8f0', padding: '0.05rem 0.4rem', borderRadius: '999px' }}>
                {chatThreads.filter(t => t.assignedHumanName === currentUser.name).length}
              </span>
            </button>

            <button
              onClick={() => setInboxFilter('all')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.6rem',
                borderRadius: '0.375rem',
                fontSize: '0.82rem',
                fontWeight: inboxFilter === 'all' ? 700 : 500,
                backgroundColor: inboxFilter === 'all' ? '#eff6ff' : 'transparent',
                color: inboxFilter === 'all' ? '#2563eb' : '#334155',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={15} /> Todos
              </div>
              <span style={{ fontSize: '0.7rem', backgroundColor: '#e2e8f0', padding: '0.05rem 0.4rem', borderRadius: '999px' }}>
                {chatThreads.length}
              </span>
            </button>

            <button
              onClick={() => setInboxFilter('unassigned')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.6rem',
                borderRadius: '0.375rem',
                fontSize: '0.82rem',
                fontWeight: inboxFilter === 'unassigned' ? 700 : 500,
                backgroundColor: inboxFilter === 'unassigned' ? '#eff6ff' : 'transparent',
                color: inboxFilter === 'unassigned' ? '#2563eb' : '#334155',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={15} /> Não atribuído
              </div>
              <span style={{ fontSize: '0.7rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '0.05rem 0.4rem', borderRadius: '999px', fontWeight: 700 }}>
                {chatThreads.filter(t => t.status === 'unassigned').length}
              </span>
            </button>

            <button
              onClick={() => setInboxFilter('spam')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.6rem',
                borderRadius: '0.375rem',
                fontSize: '0.82rem',
                color: '#64748b',
                border: 'none',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertOctagon size={15} /> Spam
              </div>
              <span>0</span>
            </button>

            <button
              onClick={() => setInboxFilter('trash')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.6rem',
                borderRadius: '0.375rem',
                fontSize: '0.82rem',
                color: '#64748b',
                border: 'none',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trash2 size={15} /> Lixeira
              </div>
              <span>0</span>
            </button>
          </div>

          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: '1.2rem', marginBottom: '0.4rem', paddingLeft: '0.5rem' }}>
            Grupos Especializados
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {specializedGroups.map(grp => (
              <div key={grp.id} style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: grp.color }} />
                  {grp.name}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{grp.activeChatsCount}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '0.5rem', backgroundColor: '#ffffff', borderRadius: '0.375rem', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}>
          <div style={{ fontWeight: 700, color: '#0f172a' }}>{currentUser.name}</div>
          <div style={{ color: '#16a34a', fontSize: '0.7rem' }}>● Atendente Online</div>
        </div>
      </div>

      {/* Column 2: Thread List */}
      <div style={{ borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Minha Caixa</span>
          <Filter size={15} color="#64748b" style={{ cursor: 'pointer' }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredThreads.map(thread => {
            const isSelected = activeThread?.id === thread.id;
            return (
              <div
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                style={{
                  padding: '0.85rem 1rem',
                  borderBottom: '1px solid #f1f5f9',
                  backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                  borderLeft: isSelected ? '3px solid #2563eb' : '3px solid transparent'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{thread.contactName}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{thread.lastMessageTime}</span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginBottom: '0.4rem' }}>
                  {thread.lastMessage}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.68rem', backgroundColor: '#f1f5f9', color: '#3b82f6', padding: '0.1rem 0.4rem', borderRadius: '0.2rem', fontWeight: 600 }}>
                    {thread.assignedGroupTitle || 'Sem Grupo'}
                  </span>
                  {thread.unreadCount > 0 && (
                    <span style={{ fontSize: '0.65rem', backgroundColor: '#ef4444', color: '#fff', padding: '0.05rem 0.35rem', borderRadius: '999px', fontWeight: 800 }}>
                      {thread.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Column 3: Main Active Chat Window */}
      {activeThread ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff' }}>
          
          {/* Chat Header */}
          <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>
                {activeThread.contactName.charAt(0)}
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{activeThread.contactName}</h4>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Canal: <strong>{activeThread.contactChannel.toUpperCase()}</strong> • Grupo: <strong style={{ color: '#2563eb' }}>{activeThread.assignedGroupTitle}</strong>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setIsTransferModalOpen(true)}
                style={{
                  backgroundColor: '#f3e8ff',
                  color: '#6b21a8',
                  border: '1px solid #d8b4fe',
                  borderRadius: '0.375rem',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <UserCheck size={14} /> Transferir de Grupo
              </button>
            </div>
          </div>

          {/* Messages Timeline */}
          <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#f8fafc' }}>
            {activeThread.messages.map(msg => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                    <span style={{ fontSize: '0.72rem', backgroundColor: '#f1f5f9', color: '#475569', padding: '0.2rem 0.75rem', borderRadius: '999px', fontWeight: 600 }}>
                      {msg.text} ({msg.timestamp})
                    </span>
                  </div>
                );
              }

              const isUser = msg.sender === 'user';
              const isAi = msg.sender === 'agent';

              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isUser ? 'flex-start' : 'flex-end',
                    maxWidth: '75%'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.2rem', textAlign: isUser ? 'left' : 'right' }}>
                    {msg.senderName} {isAi && <span style={{ color: '#7c3aed', fontWeight: 700 }}>(IA Agent)</span>}
                  </div>

                  <div style={{
                    backgroundColor: isUser ? '#ffffff' : isAi ? '#eff6ff' : '#2563eb',
                    color: isUser ? '#0f172a' : isAi ? '#1e40af' : '#ffffff',
                    border: isUser ? '1px solid #e2e8f0' : isAi ? '1px solid #bfdbfe' : 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    fontSize: '0.85rem',
                    lineHeight: 1.4
                  }}>
                    {msg.text}
                  </div>

                  <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.2rem', textAlign: isUser ? 'left' : 'right' }}>
                    {msg.timestamp}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Co-Pilot Toolbar & Reply Box */}
          <div style={{ borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff', padding: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <button
                onClick={handleAiCopilotSuggest}
                style={{
                  backgroundColor: '#f3e8ff',
                  border: '1px solid #d8b4fe',
                  color: '#7c3aed',
                  borderRadius: '0.375rem',
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Sparkles size={13} /> AI Co-Pilot: Sugerir Resposta com RAG
              </button>

              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Atendimento Atribuído a: <strong>{currentUser.name}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <textarea
                rows={2}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Digite a resposta do atendente humano..."
                style={{
                  flex: 1,
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.375rem',
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: '0 1.25rem',
                  cursor: 'pointer',
                  fontWeight: 600,
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
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
          Selecione uma conversa para iniciar o atendimento.
        </div>
      )}

      {/* Column 4: Customer Sidebar Info */}
      <div style={{ backgroundColor: '#ffffff', borderLeft: '1px solid #e2e8f0', padding: '1rem', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Perfil do Cliente
        </h3>

        {activeThread && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ textAlign: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                {activeThread.contactName.charAt(0)}
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{activeThread.contactName}</h4>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Cliente Verificado</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Telefone</span>
                <strong style={{ color: '#0f172a' }}>{activeThread.customerPhone || '+55 71 99123-4567'}</strong>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>E-mail</span>
                <strong style={{ color: '#0f172a' }}>{activeThread.customerEmail || 'contato@cliente.com.br'}</strong>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Grupo Especializado Atribuído</span>
                <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.15rem 0.5rem', borderRadius: '0.2rem', fontWeight: 700, fontSize: '0.75rem' }}>
                  {activeThread.assignedGroupTitle}
                </span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
                Etiquetas / Tags
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {activeThread.tags.map((t, idx) => (
                  <span key={idx} style={{ fontSize: '0.7rem', backgroundColor: '#f1f5f9', color: '#334155', padding: '0.15rem 0.4rem', borderRadius: '0.2rem', fontWeight: 600 }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Modal Transferir Atendimento para Grupo Especializado */}
      {isTransferModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', width: '420px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Transferir Atendimento para Grupo Especializado
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
              Selecione o departamento especializado que assumirá esta conversa.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {specializedGroups.map(grp => (
                <div
                  key={grp.id}
                  onClick={() => {
                    if (activeThread) {
                      transferThreadToGroup(activeThread.id, grp.id, grp.name);
                    }
                    setIsTransferModalOpen(false);
                  }}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: grp.color }} />
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>{grp.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{grp.description}</span>
                    </div>
                  </div>
                  <ArrowRight size={16} color="#94a3b8" />
                </div>
              ))}
            </div>

            <button onClick={() => setIsTransferModalOpen(false)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', background: 'none', cursor: 'pointer', fontSize: '0.82rem' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
