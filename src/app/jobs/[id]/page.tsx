import { prisma } from "@/lib/prisma";
import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  Group,
  Badge,
  Divider,
  Button,
} from "@mantine/core";
import {
  IconMapPin,
  IconBuilding,
  IconCurrencyYen,
  IconCalendar,
} from "@tabler/icons-react";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function JobDetailPage({ params }: { params: any }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    notFound();
  }

  const job = await prisma.jobPosting.findUnique({
    where: { id },
    include: {
      organization: true,
      location: {
        include: { prefecture: true },
      },
      jobCategory: true,
    },
  });

  if (!job) {
    notFound();
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between" align="start">
              <div>
                <Title order={1}>{job.title}</Title>
                <Group gap="xs" mt="xs">
                  <IconBuilding size={18} color="var(--mantine-color-dimmed)" />
                  <Text
                    size="lg"
                    component={Link}
                    href={`/organizations/${job.organization.id}`}
                    style={{
                      color: "var(--mantine-color-blue-6)",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    {job.organization.name}
                  </Text>
                </Group>
              </div>
              <Badge size="xl">{job.employmentType}</Badge>
            </Group>

            <Group gap="xl" mt="md">
              <Group gap="xs">
                <IconMapPin size={20} color="var(--mantine-color-blue-6)" />
                <Text size="md">
                  {job.location
                    ? `${job.location.prefecture.name} ${job.location.city}`
                    : "勤務地未定"}
                </Text>
              </Group>
              <Group gap="xs">
                <IconCurrencyYen
                  size={20}
                  color="var(--mantine-color-blue-6)"
                />
                <Text size="md" fw={600}>
                  {job.salaryMin
                    ? job.salaryMax
                      ? `${job.salaryMin}〜${job.salaryMax}万円`
                      : `${job.salaryMin}万円〜`
                    : "応相談"}
                </Text>
              </Group>
              <Group gap="xs">
                <IconCalendar size={20} color="var(--mantine-color-blue-6)" />
                <Text size="md" c="dimmed">
                  掲載日: {job.createdAt.toLocaleDateString("ja-JP")}
                </Text>
              </Group>
            </Group>

            <Divider my="md" />

            <div>
              <Title order={3} mb="sm">
                仕事内容
              </Title>
              <Text size="md" style={{ whiteSpace: "pre-wrap" }}>
                {job.description}
              </Text>
            </div>

            <Group gap="xs" mt="md">
              {job.tags.map((tag) => (
                <Badge key={tag} variant="outline" size="lg">
                  {tag}
                </Badge>
              ))}
            </Group>

            <Divider my="md" />

            <Group justify="center" mt="xl">
              {/* Note: Standard application logic would involve a form or another server action. 
                   For now, we'll keep it simple as a placeholder or reuse logic if available. */}
              <Button size="xl" radius="md" px={50}>
                この求人に応募する
              </Button>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
