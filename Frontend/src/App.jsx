import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import ChatPage from './pages/ChatPage';
import DocumentPage from './pages/DocumentPage';
import ProfilePage from './pages/ProfilePage';
import StudyGeneratorPage from './pages/StudyGeneratorPage';
import VivaSimulatorPage from './pages/VivaSimulatorPage';

function AppContent() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans relative select-none">
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Left Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Viewport Workspace */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto z-10 flex flex-col p-4 sm:p-6 lg:p-8 relative">
        <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col">
          {activeTab === 'chat' && <ChatPage />}
          {activeTab === 'viva' && <VivaSimulatorPage />}
          {activeTab === 'study' && <StudyGeneratorPage />}
          {activeTab === 'document' && <DocumentPage />}
          {activeTab === 'profile' && <ProfilePage />}
        </div>
      </main>

      {/* Toast Notification Banner */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
