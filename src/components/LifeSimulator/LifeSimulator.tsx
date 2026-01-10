"use client"
import { LifeSimulation } from "../../features/LifeSimulator/LifeSimulation"
import { useState, useMemo } from "react"
import { Container, Title, Text, Card, Stack, Group, Badge, Button, Grid, GridCol, Paper, Select, NumberInput, Divider } from "@mantine/core"
import {
  IconCalculator,
  IconHome,
  IconCar,
  IconShoppingCart,
  IconTrendingDown,
  IconTrendingUp,
  IconArrowRight,
  IconWallet
} from "@tabler/icons-react"
import simulatorSectionStyles from "./LifeSimulator.module.css"

// ▼ 地域ごとの物価データ
const REGION_DATA: Record<string, { name: string; rentRate: number; foodRate: number; carCost: number }> = {
  tokyo: { name: "東京都", rentRate: 1.0, foodRate: 1.0, carCost: 0 },
  nagano_matsumoto: { name: "長野県松本市", rentRate: 0.55, foodRate: 0.9, carCost: 15000 },
  fukui: { name: "福井県福井市", rentRate: 0.45, foodRate: 0.85, carCost: 15000 },
  hokkaido_sapporo: { name: "北海道札幌市", rentRate: 0.6, foodRate: 0.95, carCost: 10000 },
  miyagi_sendai: { name: "宮城県仙台市", rentRate: 0.65, foodRate: 0.95, carCost: 10000 },
};

export function LifeSimulation() {
  // ▼ ユーザー入力の状態管理
  const [currentRent, setCurrentRent] = useState<number | string>(80000);
  const [currentFood, setCurrentFood] = useState<number | string>(40000);
  const [targetRegionKey, setTargetRegionKey] = useState<string>("nagano_matsumoto");

  // ▼ リアルタイム計算ロジック
  const result = useMemo(() => {
    const rent = typeof currentRent === "number" ? currentRent : 0;
    const food = typeof currentFood === "number" ? currentFood : 0;
    const region = REGION_DATA[targetRegionKey];

    // 移住後のコスト予測
    const newRent = Math.round(rent * region.rentRate);
    const newFood = Math.round(food * region.foodRate);
    const newCar = region.carCost; 

    const totalCurrent = rent + food; 
    const totalNew = newRent + newFood + newCar; 
    const diff = totalCurrent - totalNew; 

    return {
      regionName: region.name,
      costs: [
        { category: "住居費", old: rent, new: newRent, icon: IconHome, rate: region.rentRate },
        { category: "食費", old: food, new: newFood, icon: IconShoppingCart, rate: region.foodRate },
        { category: "交通・車", old: 0, new: newCar, icon: IconCar, isNew: true },
      ],
      totalNew,
      diff,
    };
  }, [currentRent, currentFood, targetRegionKey]);

  return (
    <Container size="lg">
      <Card shadow="md" padding="xl" radius="md" withBorder>
        <Stack gap="xl">
          
          {/* ▼ 入力エリア */}
          <Paper bg="gray.0" p="md" radius="md">
            <Title order={4} mb="md">🛠️ あなたの現在の状況を入力してください</Title>
            <Grid>
              <GridCol span={{ base: 12, sm: 4 }}>
                <NumberInput
                  label="現在の家賃"
                  placeholder="例: 80000"
                  value={currentRent}
                  onChange={setCurrentRent}
                  thousandSeparator
                  leftSection={<IconHome size={16} />}
                  suffix=" 円"
                />
              </GridCol>
              <GridCol span={{ base: 12, sm: 4 }}>
                <NumberInput
                  label="現在の食費（月）"
                  placeholder="例: 40000"
                  value={currentFood}
                  onChange={setCurrentFood}
                  thousandSeparator
                  leftSection={<IconShoppingCart size={16} />}
                  suffix=" 円"
                />
              </GridCol>
              <GridCol span={{ base: 12, sm: 4 }}>
                <Select
                  label="移住したい地域"
                  data={[
                    { value: "nagano_matsumoto", label: "長野県 松本市" },
                    { value: "fukui", label: "福井県 福井市" },
                    { value: "hokkaido_sapporo", label: "北海道 札幌市" },
                    { value: "miyagi_sendai", label: "宮城県 仙台市" },
                  ]}
                  value={targetRegionKey}
                  onChange={(val) => val && setTargetRegionKey(val)}
                  leftSection={<IconCalculator size={16} />}
                />
              </GridCol>
            </Grid>
          </Paper>
          {/* ▼ 結果表示エリア */}
          <div>
             <Group gap="xs" mb="xs" align="center">
              <IconCalculator size={24} className={simulationStyles.primaryIcon} />
              <Title order={3}>{result.regionName} での生活コスト試算</Title>
            </Group>
            
            <Grid gutter="xl" mt="md">
              <GridCol span={{ base: 12, md: 7 }}>
                <Stack gap="md">
                  <Text fw={700} c="dimmed">月々の支出比較</Text>
                  {result.costs.map((item, index) => (
                    <Paper key={index} p="md" withBorder className={simulationStyles.costItem}>
                      <Group justify="space-between">
                        <Group gap="sm">
                          <item.icon size={20} color="gray" />
                          <Text fw={600}>{item.category}</Text>
                        </Group>
                        
                        <Group gap="xl">
                          {!item.isNew && (
                            <Stack gap={0} align="flex-end">
                              <Text size="xs" c="dimmed">現在</Text>
                              <Text size="sm" td="line-through">¥{item.old.toLocaleString()}</Text>
                            </Stack>
                          )}
                          <IconArrowRight size={16} color="gray" />
                          <Stack gap={0} align="flex-end">
                            <Text size="xs" c="teal" fw={700}>移住後</Text>
                            <Text fw={700} size="lg">¥{item.new.toLocaleString()}</Text>
                          </Stack>
                        </Group>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </GridCol>

              <GridCol span={{ base: 12, md: 5 }}>
                <Paper p="xl" radius="md" bg={result.diff > 0 ? "teal.0" : "orange.0"} style={{ height: "100%" }}>
                  <Stack align="center" justify="center" h="100%">
                    <IconWallet size={48} color={result.diff > 0 ? "teal" : "orange"} />
                    <Text fw={600} size="lg">毎月の自由なお金は...</Text>
                    
                    {result.diff > 0 ? (
                      <>
                        <Text span c="teal" fw={900} style={{ fontSize: "2.5rem", lineHeight: 1 }}>
                          +{result.diff.toLocaleString()}
                        </Text>
                        <Text size="sm" c="teal.9">円 増えます！🎉</Text>
                        <Text size="xs" c="dimmed" mt="md">年間で約 {(result.diff * 12).toLocaleString()}円 の余裕が生まれます。</Text>
                      </>
                    ) : (
                      <>
                        <Text span c="orange" fw={900} style={{ fontSize: "2.5rem", lineHeight: 1 }}>
                          {result.diff.toLocaleString()}
                        </Text>
                        <Text size="sm" c="orange.9">円 増えてしまいます💦</Text>
                        <Text size="xs" c="dimmed" mt="md">車の維持費などが影響している可能性があります。</Text>
                      </>
                    )}
                  </Stack>
                </Paper>
              </GridCol>
            </Grid>
          </div>

          <Divider />

          <Group justify="center">
            <Button size="md" color="blue">この地域の求人を見る</Button>
            <Button size="md" variant="default">詳細な条件を設定する</Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  )
}