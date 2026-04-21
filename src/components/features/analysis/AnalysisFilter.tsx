// src/components/features/analysis/AnalysisFilter.tsx
import React from 'react';
import { MESSAGES } from '../../../constants/messages';

interface AnalysisFilterProps {
  playersInfo: any[];
  selectedPlayers: string[];
  togglePlayer: (pId: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
}

export const AnalysisFilter: React.FC<AnalysisFilterProps> = ({
  playersInfo,
  selectedPlayers,
  togglePlayer,
  selectAll,
  deselectAll
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full flex flex-col p-6 animate-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-700">{MESSAGES.ANALYSIS_GRAPH_FILTER}</h3>
        <div className="flex gap-1">
          <button onClick={selectAll} className="btn py-1 px-2 bg-primary-light text-primary border border-primary/20 text-[10px] uppercase font-bold hover:bg-primary hover:text-white transition-all">
            {MESSAGES.ANALYSIS_SELECT_ALL}
          </button>
          <button onClick={deselectAll} className="btn py-1 px-2 bg-slate-50 text-slate-500 border border-slate-200 text-[10px] uppercase font-bold hover:bg-slate-200 hover:text-slate-700 transition-all">
            {MESSAGES.ANALYSIS_DESELECT_ALL}
          </button>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 flex flex-col max-h-64 overflow-y-auto bg-white shadow-inner">
        {playersInfo.map((p, i) => {
          const isSelected = selectedPlayers.includes(p.id);
          return (
            <label
              key={p.id}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors text-sm border-b border-slate-50 last:border-b-0 hover:bg-slate-50 ${isSelected ? 'bg-primary-light/50 text-slate-900' : 'text-slate-600'
                }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => togglePlayer(p.id)}
                className="w-4 h-4 flex-none text-primary border-slate-300 rounded focus:ring-primary transition-all cursor-pointer"
              />
              <span className={`truncate text-xs ${isSelected ? 'font-bold text-primary' : ''}`}>
                {i + 1}. {p.name}
                <span className="text-slate-400 ml-1 font-normal">({p.rank}{MESSAGES.ANALYSIS_RANK_SUFFIX})</span>
              </span>
            </label>
          );
        })}
      </div>
      <p className="text-[10px] text-slate-400 mt-2 text-center italic">{MESSAGES.ANALYSIS_GRAPH_SYNC_NOTE}</p>
    </div>
  );
};
