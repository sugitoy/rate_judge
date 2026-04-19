// src/components/features/dashboard/DashboardFilter.tsx
import React from 'react';
import { MESSAGES } from '../../../constants/messages';

interface DashboardFilterProps {
  playersInfo: any[];
  selectedPlayers: string[];
  togglePlayer: (pId: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
}

export const DashboardFilter: React.FC<DashboardFilterProps> = ({
  playersInfo,
  selectedPlayers,
  togglePlayer,
  selectAll,
  deselectAll
}) => {
  return (
    <div className="card shadow-sm xl:w-72 flex flex-col xl:flex-none" style={{ padding: '1rem' }}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-700">{MESSAGES.DASHBOARD_GRAPH_FILTER}</h3>
        <div className="flex gap-1">
          <button onClick={selectAll} className="btn py-0.5 px-2 bg-blue-50 text-blue-600 border border-blue-200 text-xs">{MESSAGES.DASHBOARD_SELECT_ALL}</button>
          <button onClick={deselectAll} className="btn py-0.5 px-2 bg-gray-50 text-gray-600 border border-gray-200 text-xs">{MESSAGES.DASHBOARD_DESELECT_ALL}</button>
        </div>
      </div>
      <div className="rounded-md border border-gray-200 flex flex-col max-h-60 overflow-y-auto">
        {playersInfo.map((p, i) => {
          const isSelected = selectedPlayers.includes(p.id);
          return (
            <label
              key={p.id}
              className={`flex items-center gap-2 px-2.5 py-1.5 cursor-pointer transition-colors text-sm border-b border-gray-100 last:border-b-0 ${isSelected ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50 text-gray-700'
                }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => togglePlayer(p.id)}
                className="w-3.5 h-3.5 flex-none text-blue-600 rounded focus:ring-blue-500"
              />
              <span className={`truncate text-xs ${isSelected ? 'font-semibold' : ''}`}>
                {i + 1}. {p.name}
                <span className="text-gray-400 ml-1">({p.rank}{MESSAGES.DASHBOARD_RANK_SUFFIX})</span>
              </span>
            </label>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mt-1.5 text-center">{MESSAGES.DASHBOARD_GRAPH_SYNC_NOTE}</p>
    </div>
  );
};
