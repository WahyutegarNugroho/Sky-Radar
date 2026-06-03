import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMap } from '@/contexts/MapContext';
import { motion } from 'framer-motion';

function ThemeToggle() {
  const { theme, toggleTheme } = useMap();

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="icon"
      title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
      className="relative w-10 h-10 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 dark:bg-neutral-900 dark:border-neutral-800 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center overflow-hidden transition-colors duration-300 shadow-sm"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 0 : 180,
          scale: theme === 'dark' ? 0 : 1,
          opacity: theme === 'dark' ? 0 : 1
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute"
      >
        <Sun className="w-5 h-5 text-amber-500" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 0 : -180,
          scale: theme === 'dark' ? 1 : 0,
          opacity: theme === 'dark' ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute"
      >
        <Moon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
      </motion.div>
    </Button>
  );
}

export default ThemeToggle;
