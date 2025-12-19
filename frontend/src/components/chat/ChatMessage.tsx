import { motion } from 'framer-motion';
import { Copy, Check, User, Sparkles, FileText, Image, Mic } from 'lucide-react';
import { useState } from 'react';
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = (content: string) => {
    // Split content by double newlines to separate paragraphs
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Check if this paragraph is a summary section
      if (paragraph.startsWith('**Summary of')) {
        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden border border-border bg-muted/50">
            <div className="bg-primary/10 px-4 py-2 text-sm font-medium">
              {paragraph.split('\n')[0]}
            </div>
            <div className="p-4">
              {renderParagraph(paragraph.substring(paragraph.indexOf('\n') + 1))}
            </div>
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <div key={index} className="mb-3 last:mb-0">
          {renderParagraph(paragraph)}
        </div>
      );
    });
  };

  const renderParagraph = (text: string) => {
    // Handle code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={lastIndex} className="whitespace-pre-wrap">
            {renderInlineFormatting(text.slice(lastIndex, match.index))}
          </span>
        );
      }

      const language = match[1] || 'code';
      const code = match[2];

      parts.push(
        <div key={match.index} className="my-3 rounded-lg overflow-hidden border border-border">
          <div className="flex items-center justify-between bg-muted/50 px-4 py-2 text-sm">
            <span className="font-mono text-muted-foreground">{language}</span>
            <button
              onClick={() => copyToClipboard(code)}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <pre className="bg-card p-4 overflow-x-auto">
            <code className="font-mono text-sm">{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(
        <span key={lastIndex} className="whitespace-pre-wrap">
          {renderInlineFormatting(text.slice(lastIndex))}
        </span>
      );
    }

    return parts.length > 0 ? parts : <span className="whitespace-pre-wrap">{renderInlineFormatting(text)}</span>;
  };

  const renderInlineFormatting = (text: string) => {
    // Handle bold formatting
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(<strong key={match.index} className="font-semibold">{match[1]}</strong>);
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'audio': return <Mic className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'flex gap-4 py-6',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center',
          isUser ? 'bg-primary' : 'bg-accent'
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-primary-foreground" />
        ) : (
          <Sparkles className="h-5 w-5 text-accent-foreground" />
        )}
      </div>
      
      <div className={cn('flex-1 max-w-3xl', isUser && 'flex flex-col items-end')}>
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.attachments.map(attachment => (
              <div
                key={attachment.id}
                className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border"
              >
                {attachment.type === 'image' && attachment.preview ? (
                  <img
                    src={attachment.preview}
                    alt={attachment.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <>
                    {getAttachmentIcon(attachment.type)}
                    <span className="text-sm truncate max-w-32">{attachment.name}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border'
          )}
        >
          <div className={cn('text-sm leading-relaxed', isUser && 'text-primary-foreground')}>
            {renderContent(message.content)}
          </div>
        </div>
        
        <span className="text-xs text-muted-foreground mt-2">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
};