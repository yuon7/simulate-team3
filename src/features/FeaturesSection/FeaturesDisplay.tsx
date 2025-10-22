"use client"

import { Card, Stack, Grid, Title, Text } from "@mantine/core"
import { IconCalculator, IconMapPin, IconUsers, IconTrendingUp, IconHeart, IconShield } from "@tabler/icons-react"
import displayStyles from "./FeaturesDisplay.module.css"

const features = [
  {
    icon: IconCalculator,
    title: "生活シミュレーション",
    description: "移住前に生活コストや環境を詳細にシミュレーション。期待と現実のギャップを解消します。",
    color: "green",
  },
  {
    icon: IconMapPin,
    title: "地域特化求人",
    description: "全国47都道府県の地方企業・団体の求人情報を網羅。あなたに最適な働く場所を見つけます。",
    color: "blue",
  },
  {
    icon: IconUsers,
    title: "AIマッチング",
    description: "あなたのスキルや希望条件をもとに、AIが最適な求人と地域をおすすめします。",
    color: "orange",
  },
  {
    icon: IconTrendingUp,
    title: "キャリア支援",
    description: "地方でのキャリア形成をサポート。スキルアップ研修や転職相談も充実しています。",
    color: "violet",
  },
  {
    icon: IconHeart,
    title: "定着支援",
    description: "移住後の生活サポートも万全。地域コミュニティとの繋がりづくりをお手伝いします。",
    color: "pink",
  },
  {
    icon: IconShield,
    title: "安心保証",
    description: "移住に関する不安や疑問に24時間対応。専門スタッフがしっかりサポートします。",
    color: "teal",
  },
]

export function FeaturesDisplay() {
  return (
    <Grid gutter="lg">
      {features.map((feature, index) => (
        <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" className={displayStyles.featureCard}>
            <Stack gap="md">
              <div className={displayStyles.iconWrapper} data-color={feature.color}>
                <feature.icon size={24} />
              </div>
              <div>
                <Title order={4} mb="xs">
                  {feature.title}
                </Title>
                <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                  {feature.description}
                </Text>
              </div>
            </Stack>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  )
}