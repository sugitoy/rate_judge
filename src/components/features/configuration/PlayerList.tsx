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
      return {
        ...prev,
        players: remaining
      };
    });
  };

  // エントリーNoの自動整合性確保
  React.useEffect(() => {
    const needsRenumbering = localT.players.some((p, idx) => p.entryNumber !== idx + 1);
    if (needsRenumbering) {
      setLocalT(prev => ({
        ...prev,
        players: prev.players.map((p, idx) => ({ ...p, entryNumber: idx + 1 }))
      }));
    }
  }, [localT.players.length, setLocalT]);

  return (
    <div className="card shadow-md bg-white dark:bg-slate-950 w-full animate-in dark:border-slate-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-none mb-1">{MESSAGES.CONFIG_PLAYER_TITLE}</h3>
          <p className="text-xs text-slate-400 dark:text-slate-400">{MESSAGES.CONFIG_PLAYER_DESC}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={downloadPlayerSample} className="text-primary dark:text-cyan-400 hover:text-primary-hover text-[10px] uppercase font-bold px-3 py-1.5 rounded bg-primary-light/50 dark:bg-cyan-500/10 transition-colors mr-2">
            {MESSAGES.CSV_SAMPLE_DL}
          </button>
          <label className="btn btn-outline btn-action cursor-pointer flex items-center gap-1.5 shadow-sm bg-white dark:bg-slate-800">
            <Download size={16} /> {MESSAGES.CSV_PLAYER_SAMPLE}
            <input type="file" accept=".csv" onChange={handlePlayersCSV} className="hidden" />
          </label>
          <button onClick={handleExportPlayers} className="btn btn-outline btn-action flex items-center gap-1.5 shadow-sm bg-white dark:bg-slate-800">
            <Upload size={16} /> {MESSAGES.CSV_PLAYER_EXPORT}
          </button>
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto shadow-inner bg-slate-50/30 dark:bg-slate-950/50">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2 w-14 text-center uppercase tracking-tighter text-[10px]">{MESSAGES.CONFIG_PLAYER_TH_NO}</th>
              <th className="py-2 text-left font-bold uppercase tracking-wider text-[10px]">{MESSAGES.CONFIG_PLAYER_TH_NAME}</th>
              <th className="py-2 text-left font-bold uppercase tracking-wider text-[10px]">{MESSAGES.CONFIG_PLAYER_TH_AFFIL}</th>
              <th className="py-2 text-left font-bold uppercase tracking-wider text-[10px]">{MESSAGES.CONFIG_PLAYER_TH_PROP}</th>
              <th className="py-2 w-16 text-center uppercase tracking-wider text-[10px]">{MESSAGES.CONFIG_PLAYER_TH_DISQ}</th>
              <th className="py-2 w-12 text-center uppercase tracking-wider text-[10px]">{MESSAGES.CONFIG_PLAYER_TH_ACTION}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-950">
            {localT.players.map((p, index) => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group/row">
                <td className="text-center font-bold text-slate-400 dark:text-slate-400 py-1 border-r border-slate-50 dark:border-slate-800/50">
                  <span className="inline-block w-12 text-center font-bold text-slate-400 dark:text-slate-400 tabular-nums">
                    {p.entryNumber || index + 1}
                  </span>
                </td>
                <td className="py-1 pr-2 pl-2">
                  <div className="flex flex-col gap-0.5">
                    <input
                      type="text"
                      className={`form-input py-1 px-3 text-sm border-transparent group-hover/row:border-slate-200 dark:group-hover/row:border-cyan-500/20 focus:border-primary dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-900 bg-transparent w-full transition-all ${p.name.length > 100 || (p.name.trim() === '' && p.name !== '') ? 'border-danger text-danger dark:text-danger-light bg-danger-bg/5 dark:bg-danger-dark/10' : 'dark:text-slate-100'
                        }`}
                      value={p.name}
                      onChange={e => updatePlayer(p.id, 'name', e.target.value)}
                      onBlur={e => updatePlayer(p.id, 'name', e.target.value.trim())}
                      onFocus={(e) => e.target.select()}
                      placeholder={MESSAGES.CONFIG_PLAYER_TH_NAME}
                    />
                    {p.name.length > 100 && (
                      <p className="text-[8px] text-danger font-bold uppercase px-1">{MESSAGES.CONFIG_ERR_PLAYER_NAME_LENGTH}</p>
                    )}
                  </div>
                </td>
                <td className="py-1 pr-2">
                  <div className="flex flex-col gap-0.5">
                    <input
                      type="text"
                      className={`form-input py-1 px-3 text-sm border-transparent group-hover/row:border-slate-200 dark:group-hover/row:border-cyan-500/20 focus:border-primary dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-900 bg-transparent w-full transition-all ${(p.affiliation || '').length > 100 ? 'border-danger text-danger dark:text-danger-light bg-danger-bg/5 dark:bg-danger-dark/10' : 'dark:text-slate-300'
                        }`}
                      value={p.affiliation || ''}
                      onChange={e => updatePlayer(p.id, 'affiliation', e.target.value)}
                      onBlur={e => updatePlayer(p.id, 'affiliation', (e.target.value || '').trim())}
                      onFocus={(e) => e.target.select()}
                      placeholder={MESSAGES.CONFIG_PLAYER_TH_AFFIL}
                    />
                    {(p.affiliation || '').length > 100 && (
                      <p className="text-[8px] text-danger font-bold uppercase px-1">{MESSAGES.CONFIG_ERR_PLAYER_AFFIL_LENGTH}</p>
                    )}
                  </div>
                </td>
                <td className="py-1 pr-2">
                  <div className="flex flex-col gap-0.5">
                    <input
                      type="text"
                      className={`form-input py-1 px-3 text-sm border-transparent group-hover/row:border-slate-200 dark:group-hover/row:border-cyan-500/20 focus:border-primary dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-900 bg-transparent w-full transition-all ${(p.props || '').length > 100 ? 'border-danger text-danger dark:text-danger-light bg-danger-bg/5 dark:bg-danger-dark/10' : 'dark:text-slate-400'
                        }`}
                      value={p.props || ''}
                      onChange={e => updatePlayer(p.id, 'props', e.target.value)}
                      onBlur={e => updatePlayer(p.id, 'props', (e.target.value || '').trim())}
                      onFocus={(e) => e.target.select()}
                      placeholder={MESSAGES.CONFIG_PLAYER_TH_PROP}
                    />
                    {(p.props || '').length > 100 && (
                      <p className="text-[8px] text-danger font-bold uppercase px-1">{MESSAGES.CONFIG_ERR_PLAYER_PROP_LENGTH}</p>
                    )}
                  </div>
                </td>
                <td className="text-center py-1">
                  <input
                    type="checkbox"
                    className="checkbox-danger w-4 h-4 rounded focus:ring-danger/20 transition-all cursor-pointer"
                    checked={p.isDisqualified || false}
                    onChange={(e) => updatePlayer(p.id, 'isDisqualified', e.target.checked)}
                    title={MESSAGES.CONFIG_PLAYER_TH_DISQ}
                  />
                </td>
                <td className="text-center py-1">
                  <button
                    onClick={() => removePlayer(p.id)}
                    className="w-8 h-8 flex items-center justify-center mx-auto text-slate-300 dark:text-slate-400 hover:text-danger dark:hover:text-danger-light hover:bg-danger-bg dark:hover:bg-danger/20 dark:hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {localT.players.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 bg-slate-50/50 dark:bg-slate-800/50">
                  <span className="text-slate-400 dark:text-slate-400 text-sm font-medium italic">{MESSAGES.CONFIG_PLAYER_EMPTY}</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <button
          onClick={addPlayer}
          className="btn bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-primary dark:hover:text-cyan-400 hover:border-primary dark:hover:border-cyan-400 w-full flex items-center justify-center gap-2 py-3 dashed-border transition-all dark:hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
          style={{ borderStyle: 'dashed' }}
        >
          <Plus size={18} /> {MESSAGES.CONFIG_PLAYER_ADD}
        </button>
      </div>
    </div>
  );
};
