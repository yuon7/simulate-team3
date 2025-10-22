import { Container, Title, Text, Stack } from "@mantine/core"
import sectionStyles from "./FeaturesSection.module.css"
import { FeaturesDisplay } from "../../features/FeaturesSection/FeaturesDisplay"

export function FeaturesSection() {
  return (
    <section className={sectionStyles.section}>
      <Container size="xl">
        <Stack align="center" gap="md" mb={60}>
          <Title order={2} className={sectionStyles.title}>
            なぜ選ばれるのか
          </Title>
          <Text size="lg" c="dimmed" ta="center" maw={700}>
            従来のサービスにはない、生活シミュレーション機能で具体的な移住後イメージを提供
          </Text>
        </Stack>
        <FeaturesDisplay />
      </Container>
    </section>
  )
}