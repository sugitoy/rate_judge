// src/utils/csvExport.ts
import type { Criteria, Player } from '../types';

export interface ScoreTableDataRow {
  entryNo: number;
  player: Player;
  scores: Record<string, number | undefined>;
  deduction: number;
  subtotal: number;
  total: number;
  rank: number;
  comment: string;
}

/**
 * 汎用的なCSVダウンロード処理
 */
const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 採点タブのスコアをCSV形式でダウンロードする
 * 減点有効の場合は「減点」「小計」列を追加する
 */
export const exportScoringToCSV = (
  tournamentName: string,
  criteria: Criteria[],
  tableData: ScoreTableDataRow[],
  hasDeduction = false
) => {
  const headers = hasDeduction
    ? ['エントリーNo', '氏名', ...criteria.map(c => c.name), '減点', '小計', '合計得点(pt)', 'コメント']
    : ['エントリーNo', '氏名', ...criteria.map(c => c.name), '合計得点(pt)', 'コメント'];

  const rows = tableData.map(row => {
    const scoreCols = criteria.map(c => row.scores[c.id] ?? '');
    const commentCol = `"${(row.comment || '').replace(/"/g, '""')}"`;

    if (hasDeduction) {
      return [
        row.entryNo,
        row.player.name,
        ...scoreCols,
        row.deduction,
        row.subtotal,
        row.total,
        commentCol
      ];
    }
    return [
      row.entryNo,
      row.player.name,
      ...scoreCols,
      row.total,
      commentCol
    ];
  });
  downloadCSV(`採点_${tournamentName}.csv`, headers, rows);
};

/**
 * 大会情報設定をCSV形式でダウンロードする
 */
export const exportConfigToCSV = (config: { name: string; division: string; inputUnit: number; criteria: Criteria[] }) => {
  const headers = ['大会名', '部門', '入力単位', ...config.criteria.map(c => `審査項目:${c.name}`)];
  const row = [
    config.name,
    config.division,
    config.inputUnit,
    ...config.criteria.map(c => c.maxScore)
  ];
  downloadCSV(`大会設定_${config.name}.csv`, headers, [row]);
};

/**
 * 選手リストをCSV形式でダウンロードする
 */
export const exportPlayersToCSV = (tournamentName: string, players: Player[]) => {
  const headers = ['氏名', '所属', '使用道具'];
  const rows = players.map(p => [
    p.name,
    p.affiliation || '',
    p.props || ''
  ]);
  downloadCSV(`選手リスト_${tournamentName}.csv`, headers, rows);
};
