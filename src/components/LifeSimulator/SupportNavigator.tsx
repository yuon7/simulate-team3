"use client";

import { useState, useMemo } from "react";
import { Card, Title, Text, Select, Badge, Group, Stack, Alert, Grid, GridCol, Box } from "@mantine/core";
import { IconCoin, IconMapPin, IconInfoCircle, IconBuildingCottage, IconBuildingSkyscraper } from "@tabler/icons-react";
import { REGIONS, PREFECTURAL_CAPITALS, getSupportsForCity } from "./supportData";

export function SupportNavigator() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedPref, setSelectedPref] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null); // 追加

  // ▼ 1. 地方が選ばれたら、その中の都道府県リストを出す
  const prefectureOptions = useMemo(() => {
    if (!selectedRegion) return [];
    const target = REGIONS.find((r) => r.region === selectedRegion);
    return target ? target.prefs : [];
  }, [selectedRegion]);

  // ▼ 2. 都道府県が選ばれたら、その中の都市リスト（県庁所在地）を出す
  const cityOptions = useMemo(() => {
    if (!selectedPref) return [];
    return PREFECTURAL_CAPITALS[selectedPref] || [];
  }, [selectedPref]);

  // ▼ 3. 都市まで選ばれたら、支援データを生成して合計する
  const { filteredSupports, totalAmount } = useMemo(() => {
    if (!selectedPref || !selectedCity) return { filteredSupports: [], totalAmount: 0 };
    
    // 都市名を渡してデータを取得
    const supports = getSupportsForCity(selectedPref, selectedCity);
    const total = supports.reduce((sum, item) => sum + item.amount, 0);

    return { filteredSupports: supports, totalAmount: total };
  }, [selectedPref, selectedCity]);

  // ▼ リセット処理
  const handleRegionChange = (val: string | null) => {
    setSelectedRegion(val);
    setSelectedPref(null);
    setSelectedCity(null);
  };

  const handlePrefChange = (val: string | null) => {
    setSelectedPref(val);
    setSelectedCity(null);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="lg">
        <div>
          <Title order={4} mb="xs">🧭 支援制度ナビ</Title>
          <Text c="dimmed" size="sm">
            47都道府県・主要都市対応。地域ごとの移住支援金や、独自の補助金を試算します。
          </Text>
        </div>

        {/* ▼ 3段階選択エリア */}
        <Box p="md" bg="gray.0" style={{ borderRadius: "8px" }}>
          <Grid align="flex-end">
            <GridCol span={{ base: 12, sm: 4 }}>
              <Select
                label="① 地方を選択"
                placeholder="例：関東"
                data={REGIONS.map((r) => r.region)}
                value={selectedRegion}
                onChange={handleRegionChange}
                leftSection={<IconMapPin size={16} />}
              />
            </GridCol>
            <GridCol span={{ base: 12, sm: 4 }}>
              <Select
                label="② 都道府県を選択"
                placeholder={selectedRegion ? "都道府県" : "地方を選んでください"}
                data={prefectureOptions}
                value={selectedPref}
                onChange={handlePrefChange}
                disabled={!selectedRegion}
                leftSection={<IconBuildingCottage size={16} />}
              />
            </GridCol>
            <GridCol span={{ base: 12, sm: 4 }}>
              <Select
                label="③ 都市を選択"
                placeholder={selectedPref ? "都市を選択" : "県を選んでください"}
                data={cityOptions}
                value={selectedCity}
                onChange={setSelectedCity}
                disabled={!selectedPref}
                leftSection={<IconBuildingSkyscraper size={16} />}
              />
            </GridCol>
          </Grid>
        </Box>
        {/* ▼ 結果表示エリア（都市まで選んだら表示） */}
        {selectedCity ? (
          <>
            <Alert 
              variant="light" 
              color="teal" 
              title={`${selectedPref} ${selectedCity} の支援額試算（最大）`} 
              icon={<IconCoin />}
              radius="md"
            >
              <Group align="flex-end" gap="xs">
                <Text size="xl" fw={700} c="teal">最大</Text>
                <Text size="3rem" fw={900} c="teal" style={{ lineHeight: 1 }}>
                  {(totalAmount / 10000).toLocaleString()}
                </Text>
                <Text size="xl" fw={700} c="teal">万円</Text>
              </Group>
              <Text size="xs" mt="sm">
                ※世帯構成や就業条件により変動します。
              </Text>
            </Alert>

            <Stack gap="md">
              <Text fw={600}>利用可能な制度一覧 ({filteredSupports.length}件)</Text>
              {filteredSupports.map((item) => (
                <Card key={item.id} withBorder padding="sm" radius="md">
                  <Group justify="space-between" align="start" wrap="nowrap">
                    <Stack gap="xs" style={{ flex: 1 }}>
                      <Group gap="xs">
                        <Badge color="blue" variant="light">{item.category}</Badge>
                        <Text fw={600} size="sm">{item.title}</Text>
                      </Group>
                      <Text size="xs" c="dimmed">{item.description}</Text>
                    </Stack>
                    <Badge size="lg" color="green" variant="outline">
                      {item.amount.toLocaleString()}円
                    </Badge>
                  </Group>
                </Card>
              ))}
            </Stack>
          </>
        ) : (
          <Alert color="gray" icon={<IconInfoCircle />}>
            上部から地域・都道府県・都市を選択すると、支援制度と金額が表示されます。
          </Alert>
        )}
      </Stack>
    </Card>
  );
}