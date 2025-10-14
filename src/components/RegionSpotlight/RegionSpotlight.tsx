import { Container, Title, Text, Stack, Group, Button } from "@mantine/core"
import regionSectionStyles from "./RegionSpotlight.module.css"
import { RegionCards } from "../../features/RegionSpotlight/RegionCards"

export function RegionSpotlight() {
  return (
    <section id="regions" className={regionSectionStyles.section}>
      <Container size="xl">
        <Stack align="center" gap="md" mb={60}>
          <Title order={2} className={regionSectionStyles.title}>
            注目の地域
          </Title>
          <Text size="lg" c="dimmed" ta="center" maw={700}>
            移住先として人気の地域をピックアップ
          </Text>
        </Stack>

        <RegionCards />

        <Group justify="center">
          <Button size="lg" variant="outline">
            すべての地域を見る
          </Button>
        </Group>
      </Container>
    </section>
  )
}