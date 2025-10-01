# Next Hono Template

Next.js 内に Hono や Supabase Auth、Prisma を組み込んだフルスタックテンプレートです。
このテンプレートは、エッジランタイム専用のアプリケーションを構築するためのものです。

## 特徴

- **フロントエンド & バックエンド**: Next.js（Hono & Supabase Auth 統合）
- **データベース**: Supabase（Prisma Accelerate 経由で接続）
- **ORM**: Prisma
- **認証**: Supabase Auth
- **スタイリング**: CSS Modules
- **UIライブラリ**: Mantine UI
- **ホスティング**:
  - Next.js → Vercel
- **コード品質管理**: ESLint & stylelint
- **エッジランタイム対応**: Prisma Accelerate

## はじめに

### 必要なもの

- Node.js 18+
- npm

### セットアップ

1. リポジトリをクローン:
   ```sh
   git clone https://github.com/Sho0226/next-hono-template.git
   cd next-hono-template
   ```
2. 依存関係をインストール:
   ```sh
   npm install
   ```
3. 環境変数を設定:

   ```sh
   cp .env.example .env
   ```

   `.env`ファイルに必要な環境変数を入力。

4. Prisma Accelerate をセットアップ:
   ```sh
   npx prisma migrate dev
   ```
5. ローカル開発サーバーを起動:
   ```sh
   npm run dev
   ```

## Supabase のセットアップ

1. [Supabase](https://supabase.com/) にアクセスしてサインアップ。
2. 新しいプロジェクトを作成。
3. **プロジェクト設定** → **API** に移動。
4. **プロジェクト URL**、**anon public API キー** をコピー。
5. `.env`ファイルに以下を追加:
   ```sh
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   ```

## Prisma Accelerate の使用

Prisma Accelerate を使用する場合、専用の接続文字列が必要です。

この接続文字列は、通常`prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY`の形式です。

### Prisma Accelerate 接続文字列の生成方法

1. **Prisma Data Platform にサインアップ:**

   - Prisma の [Cloud Platform](https://console.prisma.io/) にアクセスし、GitHub などでサインアップします。

2. **新しいクラウドプロジェクトを作成:**

   - ダッシュボードで「新しいクラウドプロジェクト」を作成します。

3. **Accelerate を有効化:**

   - プロジェクト内で Accelerate を有効化します。これには、データベース接続文字列と近いロケーションの選択が必要です。

4. **API キーを生成:**

   - Accelerate を有効化後、API キーを生成します。この API キーは、接続文字列の一部として使用されます。

5. **接続文字列の生成:**

   - API キーを含む新しい接続文字列が生成されます。この文字列は、通常`prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY`の形式です。

6. **環境変数に設定:**
   - 生成された接続文字列を`.env`ファイルの`DATABASE_URL`として設定します。

### 例: .env ファイルの設定

```bash
# .env
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
```

この接続文字列は、Prisma Accelerate を通じてデータベースにアクセスするために使用されます。通常の PostgreSQL 接続文字列とは異なり、API キーを含んでいます。

### Supabase との統合

Supabase を使用する場合、通常の PostgreSQL 接続文字列を使用してデータベースに直接アクセスする必要があります。Prisma Accelerate の接続文字列は、Supabase の管理画面で直接使用できません。

## デプロイ

### フロントエンド & バックエンド（Vercel）

1. リポジトリを GitHub にプッシュ。
2. Vercel にリポジトリをインポート。
3. Vercel の環境変数設定で `.env` の内容を追加。
4. deploy

---

## 📚 開発ガイド

<details>
<summary><strong>🏗️ アーキテクチャと技術スタック</strong></summary>

### フロントエンド
- **Next.js 14** - React フレームワーク（App Router使用）
- **TypeScript** - 型安全なJavaScript
- **Mantine UI** - モダンなUIコンポーネントライブラリ
- **CSS Modules** - コンポーネント単位のスタイリング

### バックエンド
- **Hono** - 軽量で高速なWebフレームワーク
- **Prisma** - データベースORM
- **Supabase** - 認証とデータベース

### その他
- **Vercel** - デプロイ先
- **ESLint/Prettier** - コード品質管理

### プロジェクト構造
```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # 全体レイアウト
│   ├── page.tsx         # ホームページ
│   ├── auth/           # 認証関連ページ
│   └── api/            # API ルート
├── components/         # 再利用可能なコンポーネント
├── features/           # 機能別コンポーネント
└── lib/               # ユーティリティ関数
```

</details>

<details>
<summary><strong>🎨 フロントエンドコンポーネントの作り方</strong></summary>

### 1. 基本的なコンポーネント作成

新しいコンポーネントを作る時は、`src/components/` にフォルダを作成します：

```typescript
// src/components/MyComponent/MyComponent.tsx
import styles from './MyComponent.module.css';

interface MyComponentProps {
  title: string;
  children?: React.ReactNode;
}

export default function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </div>
  );
}
```

```css
/* src/components/MyComponent/MyComponent.module.css */
.container {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.title {
  color: #333;
  margin-bottom: 0.5rem;
}
```

### 2. Mantine UIコンポーネントの使用

このプロジェクトではMantine UIが使えるので、美しいコンポーネントが簡単に作れます：

```typescript
import { Button, Card, Text, Group } from '@mantine/core';

export default function MyCard() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text size="lg" weight={500}>
        Card Title
      </Text>
      <Text size="sm" color="dimmed">
        Card description
      </Text>
      <Group justify="flex-end" mt="md">
        <Button variant="light" size="sm">
          Cancel
        </Button>
        <Button size="sm">
          Save
        </Button>
      </Group>
    </Card>
  );
}
```

</details>

<details>
<summary><strong>🛣️ ページルーティングの仕方</strong></summary>

Next.js App Routerでは、フォルダ構造がそのままルートになります：

### 1. 基本的なページ作成

```
src/app/
├── page.tsx          # / (ホーム)
├── about/
│   └── page.tsx      # /about
└── contact/
    └── page.tsx      # /contact
```

### 2. 動的ルート

```
src/app/
└── posts/
    └── [id]/
        └── page.tsx  # /posts/123
```

```typescript
// src/app/posts/[id]/page.tsx
interface PageProps {
  params: { id: string };
}

export default function PostPage({ params }: PageProps) {
  return <div>Post ID: {params.id}</div>;
}
```

### 3. レイアウトの使い方

```typescript
// src/app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>Dashboard Navigation</nav>
      <main>{children}</main>
    </div>
  );
}
```

</details>

<details>
<summary><strong>🔧 バックエンドAPIの書き方</strong></summary>

### 1. Hono APIの基本構造

```typescript
// src/app/api/[[...route]]/route.ts
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

// GET /api/users
app.get("/users", async (c) => {
  const users = await prisma.user.findMany();
  return c.json(users);
});

// POST /api/users
app.post("/users", async (c) => {
  const body = await c.req.json();
  const user = await prisma.user.create({
    data: body,
  });
  return c.json(user, 201);
});

export const GET = handle(app);
export const POST = handle(app);
```

### 2. エラーハンドリング

```typescript
app.get("/users/:id", async (c) => {
  const id = c.req.param("id");
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }
    
    return c.json(user);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});
```

### 3. Next.js API Routes（代替方法）

```typescript
// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  // データ取得処理
  return NextResponse.json({ posts: [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // データ作成処理
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
```

</details>

<details>
<summary><strong>📦 ライブラリの追加方法</strong></summary>

### 1. 新しいライブラリをインストール

```bash
# UIライブラリ
npm install @mantine/notifications

# ユーティリティ
npm install date-fns

# 型定義（TypeScript用）
npm install -D @types/lodash
```

### 2. ライブラリの設定

```typescript
// src/app/layout.tsx
import { Notifications } from '@mantine/notifications';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <MantineProvider>
          <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
```

### 3. よく使うライブラリの例

```bash
# 日付処理
npm install date-fns

# フォーム管理
npm install react-hook-form @hookform/resolvers zod

# 状態管理
npm install zustand

# アニメーション
npm install framer-motion

# アイコン
npm install @tabler/icons-react
```

</details>

<details>
<summary><strong>🎯 サンプルページとコンポーネント</strong></summary>

このテンプレートには以下のサンプルが含まれています：

### 📄 作成済みページ
- **プロフィールページ** (`/profile`) - ユーザー情報を表示
- **ブログ一覧ページ** (`/blog`) - 記事一覧を表示  
- **ブログ詳細ページ** (`/blog/[id]`) - 個別記事を表示（動的ルート）
- **API エンドポイント** (`/api/posts`) - ブログ記事のCRUD操作

### 🧩 作成済みコンポーネント
- **ProfileCard** - プロフィール情報を表示するカードコンポーネント
- **BlogCard** - ブログ記事を表示するカードコンポーネント

### 🚀 開発サーバーの起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスすると、以下のページが利用できます：

- `/` - ホームページ（既存のTodoアプリ）
- `/profile` - プロフィールページ
- `/blog` - ブログ一覧
- `/blog/1` - ブログ詳細（動的ルート）

### 📚 学習ポイント

**フロントエンド:**
- Mantine UIコンポーネントの使い方
- CSS Modulesでのスタイリング
- TypeScriptでの型定義
- Next.js App Routerでのルーティング

**バックエンド:**
- Next.js API Routesの作成
- リクエスト/レスポンスの処理
- エラーハンドリング

**開発の流れ:**
1. コンポーネント設計 → 2. スタイリング → 3. 型定義 → 4. API連携

</details>

---

このテンプレートを使用することで、Next.js と Hono、Supabase Auth、Prisma を組み合わせたエッジランタイム専用のフルスタックアプリケーションを簡単に構築できます。また、Prisma Accelerate を使用することで、エッジ環境でのデータベースアクセスも可能になります。

---
