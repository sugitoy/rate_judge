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
      players: [...prev.players, { id: Date.now().toString() + Math.random(), name: '', affiliation: '', props: '' }]
    }));
  };

  const updatePlayer = (id: string, field: keyof Player, value: string) => {
    setLocalT(prev => ({
      ...prev,
      players: prev.players.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const removePlayer = (id: string) => {
    setLocalT(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== id)
    }));
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
              <th className="py-4 w-14 text-center uppercase tracking-tighter text-[10px]">{MESSAGES.CONFIG_PLAYER_TH_NO}</th>
              <th className="py-3 text-left font-bold uppercase tracking-wider text-[10px]">{MESSAGES.CONFIG_PLAYER_TH_NAME}</th>
              <th className="py-3 text-left font-bold uppercase tracking-wider text-[10px]">{MESSAGES.CONFIG_PLAYER_TH_AFFIL}</th>
              <th className="py-3 text-left font-bold uppercase tracking-wider text-[10px]">{MESSAGES.CONFIG_PLAYER_TH_PROP}</th>
              <th className="py-3 w-16 text-center uppercase tracking-wider text-[10px]">{MESSAGES.CONFIG_PLAYER_TH_ACTION}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {localT.players.map((p, i) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors group/row">
                <td className="text-center font-bold text-slate-400 py-2 border-r border-slate-50">{i + 1}</td>
                <td className="py-2 pr-4 pl-2">
                  <input 
                    type="text" 
                    className="form-input py-2 px-3 text-sm border-transparent group-hover/row:border-slate-200 focus:border-primary focus:bg-white bg-transparent w-full transition-all" 
                    value={p.name} 
                    onChange={e => updatePlayer(p.id, 'name', e.target.value)} 
                    placeholder={MESSAGES.CONFIG_PLAYER_TH_NAME}
                  />
                </td>
                <td className="py-2 pr-4">
                  <input 
                    type="text" 
                    className="form-input py-2 px-3 text-sm border-transparent group-hover/row:border-slate-200 focus:border-primary focus:bg-white bg-transparent w-full transition-all" 
                    value={p.affiliation || ''} 
                    onChange={e => updatePlayer(p.id, 'affiliation', e.target.value)} 
                    placeholder={MESSAGES.CONFIG_PLAYER_TH_AFFIL}
                  />
                </td>
                <td className="py-2 pr-4">
                  <input 
                    type="text" 
                    className="form-input py-2 px-3 text-sm border-transparent group-hover/row:border-slate-200 focus:border-primary focus:bg-white bg-transparent w-full transition-all" 
                    value={p.props || ''} 
                    onChange={e => updatePlayer(p.id, 'props', e.target.value)} 
                    placeholder={MESSAGES.CONFIG_PLAYER_TH_PROP}
                  />
                </td>
                <td className="text-center py-2">
                  <button 
                    onClick={() => removePlayer(p.id)} 
                    className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-danger hover:bg-danger-bg rounded-lg transition-all opacity-0 group-hover/row:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {localT.players.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 bg-slate-50/50">
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
