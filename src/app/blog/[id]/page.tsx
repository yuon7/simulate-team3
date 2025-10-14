import { Container, Title, Text, Group, Badge, Divider, Button } from '@mantine/core';
import { IconCalendar, IconUser, IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import styles from './[id].module.css';

interface PageProps {
  params: { id: string };
}

// サンプルデータ（実際のアプリではAPIから取得）
const blogPost = {
  id: 1,
  title: 'Next.js 14の新機能を試してみた',
  content: `
    Next.js 14がリリースされ、多くの新機能が追加されました。特にApp Routerの改善点とServer Componentsの使い方について詳しく解説します。

    ## App Routerの改善点

    App Routerは、Next.js 13で導入された新しいルーティングシステムですが、14ではさらに使いやすくなりました。

    ### Server Componentsの活用

    Server Componentsを使用することで、サーバーサイドでレンダリングされたコンポーネントを効率的に扱うことができます。

    \`\`\`typescript
    // Server Componentの例
    async function BlogPost({ id }: { id: string }) {
      const post = await fetchPost(id);
      return <div>{post.title}</div>;
    }
    \`\`\`

    ## パフォーマンスの向上

    Next.js 14では、バンドルサイズの最適化とレンダリング性能の向上が図られています。

    ## まとめ

    Next.js 14の新機能を活用することで、より効率的で高速なWebアプリケーションを構築できます。
  `,
  author: '田中太郎',
  publishedAt: '2024-01-15',
  category: '技術',
  readTime: '5分',
};

export default function BlogPostPage({ params }: PageProps) {
  return (
    <Container size="md" className={styles.container}>
      <Link href="/blog">
        <Button
          leftSection={<IconArrowLeft size={16} />}
          variant="light"
          mb="xl"
        >
          ブログ一覧に戻る
        </Button>
      </Link>

      <article>
        <Group justify="space-between" mb="md">
          <Badge color="blue" variant="light">
            {blogPost.category}
          </Badge>
          <Text size="sm" color="dimmed">
            {blogPost.readTime}
          </Text>
        </Group>

        <Title order={1} className={styles.title}>
          {blogPost.title}
        </Title>

        <Group gap="md" mb="xl">
          <Group gap="xs">
            <IconUser size={16} color="gray" />
            <Text size="sm">{blogPost.author}</Text>
          </Group>
          <Group gap="xs">
            <IconCalendar size={16} color="gray" />
            <Text size="sm">{blogPost.publishedAt}</Text>
          </Group>
        </Group>

        <Divider mb="xl" />

        <div 
          className={styles.content}
          dangerouslySetInnerHTML={{ 
            __html: blogPost.content.replace(/\n/g, '<br>') 
          }}
        />
      </article>
    </Container>
  );
}
