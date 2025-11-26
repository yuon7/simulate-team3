"use client"

import { Container, Title, Text, Card, Stack, Group, Badge, Button, Grid, GridCol, Paper } from "@mantine/core"
import {
  IconCalculator,
  IconHome,
  IconCar,
  IconShoppingCart,
  IconHeart,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react"
import simulationStyles from "./LifeSimulation.module.css"

const simulationData = {
  location: "長野県松本市",
  salary: "500万円",
  costs: [
    { category: "住居費", amount: 60000, icon: IconHome, trend: "down", comparison: "東京比 -65%" },
    { category: "交通費", amount: 15000, icon: IconCar, trend: "down", comparison: "東京比 -40%" },
    { category: "食費", amount: 45000, icon: IconShoppingCart, trend: "down", comparison: "東京比 -20%" },
    { category: "娯楽費", amount: 25000, icon: IconHeart, trend: "up", comparison: "東京比 +15%" },
  ],
  totalMonthlyCost: 145000,
  disposableIncome: 270000,
  qualityOfLife: {
    commute: "15分",
    nature: "豊富",
    community: "活発",
    workLife: "良好",
  },
}

export function LifeSimulation() {
  return (
    <Container size="lg">
      <Card shadow="md" padding="xl" radius="md">
        <Stack gap="xl">
          <div>
            <Group gap="xs" mb="xs">
              <IconCalculator size={20} className={simulationStyles.primaryIcon} />
              <Title order={3}>{simulationData.location}での生活シミュレーション結果</Title>
            </Group>
            <Group gap="md">
              <Text size="sm" c="dimmed">
                想定年収: {simulationData.salary}
              </Text>
              <Badge variant="light">Webエンジニア</Badge>
            </Group>
          </div>

          <Grid gutter="xl">
            {/* Grid.Col を GridCol に変更 */}
            <GridCol span={{ base: 12, md: 6 }}>
              <Stack gap="lg">
                <div>
                  <Title order={4} mb="md">
                    月間生活費内訳
                  </Title>
                  <Stack gap="sm">
                    {simulationData.costs.map((cost, index) => (
                      <Paper key={index} p="md" className={simulationStyles.costItem}>
                        <Group justify="space-between">
                          <Group gap="sm">
                            <cost.icon size={18} className={simulationStyles.icon} />
                            <Text size="sm" fw={500}>
                              {cost.category}
                            </Text>
                          </Group>
                          <div style={{ textAlign: "right" }}>
                            <Text fw={600}>¥{cost.amount.toLocaleString()}</Text>
                            <Group gap={4} justify="flex-end">
                              {cost.trend === "down" ? (
                                <IconTrendingDown size={14} className={simulationStyles.trendDown} />
                              ) : (
                                <IconTrendingUp size={14} className={simulationStyles.trendUp} />
                              )}
                              <Text size="xs" c={cost.trend === "down" ? "green" : "orange"}>
                                {cost.comparison}
                              </Text>
                            </Group>
                          </div>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                </div>

                <Paper p="lg" className={simulationStyles.incomeCard}>
                  <Group justify="space-between" mb="xs">
                    <Text fw={600}>月間可処分所得</Text>
                    <Text size="xl" fw={700} className={simulationStyles.incomeAmount}>
                      ¥{simulationData.disposableIncome.toLocaleString()}
                    </Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    東京と比較して約8万円の余裕が生まれます
                  </Text>
                </Paper>
              </Stack>
            </GridCol>

            {/* Grid.Col を GridCol に変更 */}
            <GridCol span={{ base: 12, md: 6 }}>
              <Stack gap="lg">
                <div>
                  <Title order={4} mb="md">
                    生活の質指標
                  </Title>
                  <Grid gutter="sm">
                    <GridCol span={6}>
                      <Paper p="md" className={simulationStyles.qualityItem}>
                        <Text size="sm" c="dimmed" mb={4}>
                          通勤時間
                        </Text>
                        <Text fw={600} className={simulationStyles.qualityValue}>
                          {simulationData.qualityOfLife.commute}
                        </Text>
                      </Paper>
                    </GridCol>
                    <GridCol span={6}>
                      <Paper p="md" className={simulationStyles.qualityItem}>
                        <Text size="sm" c="dimmed" mb={4}>
                          自然環境
                        </Text>
                        <Text fw={600} className={simulationStyles.qualityValue}>
                          {simulationData.qualityOfLife.nature}
                        </Text>
                      </Paper>
                    </GridCol>
                    <GridCol span={6}>
                      <Paper p="md" className={simulationStyles.qualityItem}>
                        <Text size="sm" c="dimmed" mb={4}>
                          コミュニティ
                        </Text>
                        <Text fw={600} className={simulationStyles.qualityValue}>
                          {simulationData.qualityOfLife.community}
                        </Text>
                      </Paper>
                    </GridCol>
                    <GridCol span={6}>
                      <Paper p="md" className={simulationStyles.qualityItem}>
                        <Text size="sm" c="dimmed" mb={4}>
                          ワークライフ
                        </Text>
                        <Text fw={600} className={simulationStyles.qualityValue}>
                          {simulationData.qualityOfLife.workLife}
                        </Text>
                      </Paper>
                    </GridCol>
                  </Grid>
                </div>

                <Paper p="lg" className={simulationStyles.benefitsCard}>
                  <Title order={5} mb="sm" c="teal">
                    移住メリット
                  </Title>
                  <Stack gap={4}>
                    <Text size="sm" c="dimmed">
                      • 住居費が大幅に削減できます
                    </Text>
                    <Text size="sm" c="dimmed">
                      • 通勤ストレスが軽減されます
                    </Text>
                    <Text size="sm" c="dimmed">
                      • 自然豊かな環境で生活できます
                    </Text>
                    <Text size="sm" c="dimmed">
                      • 地域コミュニティとの繋がりが深まります
                    </Text>
                  </Stack>
                </Paper>
              </Stack>
            </GridCol>
          </Grid>

          <Group gap="md" pt="md" style={{ borderTop: "1px solid var(--mantine-color-gray-3)" }}>
            <Button flex={1}>この条件で求人を探す</Button>
            <Button variant="outline">条件を変更してシミュレーション</Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  )
}