import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-lg flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"
        >
          <Sparkles className="h-6 w-6 text-primary-foreground" />
        </motion.div>
        <div>
          <h1 className="text-lg font-semibold">Padh.Ai</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">Multimodal Intelligence</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-muted transition-colors"
          aria-label="Toggle theme"
        >
          <motion.div
            initial={false}
            animate={{ rotate: theme === 'dark' ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {theme === 'dark' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </motion.div>
        </button>
        
        <div className="flex flex-col sm:flex-row items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">built with</span>
            <span className="text-red-500">❤️</span>
            <span className="text-muted-foreground">by</span>
          </div>
          <div className="flex items-center gap-1">
            <a 
              href="https://waiz-alam.vercel.app/" 
              className="font-medium text-primary hover:underline"
            >
              Waiz Alam
            </a>
            <span className="text-muted-foreground">&</span>
            <a 
              href="https://www.instagram.com/_adbulnaved_?igsh=MTAwMzk3dnYxbnhzNg==" 
              className="font-medium text-primary hover:underline"
            >
              Abdul Naved
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
