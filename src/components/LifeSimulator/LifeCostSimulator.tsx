"use client";

import { useState, useMemo } from "react";
import { 
  Title, Text, Card, Stack, Group, Grid, GridCol, 
  Paper, Select, NumberInput, Divider, SegmentedControl, Alert, Badge 
} from "@mantine/core";
import { 
  IconCalculator, IconCar, IconChartBar, IconSnowflake, IconSun, 
  IconDroplet, IconFlame, IconBolt, IconUsers 
} from "@tabler/icons-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

import { REGION_FACTORS, calculateLifeCost } from "@/lib/Simulator/LifeCostLogic";

export function LifeCostSimulator() {
  const [currentRent, setCurrentRent] = useState<number | string>(85000);
  const [currentFood, setCurrentFood] = useState<number | string>(45000);
  const [currentElec, setCurrentElec] = useState<number | string>(8000);
  const [currentGas, setCurrentGas] = useState<number | string>(5000);
  const [currentWater, setCurrentWater] = useState<number | string>(4000);
  const [targetRegionKey, setTargetRegionKey] = useState<string>("nagano");
  const [familySize, setFamilySize] = useState("1");
  const [hasCar, setHasCar] = useState("no");
  const [gasType, setGasType] = useState("city");
  const result = useMemo(() => {
    return calculateLifeCost({
      currentRent: Number(currentRent),
      currentFood: Number(currentFood),
      currentElec: Number(currentElec),
      currentGas: Number(currentGas),
      currentWater: Number(currentWater),
      targetRegionKey,
      familySize: Number(familySize),
      hasCar: hasCar === "yes",
      gasType: gasType as 'city' | 'propane'
    });
  }, [currentRent, currentFood, currentElec, currentGas, currentWater, targetRegionKey, familySize, hasCar, gasType]);

  return (
    <Card shadow="md" padding="xl" radius="md" withBorder>
      <Stack gap="xl">
        <Group>
          <IconCalculator size={28} />
          <div>
            <Title order={3}>高精度・生活収支シミュレーター</Title>
            <Text c="dimmed" size="sm">
              現在の生活費と照らし合わせ、移住後の「リアルな収支」を算出します。
            </Text>
          </div>
        </Group>
        
        <Grid>
          {/* ▼ 左側：入力パネル */}
          <GridCol span={{ base: 12, md: 4 }}>
            <Paper bg="gray.0" p="md" radius="md" h="100%">
              <Stack gap="sm">
                <Badge color="blue" variant="light" fullWidth>Step 1: 現在の基礎支出</Badge>
                <NumberInput
                  label="家賃" leftSection={<IconUsers size={16} />}
                  value={currentRent} onChange={setCurrentRent} thousandSeparator suffix=" 円"
                />
                <NumberInput
                  label="食費" leftSection={<IconCalculator size={16} />}
                  value={currentFood} onChange={setCurrentFood} thousandSeparator suffix=" 円"
                />
                <Text size="xs" fw={700} mt="xs">現在の光熱費 (月平均)</Text>
                <Group gap="xs" grow>
                  <NumberInput 
                    placeholder="電気" leftSection={<IconBolt size={14} />} 
                    value={currentElec} onChange={setCurrentElec} thousandSeparator 
                  />
                  <NumberInput 
                    placeholder="ガス" leftSection={<IconFlame size={14} />} 
                    value={currentGas} onChange={setCurrentGas} thousandSeparator 
                  />
                  <NumberInput 
                    placeholder="水道" leftSection={<IconDroplet size={14} />} 
                    value={currentWater} onChange={setCurrentWater} thousandSeparator 
                  />
                </Group>

                <Divider my="xs" />

                <Badge color="teal" variant="light" fullWidth>Step 2: 移住先の条件</Badge>
                <Select
                  label="候補地域（気候モデル）"
                  data={Object.keys(REGION_FACTORS).map(key => ({ 
                    value: key, label: REGION_FACTORS[key].name 
                  }))}
                  value={targetRegionKey}
                  onChange={(val) => val && setTargetRegionKey(val)}
                />
                
                <Text size="sm" fw={500} mt="xs">世帯人数</Text>
                <SegmentedControl
                  value={familySize} onChange={setFamilySize}
                  data={[
                    { label: '1人', value: '1' },
                    { label: '2人', value: '2' },
                    { label: '3人~', value: '3' },
                  ]}
                />

                <Text size="sm" fw={500} mt="xs">🚗 車の所有（地方必須）</Text>
                <SegmentedControl
                  value={hasCar} onChange={setHasCar} fullWidth
                  color={hasCar === "yes" ? "blue" : "gray"}
                  data={[
                    { label: 'なし', value: 'no' },
                    { label: 'あり', value: 'yes' },
                  ]}
                />

                <Text size="sm" fw={500} mt="xs">🔥 ガスの種類</Text>
                <SegmentedControl
                  value={gasType} onChange={setGasType} fullWidth
                  color={gasType === "propane" ? "orange" : "gray"}
                  data={[
                    { label: '都市ガス', value: 'city' },
                    { label: 'プロパン', value: 'propane' },
                  ]}
                />
              </Stack>
            </Paper>
          </GridCol>

          {/* ▼ 右側：結果表示エリア */}
          <GridCol span={{ base: 12, md: 8 }}>
            <Stack h="100%" justify="space-between">
              <Paper p="md" radius="md" bg={result.diff > 0 ? "teal.0" : "red.0"} withBorder>
                <Group justify="space-between" align="center">
                  <div>
                    <Text size="sm" fw={700} c="dimmed">現在との月額収支差</Text>
                    <Group align="flex-end" gap="xs">
                      <Text size="xl" fw={900} c={result.diff > 0 ? "teal" : "red"}>
                        {result.diff > 0 ? "浮くお金" : "足が出るお金"}
                      </Text>
                      <Text 
                        size="2.5rem" 
                        fw={900} 
                        c={result.diff > 0 ? "teal" : "red"} 
                        style={{ lineHeight: 1 }}
                      >
                        {Math.abs(result.diff).toLocaleString()}
                      </Text>
                      <Text size="lg" fw={700}>円 / 月</Text>
                    </Group>
                  </div>
                  <Stack gap={0} align="flex-end">
                    <Text size="xs">移住後の平均月コスト</Text>
                    <Text fw={700} size="lg">{result.avgMonthly.toLocaleString()}円</Text>
                  </Stack>
                </Group>
              </Paper>
              <div style={{ flex: 1, minHeight: "350px" }}>
                <Text fw={700} mb="sm" size="sm">
                  <IconChartBar size={16} style={{ verticalAlign: 'middle' }} /> 年間の支出変動シミュレーション
                </Text>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={result.monthlyData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip 
                      formatter={(value: number | string | undefined) => {
                        if (value === null) return "";
                        const num = typeof value === "number" ? value : Number(value);
                        return Number.isNaN(num) ? "" : `${num.toLocaleString()}円`;
                      }}
                      labelStyle={{ color: "#333" }}
                    />
                    <Legend />
                    <Bar dataKey="住居費" stackId="a" fill="#4dabf7" />
                    <Bar dataKey="食費" stackId="a" fill="#69db7c" />
                    <Bar dataKey="車・交通" stackId="a" fill="#ffc078" />
                    <Bar dataKey="水道光熱・雪" stackId="a" fill="#ff8787" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <Stack gap="xs">
                {result.region.isSnowy && (
                  <Alert variant="light" color="blue" title="❄️ 積雪地域のアドバイス" icon={<IconSnowflake />}>
                    <Text size="xs">
                      12月〜3月は暖房（灯油・電気）と除雪費用により、光熱費が夏場の2倍近くになる想定です。冬のコスト増に備えましょう。
                    </Text>
                  </Alert>
                )}
                {result.region.climate === 'warm' && (
                  <Alert variant="light" color="orange" title="☀️ 温暖地域のアドバイス" icon={<IconSun />}>
                    <Text size="xs">
                      冬の光熱費は抑えられますが、夏場（特に7〜9月）の冷房費が高くなる傾向があります。
                    </Text>
                  </Alert>
                )}
                {hasCar === "yes" && (
                  <Alert variant="light" color="gray" title="🚗 車の維持費について" icon={<IconCar />}>
                    <Text size="xs">
                      月々約3.5〜5万円（ローン・保険・税金・車検・ガソリン）を見込んでいます。地方生活の命綱ですが、大きな固定費となります。
                    </Text>
                  </Alert>
                )}
              </Stack>
            </Stack>
          </GridCol>
        </Grid>
      </Stack>
    </Card>
  );
}