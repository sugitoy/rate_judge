// src/components/features/scoring/ScoringTab.tsx
import React, { useState } from 'react';
import { Download, Upload, Maximize2 } from 'lucide-react';
import { MESSAGES } from '../../../constants/messages';
import { useTournamentStore } from '../../../store/useTournamentStore';
import { useScoringStore } from '../../../store/useScoringStore';
import { useScoringData } from '../../../hooks/useScoringData';
import { exportScoringToCSV } from '../../../utils/csvExport';
import { parseScoresCSV } from '../../../utils/csvImport';
import { ScoreCell } from './ScoreCell';
import { DeductionCell } from './DeductionCell';
import { DetailModal } from './DetailModal';
import { ToggleSwitch } from '../../ui/ToggleSwitch';
import { SidePanel } from '../../ui/SidePanel';
import { useUIStore } from '../../../store/useUIStore';
import { PlayerFilter } from '../shared/PlayerFilter';
import { Select } from '../../ui/Select';
import { useEffect } from 'react';

export const ScoringTab = () => {
  const { tournaments, activeTournamentId } = useTournamentStore();
  const { tournamentScores, updateScore, updateTier, updateDeduction, updateComment, importScores } = useScoringStore();

  const [showRank, setShowRank] = useState(true); // 順位表示の切り替え
  const [commentModalData, setCommentModalData] = useState<{ playerId: string } | null>(null);

  const activeT = activeTournamentId ? tournaments[activeTournamentId] : null;
  const currentScores = activeTournamentId ? tournamentScores[activeTournamentId] || {} : {};

  const { tableData } = useScoringData(activeT, currentScores);
  const {
    selectedPlayerIds,
    togglePlayerSelection,
    setSelectedPlayerIds,
    initializedTournamentId,
    setInitializedTournamentId,
    displayMode,
    setDisplayMode,
    sortKey,
    setSortConfig,
    isEditing
  } = useUIStore();

  const [frozenOrder, setFrozenOrder] = useState<string[]>([]);

  // 入力中でないときのみソート順を更新する
  useEffect(() => {
    if (!isEditing && tableData.length > 0) {
      setFrozenOrder(tableData.map(d => d.player.id));
    }
  }, [tableData, isEditing]);

  // 表示用データの構築（順序はfrozenOrderに固定、中身は最新のtableData）
  const displayData = React.useMemo(() => {
    if (frozenOrder.length === 0) return tableData;
    
    const dataMap = new Map(tableData.map(d => [d.player.id, d]));
    return frozenOrder
      .map(id => dataMap.get(id))
      .filter((d): d is typeof tableData[0] => d !== undefined);
  }, [frozenOrder, tableData]);

  const hasDeduction = activeT?.hasDeduction ?? false;

  // 初期表示または大会切り替え時に全選手を選択状態にする
  useEffect(() => {
    if (!activeT || activeT.players.length === 0) return;

    // 大会が切り替わった場合のみ初期化（全選択）
    if (initializedTournamentId !== activeT.id) {
      setSelectedPlayerIds(activeT.players.map(p => p.id));
      setInitializedTournamentId(activeT.id);
    }
  }, [activeT, initializedTournamentId, setSelectedPlayerIds, setInitializedTournamentId]);

  if (!activeT || activeT.players.length === 0 || activeT.criteria.length === 0) {
    return (
      <div className="card text-center p-10 mt-6">
        <p className="text-gray-500 mb-4">{MESSAGES.NO_DATA}</p>
      </div>
    );
  }

  const handleExportCSV = () => {
    exportScoringToCSV(activeT.name, activeT.criteria, tableData, hasDeduction);
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const newScoresData = await parseScoresCSV(file, activeT);
      if (Object.keys(newScoresData).length > 0) {
        importScores(activeT.id, newScoresData);
        alert(MESSAGES.SCORING_IMPORT_SUCCESS);
      } else {
        alert(MESSAGES.SCORING_IMPORT_ERR);
      }
    } catch {
      alert(MESSAGES.SCORING_IMPORT_ERR);
    } finally {
      e.target.value = '';
    }
  };

  const sortedPlayersForNav = activeT.players.slice().sort((a, b) => a.entryNumber - b.entryNumber);

  const handlePrevPlayer = (currentComment: string) => {
    if (!activeT || !commentModalData) return;
    updateComment(activeT.id, commentModalData.playerId, currentComment);

    const currentIndex = sortedPlayersForNav.findIndex(p => p.id === commentModalData.playerId);
    if (currentIndex > 0) {
      setCommentModalData({ playerId: sortedPlayersForNav[currentIndex - 1].id });
    }
  };

  const handleNextPlayer = (currentComment: string) => {
    if (!activeT || !commentModalData) return;
    updateComment(activeT.id, commentModalData.playerId, currentComment);

    const currentIndex = sortedPlayersForNav.findIndex(p => p.id === commentModalData.playerId);
    if (currentIndex < sortedPlayersForNav.length - 1) {
      setCommentModalData({ playerId: sortedPlayersForNav[currentIndex + 1].id });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in pb-12">
      {/* A) メインコンテンツ（採点テーブル） */}
      <div className="flex-1 min-w-0 order-2 lg:order-1">
        <div className="card-table scroll-x-auto shadow-md border-slate-200">
          <table className="min-w-full border-collapse" style={{ minWidth: hasDeduction ? '1200px' : '1000px' }}>
            <thead className="bg-slate-50">
              <tr className="border-b-2 border-slate-200">
                <th className="px-3 py-2 w-12 text-center font-bold text-slate-400 sticky left-0 z-20 bg-slate-50 border-r border-slate-200">{MESSAGES.CONFIG_PLAYER_TH_NO}</th>
                <th className="px-3 py-2 text-left font-bold text-slate-700 sticky left-12 z-20 bg-slate-50 shadow-[1px_0_0_#e2e8f0] whitespace-nowrap min-w-[200px] border-r border-slate-200">{MESSAGES.SCORING_TH_PLAYER}</th>

                {activeT.criteria.map(c => (
                  <th key={c.id} className="px-2 py-2 text-center border-r border-slate-100 min-w-[130px]">
                    <div className="font-bold text-slate-800 leading-tight">{c.name}</div>
                    <div className="text-[11px] text-slate-400 font-normal mt-0.5 border-t border-slate-100 pt-0.5">MAX {c.maxScore}pt</div>
                  </th>
                ))}

                {/* 小計列（有効時のみ） */}
                {hasDeduction && (
                  <th className="px-3 py-2 text-center border-l border-slate-200 bg-slate-50 text-slate-500 font-bold">
                    {MESSAGES.SCORING_TABLE_HEAD_SUBTOTAL}
                  </th>
                )}

                {/* 減点列（有効時のみ） */}
                {hasDeduction && (
                  <th className="px-1 py-2 text-center border-l border-r border-danger/20 bg-danger-bg/20 w-20">
                    <div className="font-bold text-danger leading-tight text-xs">{MESSAGES.SCORING_TABLE_HEAD_DEDUCTION}</div>
                    <div className="text-[10px] text-danger/50 font-normal mt-0.5 border-t border-danger/10 pt-0.5">pt</div>
                  </th>
                )}

                <th className="px-3 py-2 text-center border-l-2 border-slate-200 bg-primary-light/50 text-primary font-bold">{MESSAGES.SCORING_TABLE_HEAD_TOTAL}</th>
                {showRank && (
                  <th className="px-3 py-2 text-center border-l border-primary/20 bg-primary-light/50 text-primary font-bold">{MESSAGES.SCORING_TABLE_HEAD_RANK}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {(() => {
                const filtered = displayData.filter(row => selectedPlayerIds.includes(row.player.id));
                if (filtered.length === 0) {
                  const extraCols = hasDeduction ? 2 : 0;
                  const colSpan = 4 + activeT.criteria.length + extraCols + (showRank ? 1 : 0);
                  return (
                    <tr>
                      <td colSpan={colSpan} className="px-6 py-20 text-center text-slate-400 bg-slate-50/30 italic">
                        {MESSAGES.SCORING_EMPTY_SELECTION}
                      </td>
                    </tr>
                  );
                }
                return filtered.map((row) => (
                  <tr key={row.player.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-3 py-1.5 text-center font-bold text-slate-400 sticky left-0 z-10 bg-white group-hover:bg-slate-50 border-r border-slate-200">{row.entryNo}</td>
                    <td className="px-3 py-1.5 sticky left-12 z-10 bg-white group-hover:bg-slate-50 shadow-[1px_0_0_#e2e8f0] border-r border-slate-200 align-middle">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold text-slate-900 tabular-nums truncate">{row.player.name}</div>
                        <button
                          onClick={() => setCommentModalData({ playerId: row.player.id })}
                          className={`w-7 h-7 shrink-0 rounded-lg transition-all flex items-center justify-center border outline-none focus:ring-2 focus:ring-primary/30 ${row.comment
                              ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white shadow-sm'
                              : 'bg-white text-slate-400 border-slate-200 hover:text-primary hover:border-primary hover:bg-slate-50'
                            }`}
                          title={MESSAGES.SCORING_TABLE_DETAIL_BTN}
                        >
                          <Maximize2 size={14} strokeWidth={2.5} className={row.comment ? 'text-primary' : 'text-slate-400'} />
                        </button>
                      </div>
                    </td>

                    {activeT.criteria.map(c => (
                      <td key={c.id} className="px-2 py-1 border-r border-slate-100 align-middle bg-white group-hover:bg-slate-50/30">
                        <ScoreCell
                          criterion={c}
                          inputUnit={activeT.inputUnit}
                          mode={displayMode}
                          value={row.scores[c.id]}
                          selectedTier={currentScores[row.player.id]?.selectedTiers?.[c.id]}
                          rank={row.criterionRanks?.[c.id]}
                          showRank={showRank}
                          onChange={(val) => updateScore(activeT.id, row.player.id, c.id, val)}
                          onTierChange={(tier) => updateTier(activeT.id, row.player.id, c.id, tier)}
                        />
                      </td>
                    ))}

                    {/* 小計セル（有効時のみ） */}
                    {hasDeduction && (
                      <td className="px-3 py-1.5 text-center border-l border-slate-200 align-middle bg-slate-50/50">
                        <div className="font-bold text-sm text-slate-500 tabular-nums tracking-tight">
                          {row.subtotal}<span className="text-[10px] text-slate-400 font-semibold ml-0.5 uppercase">pt</span>
                        </div>
                      </td>
                    )}

                    {/* 減点セル（有効時のみ） */}
                    {hasDeduction && (
                      <td className="px-0.5 py-1 border-l border-r border-danger/20 align-middle bg-danger-bg/10 group-hover:bg-danger-bg/20">
                        <DeductionCell
                          value={row.deduction}
                          onChange={(val) => updateDeduction(activeT.id, row.player.id, val)}
                        />
                      </td>
                    )}

                    <td className="px-3 py-1.5 text-center border-l flex-none align-middle bg-primary-light/10">
                      <div className="font-bold text-xl leading-none text-primary tabular-nums tracking-tight">
                        {row.total}<span className="text-[10px] text-primary/60 font-semibold ml-0.5 uppercase">pt</span>
                      </div>
                    </td>
                    {showRank && (
                      <td className="px-3 py-1.5 text-center align-middle bg-primary-light/10 border-l border-primary/20">
                        {(() => {
                          const r = row.rank;
                          if (r === 1) return <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 border border-yellow-300 rounded-full font-bold text-yellow-700 shadow-sm text-sm leading-none">{r}{MESSAGES.ANALYSIS_RANK_SUFFIX}</div>;
                          if (r === 2) return <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-300 rounded-full font-bold text-slate-600 shadow-sm text-sm leading-none">{r}{MESSAGES.ANALYSIS_RANK_SUFFIX}</div>;
                          if (r === 3) return <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full font-bold text-orange-700 shadow-sm text-sm leading-none">{r}{MESSAGES.ANALYSIS_RANK_SUFFIX}</div>;
                          return <div className="font-bold text-slate-400 text-sm tabular-nums">{r}{MESSAGES.ANALYSIS_RANK_SUFFIX}</div>;
                        })()}
                      </td>
                    )}
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* B) サイドコンテンツ（コントロール） */}
      <SidePanel className="order-1 lg:order-2">
        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{MESSAGES.SCORING_TOGGLE_MODE}</span>
            <ToggleSwitch
              options={[
                { value: 'points', label: MESSAGES.SCORING_TOGGLE_ABS },
                { value: 'percentage', label: MESSAGES.SCORING_TOGGLE_PCT },
                { value: 'tier', label: MESSAGES.SCORING_TOGGLE_TIER }
              ]}
              value={displayMode}
              onChange={(val) => setDisplayMode(val as 'percentage' | 'points' | 'tier')}
            />
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{MESSAGES.PLAYER_SORT_TITLE}</span>
            <div className="flex flex-col gap-2">
              <Select
                value={sortKey}
                onChange={(newKey) => {
                  const newOrder = newKey === 'entryNo' ? 'asc' : 'desc';
                  setSortConfig(newKey, newOrder);
                }}
                options={[
                  { value: 'entryNo', label: MESSAGES.PLAYER_SORT_KEY_ENTRY },
                  { value: 'total', label: MESSAGES.PLAYER_SORT_KEY_TOTAL },
                  ...activeT.criteria.map(c => ({ value: c.id, label: c.name })),
                ]}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 py-1">
            <input
              id="rank-toggle"
              type="checkbox"
              className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary/20 cursor-pointer"
              checked={showRank}
              onChange={(e) => setShowRank(e.target.checked)}
            />
            <label htmlFor="rank-toggle" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
              順位を表示する
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <PlayerFilter
              players={tableData.map(d => ({
                id: d.player.id,
                name: d.player.name,
                rank: d.rank,
                entryNo: d.entryNo
              }))}
              selectedIds={selectedPlayerIds}
              onToggle={togglePlayerSelection}
              onSelectAll={() => setSelectedPlayerIds(activeT.players.map(p => p.id))}
              onDeselectAll={() => setSelectedPlayerIds([])}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">データ入出力</span>
            <div className="grid grid-cols-1 gap-2">
              <label className="btn btn-outline btn-action w-full flex items-center justify-center gap-2 cursor-pointer py-3">
                <Download size={18} /> {MESSAGES.CSV_IMPORT_SCORES}
                <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
              </label>
              <button
                onClick={handleExportCSV}
                className="btn btn-outline btn-action w-full flex items-center justify-center gap-2 py-3"
              >
                <Upload size={18} /> {MESSAGES.CSV_EXPORT_SCORES}
              </button>
            </div>
          </div>
        </div>
      </SidePanel>

      {commentModalData && (() => {
        const rowData = tableData.find(d => d.player.id === commentModalData.playerId);
        if (!rowData) return null;
        const navIndex = sortedPlayersForNav.findIndex(p => p.id === rowData.player.id);
        const handleModalSwitch = (playerId: string, currentComment: string) => {
          updateComment(activeT.id, rowData.player.id, currentComment);
          setCommentModalData({ playerId });
        };

        return (
          <DetailModal
            player={rowData.player}
            players={activeT.players}
            activeT={activeT}
            scores={rowData.scores}
            selectedTiers={currentScores[rowData.player.id]?.selectedTiers}
            deduction={rowData.deduction}
            comment={rowData.comment}
            rank={rowData.rank}
            total={rowData.total}
            inputMode={displayMode}
            toggleInputMode={(mode) => setDisplayMode(mode)}
            onSaveScore={(cId, val) => updateScore(activeT.id, rowData.player.id, cId, val)}
            onSaveTier={(cId, tier) => updateTier(activeT.id, rowData.player.id, cId, tier)}
            onSaveDeduction={(val) => updateDeduction(activeT.id, rowData.player.id, val)}
            onSaveComment={(cmt) => updateComment(activeT.id, rowData.player.id, cmt)}
            onClose={() => setCommentModalData(null)}
            onPrevPlayer={handlePrevPlayer}
            onNextPlayer={handleNextPlayer}
            onSelectPlayer={handleModalSwitch}
            hasPrev={navIndex > 0}
            hasNext={navIndex < sortedPlayersForNav.length - 1}
          />
        );
      })()}
    </div>
  );
};
