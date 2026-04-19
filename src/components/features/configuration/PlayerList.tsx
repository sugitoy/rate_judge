// src/components/features/configuration/PlayerList.tsx
import React from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react';
import type { TournamentConfig, Player } from '../../../types';
import { MESSAGES } from '../../../constants/messages';

interface PlayerListProps {
  localT: TournamentConfig;
  setLocalT: React.Dispatch<React.SetStateAction<TournamentConfig>>;
  handlePlayersCSV: (e: React.ChangeEvent<HTMLInputElement>) => void;
  downloadPlayerSample: () => void;
}

export const PlayerList: React.FC<PlayerListProps> = ({
  localT,
  setLocalT,
  handlePlayersCSV,
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
    <div className="card shadow-sm bg-white" style={{ flex: 1, minWidth: 0 }}>
      <h3 className="text-xl font-bold mb-4 flex justify-between items-center border-b pb-4">
        <span className="flex-1">{MESSAGES.CONFIG_PLAYER_TITLE}</span>
        <div className="flex gap-2">
          <button onClick={downloadPlayerSample} className="btn text-blue-600 hover:underline text-sm p-0 gap-1 border-none bg-transparent">
            {MESSAGES.CSV_SAMPLE_DL}
          </button>
          <label className="btn btn-outline text-sm py-1 px-3 cursor-pointer mb-0 inline-flex items-center gap-1">
            <Upload size={14} /> {MESSAGES.CSV_PLAYER_SAMPLE}
            <input type="file" accept=".csv" onChange={handlePlayersCSV} style={{ display: 'none' }} />
          </label>
        </div>
      </h3>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-2 w-12">{MESSAGES.CONFIG_PLAYER_TH_NO}</th>
              <th className="py-2 text-left">{MESSAGES.CONFIG_PLAYER_TH_NAME}</th>
              <th className="py-2 text-left">{MESSAGES.CONFIG_PLAYER_TH_AFFIL}</th>
              <th className="py-2 text-left">{MESSAGES.CONFIG_PLAYER_TH_PROP}</th>
              <th className="py-2 w-16">{MESSAGES.CONFIG_PLAYER_TH_ACTION}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {localT.players.map((p, i) => (
              <tr key={p.id} className="hover:bg-gray-50/50 group">
                <td className="text-center font-medium text-gray-400 py-1">{i + 1}</td>
                <td className="py-1 pr-2">
                  <input type="text" className="form-input py-1 text-sm border-transparent hover:border-gray-300 focus:border-primary focus:bg-white bg-transparent" value={p.name} onChange={e => updatePlayer(p.id, 'name', e.target.value)} />
                </td>
                <td className="py-1 pr-2">
                  <input type="text" className="form-input py-1 text-sm border-transparent hover:border-gray-300 focus:border-primary focus:bg-white bg-transparent" value={p.affiliation || ''} onChange={e => updatePlayer(p.id, 'affiliation', e.target.value)} />
                </td>
                <td className="py-1 pr-2">
                  <input type="text" className="form-input py-1 text-sm border-transparent hover:border-gray-300 focus:border-primary focus:bg-white bg-transparent" value={p.props || ''} onChange={e => updatePlayer(p.id, 'props', e.target.value)} />
                </td>
                <td className="text-center py-1">
                  <button onClick={() => removePlayer(p.id)} className="btn text-danger hover:bg-danger-bg p-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {localT.players.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-400">
                  {MESSAGES.CONFIG_PLAYER_EMPTY}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-3 flex">
        <button onClick={addPlayer} className="btn btn-outline text-sm text-gray-600">
          <Plus size={16} /> {MESSAGES.CONFIG_PLAYER_ADD}
        </button>
      </div>
    </div>
  );
};
