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

  // 1. 各選手のsubtotal/deduction/total/Rank事前計算
  const playersInfo = useMemo(() => {
    if (!activeT) return [];

    let info = activeT.players.map((p) => {
      let subtotal = 0;
      activeT.criteria.forEach(c => {
        subtotal += currentScores[p.id]?.scores[c.id] || 0;
      });
      const deduction = activeT.hasDeduction
        ? (currentScores[p.id]?.deduction ?? 0)
        : 0;
      const total = Number((subtotal - deduction).toFixed(2));

      return {
        id: p.id,
        name: p.name,
        subtotal: Number(subtotal.toFixed(2)),
        deduction,
        total,
        entryNo: p.entryNumber,
        rank: 0
      };
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


  // 2. 小計グラフ用データ（審査項目の積み上げのみ、減点なし）
  const subtotalBarData = useMemo(() => {
    if (!activeT) return [];
    return playersInfo
      .filter(p => selectedPlayers.includes(p.id))
      .map(p => {
        const point: Record<string, string | number> = {
          id: p.id,
          label: `${p.entryNo}. ${p.name}`
        };
        activeT.criteria.forEach(c => {
          point[c.id] = currentScores[p.id]?.scores[c.id] || 0;
        });
        point['subtotal'] = p.subtotal;
        return point;
      });
  }, [activeT, playersInfo, currentScores, selectedPlayers]);

  // 3. 合計グラフ用データ（減点を baseValue としてオフセット付き積み上げ）
  // 減点有効時のみ使用される
  const totalBarData = useMemo(() => {
    if (!activeT || !activeT.hasDeduction) return [];
    return playersInfo
      .filter(p => selectedPlayers.includes(p.id))
      .map(p => {
        const point: Record<string, string | number> = {
          id: p.id,
          label: `${p.entryNo}. ${p.name}`,
          deduction: p.deduction, // マイナスオフセット用
        };
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
      const point: Record<string, string | number> = { subject: c.name, fullMark: 100 };
      radarPlayers.forEach(p => {
        const absScore = currentScores[p.id]?.scores[c.id] || 0;
        const normalized = c.maxScore > 0 ? (absScore / c.maxScore) * 100 : 0;
        point[p.id] = normalized;
      });
      return point;
    });
  }, [activeT, radarPlayers, currentScores]);


  // 4. 統計データ
  const statsData = useMemo(() => {
    if (!activeT || activeT.players.length === 0) return { totalStat: null, critStats: [], deductionStat: null };

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

    // 減点統計（有効時のみ）
    let deductionStat = null;
    if (activeT.hasDeduction) {
      const deductionArr = activeT.players.map(p => currentScores[p.id]?.deduction ?? 0);
      const deductionMean = getMean(deductionArr);
      deductionStat = {
        id: 'deduction',
        name: '減点',
        maxScore: totalMax, // %表示時の分母として使用
        mean: deductionMean,
        median: getMedian(deductionArr),
        max: Math.max(...deductionArr),
        min: Math.min(...deductionArr),
        variance: getVariance(deductionArr, deductionMean)
      };
    }

    return { totalStat, critStats, deductionStat };
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
    sortOrder,
    setSortConfig
  };
};
