import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Banner } from './components/layout/Banner';
import { HomeView } from './components/home/HomeView';
import { AgentsView } from './components/agents/AgentsView';
import { KnowledgeView } from './components/knowledge/KnowledgeView';
import { CampaignsView } from './components/campaigns/CampaignsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ChatView } from './components/chat/ChatView';
import { DeployView } from './components/deploy/DeployView';
import { ContactsView } from './components/contacts/ContactsView';
import { SettingsView } from './components/settings/SettingsView';
import { SuperAdminView } from './components/admin/SuperAdminView';
import { LandingPage } from './components/landing/LandingPage';
import { TestDrawer } from './components/agents/TestDrawer';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  if (currentView === 'landing') {
    return <LandingPage />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Banner />
      <Header />
      <main style={{ flex: 1 }}>
        {currentView === 'home' && <HomeView />}
        {currentView === 'agents' && <AgentsView />}
        {currentView === 'knowledge' && <KnowledgeView />}
        {currentView === 'campaigns' && <CampaignsView />}
        {currentView === 'contacts' && <ContactsView />}
        {currentView === 'analytics' && <AnalyticsView />}
        {currentView === 'chats' && <ChatView />}
        {currentView === 'deploy' && <DeployView />}
        {currentView === 'settings' && <SettingsView />}
        {currentView === 'admin' && <SuperAdminView />}
      </main>
      <TestDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
