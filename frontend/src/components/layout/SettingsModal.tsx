import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Eye, Volume2, Trash2 } from 'lucide-react';
import { ModelType } from '@/types/chat';
import { cn } from '@/lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  onClearHistory: () => void;
}

const models = [
  { id: 'gpt-4' as ModelType, name: 'GPT-4', description: 'Most capable language model', icon: Cpu },
  { id: 'vision' as ModelType, name: 'Vision Model', description: 'Optimized for image analysis', icon: Eye },
  { id: 'speech' as ModelType, name: 'Speech Model', description: 'Audio transcription & synthesis', icon: Volume2 },
];

export const SettingsModal = ({
  isOpen,
  onClose,
  selectedModel,
  onModelChange,
  onClearHistory,
}: SettingsModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-card rounded-2xl border border-border shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Settings</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <h3 className="text-sm font-medium mb-3">Model Selection</h3>
                <div className="space-y-2">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => onModelChange(model.id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left',
                        selectedModel === model.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground/30'
                      )}
                    >
                      <div className={cn(
                        'p-2 rounded-lg',
                        selectedModel === model.id ? 'bg-primary/10' : 'bg-muted'
                      )}>
                        <model.icon className={cn(
                          'h-5 w-5',
                          selectedModel === model.id ? 'text-primary' : 'text-muted-foreground'
                        )} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{model.name}</p>
                        <p className="text-xs text-muted-foreground">{model.description}</p>
                      </div>
                      {selectedModel === model.id && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Features</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-border">
                    <div className="flex items-center gap-3">
                      <Volume2 className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Enable voice responses</span>
                    </div>
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-3 rounded-xl border border-border">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Enable image analysis</span>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                    />
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Danger Zone</h3>
                <button
                  onClick={() => {
                    onClearHistory();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-destructive text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Clear all chat history</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
