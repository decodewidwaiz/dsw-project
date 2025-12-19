import { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { SettingsModal } from '@/components/layout/SettingsModal';
import { ChatArea } from '@/components/chat/ChatArea';
import { InputPanel } from '@/components/chat/InputPanel';
import { useChat } from '@/hooks/use-chat';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | undefined>();

  const {
    sessions,
    currentSession,
    messages,
    isLoading,
    selectedModel,
    setSelectedModel,
    sendMessage,
    createNewSession,
    selectSession,
    deleteSession,
    clearAllSessions,
  } = useChat();

  const handleExampleClick = useCallback((text: string) => {
    setPendingMessage(text);
    setTimeout(() => setPendingMessage(undefined), 100);
  }, []);

  return (
    <div className="h-[100vh] flex flex-col bg-background overflow-hidden">
      <Header />
      
      <div className="flex-1 flex relative overflow-hidden">
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSession?.id || null}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onNewChat={createNewSession}
          onSelectSession={selectSession}
          onDeleteSession={deleteSession}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        
        <main className="flex-1 flex flex-col min-w-0 h-full">
          <ChatArea 
            messages={messages}
            isLoading={isLoading}
            onExampleClick={handleExampleClick}
          />
          
          <InputPanel 
            onSend={sendMessage}
            isLoading={isLoading}
            initialMessage={pendingMessage}
          />
        </main>
        
        <SettingsModal 
          open={settingsOpen} 
          onOpenChange={setSettingsOpen}
          model={selectedModel}
          onModelChange={setSelectedModel}
          onClearHistory={clearAllSessions}
        />
      </div>
    </div>
  );
};

export default Index;