"use client"
import { Tabs } from "@mantine/core";
import { LifeCostSimulator } from "@/components/LifeSimulator/LifeCostSimulator";
import { InitialCostSimulator } from "@/components/LifeSimulator/InitialCostSimulator";
import { SupportNavigator } from "@/components/LifeSimulator/SupportNavigator";

export function LifeSimulation() {
  return (
    <Tabs defaultValue="cost" variant="outline" radius="md">
      <Tabs.List grow mb="xl">
        <Tabs.Tab value="cost">生活コスト試算</Tabs.Tab>
        <Tabs.Tab value="initial">引っ越し・初期費用見積もり</Tabs.Tab>
        <Tabs.Tab value="support">支援制度ナビ</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="cost">
        <LifeCostSimulator />
      </Tabs.Panel>

      <Tabs.Panel value="initial">
        <InitialCostSimulator />
      </Tabs.Panel>

      <Tabs.Panel value="support">
        <SupportNavigator />
      </Tabs.Panel>
    </Tabs>
  );
}