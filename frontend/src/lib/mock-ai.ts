import { Message, Attachment } from '@/types/chat';

const responses = [
  "I've analyzed your request and here's what I found. The data suggests a clear pattern that we can leverage for better insights.",
  "That's an interesting question! Based on my analysis, there are several approaches we could take:\n\n1. **First approach**: Focus on optimization\n2. **Second approach**: Prioritize user experience\n3. **Third approach**: Balance both factors\n\nWould you like me to elaborate on any of these?",
  "Here's a code example that might help:\n\n```typescript\nconst processData = async (input: string) => {\n  const result = await analyze(input);\n  return result.map(item => item.value);\n};\n```\n\nLet me know if you need any modifications!",
  "I can see from your image that you're working with a complex dataset. The visualization shows some interesting trends that we should explore further.",
  "I've transcribed your audio input. Here's what I understood from your message, and I'll help you with that request right away.",
  "The document you uploaded contains valuable information. Let me summarize the key points for you and highlight the most relevant sections.",
];

const imageResponses = [
  "I can see the image you've shared! It appears to be a well-composed photograph. The lighting and composition create a nice visual balance. What would you like me to help you with regarding this image?",
  "Analyzing this image... I notice several interesting elements. The colors and patterns suggest this could be useful for your project. How can I assist you further?",
];

const documentResponses = [
  "I've reviewed the document you uploaded. It contains structured information that I can help you analyze. Would you like me to summarize it or extract specific data?",
  "The document appears to be a comprehensive report. I can help you understand the key findings or answer specific questions about its contents.",
];

const audioResponses = [
  "I've processed your audio recording. Based on what you said, I understand you're looking for assistance with your project. Let me help you with that.",
  "Thank you for the voice input! I've captured your request and I'm ready to assist you with the task you mentioned.",
];

export const generateMockResponse = async (
  userMessage: string,
  attachments?: Attachment[]
): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));
  
  if (attachments && attachments.length > 0) {
    const hasImage = attachments.some(a => a.type === 'image');
    const hasDocument = attachments.some(a => a.type === 'document');
    const hasAudio = attachments.some(a => a.type === 'audio');
    
    if (hasImage) {
      return imageResponses[Math.floor(Math.random() * imageResponses.length)];
    }
    if (hasDocument) {
      return documentResponses[Math.floor(Math.random() * documentResponses.length)];
    }
    if (hasAudio) {
      return audioResponses[Math.floor(Math.random() * audioResponses.length)];
    }
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export const generateSessionTitle = (firstMessage: string): string => {
  const words = firstMessage.split(' ').slice(0, 5);
  return words.join(' ') + (words.length >= 5 ? '...' : '');
};
