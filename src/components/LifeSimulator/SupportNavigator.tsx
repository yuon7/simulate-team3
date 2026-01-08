"use client";

import { useState, useMemo } from "react";
import { Card, Title, Text, Select, Badge, Group, Stack, Alert, Grid, GridCol, Box } from "@mantine/core";
import { IconCoin, IconMapPin, IconInfoCircle, IconBuildingCottage, IconBuildingSkyscraper, IconMap } from "@tabler/icons-react";

// ▼ 2つのデータファイルをインポートして連携させます
import { REGIONS, PREFECTURE_AREAS } from "./supportData"; // 住所選択用
import { CITY_SUPPORT_LIST } from "./supportData2";       // 支援金データ用

export function SupportNavigator() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedPref, setSelectedPref] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // ▼ 1. 地方選択肢
  const prefectureOptions = useMemo(() => {
    if (!selectedRegion) return [];
    const target = REGIONS.find((r) => r.region === selectedRegion);
    return target ? target.prefs : [];
  }, [selectedRegion]);

  // ▼ 2. 都道府県選択肢 -> 地域(エリア)リスト
  const areaOptions = useMemo(() => {
    if (!selectedPref) return [];
    const areas = PREFECTURE_AREAS[selectedPref];
    return areas ? Object.keys(areas) : [];
  }, [selectedPref]);

  // ▼ 3. 地域(エリア)選択肢 -> 市町村リスト
  const cityOptions = useMemo(() => {
    if (!selectedPref || !selectedArea) return [];
    // PREFECTURE_AREAS[県名][エリア名] で市の配列を取得
    return PREFECTURE_AREAS[selectedPref][selectedArea] || [];
  }, [selectedPref, selectedArea]);

  // ▼ 4. 市が選ばれたら、supportData2.ts の巨大リストから検索して合計計算
  const { filteredSupports, totalAmount } = useMemo(() => {
    if (!selectedCity) return { filteredSupports: [], totalAmount: 0 };
    
    // データリストから、選ばれた市(city)と一致するものを抽出
    const supports = CITY_SUPPORT_LIST.filter((item) => item.city === selectedCity);
    
    // 合計金額を計算
    const total = supports.reduce((sum, item) => sum + item.amount, 0);

    return { filteredSupports: supports, totalAmount: total };
  }, [selectedCity]);

  // ▼ リセット処理（親を変えたら子はリセット）
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
            47都道府県・全自治体対応。地域ごとの移住支援金や独自の補助金を検索します。
          </Text>
        </div>

        {/* ▼ 4段階選択エリア */}
        <Box p="md" bg="gray.0" style={{ borderRadius: "8px" }}>
          <Grid align="flex-end">
            <GridCol span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                label="① 地方"
                placeholder="地方を選択"
                data={REGIONS.map((r) => r.region)}
                value={selectedRegion}
                onChange={handleRegionChange}
                leftSection={<IconMapPin size={16} />}
              />
            </GridCol>
            <GridCol span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                label="② 都道府県"
                placeholder={selectedRegion ? "県を選択" : "-"}
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
                placeholder={selectedPref ? "エリアを選択" : "-"}
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
                placeholder={selectedArea ? "市町村を選択" : "-"}
                data={cityOptions}
                value={selectedCity}
                onChange={setSelectedCity}
                disabled={!selectedArea}
                leftSection={<IconBuildingSkyscraper size={16} />}
                searchable // 市が多いので検索可能にしました
              />
            </GridCol>
          </Grid>
        </Box>

        {/* ▼ 結果表示エリア */}
        {selectedCity ? (
          <>
            {filteredSupports.length > 0 ? (
              <>
                <Alert 
                  variant="light" 
                  color="teal" 
                  title={`${selectedPref} ${selectedCity} の支援額試算`} 
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
                    ※制度の適用には条件があります（世帯構成・年齢・就業等）。詳細は自治体HPをご確認ください。
                  </Text>
                </Alert>

                <Stack gap="md">
                  <Text fw={600}>利用可能な制度一覧 ({filteredSupports.length}件)</Text>
                  {filteredSupports.map((item, index) => (
                    <Card key={`${item.city}-${index}`} withBorder padding="sm" radius="md">
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
              // データがない場合の表示
              <Alert color="gray" icon={<IconInfoCircle />}>
                {selectedCity} の詳細な支援金データは現在登録されていません。<br />
                （※一般的な国の移住支援金制度などが利用できる可能性があります）
              </Alert>
            )}
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