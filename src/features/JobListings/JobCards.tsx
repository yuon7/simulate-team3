"use client"

import { Grid, Card, Badge, Group, Button, Stack, Title, Text } from "@mantine/core"
import { IconMapPin, IconBuilding, IconCurrencyYen, IconArrowRight } from "@tabler/icons-react"
import jobCardStyles from "./JobCards.module.css"

const jobListings = [
  {
    id: 1,
    title: "Webエンジニア",
    company: "株式会社地方テック",
    location: "長野県松本市",
    type: "正社員",
    salary: "400-600万円",
    tags: ["リモートワーク可", "フレックス", "住宅補助"],
    description: "地方発のスタートアップで最新技術を使った開発に携われます。",
  },
  {
    id: 2,
    title: "マーケティング担当",
    company: "農業法人グリーンファーム",
    location: "熊本県阿蘇市",
    type: "正社員",
    salary: "350-500万円",
    tags: ["未経験歓迎", "研修充実", "移住支援"],
    description: "地域の農産物を全国に届けるマーケティング戦略を企画・実行。",
  },
  {
    id: 3,
    title: "UI/UXデザイナー",
    company: "地域創生デザイン",
    location: "島根県出雲市",
    type: "正社員",
    salary: "380-550万円",
    tags: ["クリエイティブ", "地域貢献", "副業OK"],
    description: "地域の魅力を伝えるデジタルコンテンツのデザインを担当。",
  },
  {
    id: 4,
    title: "プロジェクトマネージャー",
    company: "観光開発株式会社",
    location: "沖縄県石垣市",
    type: "正社員",
    salary: "450-700万円",
    tags: ["マネジメント", "観光業界", "英語活用"],
    description: "持続可能な観光開発プロジェクトの企画・運営を統括。",
  },
]

export function JobCards() {
  return (
    <Grid gutter="lg" mb={48}>
      {jobListings.map((job) => (
        <Grid.Col key={job.id} span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" className={jobCardStyles.jobCard}>
            <Stack gap="md">
              <Group justify="space-between" align="flex-start">
                <Title order={4}>{job.title}</Title>
                <Badge variant="light" color="blue">
                  {job.type}
                </Badge>
              </Group>

              <Stack gap="xs">
                <Group gap="xs">
                  <IconBuilding size={16} className={jobCardStyles.icon} />
                  <Text size="sm" c="dimmed">
                    {job.company}
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconMapPin size={16} className={jobCardStyles.icon} />
                  <Text size="sm" c="dimmed">
                    {job.location}
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconCurrencyYen size={16} className={jobCardStyles.icon} />
                  <Text size="sm" c="dimmed">
                    {job.salary}
                  </Text>
                </Group>
              </Stack>

              <Text size="sm" c="dimmed">
                {job.description}
              </Text>

              <Group gap="xs">
                {job.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" size="sm">
                    {tag}
                  </Badge>
                ))}
              </Group>

              <Group gap="sm" mt="md">
                <Button flex={1} rightSection={<IconArrowRight size={16} />}>
                  詳細を見る
                </Button>
                <Button variant="outline">生活シミュレーション</Button>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  )
}