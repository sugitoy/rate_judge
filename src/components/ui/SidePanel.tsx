import type { ReactNode } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../utils/cn';
import { MESSAGES } from '../../constants/messages';

import { VERSION } from '../../constants/ver';

interface SidePanelProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export const SidePanel = ({ children, className }: SidePanelProps) => {
  const { isSidePanelOpen, toggleSidePanel } = useUIStore();

  return (
    <aside
      className={cn(
        "fixed top-16 right-0 bottom-0 z-40 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-600 transition-all duration-300 ease-in-out flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] dark:shadow-[-10px_0_30px_rgba(0,0,0,0.5)]",
        isSidePanelOpen ? "w-[calc(100%-3rem)] lg:w-80" : "w-0 lg:w-16",
        className
      )}
    >
      {/* トグルボタン */}
      <button
        onClick={toggleSidePanel}
        className={cn(
          "absolute top-4 -left-10 w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 border-r-0 rounded-l-xl shadow-[-4px_0_10px_-2px_rgba(0,0,0,0.05)] dark:shadow-[-4px_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center text-primary dark:text-cyan-400 hover:text-primary-dark dark:hover:text-cyan-300 transition-all z-50",
          !isSidePanelOpen && "lg:static lg:w-full lg:h-16 lg:rounded-none lg:border-none lg:shadow-none"
        )}
        title={isSidePanelOpen ? MESSAGES.SIDE_PANEL_CLOSE : MESSAGES.SIDE_PANEL_OPEN}
      >
        {isSidePanelOpen ? <ChevronRight size={24} strokeWidth={2.5} /> : <ChevronLeft size={24} strokeWidth={2.5} className="rotate-180 lg:rotate-0" />}
      </button>

      {/* コンテンツエリア */}
      <div className={cn(
        "flex-1 overflow-y-auto transition-all duration-300",
        isSidePanelOpen ? "opacity-100 p-6 visible" : "opacity-0 p-0 invisible"
      )}>
        {isSidePanelOpen && children}
      </div>

      {/* バージョン情報 */}
      {isSidePanelOpen && (
        <div className="flex-none px-4 py-2 text-right bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800/50">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 opacity-50 select-none">
            {VERSION}
          </span>
        </div>
      )}
    </aside>
  );
};
