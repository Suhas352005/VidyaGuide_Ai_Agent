import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      whileTap={{ scale: 0.95 }}
      className="relative flex h-8 w-14 items-center rounded-full border border-slate-700/70 bg-slate-900/80 px-1 text-xs text-slate-200 shadow-sm shadow-slate-900/50 dark:bg-slate-800/80"
    >
      <motion.div
        layout
        className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-rose-400 text-[11px] font-semibold text-slate-950 dark:from-sky-400 dark:to-indigo-400 dark:text-slate-950"
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{ x: isDark ? 24 : 0 }}
      >
        {isDark ? '☾' : '☼'}
      </motion.div>
      <span className="ml-1 flex-1 text-[10px] text-slate-400">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </motion.button>
  );
};

export default ThemeToggle;

