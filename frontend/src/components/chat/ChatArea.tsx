import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, Image, Mic, FileText } from 'lucide-react';
import { Message } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onExampleClick: (text: string) => void;
}

const examplePrompts = [
  { icon: MessageSquare, text: "Explain quantum computing in simple terms" },
  { icon: Image, text: "Analyze this image and describe what you see" },
  { icon: Mic, text: "Text to image" },
  { icon: FileText, text: "Extract key insights from this document" },
];

export const ChatArea = ({ messages, isLoading, onExampleClick }: ChatAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl w-full"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-semibold mb-3">Welcome to Padh.Ai</h1>
          <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
            Your intelligent multimodal assistant. Ask questions, analyze images, or extract insights from documents.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {examplePrompts.map((prompt, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => onExampleClick(prompt.text)}
                className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-card/80 transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <prompt.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <span className="text-xs md:text-sm">{prompt.text}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8">
      <div className="max-w-4xl mx-auto py-6">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </AnimatePresence>
        
        {isLoading && <TypingIndicator />}
      </div>
    </div>
  );
};
