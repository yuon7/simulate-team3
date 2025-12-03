# Agent Rules

### プロジェクト構造
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # 全体レイアウト
│   ├── page.tsx         # ホームページ
│   ├── auth/           # 認証関連ページ
│   └── api/            # API ルート
├── components/         # 再利用可能なコンポーネント
├── features/           # 機能別コンポーネント
└── lib/               # ユーティリティ関数

## 破壊的変更の禁止
- 既存の認証フロー（`/auth/login`）は変更しない
- データベーススキーマ（[prisma/schema.prisma](cci:7://file:///home/yuon/simulate/prisma/schema.prisma:0:0-0:0)）は事前確認なしに変更しない

## 変更範囲の制限
- 一度に変更するファイル数は5つまで
- 新規機能は必ず新しいディレクトリに作成

## 必須の確認事項
- 新しいServer Actionsを作成する前にユーザーに確認
- 既存コンポーネントの大幅な書き換えは提案のみ、実装前に承認を得る

## コーディング規約
- CSS Modulesを使用
- Server ActionsとClient Componentsを明確に分離