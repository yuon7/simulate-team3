"use client";
import { useState } from "react";
import {
  Container,
  Title,
  SimpleGrid,
  Card,
  Text,
  Button,
  Space,
  ThemeIcon,
  Group,
  Badge,
  Paper,
} from "@mantine/core";
import {
  IconCalculator,
  IconTruck,
  IconMap2,
  IconArrowRight,
  IconHomeHeart,
} from "@tabler/icons-react";
import { LifeCostFeature } from "@/features/LifeSimulator/LifeCostFeature";
import { InitialCostFeature } from "@/features/LifeSimulator/InitialCostFeature";
import { SupportNavigatorFeature } from "@/features/LifeSimulator/SupportNavigatorFeature";

export default function LifeSimulatorPage() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const features = [
    {
      id: "cost",
      title: "生活コスト試算",
      desc: "現在の家計と比較し、移住後のリアルな収支差額を算出します。",
      icon: IconCalculator,
      color: "blue",
      component: <LifeCostFeature />,
    },
    {
      id: "initial",
      title: "初期費用見積もり",
      desc: "引越し・敷礼・車の購入など、移住スタートに必要な貯金額を計算。",
      icon: IconTruck,
      color: "orange",
      component: <InitialCostFeature />,
    },
    {
      id: "support",
      title: "支援制度ナビ",
      desc: "全国の自治体から、あなたが利用できる移住支援金・補助金を検索。",
      icon: IconMap2,
      color: "teal",
      component: <SupportNavigatorFeature />,
    },
  ];

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div
        style={{ backgroundColor: "white", borderBottom: "1px solid #e9ecef" }}
      >
        <Container size="lg" py={50}>
          <Group justify="center" mb="md">
            <ThemeIcon size={60} radius="xl" variant="light" color="blue">
              <IconHomeHeart size={34} />
            </ThemeIcon>
          </Group>
          <Title
            order={1}
            ta="center"
            fw={900}
            style={{ letterSpacing: "-1px" }}
          >
            地方移住シミュレーション
          </Title>
          <Text ta="center" c="dimmed" mt="sm" maw={600} mx="auto">
            お金の計算から制度の検索まで。
            <br />
            あなたの移住計画を具体化する3つのツールを自由に試せます。
          </Text>
        </Container>
      </div>

      <Container size="lg" py="xl">
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
          {features.map((feature) => {
            const isActive = activeFeature === feature.id;
            return (
              <Card
                key={feature.id}
                shadow={isActive ? "md" : "sm"}
                padding="lg"
                radius="md"
                withBorder
                style={{
                  cursor: "pointer",
                  borderColor: isActive
                    ? `var(--mantine-color-${feature.color}-6)`
                    : undefined,
                  backgroundColor: isActive
                    ? `var(--mantine-color-${feature.color}-0)`
                    : "white",
                  transition: "all 0.2s ease",
                }}
                onClick={() => setActiveFeature(feature.id)}
              >
                <Group justify="space-between" align="start" mb="md">
                  <ThemeIcon
                    size={48}
                    radius="md"
                    variant={isActive ? "filled" : "light"}
                    color={feature.color}
                  >
                    <feature.icon size={26} stroke={1.5} />
                  </ThemeIcon>
                  {isActive && <Badge color={feature.color}>選択中</Badge>}
                </Group>

                <Text
                  fw={700}
                  size="lg"
                  mt="xs"
                  c={isActive ? `${feature.color}.9` : "dark"}
                >
                  {feature.title}
                </Text>
                <Text mt="xs" c="dimmed" size="sm" style={{ flex: 1 }}>
                  {feature.desc}
                </Text>

                <Button
                  fullWidth
                  mt="md"
                  variant={isActive ? "filled" : "light"}
                  color={feature.color}
                  rightSection={<IconArrowRight size={16} />}
                >
                  {isActive ? "表示中" : "これを使う"}
                </Button>
              </Card>
            );
          })}
        </SimpleGrid>

        <Space h="xl" />
        {activeFeature && (
          <Paper p={0} bg="transparent">
            <Text fw={700} size="xl" mb="md" c="dimmed" ta="center">
              👇 シミュレーション結果
            </Text>
            {features.find((f) => f.id === activeFeature)?.component}
          </Paper>
        )}

        {!activeFeature && (
          <Paper p="xl" withBorder radius="md" ta="center" bg="white" mt="xl">
            <Text c="dimmed">
              上のカードをクリックして、シミュレーターを選択してください 👆
            </Text>
          </Paper>
        )}
      </Container>
    </div>
  );
}
