import { useMemo, useEffect } from 'react';
import type { TournamentConfig, PlayerScore } from '../types';
import { useUIStore } from '../store/useUIStore';

function getMean(arr: number[]) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function getMedian(arr: number[]) {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 !== 0 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function getVariance(arr: number[], mean: number) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
}

export const useAnalysisData = (
  activeT: TournamentConfig | null | undefined,
  currentScores: Record<string, PlayerScore>
) => {
  const { 
    selectedPlayerIds: selectedPlayers, 
    togglePlayerSelection: togglePlayer, 
    setSelectedPlayerIds,
    initializedTournamentId,
    setInitializedTournamentId,
    displayMode,
    setDisplayMode,
    sortKey,
    sortOrder,
    setSortConfig
  } = useUIStore();

  // 初期表示または大会切り替え時に全選手を選択状態にする
  useEffect(() => {
    if (!activeT || activeT.players.length === 0) return;
    
    // 大会が切り替わった場合のみ初期化（全選択）
    if (initializedTournamentId !== activeT.id) {
      setSelectedPlayerIds(activeT.players.map(p => p.id));
      setInitializedTournamentId(activeT.id);
    }
  }, [activeT, initializedTournamentId, setSelectedPlayerIds, setInitializedTournamentId]);

  // 1. 各選手のTotalとRank事前計算
  const playersInfo = useMemo(() => {
    if (!activeT) return [];

    let info = activeT.players.map((p) => {
      let total = 0;
      activeT.criteria.forEach(c => {
        total += currentScores[p.id]?.scores[c.id] || 0;
      });
      return { id: p.id, name: p.name, total: Number(total.toFixed(2)), entryNo: p.entryNumber, rank: 0 };
    });

    const sortedByScore = [...info].sort((a, b) => b.total - a.total);
    const rankMap = new Map<string, number>();
    let currentRank = 1, prevTotal = -1, tiedCount = 0;
    sortedByScore.forEach((item, index) => {
      if (index === 0) { rankMap.set(item.id, currentRank); prevTotal = item.total; }
      else {
        if (item.total === prevTotal) { rankMap.set(item.id, currentRank); tiedCount++; }
        else { currentRank += 1 + tiedCount; rankMap.set(item.id, currentRank); prevTotal = item.total; tiedCount = 0; }
      }
    });

    const result = info.map(p => ({ ...p, rank: rankMap.get(p.id) || 0 }));

    // ソート処理の適用
    return [...result].sort((a, b) => {
      let valA: number, valB: number;
      if (sortKey === 'entryNo') {
        valA = a.entryNo;
        valB = b.entryNo;
      } else if (sortKey === 'total') {
        valA = a.total;
        valB = b.total;
      } else {
        // 審査項目IDによるソート
        valA = currentScores[a.id]?.scores[sortKey] || 0;
        valB = currentScores[b.id]?.scores[sortKey] || 0;
      }

      if (sortOrder === 'asc') return valA - valB;
      return valB - valA;
    });
  }, [activeT, currentScores, sortKey, sortOrder]);


  // 2. グラフ用分布データ (エントリーNo順 + フィルター適用)
  const distBarData = useMemo(() => {
    if (!activeT) return [];
    return playersInfo
      .filter(p => selectedPlayers.includes(p.id))
      .map(p => {
        const point: any = { id: p.id, label: `${p.entryNo}. ${p.name}` };
        activeT.criteria.forEach(c => {
          point[c.id] = currentScores[p.id]?.scores[c.id] || 0;
        });
        point['total'] = p.total;
        return point;
      });
  }, [activeT, playersInfo, currentScores, selectedPlayers]);

  // レーダーチャート用データ (MAX 5名)
  const radarPlayers = useMemo(() => {
    return playersInfo.filter(p => selectedPlayers.includes(p.id)).slice(0, 5);
  }, [playersInfo, selectedPlayers]);

  const radarData = useMemo(() => {
    if (!activeT || radarPlayers.length === 0) return [];
    return activeT.criteria.map(c => {
      const point: any = { subject: c.name, fullMark: 100 };
      radarPlayers.forEach(p => {
        const absScore = currentScores[p.id]?.scores[c.id] || 0;
        const normalized = c.maxScore > 0 ? (absScore / c.maxScore) * 100 : 0;
        point[p.id] = normalized;
      });
      return point;
    });
  }, [activeT, radarPlayers, currentScores]);


  // 3. 統計データ
  const statsData = useMemo(() => {
    if (!activeT || activeT.players.length === 0) return { totalStat: null, critStats: [] };

    const totalMax = activeT.criteria.reduce((s, c) => s + c.maxScore, 0);
    const totalArr = playersInfo.map(p => p.total);
    const totalMean = getMean(totalArr);

    const totalStat = {
      id: 'total',
      name: '合計得点',
      maxScore: totalMax,
      mean: totalMean,
      median: getMedian(totalArr),
      max: Math.max(...totalArr),
      min: Math.min(...totalArr),
      variance: getVariance(totalArr, totalMean)
    };

    const critStats = activeT.criteria.map(c => {
      const arr = activeT.players.map(p => currentScores[p.id]?.scores[c.id] || 0);
      const mean = getMean(arr);
      return {
        id: c.id,
        name: c.name,
        maxScore: c.maxScore,
        mean: mean,
        median: getMedian(arr),
        max: Math.max(...arr),
        min: Math.min(...arr),
        variance: getVariance(arr, mean)
      };
    });

    return { totalStat, critStats };
  }, [activeT, playersInfo, currentScores]);

  const selectAll = () => {
    if (activeT) setSelectedPlayerIds(activeT.players.map(p => p.id));
  };
  
  const deselectAll = () => {
    setSelectedPlayerIds([]);
  };

  return {
    selectedPlayers,
    playersInfo,
    distBarData,
    radarPlayers,
    radarData,
    statsData,
    togglePlayer,
    selectAll,
    deselectAll,
    displayMode,
    setDisplayMode,
    sortKey,
    sortOrder,
    setSortConfig
  };
};
