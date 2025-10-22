// src/app/simulate/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import styles from './simulate.module.css';
import { Container, SimpleGrid, Card, Text, Title, Button, Group } from '@mantine/core';

export const metadata: Metadata = {
  title: 'Simulate — 地方移住シミュレーション',
  description: '地方に移住したあとの暮らしを想像するシミュレーションページ',
};

export default function SimulatePage() {
  return (
    <main className={styles.root}>
      <Container size="lg" py="xl">
        {/* header */}
        <Group justify="space-between" align="flex-end" mb="md">
          <div>
            <Title order={2}>地方移住シミュレーション</Title>
            <Text color="dimmed" size="sm">
              条件を入力して、移住後の生活スタイルをシミュレーションしてみましょう。
              （機能はこれから実装します。まずはページ構成を用意します）
            </Text>
          </div>

          <div>
            <Link href="/profile">
              <Button variant="outline" size="sm">自分のプロフィールを見る</Button>
            </Link>
          </div>
        </Group>

        {/* layout */}
        <SimpleGrid cols={2} spacing="xl" verticalSpacing='md'>
          {/* left */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="xs">入力パネル（準備中）</Title>
            <Text size="sm" color="dimmed" mb="md">
              ここに「職業」「家族構成」「予算」「好きな休日の過ごし方」などの入力フォームを置きます。
            </Text>

            <div className={styles.placeholder}>
              {/* ⚠️ ここは Text の align prop を使わず sx で代替 */}
              <Text style={{ textAlign: 'center' }} color="dimmed">フォームコンポーネントをここに追加します</Text>
            </div>

            <Group justify="space-between" mt="md">
              <Button disabled>シミュレーション開始（実装中）</Button>
              <Button variant="subtle" size="xs">テンプレセットを読み込む</Button>
            </Group>
          </Card>

          {/* right */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="xs">シミュレーション結果（プレビュー）</Title>
            <Text size="sm" color="dimmed" mb="md">
              シミュレーションを実行するとここに生活プランや推定支出が表示されます。
            </Text>

            <div className={styles.resultPlaceholder}>
              <Text style={{ textAlign: 'center' }} color="dimmed">結果プレビューはここに表示されます</Text>
            </div>

            <Group justify="flex-end" mt="md">
              <Button variant="outline" disabled>PDFで保存（実装中）</Button>
            </Group>
          </Card>
        </SimpleGrid>
      </Container>
    </main>
  );
}
