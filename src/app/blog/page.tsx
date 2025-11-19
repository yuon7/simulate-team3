"use client";
import { Container, Title, Grid, Text, Group, Button } from '@mantine/core';
import {IconArrowRight } from '@tabler/icons-react';
import BlogCard from '@/components/BlogCard/BlogCard';
import styles from './blog.module.css';

// サンプルデータ
const blogPosts = [
  {
    id: 1,
    title: 'Next.js 14の新機能を試してみた',
    excerpt: 'App Routerの改善点とServer Componentsの使い方について解説します。',
    author: '田中太郎',
    date: '2024-01-15',
    category: '技術',
    readTime: '5分',
    image: '/api/placeholder/400/200',
  },
  {
    id: 2,
    title: 'TypeScriptで型安全なAPI設計',
    excerpt: 'PrismaとHonoを使った型安全なバックエンド開発のベストプラクティス。',
    author: '佐藤花子',
    date: '2024-01-10',
    category: '開発',
    readTime: '8分',
    image: '/api/placeholder/400/200',
  },
  {
    id: 3,
    title: 'Mantine UIで美しいフォームを作る',
    excerpt: 'バリデーション機能付きのフォームコンポーネントの実装方法。',
    author: '山田次郎',
    date: '2024-01-05',
    category: 'UI/UX',
    readTime: '6分',
    image: '/api/placeholder/400/200',
  },
];

export default function BlogPage() {
  return (
    <Container size="lg" className={styles.container}>
      <Title order={1} className={styles.title}>
        ブログ
      </Title>
      <Text size="lg" color="dimmed" mb="xl">
        最新の技術記事や開発のコツをお届けします
      </Text>

      <Grid>
        {blogPosts.map((post) => (
          <Grid.Col key={post.id} span={{ base: 12, md: 6, lg: 4 }}>
            <BlogCard {...post} />
          </Grid.Col>
        ))}
      </Grid>

      <Group justify="center" mt="xl">
        <Button rightSection={<IconArrowRight size={16} />} size="lg">
          もっと見る
        </Button>
      </Group>
    </Container>
  );
}
