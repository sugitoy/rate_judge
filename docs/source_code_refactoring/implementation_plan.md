# コーディング規約に基づくソースコードの大規模リファクタリング

現在のソースコード（特に `App.tsx`, `ConfigurationTab.tsx`, `ScoringTab.tsx`, `DashboardTab.tsx`, `useStore.ts`）に対し、`.agents/rules/ai_coding_convention.md` のコーディング規約に沿った大規模なリファクタリングを実施します。目的は人間が読みやすく保守しやすい状態（コンポーネントの細分化、ロジックの分離、状態管理のドメイン分割）へ移行することです。

## User Review Required

> [!WARNING]
> 大規模なファイル分割およびディレクトリ構成の変更を伴います（特に `src/components/` 内が `features/` と `ui/` に再編されます）。
> また、状態管理の `Zustand` を `useTournamentStore` と `useScoringStore` に分割するため、既存の LocalStorage データ（v2）からのマイグレーションロジックも追加します。
> これにより UI の見た目に大きな変更はありませんが、内部構造が大きく変わります。この計画で進めてよいかご確認をお願いします。

## Proposed Changes

### 1. Store層の分割（機能ドメイン別）
既存の巨大な `useStore.ts` を機能ドメイン単位に分割します。

- `src/types/store.ts` (新規作成: 分割に伴う型定義の整理)
- `src/store/useTournamentStore.ts` (新規作成: 大会設定・プレイヤー管理)
- `src/store/useScoringStore.ts` (新規作成: スコア・コメント管理)
- `src/store/useStore.ts` (修正: 後方互換と旧 `juggling-judge-storage` からデータを復旧するための初期化用ラッパーまたはマイグレーションスクリプト)

### 2. カスタムフック・ユーティリティ層の分離
UIコンポーネント内に記述されている長い計算ロジックやデータ変換処理（CSV入出力など）を分離します。

- `src/hooks/useDashboardData.ts` (新規作成: `DashboardTab` の平均・中央値・分散などの統計計算とグラフ用データ生成)
- `src/hooks/useScoringData.ts` (新規作成: `ScoringTab` のランキング計算)
- `src/utils/csvExport.ts` (新規作成: `ScoringTab` の CSV 出力ロジック)
- `src/utils/csvImport.ts` (新規作成: `ConfigurationTab` および `ScoringTab` の CSV 読み込みとパース処理)
- `src/utils/scoreFormatter.ts` (新規作成: ゼロ埋め除去 `trimZero` や `isValidUnit` などの計算)

### 3. コンポーネントの分割と再配置
200〜300行を超える巨大コンポーネントを `features` および `ui` ディレクトリへ分割・配置します。

#### UI共通コンポーネント (`src/components/ui/`)
- `src/components/ui/ToggleSwitch.tsx` (新規作成: Scoring と DetailModal で重複しているトグルスイッチ)
- `src/components/ui/LegacyDataModal.tsx` (App.tsx から抽出)

#### Configuration (大会設定) 関連 (`src/components/features/configuration/`)
- `src/components/features/configuration/ConfigurationTab.tsx` (ベース)
- `src/components/features/configuration/BasicConfig.tsx` (基本設定とCriteria入力)
- `src/components/features/configuration/PlayerList.tsx` (プレイヤー一覧)

#### Scoring (採点) 関連 (`src/components/features/scoring/`)
- `src/components/features/scoring/ScoringTab.tsx` (ベース)
- `src/components/features/scoring/ScoringTable.tsx` (採点テーブル部分)
- `src/components/features/scoring/ScoreCell.tsx` (既存を切り出し)
- `src/components/features/scoring/DetailModal.tsx` (既存を切り出し)

#### Dashboard (ダッシュボード) 関連 (`src/components/features/dashboard/`)
- `src/components/features/dashboard/DashboardTab.tsx` (ベース)
- `src/components/features/dashboard/DashboardStats.tsx` (基礎統計量テーブル)
- `src/components/features/dashboard/DashboardFilter.tsx` (グラフ表示の絞り込み)
- `src/components/features/dashboard/DashboardDistCharts.tsx` (積み上げ得点・各項目グラフ)
- `src/components/features/dashboard/DashboardRadarChart.tsx` (レーダーチャート)

#### メインファイル修正
- `src/App.tsx` (パス変更の適用と、肥大化したローカルステート・UIの整理)
- `src/components/ConfigurationTab.tsx` (削除)
- `src/components/ScoringTab.tsx` (削除)
- `src/components/DashboardTab.tsx` (削除)

## Open Questions

> [!IMPORTANT]
> 1. Storeの分割について：Zustandでの `juggling-judge-storage`（古いLocal Storageデータ）の互換性を考慮し、機能別に `useTournamentStore` と `useScoringStore` に分けた上で、初期ロード時に古いキーからデータを移行するスクリプトを組み込む想定です。これでよろしいでしょうか？
> 2. 今回から新しく作るコンポーネントのスタイルは、引き続き既存の `index.css`（Design Tokens）をベースに構成しますが、よろしいでしょうか？

## Verification Plan

### 自動フォーマット
- `eslint` や `tsc` による静的解析およびフォーマットの実行エラーが出ないこと。

### 手動検証
- **設定タブ**: サンプルCSVからの設定／選手のインポート・追加・保存について動作確認。
- **採点タブ**: 得点の双方向入力（%とpt）、CSVでのスコア出力とインポートについて動作確認。
- **ダッシュボード**: 統計グラフやテーブルの描画、選手フィルターの動作確認。

---
*Timestamp: 2026-04-20 01:44:xx*
