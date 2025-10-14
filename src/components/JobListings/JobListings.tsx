import { Container, Title, Text, Stack, Group, Button } from "@mantine/core"
import jobSectionStyles from "./JobListings.module.css"
import { JobCards } from "../../features/JobListings/JobCards"

export function JobListings() {
  return (
    <section id="jobs" className={jobSectionStyles.section}>
      <Container size="xl">
        <Stack align="center" gap="md" mb={60}>
          <Title order={2} className={jobSectionStyles.title}>
            注目の求人情報
          </Title>
          <Text size="lg" c="dimmed" ta="center" maw={700}>
            地方で活躍できる魅力的な求人を厳選してご紹介
          </Text>
        </Stack>

        <JobCards />

        <Group justify="center">
          <Button size="lg" variant="outline">
            すべての求人を見る
          </Button>
        </Group>
      </Container>
    </section>
  )
}