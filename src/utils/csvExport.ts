// src/utils/csvExport.ts
import type { Criteria, Player } from '../types';
import { MESSAGES } from '../constants/messages';

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
 * CSVの値を適切にエスケープする
 * カンマ、改行、ダブルクォートが含まれる場合は全体をクォートし、
 * 内部のダブルクォートは二重化する。null/undefinedは空文字にする。
 */
const escapeCSV = (val: string | number | null | undefined): string => {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (/[,"\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * ファイル名を安全な形式にサニタイズする
 */
const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[\\/:*?"<>|]/g, '_');
};

/**
 * 汎用的なCSVダウンロード処理
 */
const downloadCSV = (filename: string, headers: string[], rows: (string | number | null | undefined)[][]) => {
  const sanitized = sanitizeFilename(filename);
  const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.map(escapeCSV).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", sanitized);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 採点タブのスコアをCSV形式でダウンロードする
 * 減点有効の場合は「減点」「小計」列を追加する。順位列を末尾に追加。
 */
export const exportScoringToCSV = (
  tournamentName: string,
  criteria: Criteria[],
  tableData: ScoreTableDataRow[],
  hasDeduction = false
) => {
  const headers = hasDeduction
    ? [MESSAGES.CSV_HEADER_S_ENTRY, MESSAGES.CSV_HEADER_P_NAME, ...criteria.map(c => c.name), MESSAGES.ANALYSIS_DEDUCTION_LABEL, MESSAGES.CSV_HEADER_S_SUBTOTAL, MESSAGES.CSV_HEADER_S_TOTAL, MESSAGES.SCORING_TABLE_HEAD_RANK, MESSAGES.CSV_HEADER_S_COMMENT]
    : [MESSAGES.CSV_HEADER_S_ENTRY, MESSAGES.CSV_HEADER_P_NAME, ...criteria.map(c => c.name), MESSAGES.CSV_HEADER_S_TOTAL, MESSAGES.SCORING_TABLE_HEAD_RANK, MESSAGES.CSV_HEADER_S_COMMENT];

  const rows = tableData.map(row => {
    const scoreCols = criteria.map(c => row.scores[c.id] ?? '');
    const commentCol = row.comment || '';

    if (hasDeduction) {
      return [
        row.entryNo,
        row.player.name,
        ...scoreCols,
        row.deduction,
        row.subtotal,
        row.total,
        row.rank || '',
        commentCol
      ];
    }
    return [
      row.entryNo,
      row.player.name,
      ...scoreCols,
      row.total,
      row.rank || '',
      commentCol
    ];
  });
  downloadCSV(`03_採点_${tournamentName}.csv`, headers, rows);
};

/**
 * 大会情報設定をCSV形式でダウンロードする
 */
export const exportConfigToCSV = (config: { name: string; division: string; inputUnit: number; criteria: Criteria[] }) => {
  const headers = [MESSAGES.CSV_HEADER_T_NAME, MESSAGES.CSV_HEADER_T_DIV, MESSAGES.CSV_HEADER_T_UNIT, ...config.criteria.map(c => `${MESSAGES.CSV_HEADER_CRITERIA_PREFIX}${c.name}`)];
  const row = [
    config.name,
    config.division,
    config.inputUnit,
    ...config.criteria.map(c => c.maxScore)
  ];
  downloadCSV(`01_大会設定_${config.name}.csv`, headers, [row]);
};

/**
 * 選手リストをCSV形式でダウンロードする
 */
export const exportPlayersToCSV = (tournamentName: string, players: Player[]) => {
  const headers = [MESSAGES.CSV_HEADER_P_NAME, MESSAGES.CSV_HEADER_P_AFFIL, MESSAGES.CSV_HEADER_P_PROP, MESSAGES.CSV_HEADER_P_DISQ];
  const rows = players.map(p => [
    p.name,
    p.affiliation || '',
    p.props || '',
    p.isDisqualified ? '1' : '0'
  ]);
  downloadCSV(`02_選手リスト_${tournamentName}.csv`, headers, rows);
};
