# フォルダ構成

本プロジェクトのディレクトリ構成と各ディレクトリの役割を定義します。

## 1. 全体構造

```
rate_judge/
├── .agents/             # エージェント用設定
├── dist/                # ビルド生成物
├── docs/                # ドキュメント類
│   ├── BD/              # 基本設計（Basic Design）
│   ├── RD/              # 要件定義（Requirements Definition）
│   ├── RULES/           # AI作業手順ルール等
│   └── juggling_judge_tool/ # プロジェクト固有資料（進捗管理等）
├── node_modules/        # 外部ライブラリ
├── public/              # 静的資産
├── src/                 # ソースコード
│   ├── assets/          # 画像・アイコン等のアセット
│   ├── components/      # UIコンポーネント（共通部品、各画面部品）
│   ├── constants/       # 定数定義、メッセージ集約（messages.ts等）
│   ├── store/           # 状態管理（Zustand等）
│   ├── types/           # TypeScript型定義
│   ├── App.tsx          # メインアプリケーションコンポーネント
│   ├── main.tsx         # エントリーポイント
│   ├── index.css        # グローバルスタイル
│   └── App.css          # アプリケーション固有スタイル
├── index.html           # HTMLテンプレート
├── package.json         # プロジェクト設定・依存関係
├── tsconfig.json        # TypeScript設定
└── vite.config.ts       # Vite設定
```

## 2. 主要ディレクトリの役割

### src/components
UIを構成する再利用可能なコンポーネントを配置します。
- **共通部品**: ボタン、入力フォーム、ダイアログ等の汎用パーツ。
- **画面パーツ**: 特定の画面（採点画面、分析機能等）に依存する複雑なパーツ。

### src/constants
マジックナンバーやシステム内で共通利用する定数を管理します。
特に、ユーザーに表示する日本語メッセージは `messages.ts` に集約し、ハードコードを避け、保守性を高めます。

### src/store
アプリケーション全体の状態（大会情報、選手データ、採点結果等）を管理します。
データの永続化（LocalStorage等）との連携もここで行います。

### docs/BD
基本設計書を格納します。以下の構成で管理し、実装前に整合性を確認します。
- `01_architecture.md`: アーキテクチャ設計
- `02_data_model.md`: データモデル、localStorageの構造
- `03_screen_design.md`: 画面デザイン、UIコンポーネント構成
- `04_logic_design.md`: 計算ロジック、バリデーションルール
- `05_directory_structure.md`: 本資料（フォルダ構成）

---
*最終更新: 2026-04-20*
