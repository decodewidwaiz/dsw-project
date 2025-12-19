import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-4 py-6"
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-accent flex items-center justify-center">
        <Sparkles className="h-5 w-5 text-accent-foreground" />
      </div>
      
      <div className="flex items-center gap-1 px-4 py-3 bg-card rounded-2xl border border-border">
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 rounded-full bg-primary"
        />
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
          className="w-2 h-2 rounded-full bg-primary"
        />
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
          className="w-2 h-2 rounded-full bg-primary"
        />
      </div>
    </motion.div>
  );
};
