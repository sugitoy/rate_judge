// src/components/features/configuration/ConfigurationTab.tsx
import React, { useState, useEffect } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { MESSAGES } from '../../../constants/messages';
import type { TournamentConfig } from '../../../types';
import { useTournamentStore } from '../../../store/useTournamentStore';
import { useScoringStore } from '../../../store/useScoringStore';
import { parseConfigCSV, parsePlayersCSV } from '../../../utils/csvImport';
import { exportConfigToCSV, exportPlayersToCSV } from '../../../utils/csvExport';
import { BasicConfig } from './BasicConfig';
import { PlayerList } from './PlayerList';
import { SidePanel } from '../../ui/SidePanel';

const createEmptyTournament = (): TournamentConfig => ({
  id: Date.now().toString(),
  name: '',
  division: '',
  inputUnit: 1,
  criteria: [],
  players: []
});

export const ConfigurationTab = ({ 
  triggerCreateNew,
  onTriggerConsumed
}: { 
  triggerCreateNew?: number,
  onTriggerConsumed?: () => void
}) => {
  const { tournaments, activeTournamentId, addTournament, updateTournament, deleteTournament, setActiveTournament } = useTournamentStore();
  const { deleteTournamentScores } = useScoringStore();
  
  const activeT = activeTournamentId ? tournaments[activeTournamentId] : null;

  const [localT, setLocalT] = useState<TournamentConfig>(activeT || createEmptyTournament());
  // activeTournamentIdが有効な大会を指している場合は編集モード、それ以外は新規作成モードで初期化する
  const [isCreatingNew, setIsCreatingNew] = useState(
    !activeTournamentId || !tournaments[activeTournamentId]
  );

  // Sync state when activeT changes (from header dropdown)
  useEffect(() => {
    if (activeT) {
      // 既存の大会が選択された場合は、編集モードに切り替えてデータを同期する
      setLocalT(activeT);
      setIsCreatingNew(false);
    } else {
      // 大会が未選択の場合は、新規作成モードにする
      setLocalT(createEmptyTournament());
      setIsCreatingNew(true);
    }
  }, [activeT]);

  // ヘッダーからの新規作成トリガー
  useEffect(() => {
    if (triggerCreateNew && triggerCreateNew > 0) {
      setIsCreatingNew(true);
      setActiveTournament('');
      setLocalT(createEmptyTournament());
      // トリガーを消費したことを親に通知
      onTriggerConsumed?.();
    }
  }, [triggerCreateNew, setActiveTournament, onTriggerConsumed]);

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
    const data = "大会名,部門,入力単位,審査項目:技術,審査項目:構成\nJJF2026,男子個人,0.5,40,60";
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "大会設定_sample.csv";
    link.click();
  };

  const downloadPlayerSample = () => {
    const data = "氏名,所属,使用道具\n山田太郎,ジャグリングサークルA,ボール\n佐藤花子,,ディアボロ";
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "選手リスト_sample.csv";
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

  const handleExportConfig = () => {
    if (!localT.name) {
      alert(MESSAGES.CONFIG_NO_NAME_ALERT);
      return;
    }
    exportConfigToCSV(localT);
  };

  const handleExportPlayers = () => {
    if (!localT.name) {
      alert(MESSAGES.CONFIG_NO_NAME_ALERT);
      return;
    }
    exportPlayersToCSV(localT.name, localT.players);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in tabular-nums pb-12">
      {/* メインコンテンツ領域 (A, B) */}
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        {!activeT && !isCreatingNew && (
          <div className="bg-primary-light text-primary border border-primary/20 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <span className="font-medium">{MESSAGES.CONFIG_EMPTY_LIST}</span>
          </div>
        )}
        
        {isCreatingNew && (
          <div className="bg-warning-bg text-warning border border-warning/20 p-4 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2">
            <span className="bg-warning text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0">!</span>
            {MESSAGES.CONFIG_EDITING_NEW}
          </div>
        )}

        {/* A) 大会基本情報・審査項目 */}
        <BasicConfig 
          localT={localT} 
          setLocalT={setLocalT} 
          handleConfigCSV={handleConfigCSV} 
          handleExportConfig={handleExportConfig}
          downloadConfigSample={downloadConfigSample} 
        />

        {/* B) 選手管理 */}
        <PlayerList 
          localT={localT} 
          setLocalT={setLocalT} 
          handlePlayersCSV={handlePlayersCSV} 
          handleExportPlayers={handleExportPlayers}
          downloadPlayerSample={downloadPlayerSample} 
        />
      </div>

      {/* C) サイドコンテンツ（操作・アクション） */}
      <SidePanel title="アクション">
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleSaveInfo} 
            className="btn btn-primary w-full py-3 text-base shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
          >
            <Save size={20} /> {MESSAGES.CONFIG_SAVE_BTN}
          </button>
          
          {isCreatingNew && Object.keys(tournaments).length > 0 && (
            <button 
              className="btn bg-danger-bg font-bold text-danger border border-danger/10 hover:bg-danger hover:text-white w-full py-3 flex items-center justify-center gap-2 transition-all" 
              onClick={() => {
                const keys = Object.keys(tournaments);
                if (keys.length > 0) {
                  setIsCreatingNew(false);
                  setActiveTournament(keys[0]);
                  setLocalT(tournaments[keys[0]]);
                }
              }}
            >
              {MESSAGES.CANCEL}
            </button>
          )}

          {!isCreatingNew && activeT && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button 
                onClick={handleDeleteTournament} 
                className="btn bg-danger-bg font-bold text-danger border border-danger/10 hover:bg-danger hover:text-white w-full py-3 flex items-center justify-center gap-2 transition-all"
              >
                <Trash2 size={18} /> {MESSAGES.CONFIG_DELETE_BTN}
              </button>
              <p className="text-[10px] text-slate-400 text-center px-2">
                ※大会を削除すると、関連する全選手の採点データも完全に消去されます。
              </p>
            </div>
          )}
        </div>
      </SidePanel>
    </div>
  );
};
