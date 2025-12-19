import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MessageSquare,
  Settings,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ChatSession } from '@/types/chat';
import { cn } from '@/lib/utils';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onOpenSettings: () => void;
}

export const Sidebar = ({
  sessions,
  currentSessionId,
  isOpen,
  onToggle,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onOpenSettings,
}: SidebarProps) => {
  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden"
          >
            <div className="p-4">
              <button
                onClick={onNewChat}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-medium"
              >
                <Plus className="h-5 w-5" />
                New Chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2">
              <div className="space-y-1">
                {sessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8 px-4">
                    No conversations yet. Start a new chat!
                  </p>
                ) : (
                  sessions.map((session) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group relative"
                    >
                      <button
                        onClick={() => onSelectSession(session.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                          currentSessionId === session.id
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'hover:bg-muted/50 text-sidebar-foreground'
                        )}
                      >
                        <MessageSquare className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm truncate flex-1">{session.title}</span>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 border-t border-sidebar-border">
              <button
                onClick={onOpenSettings}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors text-sidebar-foreground"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm">Settings</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <button
        onClick={onToggle}
        className={cn(
          'absolute top-4 z-20 p-2 rounded-lg bg-card border border-border hover:bg-muted transition-all',
          isOpen ? 'left-[268px]' : 'left-4'
        )}
      >
        {isOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
    </>
  );
};
