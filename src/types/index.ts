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
}

export interface TournamentConfig {
  id: string;
  name: string;
  division: string;
  inputUnit: number; // 採点単位 (例: 1, 0.5)
  criteria: Criteria[];
  players: Player[];
}

export interface PlayerScore {
  playerId: string;
  scores: Record<string, number | undefined>; // 項目IDをキーとした得点データ
  comment?: string;
}
