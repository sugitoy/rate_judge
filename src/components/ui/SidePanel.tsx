import React, { ReactNode } from 'react';
import { ChevronRight, ChevronLeft, Layout } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../utils/cn';

interface SidePanelProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export const SidePanel = ({ children, title, className }: SidePanelProps) => {
  const { isSidePanelOpen, toggleSidePanel } = useUIStore();

  return (
    <aside
      className={cn(
        "transition-all duration-300 ease-in-out shrink-0 w-full",
        isSidePanelOpen ? "lg:w-80" : "lg:w-16",
        className
      )}
    >
      <div className={cn(
        "lg:sticky lg:top-24 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all duration-300",
        !isSidePanelOpen && "items-center"
      )}>
        {/* ヘッダー/トグルボタン */}
        <div className={cn(
          "flex items-center p-4 w-full",
          isSidePanelOpen ? "justify-between border-b border-slate-100" : "justify-center"
        )}>
          {isSidePanelOpen && (
            <h3 className="font-bold text-slate-800 flex items-center gap-2 truncate">
              {title || 'メニュー'}
            </h3>
          )}
          <button
            onClick={toggleSidePanel}
            className={cn(
              "p-2 hover:bg-primary-light text-slate-400 hover:text-primary rounded-xl transition-all duration-200",
              !isSidePanelOpen && "text-slate-300"
            )}
            title={isSidePanelOpen ? "メニューを閉じる" : "メニューを開く"}
          >
            {isSidePanelOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} className="rotate-180 lg:rotate-0" />}
          </button>
        </div>

        {/* コンテンツエリア */}
        <div className={cn(
          "transition-all duration-300 overflow-hidden",
          isSidePanelOpen 
            ? "opacity-100 h-auto p-6" 
            : "opacity-0 h-0 p-0 lg:h-auto lg:p-0 invisible"
        )}>
          {children}
        </div>

        {/* 最小化時のアイコン表示（デスクトップのみ） */}
        {!isSidePanelOpen && (
          <div className="hidden lg:flex flex-col items-center py-8 gap-6 text-slate-200">
             <Layout size={24} className="opacity-50" />
             <div className="w-1 h-24 bg-slate-50 rounded-full" />
          </div>
        )}
      </div>
    </aside>
  );
};
