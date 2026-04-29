// src/hooks/useScoringData.ts
import { useMemo } from 'react';
import type { TournamentConfig, PlayerScore } from '../types';
import type { ScoreTableDataRow } from '../utils/csvExport';

/**
 * 大会情報とスコア情報から、ランキング付けされた採点テーブル用データを生成する
 */
export const useScoringData = (
  activeT: TournamentConfig | null | undefined,
  currentScores: Record<string, PlayerScore>
) => {
  const tableData = useMemo<ScoreTableDataRow[]>(() => {
    if (!activeT) return [];

    const data = activeT.players.map((p) => {
      const pScore = currentScores[p.id]?.scores || {};
      const cmt = currentScores[p.id]?.comment || '';
      let total = 0;
      activeT.criteria.forEach(c => {
        total += pScore[c.id] || 0;
      });
      return { 
        entryNo: p.entryNumber, 
        player: p, 
        scores: pScore, 
        comment: cmt, 
        total: Number(total.toFixed(2)),
        rank: 0 // 仮
      };
    });

    const sorted = [...data].sort((a, b) => b.total - a.total);
    let currentRank = 1;
    let prevTotal = -1;
    let tiedCount = 0;

    const rankMap = new Map<string, number>();
    sorted.forEach((item, index) => {
      if (index === 0) {
        rankMap.set(item.player.id, currentRank);
        prevTotal = item.total;
      } else {
        if (item.total === prevTotal) {
          rankMap.set(item.player.id, currentRank);
          tiedCount++;
        } else {
          currentRank += 1 + tiedCount;
          rankMap.set(item.player.id, currentRank);
          prevTotal = item.total;
          tiedCount = 0;
        }
      }
    });

    return data.map(item => ({ ...item, rank: rankMap.get(item.player.id) || 0 }));
  }, [activeT, currentScores]);

  return { tableData };
};
