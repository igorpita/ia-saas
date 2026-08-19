import React, { useState } from 'react';
import { 
  Globe, 
  FileText, 
  HelpCircle, 
  Plus, 
  Search, 
  MoreVertical, 
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { KnowledgeItem } from '../../types';

export const KnowledgeView: React.FC = () => {
  const { knowledgeItems, addKnowledgeItem, setIsTestDrawerOpen } = useApp();
  const [activeCategory, setActiveCategory] = useState<'faq' | 'documents' | 'webpages' | 'external'>('webpages');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');

  const filteredItems = knowledgeItems.filter(item => {
    const categoryMatch = item.category === activeCategory;
    const searchMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const handleAddItem = () => {
    if (!newTitle.trim()) return;
    const newItem: KnowledgeItem = {
      id: `kb-${Date.now()}`,
      title: newTitle,
      category: activeCategory,
      status: 'active',
      creator: 'Fabiano Caldas',
      updatedAt: 'Agora mesmo',
      detailInfo: newDetail || '1 fonte adicionada com sucesso'
    };
    addKnowledgeItem(newItem);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDetail('');
  };

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: '1400px', margin: '0 auto', minHeight: 'calc(100vh - 56px)' }}>
      
      {/* Header bar matching screenshot 4 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.2rem' }}>
            Bases de conhecimento &gt; <strong>MASTER</strong>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Gerenciamento de Fontes para RAG
          </h2>
        </div>

        {/* Sub-tabs pills matching screenshot 4 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#e2e8f0', padding: '0.25rem', borderRadius: '0.5rem' }}>
          <button
            onClick={() => setActiveCategory('faq')}
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: activeCategory === 'faq' ? 700 : 500,
              backgroundColor: activeCategory === 'faq' ? '#ffffff' : 'transparent',
              color: activeCategory === 'faq' ? '#0f172a' : '#64748b',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Perguntas Frequentes
          </button>
          <button
            onClick={() => setActiveCategory('documents')}
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: activeCategory === 'documents' ? 700 : 500,
              backgroundColor: activeCategory === 'documents' ? '#ffffff' : 'transparent',
              color: activeCategory === 'documents' ? '#0f172a' : '#64748b',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Documentos
          </button>
          <button
            onClick={() => setActiveCategory('webpages')}
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: activeCategory === 'webpages' ? 700 : 500,
              backgroundColor: activeCategory === 'webpages' ? '#ffffff' : 'transparent',
              color: activeCategory === 'webpages' ? '#0f172a' : '#64748b',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Páginas da Web
          </button>
          <button
            onClick={() => setActiveCategory('external')}
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: activeCategory === 'external' ? 700 : 500,
              backgroundColor: activeCategory === 'external' ? '#ffffff' : 'transparent',
              color: activeCategory === 'external' ? '#0f172a' : '#64748b',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Fontes externas (MCP)
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setIsTestDrawerOpen(true)}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#2563eb',
              borderRadius: '0.375rem',
              padding: '0.45rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ▶ Testar
          </button>
          <button
            onClick={() => alert('Base de Conhecimento publicada no ambiente!')}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.45rem 1rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Publicar
          </button>
        </div>
      </div>

      {/* Main Table Card Container matching Screenshot 4 */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        {/* Search & Add action row */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                activeCategory === 'webpages' ? 'Pesquisar páginas web...' :
                activeCategory === 'documents' ? 'Pesquisar documentos...' :
                activeCategory === 'faq' ? 'Pesquisar perguntas e respostas...' : 'Pesquisar fontes MCP...'
              }
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2.25rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.375rem',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#0f172a',
              borderRadius: '0.375rem',
              padding: '0.45rem 1rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Plus size={16} /> Adicionar
          </button>
        </div>

        {/* Table Content */}
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', fontWeight: 700 }}>
              <th style={{ padding: '0.75rem 1.25rem' }}>Título ↕</th>
              <th style={{ padding: '0.75rem 1.25rem' }}>Estado ↕</th>
              <th style={{ padding: '0.75rem 1.25rem' }}>Criador</th>
              <th style={{ padding: '0.75rem 1.25rem' }}>Atualizado ↕</th>
              <th style={{ padding: '0.75rem 1.25rem' }}>ativo</th>
              <th style={{ padding: '0.75rem 1.25rem', width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                  Nenhum item encontrado nesta categoria. Clique em <strong>+ Adicionar</strong> para cadastrar novas fontes de conhecimento.
                </td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '0.375rem', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                        {item.category === 'webpages' && <Globe size={18} />}
                        {item.category === 'documents' && <FileText size={18} />}
                        {item.category === 'faq' && <HelpCircle size={18} />}
                        {item.category === 'external' && <Sliders size={18} />}
                      </div>
                      <div>
                        <strong style={{ color: '#0f172a', display: 'block' }}>{item.title}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.detailInfo}</span>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.15rem 0.5rem', borderRadius: '0.2rem', fontSize: '0.75rem', fontWeight: 600 }}>
                      Ativo
                    </span>
                  </td>

                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        FC
                      </div>
                      <span>{item.creator}</span>
                    </div>
                  </td>

                  <td style={{ padding: '0.85rem 1.25rem', color: '#64748b' }}>
                    {item.updatedAt}
                  </td>

                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#0f172a' }}>
                    {item.urlsCount ? `${item.urlsCount} de ${item.urlsCount}` : 'OK'}
                  </td>

                  <td style={{ padding: '0.85rem 1.25rem', color: '#94a3b8', cursor: 'pointer' }}>
                    <MoreVertical size={16} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Adicionar Fonte de Conhecimento */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.75rem', width: '480px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>
              Adicionar Nova Fonte ({activeCategory.toUpperCase()})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  {activeCategory === 'webpages' ? 'URL do Website ou Domínio' : activeCategory === 'documents' ? 'Nome do Documento / Arquivo' : activeCategory === 'faq' ? 'Título do FAQ' : 'Nome do Servidor MCP / Conector'}
                </label>
                <input
                  type="text"
                  placeholder={activeCategory === 'webpages' ? 'https://exemplo.com.br' : 'Documento.pdf'}
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Detalhes / Conteúdo de Referência</label>
                <textarea
                  rows={4}
                  placeholder="Insira detalhes adicionais ou regras de rastreamento..."
                  value={newDetail}
                  onChange={e => setNewDetail(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button onClick={() => setIsAddModalOpen(false)} style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', background: 'none', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={handleAddItem} style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}>
                Salvar & Indexar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
