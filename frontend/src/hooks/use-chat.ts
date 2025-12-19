import { useState, useCallback } from 'react';
import { Message, ChatSession, Attachment, ModelType } from '@/types/chat';

const generateId = () => Math.random().toString(36).substring(2, 15);

// Backend API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const useChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>('gpt-4');

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  }, []);

  const sendMessage = useCallback(async (content: string, attachments?: Attachment[]) => {
    let sessionId = currentSessionId;
    
    if (!sessionId) {
      sessionId = createNewSession();
    }

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      attachments,
      timestamp: new Date(),
    };

    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        const isFirstMessage = session.messages.length === 0;
        return {
          ...session,
          title: isFirstMessage ? content.substring(0, 30) + (content.length > 30 ? '...' : '') : session.title,
          messages: [...session.messages, userMessage],
          updatedAt: new Date(),
        };
      }
      return session;
    }));

    setIsLoading(true);

    try {
      // Call the backend /ask endpoint
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        metadata: {
          engine: data.engine,
        },
      };

      setSessions(prev => prev.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: [...session.messages, assistantMessage],
            updatedAt: new Date(),
          };
        }
        return session;
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback to mock response in case of error
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        metadata: {
          error: true,
        },
      };

      setSessions(prev => prev.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: [...session.messages, errorMessage],
            updatedAt: new Date(),
          };
        }
        return session;
      }));
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, createNewSession]);

  const selectSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  }, [currentSessionId]);

  const clearAllSessions = useCallback(() => {
    setSessions([]);
    setCurrentSessionId(null);
  }, []);

  return {
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
  };
};