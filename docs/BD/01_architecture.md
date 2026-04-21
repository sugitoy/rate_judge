# 01. システム構成

本システムは、React / TypeScript / Vite を利用したシングルページアプリケーション (SPA) です。  
サーバーサイドのデータベースは持たず、ブラウザの `LocalStorage` を永続化層として利用するスタンドアロンな構成です。

## 1.1. システム構成
- **構成**: フロントエンド完結型 SPA
- **永続化**: Web Storage API (LocalStorage)
- **データ移行**: バージョンアップデート時のスキーマ変更を検知し、レガシーデータのバックアップ（JSON等）提供と新フォーマットへの初期化をサポートするメカニズムを備える。

## 1.2. 技術スタック・ライブラリ
- **Frontend Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data Parsing**: PapaParse (CSV)
- **Visualization**: Recharts
