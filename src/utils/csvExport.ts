// src/utils/csvExport.ts
import type { Criteria } from '../types';

export interface ScoreTableDataRow {
  entryNo: number;
  player: { id: string; name: string; affiliation?: string; props?: string };
  scores: Record<string, { absoluteScore: number }>;
  total: number;
  rank: number;
  comment: string;
}

/**
 * 採点タブのスコアをCSV形式でダウンロードする
 */
export const exportScoringToCSV = (
  tournamentName: string,
  criteria: Criteria[],
  tableData: ScoreTableDataRow[]
) => {
  // 順位を出力から削除
  const headers = ['エントリーNo', '氏名', '所属', '使用道具', ...criteria.map(c => c.name), '合計得点(pt)', 'コメント'];

  const rows = tableData.map(row => {
    const scoreCols = criteria.map(c => row.scores[c.id]?.absoluteScore || 0);
    return [
      row.entryNo,
      row.player.name,
      row.player.affiliation || '',
      row.player.props || '',
      ...scoreCols,
      row.total,
      `"${(row.comment || '').replace(/"/g, '""')}"`
    ];
  });

  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `採点_${tournamentName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
