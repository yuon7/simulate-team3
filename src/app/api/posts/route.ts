import { NextRequest, NextResponse } from 'next/server';

// サンプルデータ
const posts = [
  {
    id: 1,
    title: 'Next.js 14の新機能を試してみた',
    content: 'App Routerの改善点とServer Componentsの使い方について詳しく解説します...',
    author: '田中太郎',
    publishedAt: '2024-01-15',
    category: '技術',
  },
  {
    id: 2,
    title: 'TypeScriptで型安全なAPI設計',
    content: 'PrismaとHonoを使った型安全なバックエンド開発のベストプラクティス...',
    author: '佐藤花子',
    publishedAt: '2024-01-10',
    category: '開発',
  },
  {
    id: 3,
    title: 'Mantine UIで美しいフォームを作る',
    content: 'バリデーション機能付きのフォームコンポーネントの実装方法...',
    author: '山田次郎',
    publishedAt: '2024-01-05',
    category: 'UI/UX',
  },
];

// GET /api/posts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const author = searchParams.get('author');

  let filteredPosts = posts;

  if (category) {
    filteredPosts = filteredPosts.filter(post => post.category === category);
  }

  if (author) {
    filteredPosts = filteredPosts.filter(post => post.author === author);
  }

  return NextResponse.json({
    posts: filteredPosts,
    total: filteredPosts.length,
  });
}

// POST /api/posts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, author, category } = body;

    // バリデーション
    if (!title || !content || !author || !category) {
      return NextResponse.json(
        { error: '必須フィールドが不足しています' },
        { status: 400 }
      );
    }

    // 新しい投稿を作成（実際のアプリではデータベースに保存）
    const newPost = {
      id: posts.length + 1,
      title,
      content,
      author,
      category,
      publishedAt: new Date().toISOString().split('T')[0],
    };

    posts.push(newPost);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
