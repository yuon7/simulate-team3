"use client";

import { HeroSection } from "../components/HeroSection/HeroSection";
import { FeaturesSection } from "../components/FeaturesSection/FeaturesSection";
import { JobListings } from "../components/JobListings/JobListings";
import { RegionSpotlight } from "../components/RegionSpotlight/RegionSpotlight";
import { Footer } from "../components/Footer/Footer";

import { Tabs, Container, Title } from "@mantine/core";
import { LifeCostSimulator } from "../components/LifeSimulator/LifeCostSimulator";
import LifeChatAssistant from "../components/LifeSimulator/LifeChatAssistant";
import { SupportNavigator } from "../components/LifeSimulator/SupportNavigator";

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <FeaturesSection />
        <JobListings />
        <RegionSpotlight />
        <Container size="md" py="xl">
          <Title order={1} mb="lg" ta="center">
            生活体験シミュレーター
          </Title>

          <Tabs defaultValue="cost" variant="outline" radius="md">
            <Tabs.List grow mb="xl">
              <Tabs.Tab value="cost">生活コスト試算</Tabs.Tab>
              <Tabs.Tab value="chat">生活相談AI</Tabs.Tab>
              <Tabs.Tab value="support">支援制度ナビ</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="cost">
              <LifeCostSimulator />
            </Tabs.Panel>

            <Tabs.Panel value="chat">
              <LifeChatAssistant />
            </Tabs.Panel>

            <Tabs.Panel value="support">
              <SupportNavigator />
            </Tabs.Panel>
          </Tabs>
        </Container>
      </main>

      <Footer />
    </>
  );
}
