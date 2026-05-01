import { useMemo } from 'react';
import type { TournamentConfig, PlayerScore, ScoreTableDataRow } from '../types';
import { useUIStore } from '../store/useUIStore';

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
  const { sortKey, sortOrder } = useUIStore();

  const { tableData, exportData } = useMemo(() => {
    if (!activeT) return { tableData: [], exportData: [] };

    // 1. 全選手の基礎データを作成
    const allData = activeT.players.map((p) => {
      const pScore = currentScores[p.id]?.scores || {};
      const cmt = currentScores[p.id]?.comment || '';
      const deduction = activeT.hasDeduction
        ? (currentScores[p.id]?.deduction ?? 0)
        : 0;

      let subtotal = 0;
      activeT.criteria.forEach(c => {
        subtotal += pScore[c.id] || 0;
      });

      const total = Number((subtotal - deduction).toFixed(2));

      return { 
        entryNo: p.entryNumber, 
        player: p, 
        scores: pScore,
        deduction,
        comment: cmt, 
        subtotal: Number(subtotal.toFixed(2)),
        total,
        rank: 0,
        criterionRanks: {} as Record<string, number>
      };
    });

    // 2. 順位計算の対象となる有効な選手のみを抽出
    const eligibleData = allData.filter(d => !d.player.isDisqualified);

    // 合計順位の計算（total ベース）
    const totalRankMap = calculateRanks(eligibleData.map(d => ({ id: d.player.id, score: d.total })));

    // 項目別順位の計算
    const criterionRankMaps: Record<string, Map<string, number>> = {};
    activeT.criteria.forEach(c => {
      criterionRankMaps[c.id] = calculateRanks(
        eligibleData.map(d => ({ id: d.player.id, score: d.scores[c.id] || 0 }))
      );
    });

    // 3. 順位を各データに適用
    const resultWithRanks = allData.map(item => {
      if (item.player.isDisqualified) {
        return item; // 失格者は順位なし(0のまま)
      }
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

    // 4. エクスポート用データ（全選手をエントリーNo順で返す）
    const exportData = [...resultWithRanks].sort((a, b) => a.entryNo - b.entryNo);

    // 5. 表示用データ（失格者を除外し、ソート設定を適用）
    const eligibleResult = resultWithRanks.filter(d => !d.player.isDisqualified);
    const sortedTableData = [...eligibleResult].sort((a, b) => {
      let valA: number, valB: number;
      if (sortKey === 'entryNo') {
        valA = a.entryNo;
        valB = b.entryNo;
      } else if (sortKey === 'total') {
        valA = a.total;
        valB = b.total;
      } else if (sortKey === 'subtotal') {
        valA = a.subtotal;
        valB = b.subtotal;
      } else if (sortKey === 'deduction') {
        valA = a.deduction;
        valB = b.deduction;
      } else {
        // 審査項目IDによるソート
        valA = a.scores[sortKey] || 0;
        valB = b.scores[sortKey] || 0;
      }

      if (sortOrder === 'asc') return valA - valB;
      return valB - valA;
    });

    return { tableData: sortedTableData, exportData };
  }, [activeT, currentScores, sortKey, sortOrder]);

  return { tableData, exportData };
};
