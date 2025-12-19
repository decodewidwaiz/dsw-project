export interface Attachment {
  id: string;
  type: 'image' | 'audio' | 'document';
  name: string;
  size: number;
  url?: string;
  preview?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
  timestamp: Date;
  metadata?: {
    engine?: string;
    error?: boolean;
    [key: string]: any;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export type ModelType = 'gpt-4' | 'vision' | 'speech';