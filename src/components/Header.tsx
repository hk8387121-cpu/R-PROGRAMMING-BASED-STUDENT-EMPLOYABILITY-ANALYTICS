import { GraduationCap, Moon, Sun } from 'lucide-react';
import { useDataset } from '../context/DatasetContext';

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useDataset();

  return (
    <header className="h-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100 uppercase tracking-tight">R PROGRAMMING BASED STUDENT EMPLOYABILITY ANALYTICS</h1>
        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded text-[10px] border border-slate-200 dark:border-slate-700">Academic Session 2024-25</span>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleDarkMode}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
