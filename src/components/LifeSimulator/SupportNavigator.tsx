"use client";

import { useState, useMemo } from "react";
import { Card, Title, Text, Select, Button, Badge, Group, Stack, ThemeIcon, Alert } from "@mantine/core";
import { IconCoin, IconMapPin, IconInfoCircle, IconCheck } from "@tabler/icons-react";

// データはここに「直書き」
// 数字(amount)を持たせて計算
const SUPPORT_DATA = [
  {
    id: 1,
    region: "nagano_matsumoto",
    title: "松本市移住支援金",
    amount: 1000000,
    category: "移住支援",
    description: "東京圏から移住し、就業・起業した方に最大100万円を支給。",
  },
  {
    id: 2,
    region: "nagano_matsumoto",
    title: "三世代同居等推進事業補助金",
    amount: 300000,
    category: "住宅",
    description: "親世帯と同居するための改修工事費用を一部補助。",
  },
  {
    id: 3,
    region: "fukui",
    title: "ふくい移住支援金",
    amount: 1000000,
    category: "移住支援",
    description: "全国トップクラスの支援額。条件を満たせば単身でも60万円支給。",
  },
  {
    id: 4,
    region: "fukui",
    title: "結婚新生活支援事業",
    amount: 600000,
    category: "結婚",
    description: "新婚世帯の引越し費用や家賃を最大60万円まで補助。",
  },
  {
    id: 5,
    region: "hokkaido_sapporo",
    title: "UIJターン新規就業支援",
    amount: 600000,
    category: "就業",
    description: "道外からの移住で、対象企業に就職した場合に移転費用を補助。",
  },
];

export function SupportNavigator() {
  const [region, setRegion] = useState<string | null>("nagano_matsumoto");

  // ▼ 2. 選んだ地域に合わせてデータをフィルタリング＆合計計算
  const { filteredSupports, totalAmount } = useMemo(() => {
    if (!region) return { filteredSupports: [], totalAmount: 0 };

    const filtered = SUPPORT_DATA.filter((item) => item.region === region);
    const total = filtered.reduce((sum, item) => sum + item.amount, 0);

    return { filteredSupports: filtered, totalAmount: total };
  }, [region]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="lg">
        <div>
          <Title order={4} mb="xs">🧭 支援制度ナビ</Title>
          <Text c="dimmed" size="sm">
            地域を選択すると、利用可能な支援制度と「最大受給額」を試算します。
          </Text>
        </div>

        {/* 地域選択 */}
        <Select
          label="移住検討先の地域"
          placeholder="地域を選択してください"
          data={[
            { value: "nagano_matsumoto", label: "長野県 松本市" },
            { value: "fukui", label: "福井県 福井市" },
            { value: "hokkaido_sapporo", label: "北海道 札幌市" },
            { value: "miyagi_sendai", label: "宮城県 仙台市" },
          ]}
          value={region}
          onChange={setRegion}
          leftSection={<IconMapPin size={16} />}
        />

        {/* ▼ 3. 合計金額（数字）をドーンと表示 */}
        {region && filteredSupports.length > 0 ? (
          <>
            <Alert variant="light" color="teal" title="受給可能な最大金額（試算）" icon={<IconCoin />}>
              <Group align="flex-end" gap="xs">
                <Text size="xl" fw={700} c="teal">
                  最大
                </Text>
                <Text size="3rem" fw={900} c="teal" style={{ lineHeight: 1 }}>
                  {(totalAmount / 10000).toLocaleString()}
                </Text>
                <Text size="xl" fw={700} c="teal">
                  万円
                </Text>
              </Group>
              <Text size="xs" mt="sm">
                ※条件をすべて満たした場合の最大額です。
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
            地域を選択すると情報が表示されます（データがない地域もあります）。
          </Alert>
        )}
      </Stack>
    </Card>
  );
}