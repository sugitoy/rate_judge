export interface Criteria {
  id: string;
  name: string;
  maxScore: number;
}

export interface Player {
  id: string;
  entryNumber: number; // エントリーNo (表示・ソート用)
  name: string;
  affiliation?: string; // 所属(任意)
  props?: string; // 使用道具(任意)
  isDisqualified?: boolean; // 失格フラグ
}

export interface TournamentConfig {
  id: string;
  name: string;
  division: string;
  inputUnit: number; // 採点単位 (例: 1, 0.5)
  hasDeduction: boolean; // 減点機能の有無
  criteria: Criteria[];
  players: Player[];
}

export interface PlayerScore {
  playerId: string;
  scores: Record<string, number | undefined>; // 項目IDをキーとした得点データ
  deduction?: number; // 減点値（絶対値で保存、合計計算時に減算）
  comment?: string;
}

export interface ScoreTableDataRow {
  entryNo: number;
  player: Player;
  scores: Record<string, number | undefined>;
  deduction: number; // 減点値（絶対値）
  criterionRanks?: Record<string, number>; // 項目ごとの順位
  comment: string;
  subtotal: number; // 審査項目の合計（小計）
  total: number; // subtotal - deduction（合計）
  rank: number;
}
