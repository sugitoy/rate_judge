// src/components/features/configuration/ConfigurationTab.tsx
import React, { useState, useEffect } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { MESSAGES } from '../../../constants/messages';
import type { TournamentConfig } from '../../../types';
import { useTournamentStore } from '../../../store/useTournamentStore';
import { useScoringStore } from '../../../store/useScoringStore';
import { parseConfigCSV, parsePlayersCSV } from '../../../utils/csvImport';
import { BasicConfig } from './BasicConfig';
import { PlayerList } from './PlayerList';

const createEmptyTournament = (): TournamentConfig => ({
  id: Date.now().toString(),
  name: '',
  division: '',
  inputUnit: 1,
  criteria: [],
  players: []
});

export const ConfigurationTab = ({ triggerCreateNew }: { triggerCreateNew?: number }) => {
  const { tournaments, activeTournamentId, addTournament, updateTournament, deleteTournament, setActiveTournament } = useTournamentStore();
  const { deleteTournamentScores } = useScoringStore();
  
  const activeT = activeTournamentId ? tournaments[activeTournamentId] : null;

  const [localT, setLocalT] = useState<TournamentConfig>(activeT || createEmptyTournament());
  const [isCreatingNew, setIsCreatingNew] = useState(!activeT);

  // Sync state when activeT changes (from header dropdown)
  useEffect(() => {
    if (activeT && !isCreatingNew) {
      setLocalT(activeT);
    } else if (!activeT) {
      setLocalT(createEmptyTournament());
      setIsCreatingNew(true);
    }
  }, [activeT, isCreatingNew]);

  // ヘッダーからの新規作成トリガー
  useEffect(() => {
    if (triggerCreateNew && triggerCreateNew > 0) {
      setIsCreatingNew(true);
      setActiveTournament('');
      setLocalT(createEmptyTournament());
    }
  }, [triggerCreateNew, setActiveTournament]);

  const handleSaveInfo = () => {
    if (!localT.name.trim()) {
      alert(MESSAGES.CONFIG_NO_NAME_ALERT);
      return;
    }
    if (isCreatingNew) {
      addTournament(localT);
      setIsCreatingNew(false);
    } else if (activeT) {
      updateTournament(activeT.id, localT);
    }
    alert(MESSAGES.CONFIG_SAVED);
  };

  const handleDeleteTournament = () => {
    if (activeT && window.confirm(MESSAGES.CONFIG_DELETE_CONFIRM)) {
      deleteTournament(activeT.id);
      deleteTournamentScores(activeT.id); // 関連するスコアも削除
    }
  };

  const downloadConfigSample = () => {
    const data = "設定項目,値\n大会名,JJF2026\n部門,男子個人\n入力単位,0.5\n審査項目:技術,40\n審査項目:芸術,60";
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "config_sample.csv";
    link.click();
  };

  const downloadPlayerSample = () => {
    const data = "氏名,所属,使用道具\n山田太郎,ジャグリングサークルA,ボール\n佐藤花子,,ディアボロ";
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "players_sample.csv";
    link.click();
  };

  const handleConfigCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsedConfig = await parseConfigCSV(file);
      setLocalT(prev => ({ ...prev, ...parsedConfig }));
      e.target.value = '';
    } catch {
      alert(MESSAGES.CONFIG_CSV_ERR_CONFIG);
      e.target.value = '';
    }
  };

  const handlePlayersCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const players = await parsePlayersCSV(file);
      setLocalT(prev => ({ ...prev, players }));
      e.target.value = '';
    } catch {
      alert(MESSAGES.CONFIG_CSV_ERR_PLAYER);
      e.target.value = '';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', margin: '0 auto', paddingBottom: '5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
      {!activeT && !isCreatingNew && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md mb-2 flex items-center justify-between">
          <span>{MESSAGES.CONFIG_EMPTY_LIST}</span>
        </div>
      )}
      
      {isCreatingNew && (
        <div style={{ background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning)', color: '#92400e', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>
          {MESSAGES.CONFIG_EDITING_NEW}
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', alignItems: 'flex-start' }}>
        <BasicConfig 
          localT={localT} 
          setLocalT={setLocalT} 
          handleConfigCSV={handleConfigCSV} 
          downloadConfigSample={downloadConfigSample} 
        />
        <PlayerList 
          localT={localT} 
          setLocalT={setLocalT} 
          handlePlayersCSV={handlePlayersCSV} 
          downloadPlayerSample={downloadPlayerSample} 
        />
      </div>

      {/* Footer controls */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid var(--color-border)', padding: '1rem', boxShadow: 'var(--shadow-lg)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', zIndex: 40 }}>
        <button onClick={handleSaveInfo} className="btn btn-primary" style={{ padding: '0.625rem 3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Save size={18} /> {MESSAGES.CONFIG_SAVE_BTN}
        </button>
        
        {isCreatingNew && Object.keys(tournaments).length > 0 && (
          <button className="btn btn-outline" style={{ padding: '0.625rem 1.5rem' }} onClick={() => {
            const keys = Object.keys(tournaments);
            if (keys.length > 0) {
              setIsCreatingNew(false);
              setActiveTournament(keys[0]);
              setLocalT(tournaments[keys[0]]);
            }
          }}>{MESSAGES.CANCEL}</button>
        )}

        {!isCreatingNew && activeT && (
          <button onClick={handleDeleteTournament} className="btn btn-outline" style={{ color: 'var(--color-danger)', padding: '0.625rem 1rem', marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderColor: 'var(--color-border)' }}>
            <Trash2 size={16} /> {MESSAGES.CONFIG_DELETE_BTN}
          </button>
        )}
      </div>
    </div>
  );
};
