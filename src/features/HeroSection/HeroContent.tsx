"use client"

import { Container, Title, Text, Button, Group, Grid, Stack, Paper } from "@mantine/core"
import { IconArrowRight, IconMapPin, IconUsers, IconBriefcase } from "@tabler/icons-react"
import heroContentStyles from "./HeroContent.module.css"
import Link from "next/link"

export function HeroContent() {
  return (
    <Container size="xl" className={heroContentStyles.container}>
      <Grid gutter="xl" align="center">
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Stack gap="xl">
            <Stack gap="md">
              <Title className={heroContentStyles.title}>
                地方と人材を
                <span className={heroContentStyles.highlight}>つなぐ</span>
                プラットフォーム
              </Title>
              <Text size="xl" c="dimmed" className={heroContentStyles.description}>
                あなたの理想の働き方と生活を地方で実現。生活シミュレーション機能で移住前に具体的な生活イメージを描けます。
              </Text>
            </Stack>

            <Group gap="md">
              <Button size="lg" rightSection={<IconArrowRight size={20} />}>
                求人を探す
              </Button>
              <Button size="lg" variant="outline" component={Link} href="/simulate">
                生活シミュレーション
              </Button>
            </Group>

            <Grid gutter="xl" mt="xl">
              <Grid.Col span={4}>
                <Stack align="center" gap="xs">
                  <div className={heroContentStyles.statIcon} style={{ backgroundColor: "var(--mantine-color-green-1)" }}>
                    <IconBriefcase size={24} className={heroContentStyles.iconPrimary} />
                  </div>
                  <Text size="xl" fw={700} className={heroContentStyles.statNumber}>
                    1,200+
                  </Text>
                  <Text size="sm" c="dimmed">
                    求人情報
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={4}>
                <Stack align="center" gap="xs">
                  <div className={heroContentStyles.statIcon} style={{ backgroundColor: "var(--mantine-color-blue-1)" }}>
                    <IconMapPin size={24} className={heroContentStyles.iconSecondary} />
                  </div>
                  <Text size="xl" fw={700} className={heroContentStyles.statNumber}>
                    47
                  </Text>
                  <Text size="sm" c="dimmed">
                    都道府県
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={4}>
                <Stack align="center" gap="xs">
                  <div className={heroContentStyles.statIcon} style={{ backgroundColor: "var(--mantine-color-orange-1)" }}>
                    <IconUsers size={24} className={heroContentStyles.iconAccent} />
                  </div>
                  <Text size="xl" fw={700} className={heroContentStyles.statNumber}>
                    8,500+
                  </Text>
                  <Text size="sm" c="dimmed">
                    登録ユーザー
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 6 }}>
          <div className={heroContentStyles.imageWrapper}>
            <Paper className={heroContentStyles.imagePaper} shadow="xl" radius="lg">
              <img
                src="/images/japanese-countryside-with-modern-office-buildings-.jpg"
                alt="地方で働く人々のイメージ"
                className={heroContentStyles.image}
              />
            </Paper>
          </div>
        </Grid.Col>
      </Grid>
    </Container>
  )
}