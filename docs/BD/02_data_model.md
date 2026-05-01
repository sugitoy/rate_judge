# 02. データモデル

## 2.1. 内部データ構造

### 審査項目 (Criteria)
```typescript
interface Criteria {
  id: string;       // 項目識別子
  name: string;     // 項目名 (例: 技術点)
  maxScore: number;  // 満点
}
```

### 選手 (Player)
```typescript
interface Player {
  id: string;           // 内部的なシステムID (UUID等)
  entryNumber: number;  // エントリーNo (表示・ソート・CSVのIDとして機能)
  name: string;
  affiliation?: string; // 所属
  props?: string;       // 使用道具
  isDisqualified?: boolean; // 失格フラグ
}
```

### 大会設定 (TournamentConfig)
```typescript
interface TournamentConfig {
  id: string;
  name: string;
  division: string;
  inputUnit: number;      // 0.1, 0.5, 1 等の採点単位
  hasDeduction: boolean;  // 減点機能の有無 (デフォルト: false)
  criteria: Criteria[];
  players: Player[];      // 選手リスト
}
```

### 採点データ (PlayerScore)
```typescript
interface PlayerScore {
  playerId: string;
  scores: Record<string, number | undefined>; // 項目IDをキーとした得点データ(未入力考慮)
  selectedTiers?: Record<string, string | undefined>; // 項目IDをキーとした選択中のTier
  deduction?: number;                          // 減点値（絶対値で保存、合計計算時に減算）
  comment?: string;                           // 自由記述コメント
}
```

### トーナメント状態 (TournamentStore State)
```typescript
interface TournamentState {
  tournaments: Record<string, TournamentConfig>;
  activeTournamentId: string | null;
}
```

### 採点状態 (ScoringStore State)
```typescript
interface ScoringState {
  tournamentScores: Record<string, Record<string, PlayerScore>>;
}
```



## 2.2. 外部インターフェース (CSV)

システムの入出力に使用するCSV形式の仕様です。文字コードは **UTF-8（BOM付き）** を推奨します。

### 2.2.1. 大会情報のインポート・エクスポート
「大会設定」タブで使用する、大会の基本構成（名称・審査項目等）をインポート・エクスポートするための形式です。

| 大会名 | 部門 | 入力単位 | 審査項目:技術 | 審査項目:芸術 |
| :--- | :--- | :--- | :--- | :--- |
| JJF2026 | 男子個人 | 0.5 | 40 | 60 |

### 2.2.2. 選手情報のインポート・エクスポート
「大会設定」タブで使用する、エントリーする選手の一覧をインポート・エクスポートするための形式です。

| 氏名 | 所属 | 使用道具 | 失格 |
| :--- | :--- | :--- | :--- |
| 山田太郎 | ジャグリングサークルA | ボール | 0 |
| 佐藤花子 | | ディアボロ | 1 |

※「失格」列は `1`（失格）または `0`（有効）で指定します。空欄は `0` とみなされます。
### 2.2.3. 採点データのインポート・エクスポート
「採点」タブで使用する、採点結果の一覧をインポート・エクスポートするための形式です。

| エントリーNo | 氏名 | 技術点 | 構成点 | 減点 | 小計 | 合計得点(pt) | コメント |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 選手A | 18.5 | 15.0 | 1.0 | 33.5 | 32.5 | 素晴らしい演技でした |
| 2 | 選手B | 12.0 | 14.5 | 0.0 | 26.5 | 26.5 | ドロップが惜しい |

※審査項目の列（上記例では「技術点」「構成点」）は、大会設定で定義された項目名に基づいて可変となります。
※「減点」列および「小計」列は、大会設定で減点が有効な場合のみ出力されます。減点が無効な場合は「合計得点(pt)」のみを出力します。
