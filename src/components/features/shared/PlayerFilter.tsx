// src/components/features/shared/PlayerFilter.tsx
import React from 'react';
import { MESSAGES } from '../../../constants/messages';

interface PlayerFilterProps {
  players: { id: string; name: string; rank?: number; entryNo?: number }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  showRank?: boolean;
}

export const PlayerFilter: React.FC<PlayerFilterProps> = ({
  players,
  selectedIds,
  onToggle,
  onSelectAll,
  onDeselectAll,
  showRank = true
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 w-full flex flex-col p-6 animate-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">{MESSAGES.PLAYER_FILTER_TITLE}</h3>
        <div className="flex gap-1">
          <button 
            onClick={onSelectAll} 
            className="btn py-1 px-2 bg-primary-light dark:bg-cyan-500/10 text-primary dark:text-cyan-400 border border-primary/20 dark:border-cyan-500/30 text-[10px] uppercase font-bold hover:bg-primary dark:hover:bg-cyan-500 hover:text-white dark:hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
          >
            {MESSAGES.ANALYSIS_SELECT_ALL}
          </button>
          <button 
            onClick={onDeselectAll} 
            className="btn py-1 px-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-[10px] uppercase font-bold hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
          >
            {MESSAGES.ANALYSIS_DESELECT_ALL}
          </button>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col max-h-64 overflow-y-auto bg-white dark:bg-slate-900 shadow-inner">
        {players.map((p, i) => {
          const isSelected = selectedIds.includes(p.id);
          const displayNo = p.entryNo !== undefined ? p.entryNo : i + 1;
          
          return (
            <label
              key={p.id}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors text-sm border-b border-slate-50 dark:border-slate-700/50 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800 ${
                isSelected ? 'bg-primary-light/50 dark:bg-cyan-500/10 text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(p.id)}
                className="w-4 h-4 flex-none rounded transition-all cursor-pointer"
              />
              <span className={`truncate text-xs ${isSelected ? 'font-bold' : ''}`}>
                {displayNo}. {p.name}
                {showRank && p.rank !== undefined && (
                  <span className="text-slate-400 dark:text-slate-400 ml-1 font-normal">({p.rank}{MESSAGES.ANALYSIS_RANK_SUFFIX})</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-2 text-center italic">{MESSAGES.PLAYER_FILTER_SYNC_NOTE}</p>
    </div>
  );
};
