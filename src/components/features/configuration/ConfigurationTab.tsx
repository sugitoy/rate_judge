import React, { useState, useEffect } from 'react';
import { Save, Trash2, Plus } from 'lucide-react';
import { MESSAGES } from '../../../constants/messages';
import type { TournamentConfig } from '../../../types';
import { useTournamentStore } from '../../../store/useTournamentStore';
import { useScoringStore } from '../../../store/useScoringStore';
import { parseConfigCSV, parsePlayersCSV } from '../../../utils/csvImport';
import { exportConfigToCSV, exportPlayersToCSV } from '../../../utils/csvExport';
import { BasicConfig } from './BasicConfig';
import { PlayerList } from './PlayerList';
import { SidePanel } from '../../ui/SidePanel';
import { Select } from '../../ui/Select';
import { useUIStore } from '../../../store/useUIStore';

const EMPTY_T_TEMPLATE = {
  name: '',
  division: '',
  inputUnit: 0.1,
  hasDeduction: false,
  criteria: [],
  players: []
};

const isTournamentEqual = (a: any, b: any) => {
  const { id: idA, ...restA } = a;
  const { id: idB, ...restB } = b;
  return JSON.stringify(restA) === JSON.stringify(restB);
};

const createEmptyTournament = (): TournamentConfig => ({
  id: Date.now().toString(),
  name: '',
  division: '',
  inputUnit: 0.1,
  hasDeduction: false,
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
  const { tournaments, activeTournamentId, addTournament, updateTournament, deleteTournament, setActiveTournament, clearTournaments } = useTournamentStore();
  const { deleteTournamentScores, clearAllScores } = useScoringStore();
  const { isConfigDirty, setIsConfigDirty } = useUIStore();

  const activeT = activeTournamentId ? tournaments[activeTournamentId] : null;
  const tournamentList = Object.values(tournaments);

  const [localT, setLocalT] = useState<TournamentConfig>(activeT || createEmptyTournament());
  const [isCreatingNew, setIsCreatingNew] = useState(
    !activeTournamentId || !tournaments[activeTournamentId]
  );

  // Sync state when activeT changes
  useEffect(() => {
    if (activeT) {
      setLocalT(activeT);
      setIsCreatingNew(false);
    } else {
      setLocalT(createEmptyTournament());
      setIsCreatingNew(true);
    }
  }, [activeT]);

  // 変更検知
  useEffect(() => {
    const baseT = activeT || { id: localT.id, ...EMPTY_T_TEMPLATE };
    const dirty = !isTournamentEqual(localT, baseT);
    setIsConfigDirty(dirty);
  }, [localT, activeT, setIsConfigDirty]);

  // ヘッダーからの新規作成トリガー
  useEffect(() => {
    if (triggerCreateNew && triggerCreateNew > 0) {
      handleAddNew();
      onTriggerConsumed?.();
    }
  }, [triggerCreateNew]);

  const handleAddNew = () => {
    if (isConfigDirty && !window.confirm(MESSAGES.CONFIG_UNSAVED_CONFIRM)) return;
    setIsCreatingNew(true);
    setActiveTournament('');
    setLocalT(createEmptyTournament());
  };

  const handleSaveInfo = () => {
    // 1. 大会名バリデーション
    const name = localT.name.trim();
    if (!name) {
      alert(MESSAGES.CONFIG_NO_NAME_ALERT);
      return;
    }
    if (name.length > 100) {
      alert(MESSAGES.CONFIG_ERR_NAME_LENGTH);
      return;
    }

    // 2. 部門名バリデーション
    if (localT.division.length > 50) {
      alert(MESSAGES.CONFIG_ERR_DIV_LENGTH);
      return;
    }

    // 3. 審査項目バリデーション
    const criteriaNames = new Set<string>();
    for (const c of localT.criteria) {
      const cName = c.name.trim();
      if (!cName) {
        alert(MESSAGES.CONFIG_ERR_CRITERIA_NAME_EMPTY);
        return;
      }
      if (cName.length > 50) {
        alert(MESSAGES.CONFIG_ERR_CRITERIA_NAME_LENGTH);
        return;
      }
      if (criteriaNames.has(cName)) {
        alert(`${MESSAGES.CONFIG_ERR_CRITERIA_NAME_DUP}: ${cName}`);
        return;
      }
      criteriaNames.add(cName);

      if (c.maxScore < 0.1 || c.maxScore > 1000) {
        alert(MESSAGES.CONFIG_ERR_CRITERIA_MAX_SCORE);
        return;
      }
    }

    // 4. 選手バリデーション
    for (const p of localT.players) {
      if (!p.name.trim()) {
        alert(MESSAGES.CONFIG_ERR_PLAYER_NAME_EMPTY);
        return;
      }
      if (p.name.length > 100) {
        alert(MESSAGES.CONFIG_ERR_PLAYER_NAME_LENGTH);
        return;
      }
      if ((p.affiliation || '').length > 100) {
        alert(MESSAGES.CONFIG_ERR_PLAYER_AFFIL_LENGTH);
        return;
      }
      if ((p.props || '').length > 100) {
        alert(MESSAGES.CONFIG_ERR_PLAYER_PROP_LENGTH);
        return;
      }
    }

    if (isCreatingNew) {
      addTournament({ ...localT, name });
      setIsCreatingNew(false);
    } else if (activeT) {
      updateTournament(activeT.id, { ...localT, name });
    }
    alert(MESSAGES.CONFIG_SAVED);
  };

  const handleDeleteTournament = () => {
    if (activeT && window.confirm(MESSAGES.CONFIG_DELETE_CONFIRM)) {
      deleteTournament(activeT.id);
      deleteTournamentScores(activeT.id);
    }
  };

  const handleGlobalClear = () => {
    if (window.confirm(MESSAGES.HEADER_CLEAR_CONFIRM)) {
      clearTournaments();
      clearAllScores();
      alert(MESSAGES.HEADER_CLEAR_SUCCESS);
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
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        {!activeT && !isCreatingNew && (
          <div className="bg-primary-light dark:bg-cyan-500/10 text-primary dark:text-cyan-400 border-primary/20 dark:border-cyan-500/30 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <span className="font-medium">{MESSAGES.CONFIG_EMPTY_LIST}</span>
          </div>
        )}

        {isCreatingNew && (
          <div className="bg-warning-bg dark:bg-warning-dark/20 text-warning dark:text-warning-light border border-warning/20 dark:border-warning-dark/40 p-4 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2">
            <span className="bg-warning dark:bg-warning-dark text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0">!</span>
            {MESSAGES.CONFIG_EDITING_NEW}
          </div>
        )}

        <BasicConfig
          localT={localT}
          setLocalT={setLocalT}
          handleConfigCSV={handleConfigCSV}
          handleExportConfig={handleExportConfig}
          downloadConfigSample={downloadConfigSample}
        />

        <PlayerList
          localT={localT}
          setLocalT={setLocalT}
          handlePlayersCSV={handlePlayersCSV}
          handleExportPlayers={handleExportPlayers}
          downloadPlayerSample={downloadPlayerSample}
        />
      </div>

      <SidePanel>
        <div className="flex flex-col h-full gap-8">
          {/* A) 大会選択・追加 */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">
              {MESSAGES.HEADER_TOURNAMENT_SELECT}
            </label>
            <div className="flex flex-col gap-2">
              <Select
                value={activeTournamentId || ''}
                onChange={(val) => {
                  if (isConfigDirty && !window.confirm(MESSAGES.CONFIG_UNSAVED_CONFIRM)) return;
                  setActiveTournament(val);
                }}
                options={tournamentList.map(t => ({ value: t.id, label: `${t.name} (${t.division})` }))}
                placeholder={MESSAGES.COMMON_UNSELECTED}
              />
              <button
                onClick={handleAddNew}
                className="btn border border-primary/20 dark:border-cyan-500/30 text-primary dark:text-cyan-400 hover:bg-primary-light dark:hover:bg-cyan-500/10 flex items-center justify-center gap-2 py-2 text-sm"
              >
                <Plus size={16} /> {MESSAGES.CONFIG_ADD_TOURNAMENT}
              </button>
            </div>
          </div>

          {/* B) 操作アクション */}
          <div className="flex flex-col gap-4">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">
              {MESSAGES.CONFIG_ACTION_LABEL}
            </label>
            <button
              onClick={handleSaveInfo}
              className="btn btn-primary w-full py-3 text-base shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
            >
              <Save size={20} /> {MESSAGES.CONFIG_SAVE_BTN}
            </button>

            {isCreatingNew && tournamentList.length > 0 && (
              <button
                className="btn bg-danger-bg dark:bg-danger-dark/20 font-bold text-danger dark:text-danger-light border border-danger/10 dark:border-danger-dark/30 hover:bg-danger hover:text-white dark:hover:bg-danger-dark dark:hover:text-white w-full py-3 flex items-center justify-center gap-2 transition-all"
                onClick={() => {
                  if (tournamentList.length > 0) {
                    setIsCreatingNew(false);
                    const firstId = tournamentList[0].id;
                    setActiveTournament(firstId);
                    setLocalT(tournaments[firstId]);
                  }
                }}
              >
                {MESSAGES.CANCEL}
              </button>
            )}

            {!isCreatingNew && activeT && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleDeleteTournament}
                  className="btn bg-danger-bg dark:bg-danger-dark/20 font-bold text-danger dark:text-danger-light border border-danger/10 dark:border-danger-dark/30 hover:bg-danger dark:hover:bg-danger-dark hover:text-white dark:hover:text-white w-full py-3 flex items-center justify-center gap-2 transition-all"
                >
                  <Trash2 size={18} /> {MESSAGES.CONFIG_DELETE_BTN}
                </button>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center px-2">
                  {MESSAGES.CONFIG_DELETE_NOTE}
                </p>
              </div>
            )}
          </div>

          {/* C) 初期化（最下部へ配置） */}
          <div className="mt-auto pt-12">
            <button
              onClick={handleGlobalClear}
              className="w-full py-2 px-4 text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-danger dark:hover:text-danger-light hover:bg-danger-bg dark:hover:bg-danger-dark/20 rounded-lg border border-transparent hover:border-danger/10 dark:hover:border-danger-dark/30 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={14} /> {MESSAGES.HEADER_CLEAR_DATA}
            </button>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 text-center mt-2 px-4 leading-relaxed opacity-60">
              {MESSAGES.CONFIG_CLEAR_ALL_NOTE}
            </p>
          </div>
        </div>
      </SidePanel>
    </div>
  );
};
