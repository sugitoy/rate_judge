// アプリケーション内のすべての静的メッセージ・ラベルを管理するファイル

export const MESSAGES = {
  // --- Global / App ---
  APP_TITLE: 'RateJudge',
  COMMON_UNSELECTED: '（未選択）',
  NO_DATA: '大会情報がありません。表示する大会を設定してください。',
  REQUIRE_MARK: '*',
  CANCEL: 'キャンセル',
  CLOSE: '閉じる',

  // --- Side Panel ---
  SIDE_PANEL_OPEN: 'メニューを開く',
  SIDE_PANEL_CLOSE: 'メニューを閉じる',

  // --- Header ---
  HEADER_TOURNAMENT_SELECT: '大会選択',
  HEADER_CLEAR_DATA: '初期化',
  HEADER_CLEAR_CONFIRM: 'すべての大会設定と採点データが削除されます。本当によろしいですか？（※バックアップが必要な場合は先にダウンロードしてください）',
  HEADER_CLEAR_SUCCESS: 'すべてのデータをクリアしました。初期状態に戻ります。',

  // --- Tab Navigation ---
  TAB_CONFIG: '設定',
  TAB_SCORING: '採点',
  TAB_ANALYSIS: '分析',

  // --- Config: Tournament Settings ---
  CONFIG_BASIC_TITLE: '大会情報設定',
  CONFIG_BASIC_DESC: '・審査項目等の管理',
  CONFIG_NAME_LABEL: '大会名',
  CONFIG_NAME_PH: '例: ジャグリング大会 2026',
  CONFIG_DIV_LABEL: '部門',
  CONFIG_DIV_PH: '例: 男子個人部門',
  CONFIG_INPUT_UNIT_LABEL: '入力単位 (刻み)',
  CONFIG_UNIT_1: '1刻み (整数)',
  CONFIG_UNIT_05: '0.5刻み',
  CONFIG_UNIT_01: '0.1刻み',
  CONFIG_DEDUCTION_LABEL: '減点あり',
  CONFIG_DEDUCTION_HINT: '有効にすると採点テーブルに減点入力欄が追加されます',

  // --- Config: Criteria Settings ---
  CONFIG_CRITERIA_TITLE: '審査項目',
  CONFIG_CRITERIA_ADD: '項目追加',
  CONFIG_CRITERIA_TOTAL: '合計満点: ',
  CONFIG_CRITERIA_PT: '点',
  CONFIG_CRITERIA_PH: '項目名',
  CONFIG_CRITERIA_EMPTY: '審査項目を追加してください。',

  // --- Config: Player Settings ---
  CONFIG_PLAYER_TITLE: '選手リスト',
  CONFIG_PLAYER_DESC: '登壇順と基本情報の管理',
  CONFIG_PLAYER_ADD: '選手追加',
  CONFIG_PLAYER_EMPTY: '選手が登録されていません。',
  CONFIG_PLAYER_TH_NO: '#',
  CONFIG_PLAYER_TH_NAME: '氏名',
  CONFIG_PLAYER_TH_AFFIL: '所属(任意)',
  CONFIG_PLAYER_TH_PROP: '使用道具(任意)',
  CONFIG_PLAYER_TH_DISQ: '失格',
  CONFIG_PLAYER_TH_ACTION: '操作',

  // --- Config: Actions & Alerts ---
  CONFIG_ACTION_LABEL: 'アクション',
  CONFIG_ADD_TOURNAMENT: '追加',
  CONFIG_SAVE_BTN: '保存',
  CONFIG_DELETE_BTN: '削除',
  CONFIG_SAVED: '設定を保存しました。',
  CONFIG_DELETE_CONFIRM: '現在の大会情報を削除しますか？',
  CONFIG_DELETE_NOTE: '※大会を削除すると、関連する全選手の採点データも完全に消去されます。',
  CONFIG_CLEAR_ALL_NOTE: '全大会および採点データを初期化します。この操作は取り消せません。',
  CONFIG_UNSAVED_CONFIRM: '設定が保存されていません。移動してもよろしいですか？',
  CONFIG_NO_NAME_ALERT: '大会名を入力してください。',
  CONFIG_EDITING_NEW: '「新しい大会」を編集中です。保存すると追加されます。',
  CONFIG_EMPTY_LIST: '大会が1つも登録されていません。詳細を入力して設定を保存してください。',
  CONFIG_ERR_NAME_LENGTH: '大会名は1〜100文字で入力してください。',
  CONFIG_ERR_DIV_LENGTH: '部門名は50文字以内で入力してください。',
  CONFIG_ERR_CRITERIA_NAME_EMPTY: '審査項目名を入力してください。',
  CONFIG_ERR_CRITERIA_NAME_LENGTH: '審査項目名は50文字以内で入力してください。',
  CONFIG_ERR_CRITERIA_NAME_DUP: '審査項目名が重複しています。',
  CONFIG_ERR_CRITERIA_MAX_SCORE: '満点は0.1〜1000の間で設定してください。',
  CONFIG_ERR_PLAYER_NAME_EMPTY: '選手名を入力してください。',
  CONFIG_ERR_PLAYER_NAME_LENGTH: '選手名は100文字以内で入力してください。',
  CONFIG_ERR_PLAYER_AFFIL_LENGTH: '所属は100文字以内で入力してください。',
  CONFIG_ERR_PLAYER_PROP_LENGTH: '使用道具は100文字以内で入力してください。',

  // --- Scoring: Layout & Mode ---
  SCORING_TOGGLE_MODE: '入力モード',
  SCORING_TOGGLE_PCT: '％',
  SCORING_TOGGLE_ABS: 'pt',
  SCORING_TOGGLE_TIER: 'Tier',
  SCORING_TOGGLE_COMPACT: '省略表示',
  SCORING_DATA_IO: 'データ入出力',

  // --- Scoring: Table ---
  SCORING_TH_PLAYER: '選手',
  SCORING_TABLE_HEAD_SUBTOTAL: '小計',
  SCORING_TABLE_HEAD_DEDUCTION: '減点',
  SCORING_TABLE_HEAD_TOTAL: '合計',
  SCORING_TABLE_HEAD_RANK: '順位',
  SCORING_TABLE_DETAIL_BTN: '詳細',
  SCORING_ABS_INPUT: '絶対値入力',

  // --- Scoring: Modal & Feedback ---
  SCORING_PREV_PLAYER: '前の選手',
  SCORING_NEXT_PLAYER: '次の選手',
  SCORING_MODAL_DESC_PH: 'この選手へのメモ・講評...',
  SCORING_ERR_UNIT: '単位エラー',
  SCORING_ERR_RANGE: '範囲外エラー',
  SCORING_ERR_TIER_MISMATCH: 'Tier不一致',
  SCORING_IMPORT_SUCCESS: 'スコアのインポートが完了しました。',
  SCORING_IMPORT_ERR: '一致する選手名・審査項目が見つかりませんでした。',
  SCORING_ERR_COMMENT_LENGTH: 'コメントは1000文字以内で入力してください。',
  SCORING_EMPTY_SELECTION: '表示対象が選択されていません。右メニューで選手を選択してください。',

  // --- Analysis ---
  ANALYSIS_STATS_TITLE: '統計データ',
  ANALYSIS_TH_ITEM: '項目',
  ANALYSIS_TH_MEAN: '平均',
  ANALYSIS_TH_MEDIAN: '中央値',
  ANALYSIS_TH_MAX: '最高',
  ANALYSIS_TH_MIN: '最低',
  ANALYSIS_TH_VAR: '分散',
  ANALYSIS_MAX_POINT: '満点: ',
  ANALYSIS_RANK_SUFFIX: '位',

  ANALYSIS_TOTAL_DIST_TITLE: '全体得点分布 (内訳の積み上げ)',
  ANALYSIS_SUBTOTAL_DIST: '全体得点分布（減点を含まない）',
  ANALYSIS_TOTAL_DIST: '合計得点',
  ANALYSIS_DEDUCTION_LABEL: '減点',
  ANALYSIS_TOTAL_PT: '合計得点 (pt)',
  ANALYSIS_TOTAL_PCT: '合計得点 (%)',
  ANALYSIS_DEDUCTION_PT: '減点 (pt)',
  ANALYSIS_DEDUCTION_PCT: '減点 (%)',

  ANALYSIS_RADAR_TITLE: '選手詳細比較 (レーダーチャート)',
  ANALYSIS_RADAR_HINT: '得点率(%)で正規化して比較',
  ANALYSIS_RADAR_LIMIT_REACHED: 'レーダーチャートの比較は最大5名までです。',
  ANALYSIS_SCORE_RATIO: 'スコア割合',
  ANALYSIS_EMPTY_SELECTION: '表示対象が選択されていません。右メニューで選手を選択してください。',

  // --- Sorting & Filtering ---
  PLAYER_SORT_TITLE: '並び順',
  PLAYER_SORT_KEY_ENTRY: 'エントリーNo順',
  PLAYER_SORT_KEY_TOTAL: '合計点順',

  PLAYER_FILTER_TITLE: '表示対象選手',
  PLAYER_FILTER_SYNC_NOTE: '※全タブで同期されます',
  ANALYSIS_SELECT_ALL: '全選択',
  ANALYSIS_DESELECT_ALL: '全解除',

  // --- CSV Import/Export ---
  CSV_SAMPLE_DL: 'サンプルCSV',
  CSV_CONFIG_SAMPLE: 'インポート',
  CSV_CONFIG_EXPORT: 'エクスポート',
  CSV_PLAYER_SAMPLE: 'インポート',
  CSV_PLAYER_EXPORT: 'エクスポート',
  CSV_EXPORT_SCORES: 'エクスポート',
  CSV_IMPORT_SCORES: 'インポート',
  CONFIG_CSV_ERR_CONFIG: 'CSVに「大会名」が含まれていません。フォーマットを確認してください。',
  CONFIG_CSV_ERR_PLAYER: '選手CSVに有効な行がありません。',

  // --- CSV Headers ---
  CSV_HEADER_T_NAME: '大会名',
  CSV_HEADER_T_DIV: '部門',
  CSV_HEADER_T_UNIT: '入力単位',
  CSV_HEADER_CRITERIA_PREFIX: '審査項目:',
  CSV_HEADER_P_NAME: '氏名',
  CSV_HEADER_P_AFFIL: '所属',
  CSV_HEADER_P_PROP: '使用道具',
  CSV_HEADER_P_DISQ: '失格',
  CSV_HEADER_S_ENTRY: 'エントリーNo',
  CSV_HEADER_S_SUBTOTAL: '小計',
  CSV_HEADER_S_TOTAL: '合計得点(pt)',
  CSV_HEADER_S_COMMENT: 'コメント'
};
