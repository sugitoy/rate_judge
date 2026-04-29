import { useMemo } from 'react';
import type { TournamentConfig, PlayerScore, ScoreTableDataRow } from '../types';

/**
 * 汎用的な順位計算関数 (同点の場合は同じ順位)
 */
const calculateRanks = (values: { id: string; score: number }[]) => {
  const sorted = [...values].sort((a, b) => b.score - a.score);
  const rankMap = new Map<string, number>();
  
  let currentRank = 1;
  let prevScore = -1;
  let tiedCount = 0;

  sorted.forEach((item, index) => {
    if (index === 0) {
      rankMap.set(item.id, currentRank);
      prevScore = item.score;
    } else {
      if (item.score === prevScore) {
        rankMap.set(item.id, currentRank);
        tiedCount++;
      } else {
        currentRank += 1 + tiedCount;
        rankMap.set(item.id, currentRank);
        prevScore = item.score;
        tiedCount = 0;
      }
    }
  });
  return rankMap;
};

/**
 * 大会情報とスコア情報から、ランキング付けされた採点テーブル用データを生成する
 */
export const useScoringData = (
  activeT: TournamentConfig | null | undefined,
  currentScores: Record<string, PlayerScore>
) => {
  const tableData = useMemo<ScoreTableDataRow[]>(() => {
    if (!activeT) return [];

    // 基礎データの作成
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
        rank: 0,
        criterionRanks: {} as Record<string, number>
      };
    });

    // 合計順位の計算
    const totalRankMap = calculateRanks(data.map(d => ({ id: d.player.id, score: d.total })));

    // 項目別順位の計算
    const criterionRankMaps: Record<string, Map<string, number>> = {};
    activeT.criteria.forEach(c => {
      criterionRankMaps[c.id] = calculateRanks(
        data.map(d => ({ id: d.player.id, score: d.scores[c.id] || 0 }))
      );
    });

    return data.map(item => {
      const cRanks: Record<string, number> = {};
      activeT.criteria.forEach(c => {
        cRanks[c.id] = criterionRankMaps[c.id].get(item.player.id) || 0;
      });
      return { 
        ...item, 
        rank: totalRankMap.get(item.player.id) || 0,
        criterionRanks: cRanks
      };
    });
  }, [activeT, currentScores]);

  return { tableData };
};
