# 実装乖離およびコーディング規約の修正計画

前回の調査レポートで挙げられた、要件定義（RD）・基本設計（BD）およびコーディング規約と現在の実装との乖離を解消するための実装計画です。

## User Review Required

実装内容について確認をお願いします。特に、レーダーチャートの追加UIレイアウト（他のグラフとどのように並べるか）についてのご確認をお願いします。本計画では、ダッシュボードの下部に全幅または2カラムでレーダーチャートエリアを追加する想定です。

## Proposed Changes

### `src/constants/messages.ts`
#### [MODIFY] messages.ts
ダッシュボード画面でハードコードされている以下の文言などを抽出し、定数として追加します。
- `DASHBOARD_GRAPH_FILTER`: 'グラフ表示対象'
- `DASHBOARD_SELECT_ALL`: '全選択'
- `DASHBOARD_DESELECT_ALL`: '全解除'
- `DASHBOARD_GRAPH_SYNC_NOTE`: '※下部の分布グラフに連動'
- `DASHBOARD_TOTAL_DIST_TITLE`: '全体得点分布 (内訳の積み上げ)'
- `DASHBOARD_SORT_NOTE`: '※エントリーNo順'
- `DASHBOARD_MAX_POINT`: '満点: '
- `DASHBOARD_EMPTY_SELECTION`: '表示対象が選択されていません。上部で比較対象を選択してください。'

### `src/components/DashboardTab.tsx`
#### [MODIFY] DashboardTab.tsx
1. **メッセージの一元管理化**: 追加した `MESSAGES` を適用し、ハードコードされているテキストを置き換えます。
2. **レーダーチャートの実装**:
   * `recharts` から `RadarChart`, `PolarGrid`, `PolarAngleAxis`, `PolarRadiusAxis`, `Radar` などをインポートします。
   * 要件定義に則り、選択された選手（最大5名）の**各項目の獲得割合（%）**を計算して正規化し、レーダーチャートとして比較表示するセクションを他のグラフの下に追加します。
   * ※選択人数が5名を超える場合は、「最大5名までです」というアラート（または表示の上限カット）を適用します。

### `src/components/ScoringTab.tsx`
#### [MODIFY] ScoringTab.tsx
1. **等幅フォント（tabular-nums）の適用**:
   * `<ScoreCell>` 内の得点およびパーセンテージを入力するための `<input>` 要素の `className` に `tabular-nums` または `font-mono` を追加し、数値の文字幅によるブレを防止します。

## Verification Plan

### 自動テスト / ビルドチェック
- `npm run build` でコンパイルエラーや型エラーが発生しないことを確認する。

### 手動確認
- `DashboardTab` において、日本語文言が正しく表示されており、ハードコードされていないことを確認する。
- 複数の選手を選択した際に、ダッシュボードへ正しくレーダーチャートが表示されること（%ベースでの正規化がされていること）を確認する。
- 6名以上選択した場合の挙動（5名に制限されるか警告が出るか）を確認する。
- 採点画面 (`ScoringTab`) で数値を入力した際、文字幅の違いで入力カーソルがブレない（等幅フォントになっている）ことを確認する。
