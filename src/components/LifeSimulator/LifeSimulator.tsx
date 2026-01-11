import { Container, Title, Text, Stack } from "@mantine/core";
import simulatorSectionStyles from "./LifeSimulator.module.css";
import { LifeSimulation } from "../../features/LifeSimulator/LifeSimulator"; 

export function LifeSimulator() {
  return (
    <section id="simulator" className={simulatorSectionStyles.section}>
      <Container size="xl">
        <Stack align="center" gap="md" mb={60}>
          <Title order={2} className={simulatorSectionStyles.title}>
            生活体験シミュレーター
          </Title>
          <Text size="lg" c="dimmed" ta="center" maw={700}>
            移住前に具体的な生活コストと環境をシミュレーション
          </Text>
        </Stack>
        <LifeSimulation />
      </Container>
    </section>
  );
}