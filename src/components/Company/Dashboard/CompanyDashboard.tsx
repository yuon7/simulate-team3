"use client";

import { Container, Title, Grid, Card, Text, Button, Group } from "@mantine/core";
import Link from "next/link";
import styles from "./CompanyDashboard.module.css";
import { ReactNode } from "react";

type CompanyDashboardProps = {
  summary: ReactNode;
};

export function CompanyDashboard({ summary }: CompanyDashboardProps) {
  return (
    <Container size="xl" py="xl" className={styles.container}>
      <Group justify="space-between" mb="xl">
        <Title order={1}>企業ダッシュボード</Title>
        <Button component={Link} href="/company/profile/edit">
          プロフィール編集
        </Button>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder shadow="sm" radius="md" p="lg" mb="lg">
            <Title order={2} size="h3" mb="md">
              企業情報サマリー
            </Title>
            {summary}
          </Card>
          
          {/* Future: Recent Applications */}
          <Card withBorder shadow="sm" radius="md" p="lg">
            <Title order={2} size="h3" mb="md">
              最近の応募
            </Title>
            <Text c="dimmed">現在、新しい応募はありません。</Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          {/* Sidebar / Quick Actions */}
          <Card withBorder shadow="sm" radius="md" p="lg">
            <Title order={3} size="h4" mb="md">クイックメニュー</Title>
            <div className={styles.menuLinks}>
              <Link href="/company/jobs/new" className={styles.link}>求人を作成する</Link>
              <Link href="/company/jobs" className={styles.link}>求人を管理する</Link>
              <Link href="/company/profile/edit" className={styles.link}>会社情報を更新する</Link>
            </div>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
