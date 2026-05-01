// src/components/features/configuration/PlayerList.tsx
import React from 'react';
import { Upload, Download, Plus, Trash2 } from 'lucide-react';
import type { TournamentConfig, Player } from '../../../types';
import { MESSAGES } from '../../../constants/messages';

interface PlayerListProps {
  localT: TournamentConfig;
  setLocalT: React.Dispatch<React.SetStateAction<TournamentConfig>>;
  handlePlayersCSV: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExportPlayers: () => void;
  downloadPlayerSample: () => void;
}

export const PlayerList: React.FC<PlayerListProps> = ({
  localT,
  setLocalT,
  handlePlayersCSV,
  handleExportPlayers,
  downloadPlayerSample
}) => {

  const addPlayer = () => {
    setLocalT(prev => ({
      ...prev,
      players: [...prev.players, { 
        id: crypto.randomUUID(), 
        entryNumber: prev.players.length + 1, 
        name: '', 
        affiliation: '', 
        props: '' 
      }]
    }));
  };

  const updatePlayer = (id: string, field: keyof Player, value: string | number | boolean) => {
    setLocalT(prev => ({
      ...prev,
      players: prev.players.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const removePlayer = (id: string) => {
    setLocalT(prev => {
      const remaining = prev.players.filter(p => p.id !== id);
      // エントリーNoを再振り直し
      const renumbered = remaining.map((p, idx) => ({ ...p, entryNumber: idx + 1 }));
      return {
        ...prev,
        players: renumbered
      };
    });
  };

  return (
    <div className="card shadow-md bg-white w-full animate-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 leading-none mb-1">{MESSAGES.CONFIG_PLAYER_TITLE}</h3>
          <p className="text-xs text-slate-400">登壇順と基本情報の管理</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={downloadPlayerSample} className="text-primary hover:text-primary-hover text-[10px] uppercase font-bold px-3 py-1.5 rounded bg-primary-light/50 transition-colors mr-2">
            {MESSAGES.CSV_SAMPLE_DL}
          </button>
          <label className="btn btn-outline btn-action cursor-pointer flex items-center gap-1.5 shadow-sm bg-white">
            <Download size={16} /> {MESSAGES.CSV_PLAYER_SAMPLE}
            <input type="file" accept=".csv" onChange={handlePlayersCSV} className="hidden" />
          </label>
          <button onClick={handleExportPlayers} className="btn btn-outline btn-action flex items-center gap-1.5 shadow-sm bg-white">
            <Upload size={16} /> {MESSAGES.CSV_PLAYER_EXPORT}
          </button>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-inner bg-slate-50/30">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th className="py-2 w-14 text-center uppercase tracking-tighter text-[10px]">{MESSAGES.CONFIG_PLAYER_TH_NO}</th>
              <th className="py-2 text-left font-bold uppercase tracking-wider text-[10px]">{MESSAGES.CONFIG_PLAYER_TH_NAME}</th>
              <th className="py-2 text-left font-bold uppercase tracking-wider text-[10px]">{MESSAGES.CONFIG_PLAYER_TH_AFFIL}</th>
              <th className="py-2 text-left font-bold uppercase tracking-wider text-[10px]">{MESSAGES.CONFIG_PLAYER_TH_PROP}</th>
              <th className="py-2 w-16 text-center uppercase tracking-wider text-[10px]">{MESSAGES.CONFIG_PLAYER_TH_DISQ}</th>
              <th className="py-2 w-12 text-center uppercase tracking-wider text-[10px]">{MESSAGES.CONFIG_PLAYER_TH_ACTION}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {localT.players.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors group/row">
                <td className="text-center font-bold text-slate-400 py-1 border-r border-slate-50">
                  <input
                    type="number"
                    className="w-10 text-center bg-transparent border-none focus:ring-0 font-bold text-slate-500"
                    value={p.entryNumber}
                    onChange={(e) => updatePlayer(p.id, 'entryNumber', Number(e.target.value))}
                    onFocus={(e) => e.target.select()}
                  />
                </td>
                <td className="py-1 pr-2 pl-2">
                  <input 
                    type="text" 
                    className="form-input py-1 px-3 text-sm border-transparent group-hover/row:border-slate-200 focus:border-primary focus:bg-white bg-transparent w-full transition-all" 
                    value={p.name} 
                    onChange={e => updatePlayer(p.id, 'name', e.target.value)} 
                    onFocus={(e) => e.target.select()}
                    placeholder={MESSAGES.CONFIG_PLAYER_TH_NAME}
                  />
                </td>
                <td className="py-1 pr-2">
                  <input 
                    type="text" 
                    className="form-input py-1 px-3 text-sm border-transparent group-hover/row:border-slate-200 focus:border-primary focus:bg-white bg-transparent w-full transition-all" 
                    value={p.affiliation || ''} 
                    onChange={e => updatePlayer(p.id, 'affiliation', e.target.value)} 
                    onFocus={(e) => e.target.select()}
                    placeholder={MESSAGES.CONFIG_PLAYER_TH_AFFIL}
                  />
                </td>
                <td className="py-1 pr-2">
                  <input 
                    type="text" 
                    className="form-input py-1 px-3 text-sm border-transparent group-hover/row:border-slate-200 focus:border-primary focus:bg-white bg-transparent w-full transition-all" 
                    value={p.props || ''} 
                    onChange={e => updatePlayer(p.id, 'props', e.target.value)} 
                    onFocus={(e) => e.target.select()}
                    placeholder={MESSAGES.CONFIG_PLAYER_TH_PROP}
                  />
                </td>
                <td className="text-center py-1">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-danger focus:ring-danger/20 transition-all cursor-pointer"
                    checked={p.isDisqualified || false}
                    onChange={(e) => updatePlayer(p.id, 'isDisqualified', e.target.checked)}
                    title={MESSAGES.CONFIG_PLAYER_TH_DISQ}
                  />
                </td>
                <td className="text-center py-1">
                  <button 
                    onClick={() => removePlayer(p.id)} 
                    className="w-8 h-8 flex items-center justify-center mx-auto text-slate-300 hover:text-danger hover:bg-danger-bg rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {localT.players.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 bg-slate-50/50">
                  <span className="text-slate-400 text-sm font-medium italic">{MESSAGES.CONFIG_PLAYER_EMPTY}</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6">
        <button 
          onClick={addPlayer} 
          className="btn bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary hover:border-primary w-full flex items-center justify-center gap-2 py-3 dashed-border transition-all"
          style={{ borderStyle: 'dashed' }}
        >
          <Plus size={18} /> {MESSAGES.CONFIG_PLAYER_ADD}
        </button>
      </div>
    </div>
  );
};
