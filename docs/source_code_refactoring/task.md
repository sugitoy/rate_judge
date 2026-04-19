# タスクリスト: ソースコードの大規模リファクタリング

- [x] 1. ディレクトリとファイルの準備
  - [x] `src/components/ui`, `src/components/features/configuration`, `src/components/features/scoring`, `src/components/features/dashboard` の作成
  - [x] `src/hooks`, `src/utils` の作成

- [x] 2. 型定義の更新 (`src/types/index.ts`)
  - [x] アプリケーションの型定義の整理

- [x] 3. Utility / カスタムフックの抽出
  - [x] `src/utils/scoreFormatter.ts` 作成 (`trimZero`, `isValidUnit` 等)
  - [x] `src/utils/csvImport.ts`, `src/utils/csvExport.ts` 作成
  - [x] `src/hooks/useDashboardData.ts` 作成 (基礎統計・レーダーデータ生成用)
  - [x] `src/hooks/useScoringData.ts` 作成 (ランクリスト化用)

- [x] 4. Store ドメイン分割
  - [x] `src/store/useTournamentStore.ts` 作成 (設定、大会情報)
  - [x] `src/store/useScoringStore.ts` 作成 (スコア、コメント)
  - [x] (App.tsx や元のコンポーネントでの `useStore` 置換)

- [x] 5. Components: UI共通・抽出
  - [x] `src/components/ui/ToggleSwitch.tsx`
  - [x] `src/components/ui/LegacyDataModal.tsx` (不要なら削除 -> 削除済)

- [x] 6. Components: Configuration (大会設定)
  - [x] `src/components/features/configuration/BasicConfig.tsx`
  - [x] `src/components/features/configuration/PlayerList.tsx`
  - [x] `src/components/features/configuration/ConfigurationTab.tsx`

- [x] 7. Components: Scoring (採点)
  - [x] `src/components/features/scoring/ScoreCell.tsx`
  - [x] `src/components/features/scoring/DetailModal.tsx`
  - [x] `src/components/features/scoring/ScoringTab.tsx` 

- [x] 8. Components: Dashboard (ダッシュボード)
  - [x] `src/components/features/dashboard/DashboardStats.tsx`
  - [x] `src/components/features/dashboard/DashboardFilter.tsx`
  - [x] `src/components/features/dashboard/DashboardDistCharts.tsx`
  - [x] `src/components/features/dashboard/DashboardRadarChart.tsx`
  - [x] `src/components/features/dashboard/DashboardTab.tsx`

- [x] 9. `App.tsx` の更新と不要ファイルの削除
  - [x] 新レイアウトへの対応、コンポーネント参照の置換
  - [x] `src/components/*Tab.tsx` などの古い階層の削除

- [x] 10. 全体検証
  - [x] 自動フォーマット、型チェック (`tsc`)
  - [x] 各タブの描画と基本操作確認
