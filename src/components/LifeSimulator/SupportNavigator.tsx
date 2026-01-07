"use client";

import { useState, useMemo } from "react";
import { Card, Title, Text, Select, Badge, Group, Stack, Alert, Grid, GridCol, Box } from "@mantine/core";
import { IconCoin, IconMapPin, IconInfoCircle, IconBuildingCottage, IconBuildingSkyscraper, IconMap } from "@tabler/icons-react";

// PREFECTURE_AREAS という新しい定数名でインポート
import { REGIONS, PREFECTURE_AREAS, getSupportsForCity } from "./supportData";

export function SupportNavigator() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedPref, setSelectedPref] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null); // 追加：県内エリア（道央など）
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // ▼ 1. 地方が選ばれたら、その中の都道府県リストを出す
  const prefectureOptions = useMemo(() => {
    if (!selectedRegion) return [];
    const target = REGIONS.find((r) => r.region === selectedRegion);
    return target ? target.prefs : [];
  }, [selectedRegion]);

  // ▼ 2. 都道府県が選ばれたら、その中の「地域（エリア）」リストを出す
  // (PREFECTURE_AREASのキーを取り出します)
  const areaOptions = useMemo(() => {
    if (!selectedPref) return [];
    const areas = PREFECTURE_AREAS[selectedPref];
    return areas ? Object.keys(areas) : [];
  }, [selectedPref]);

  // ▼ 3. 地域（エリア）が選ばれたら、その中の「市」リストを出す
  const cityOptions = useMemo(() => {
    if (!selectedPref || !selectedArea) return [];
    return PREFECTURE_AREAS[selectedPref][selectedArea] || [];
  }, [selectedPref, selectedArea]);

  // ▼ 4. 都市まで選ばれたら、支援データを生成して合計する
  const { filteredSupports, totalAmount } = useMemo(() => {
    if (!selectedPref || !selectedCity) return { filteredSupports: [], totalAmount: 0 };
    
    // 都市名を渡してデータを取得
    const supports = getSupportsForCity(selectedPref, selectedCity);
    const total = supports.reduce((sum, item) => sum + item.amount, 0);

    return { filteredSupports: supports, totalAmount: total };
  }, [selectedPref, selectedCity]);

  // ▼ リセット処理系
  const handleRegionChange = (val: string | null) => {
    setSelectedRegion(val);
    setSelectedPref(null);
    setSelectedArea(null);
    setSelectedCity(null);
  };

  const handlePrefChange = (val: string | null) => {
    setSelectedPref(val);
    setSelectedArea(null);
    setSelectedCity(null);
  };

  const handleAreaChange = (val: string | null) => {
    setSelectedArea(val);
    setSelectedCity(null);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="lg">
        <div>
          <Title order={4} mb="xs">🧭 支援制度ナビ</Title>
          <Text c="dimmed" size="sm">
            47都道府県・全域対応。地域ごとの移住支援金や、独自の補助金を試算します。
          </Text>
        </div>

        {/* ▼ 4段階選択エリア */}
        <Box p="md" bg="gray.0" style={{ borderRadius: "8px" }}>
          <Grid align="flex-end">
            <GridCol span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                label="① 地方"
                placeholder="地方"
                data={REGIONS.map((r) => r.region)}
                value={selectedRegion}
                onChange={handleRegionChange}
                leftSection={<IconMapPin size={16} />}
              />
            </GridCol>
            <GridCol span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                label="② 都道府県"
                placeholder={selectedRegion ? "都道府県" : "-"}
                data={prefectureOptions}
                value={selectedPref}
                onChange={handlePrefChange}
                disabled={!selectedRegion}
                leftSection={<IconBuildingCottage size={16} />}
              />
            </GridCol>
            <GridCol span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                label="③ 地域"
                placeholder={selectedPref ? "地域(エリア)" : "-"}
                data={areaOptions}
                value={selectedArea}
                onChange={handleAreaChange}
                disabled={!selectedPref}
                leftSection={<IconMap size={16} />}
              />
            </GridCol>
            <GridCol span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                label="④ 都市"
                placeholder={selectedArea ? "市町村" : "-"}
                data={cityOptions}
                value={selectedCity}
                onChange={setSelectedCity}
                disabled={!selectedArea}
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
            上部から場所を選択すると、支援制度と金額が表示されます。
          </Alert>
        )}
      </Stack>
    </Card>
  );
}