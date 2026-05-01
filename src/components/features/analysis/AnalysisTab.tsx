// src/components/features/analysis/AnalysisTab.tsx

import { useTournamentStore } from '../../../store/useTournamentStore';
import { useScoringStore } from '../../../store/useScoringStore';
import { useAnalysisData } from '../../../hooks/useAnalysisData';
import { MESSAGES } from '../../../constants/messages';
import { AnalysisStats } from './AnalysisStats';
import { PlayerFilter } from '../shared/PlayerFilter';
import { AnalysisTotalDistChart, AnalysisSubtotalDistChart, AnalysisCritDistCharts, AnalysisDeductionDistChart } from './AnalysisDistCharts';
import { AnalysisRadarChart } from './AnalysisRadarChart';
import { SidePanel } from '../../ui/SidePanel';
import { ToggleSwitch } from '../../ui/ToggleSwitch';
import { Select } from '../../ui/Select';

export const AnalysisTab = () => {
  const { tournaments, activeTournamentId } = useTournamentStore();
  const { tournamentScores } = useScoringStore();

  const activeT = activeTournamentId ? tournaments[activeTournamentId] : null;
  const currentScores = activeTournamentId ? tournamentScores[activeTournamentId] || {} : {};

  const {
    selectedPlayers,
    playersInfo,
    subtotalBarData,
    totalBarData,
    radarPlayers,
    radarData,
    statsData,
    togglePlayer,
    selectAll,
    deselectAll,
    displayMode,
    setDisplayMode,
    sortKey,
    setSortConfig
  } = useAnalysisData(activeT, currentScores);

  if (!activeT || activeT.players.length === 0 || activeT.criteria.length === 0) {
    return (
      <div className="card text-center p-10 mt-6">
        <p className="text-slate-500 dark:text-slate-400 mb-4">{MESSAGES.NO_DATA}</p>
      </div>
    );
  }

  const { totalStat, critStats, deductionStat } = statsData;

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in pb-12 tabular-nums">
      {/* メインコンテンツ領域 (A, B, C, D) */}
      <div className="flex-1 min-w-0 order-2 lg:order-1 flex flex-col gap-8">

        {/* A) 統計分析 (Analytics) */}
        <div className="lg:max-w-[50%] mx-auto w-full">
          <AnalysisStats
            totalStat={totalStat!}
            critStats={critStats}
            deductionStat={deductionStat}
            displayMode={displayMode}
          />
        </div>

        {subtotalBarData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* B) 合計得点分布（減点考慮後、減点有効時のみ） */}
            {activeT.hasDeduction && (
              <AnalysisTotalDistChart
                activeT={activeT}
                totalBarData={totalBarData}
                displayMode={displayMode}
              />
            )}

            {/* C) 全体得点分布（小計：審査項目積み上げ） */}
            <AnalysisSubtotalDistChart
              activeT={activeT}
              subtotalBarData={subtotalBarData}
              displayMode={displayMode}
              hasDeduction={activeT.hasDeduction ?? false}
            />

            {/* D) 各審査項目別分布（グリッド内で個別に展開） */}
            <AnalysisCritDistCharts
              activeT={activeT}
              subtotalBarData={subtotalBarData}
              selectedPlayersCount={selectedPlayers.length}
              displayMode={displayMode}
            />

            {/* E) 減点分布（減点有効時のみ） */}
            {activeT.hasDeduction && (
              <AnalysisDeductionDistChart
                activeT={activeT}
                subtotalBarData={subtotalBarData}
                selectedPlayersCount={selectedPlayers.length}
                displayMode={displayMode}
              />
            )}

            {/* F) レーダーチャート（全幅） */}
            <div className="md:col-span-2 max-w-2xl mx-auto w-full">
              <AnalysisRadarChart
                radarData={radarData}
                radarPlayers={radarPlayers}
                selectedPlayersCount={selectedPlayers.length}
              />
            </div>
          </div>
        ) : (
          <div className="card text-center p-12 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 border-dashed">
            <p className="text-slate-400 dark:text-slate-500 font-medium italic">{MESSAGES.ANALYSIS_EMPTY_SELECTION}</p>
          </div>
        )}
      </div>

      {/* B) サイドコンテンツ（表示対象フィルタ） */}
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

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
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
                  ...(activeT.hasDeduction ? [
                    { value: 'subtotal', label: MESSAGES.SCORING_TABLE_HEAD_SUBTOTAL },
                    { value: 'deduction', label: MESSAGES.SCORING_TABLE_HEAD_DEDUCTION }
                  ] : []),
                ]}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <PlayerFilter
              players={playersInfo}
              selectedIds={selectedPlayers}
              onToggle={togglePlayer}
              onSelectAll={selectAll}
              onDeselectAll={deselectAll}
            />
          </div>
        </div>
      </SidePanel>
    </div>
  );
};
