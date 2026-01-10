"use client"
import { Tabs } from "@mantine/core";
import { LifeCostFeature } from "./LifeCostFeature";
import { InitialCostFeature } from "./InitialCostFeature";
import { SupportNavigatorFeature } from "./SupportNavigatorFeature";

export function LifeSimulation() {
  return (
    <Tabs defaultValue="cost" variant="outline" radius="md">
      <Tabs.List grow mb="xl">
        <Tabs.Tab value="cost">生活コスト試算</Tabs.Tab>
        <Tabs.Tab value="initial">引っ越し・初期費用見積もり</Tabs.Tab>
        <Tabs.Tab value="support">支援制度ナビ</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="cost">
        <LifeCostFeature />
      </Tabs.Panel>

      <Tabs.Panel value="initial">
        <InitialCostFeature />
      </Tabs.Panel>

      <Tabs.Panel value="support">
        <SupportNavigatorFeature />
      </Tabs.Panel>
    </Tabs>
  );
}