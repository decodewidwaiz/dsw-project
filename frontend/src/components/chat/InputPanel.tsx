import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Image,
  Mic,
  FileText,
  X,
  Paperclip,
  Square,
} from 'lucide-react';
import { Attachment } from '@/types/chat';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface InputPanelProps {
  onSend: (content: string, attachments?: Attachment[]) => void;
  isLoading: boolean;
  initialMessage?: string;
}

// Extended Attachment interface to include the actual File object
interface ExtendedAttachment extends Attachment {
  file?: File;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const InputPanel = ({ onSend, isLoading, initialMessage }: InputPanelProps) => {
  const [message, setMessage] = useState(initialMessage || '');
  const [attachments, setAttachments] = useState<ExtendedAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = useCallback(async () => {
    if ((!message.trim() && attachments.length === 0) || isLoading || isProcessing) return;
    
    // Check if we have document attachments to send to backend
    const documentAttachments = attachments.filter(a => a.type === 'document');
    
    if (documentAttachments.length > 0) {
      setIsProcessing(true);
      try {
        // Process document attachments with backend
        let summaryContent = message || "Here's the summary of your document:";
        const summaries: string[] = [];
        
        for (const doc of documentAttachments) {
          if (doc.file) {
            const formData = new FormData();
            formData.append('file', doc.file);

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/summarize`, {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.error || `Failed to summarize document: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Extract the summary content from the nested structure
            let summary = 'No summary available';
            if (data.result && data.result.raw_output) {
              // Try to parse the raw_output as JSON
              try {
                // Remove the markdown code block markers
                const rawOutput = data.result.raw_output.replace(/```json\n?|\n?```/g, '');
                const parsed = JSON.parse(rawOutput);
              
                // Format the summary nicely
                let formattedSummary = '';
              
                // Add summary points
                if (parsed.summary && Array.isArray(parsed.summary)) {
                  formattedSummary += '**Summary:**\n';
                  parsed.summary.forEach((point: string, index: number) => {
                    formattedSummary += `${index + 1}. ${point}\n`;
                  });
                  formattedSummary += '\n';
                }
              
                // Add flashcards
                if (parsed.flashcards && Array.isArray(parsed.flashcards)) {
                  formattedSummary += '**Flashcards:**\n';
                  parsed.flashcards.forEach((card: any) => {
                    formattedSummary += `- **Q:** ${card.question}\n  **A:** ${card.answer}\n`;
                  });
                  formattedSummary += '\n';
                }
              
                // Add glossary
                if (parsed.glossary && Array.isArray(parsed.glossary)) {
                  formattedSummary += '**Glossary:**\n';
                  parsed.glossary.forEach((item: any) => {
                    formattedSummary += `- **${item.term}:** ${item.definition}\n`;
                  });
                  formattedSummary += '\n';
                }
              
                // Add concept map
                if (parsed.concept_map && Array.isArray(parsed.concept_map)) {
                  formattedSummary += '**Concept Map:**\n';
                  parsed.concept_map.forEach((map: any) => {
                    formattedSummary += `- ${map.parent}: ${map.children.join(', ')}\n`;
                  });
                }
              
                summary = formattedSummary || 'Summary generated successfully';
              } catch (parseError) {
                // If parsing fails, use the raw output
                summary = data.result.raw_output;
              }
            } else if (data.summary) {
              summary = data.summary;
            } else if (data.text) {
              summary = data.text;
            } else if (typeof data === 'string') {
              summary = data;
            } else {
              // If we got an object with content, try to display it meaningfully
              summary = JSON.stringify(data, null, 2);
            }
          
            summaries.push(`**Summary of ${doc.name}:\n${summary}`);
          }
        }
      
        // Combine all summaries
        summaryContent += "\n\n" + summaries.join("\n\n");
      
        // Send the message with the summary to the chat
        onSend(summaryContent.trim(), attachments);
      } catch (error: any) {
        console.error('Error summarizing document:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to summarize document. Please try again.",
          variant: "destructive",
        });
        // Still send the original message even if summarization failed
        onSend(message.trim() || "I tried to summarize your document but encountered an error.", attachments);
      } finally {
        setIsProcessing(false);
        setMessage('');
        setAttachments([]);
        return;
      }
    } else {
      onSend(message.trim(), attachments.length > 0 ? attachments : undefined);
      setMessage('');
      setAttachments([]);
    }
  }, [message, attachments, isLoading, isProcessing, onSend, toast]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (files: FileList | null, type: 'image' | 'document') => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const attachment: ExtendedAttachment = {
        id: generateId(),
        type,
        name: file.name,
        size: file.size,
        file, // Store the actual file object
      };

      if (type === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          attachment.preview = e.target?.result as string;
          setAttachments(prev => [...prev, attachment]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachments(prev => [...prev, attachment]);
      }
    });
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording - add mock audio attachment
      setIsRecording(false);
      setAttachments(prev => [...prev, {
        id: generateId(),
        type: 'audio',
        name: 'Recording.webm',
        size: 245000,
      }]);
    } else {
      setIsRecording(true);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    Array.from(files).forEach(file => {
      const isImage = file.type.startsWith('image/');
      const attachment: ExtendedAttachment = {
        id: generateId(),
        type: isImage ? 'image' : 'document',
        name: file.name,
        size: file.size,
        file, // Store the actual file object
      };

      if (isImage) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          attachment.preview = ev.target?.result as string;
          setAttachments(prev => [...prev, attachment]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachments(prev => [...prev, attachment]);
      }
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-lg p-4">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-3"
            >
              {attachments.map(attachment => (
                <motion.div
                  key={attachment.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  {attachment.type === 'image' && attachment.preview ? (
                    <div className="relative">
                      <img
                        src={attachment.preview}
                        alt={attachment.name}
                        className="w-20 h-20 object-cover rounded-lg border border-border"
                      />
                      <button
                        onClick={() => removeAttachment(attachment.id)}
                        className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border">
                      {attachment.type === 'audio' ? (
                        <Mic className="h-4 w-4 text-primary" />
                      ) : (
                        <FileText className="h-4 w-4 text-primary" />
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm truncate max-w-32">{attachment.name}</span>
                        <span className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</span>
                      </div>
                      <button
                        onClick={() => removeAttachment(attachment.id)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            'relative flex items-end gap-2 p-2 rounded-2xl border bg-card transition-all',
            isDragOver ? 'border-primary border-dashed bg-primary/5' : 'border-border',
            isRecording && 'border-destructive'
          )}
        >
          {isDragOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-2xl z-10">
              <p className="text-primary font-medium">Drop files here</p>
            </div>
          )}

          <div className="flex gap-1">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileSelect(e.target.files, 'image')}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              multiple
              onChange={(e) => handleFileSelect(e.target.files, 'document')}
              className="hidden"
            />
            
            <button
              onClick={() => imageInputRef.current?.click()}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="Upload image"
            >
              <Image className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="Upload document"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            
            <button
              onClick={toggleRecording}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isRecording
                  ? 'bg-destructive text-destructive-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
              title={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? 'Recording...' : 'Ask anything, upload an image, or speak…'}
            rows={1}
            className="flex-1 resize-none bg-transparent border-0 focus:outline-none focus:ring-0 py-2 px-2 max-h-40 text-sm placeholder:text-muted-foreground"
            style={{ minHeight: '40px' }}
            disabled={isRecording || isProcessing}
          />

          <button
            onClick={handleSubmit}
            disabled={(!message.trim() && attachments.length === 0) || isLoading || isProcessing}
            className={cn(
              'p-2 rounded-lg transition-all',
              (!message.trim() && attachments.length === 0) || isLoading || isProcessing
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:opacity-90'
            )}
          >
            {isLoading || isProcessing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-5 w-5"
              >
                <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
              </motion.div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};