"use client"

import { Card, Stack, Group, Badge, Button, Grid, Image, Title, Text } from "@mantine/core"
import { IconMapPin, IconUsers, IconBriefcase, IconStar } from "@tabler/icons-react"
import regionCardStyles from "./RegionCards.module.css"

const regions = [
  {
    name: "長野県松本市",
    image: "/images/matsumoto-city-with-mountains-and-traditional-buil.jpg",
    description: "アルプスの麓で働く。IT企業の誘致が進み、自然と技術が調和した街。",
    jobs: 45,
    population: "24万人",
    highlights: ["IT企業集積", "自然豊か", "交通便利"],
    rating: 4.8,
  },
  {
    name: "熊本県阿蘇市",
    image: "/images/aso-volcano-and-green-fields-with-modern-facilitie.jpg",
    description: "雄大な阿蘇山の恵みを活かした農業・観光業が盛ん。新しい働き方を実現。",
    jobs: 28,
    population: "2.6万人",
    highlights: ["農業革新", "観光業", "起業支援"],
    rating: 4.6,
  },
  {
    name: "島根県出雲市",
    image: "images/izumo-shrine-and-modern-office-buildings-blend.jpg",
    description: "歴史と革新が融合する街。クリエイティブ産業の拠点として注目。",
    jobs: 32,
    population: "17万人",
    highlights: ["クリエイティブ", "歴史文化", "住みやすさ"],
    rating: 4.7,
  },
]

export function RegionCards() {
  return (
    <Grid gutter="lg" mb={48}>
      {regions.map((region, index) => (
        <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" className={regionCardStyles.regionCard}>
            <Card.Section>
              <div className={regionCardStyles.imageWrapper}>
                <Image
                  src={region.image || "/placeholder.svg"}
                  height={200}
                  alt={region.name}
                  fallbackSrc="/placeholder.svg?height=200&width=400"
                />
                <Badge className={regionCardStyles.ratingBadge} leftSection={<IconStar size={12} />}>
                  {region.rating}
                </Badge>
              </div>
            </Card.Section>

            <Stack gap="md" mt="md">
              <div>
                <Title order={4} mb="xs">
                  {region.name}
                </Title>
                <Text size="sm" c="dimmed">
                  {region.description}
                </Text>
              </div>

              <Grid gutter="sm">
                <Grid.Col span={6}>
                  <Group gap="xs">
                    <IconBriefcase size={16} className={regionCardStyles.iconPrimary} />
                    <Text size="sm">{region.jobs}件の求人</Text>
                  </Group>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Group gap="xs">
                    <IconUsers size={16} className={regionCardStyles.iconSecondary} />
                    <Text size="sm">人口{region.population}</Text>
                  </Group>
                </Grid.Col>
              </Grid>

              <Group gap="xs">
                {region.highlights.map((highlight, idx) => (
                  <Badge key={idx} variant="outline" size="sm">
                    {highlight}
                  </Badge>
                ))}
              </Group>

              <Group gap="sm" mt="xs">
                <Button flex={1} size="sm">
                  求人を見る
                </Button>
                <Button variant="outline" size="sm">
                  <IconMapPin size={16} />
                </Button>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  )
}