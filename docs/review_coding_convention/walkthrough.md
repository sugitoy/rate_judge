# コーディング規約改善 完了報告

レビューで提案した改善点を `ai_coding_convention.md` に反映し、規約の強化を完了しました。

## 実施内容

### 規約ドキュメントの更新
[ai_coding_convention.md](file:///c:/work/dev/rate_judge/docs/RULES/ai_coding_convention.md) を修正し、以下の項目を追加・強化しました：

1.  **命名規則の強化**
    *   カスタムフック (`useXxx.ts`)、ユーティリティ関数 (`camelCase`)、ディレクトリ名 (`kebab-case`) のルールを明文化しました。
2.  **状態管理 (Zustand) の方針策定**
    *   ストアを機能ドメイン単位で分割して定義し、肥大化を防ぐ指針を追加しました。
3.  **デザインシステム (z-index) の管理**
    *   `z-index` への直接的な数値指定を禁止し、`index.css` で定義されたトークンの使用を義務化しました。
4.  **コードの自己記述性とコメント**
    *   複雑なロジックへの JSDoc 記述を推奨する一方、自明なコードへの過剰なコメントを抑制する指針を追加しました。
5.  **アクセシビリティ (a11y) と文書構造**
    *   `aria-label` の付与やセマンティックHTMLの使用をルール化しました。
6.  **エラーハンドリングとフィードバック**
    *   Toast通知等を用いた視覚的なエラーフィードバックの必要性と、メッセージ集約先 (`messages.ts`) の利用を明記しました。

## 確認事項
- 修正後の `ai_coding_convention.md` が [BD/05_directory_structure.md](file:///c:/work/dev/rate_judge/docs/BD/05_directory_structure.md) 等の既存ドキュメントと不整合を起こしていないことを確認しました。

---
*作成日: 2026-04-20*
