"use client";

import { useState } from "react";
import { Container, Title, SimpleGrid, Card, Text, Button, Space } from "@mantine/core";

import { LifeCostSimulator } from "@/components/LifeSimulator/LifeCostSimulator";
import { InitialCostSimulator } from "@/components/LifeSimulator/InitialCostSimulator";
import { SupportNavigator } from "@/components/LifeSimulator/SupportNavigator";

export default function SimulatePage() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

 
  return (
    <Container size="lg" py="xl">
      <Title order={2} ta="center" mb="md">
        🏡 地方移住 生活シミュレーション
      </Title>
      <Text ta="center" c="dimmed" mb="xl">
        住居費・交通費・支援制度・暮らし相談をまとめて体験できます。
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={4}>💰 生活コスト試算</Title>
          <Text mt="xs" c="dimmed">
            地域・条件から住居費・交通費・食費などの概算を試算します。
          </Text>
          <Button mt="md" fullWidth onClick={() => setActiveFeature("cost")}>
            試してみる
          </Button>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={4}>🚚 引っ越し・初期費用見積もり</Title>
          <Text mt="xs" c="dimmed">
            引越し・賃貸契約・車の準備など、移住に必要な貯金額を試算します。
          </Text>
          <Button mt="md" fullWidth onClick={() => setActiveFeature("initial")}>
            試してみる
          </Button>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={4}>🧭 支援制度ナビ</Title>
          <Text mt="xs" c="dimmed">
            地域の移住支援・住宅補助など、利用可能な制度を確認できます。
          </Text>
          <Button mt="md" fullWidth onClick={() => setActiveFeature("support")}>
            試してみる
          </Button>
        </Card>
      </SimpleGrid>

      <Space h="xl" />

      {activeFeature === "cost" && <LifeCostSimulator />}
      {activeFeature === "initial" && <InitialCostSimulator />}
      {activeFeature === "support" && <SupportNavigator />}
    </Container>
  );
}