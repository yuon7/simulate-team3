"use client";

import { Container, Title, Text, Stack, Card, Group, Avatar, Badge, Divider, Grid } from "@mantine/core";
import { IconMapPin, IconWorld, IconBuilding, IconUsers, IconMoneybag, IconCalendar } from "@tabler/icons-react";
import { JobCards } from "@/features/JobListings/JobCards";

type OrganizationProfileContentProps = {
  organization: any;
};

export function OrganizationProfileContent({ organization }: OrganizationProfileContentProps) {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header Section */}
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Group align="flex-start" gap="xl">
            <Avatar 
              src={organization.logoUrl} 
              size={120} 
              radius="md" 
              name={organization.name}
            />
            <Stack gap="xs" style={{ flex: 1 }}>
              <Group justify="space-between">
                <div>
                  <Title order={1}>{organization.name}</Title>
                  <Text c="dimmed" size="lg">{organization.industry || "業種未定"}</Text>
                </div>
                <Badge size="xl" variant="light">
                  {organization.organizationType === "COMPANY" ? "一般企業" : "自治体"}
                </Badge>
              </Group>

              <Group gap="lg" mt="sm">
                <Group gap="xs">
                  <IconMapPin size={18} color="var(--mantine-color-dimmed)" />
                  <Text size="sm">{organization.location.prefecture.name} {organization.location.city}</Text>
                </Group>
                {organization.websiteUrl && (
                  <Group gap="xs">
                    <IconWorld size={18} color="var(--mantine-color-dimmed)" />
                    <Text size="sm" component="a" href={organization.websiteUrl} target="_blank" c="blue" inherit style={{ textDecoration: 'none' }}>
                      ウェブサイト
                    </Text>
                  </Group>
                )}
              </Group>
            </Stack>
          </Group>
        </Card>

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="xl">
              {/* Description Section */}
              <section>
                <Title order={3} mb="md">組織について</Title>
                <Card shadow="xs" padding="lg" radius="md" withBorder>
                  <Text style={{ whiteSpace: "pre-wrap" }}>
                    {organization.description || "紹介文はまだ登録されていません。"}
                  </Text>
                </Card>
              </section>

              {/* Job Postings Section */}
              <section>
                <Title order={3} mb="md">募集中の求人</Title>
                <JobCards company={organization.name} />
              </section>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            {/* Details Sidebar */}
            <Title order={3} mb="md">組織詳細</Title>
            <Card shadow="xs" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Group gap="sm">
                  <IconBuilding size={20} color="var(--mantine-color-blue-6)" />
                  <div>
                    <Text size="xs" c="dimmed">組織名</Text>
                    <Text size="sm" fw={500}>{organization.name}</Text>
                  </div>
                </Group>

                <Group gap="sm">
                  <IconCalendar size={20} color="var(--mantine-color-blue-6)" />
                  <div>
                    <Text size="xs" c="dimmed">設立</Text>
                    <Text size="sm" fw={500}>{organization.foundedDate ? new Date(organization.foundedDate).toLocaleDateString('ja-JP') : "未登録"}</Text>
                  </div>
                </Group>

                <Group gap="sm">
                  <IconMoneybag size={20} color="var(--mantine-color-blue-6)" />
                  <div>
                    <Text size="xs" c="dimmed">資本金</Text>
                    <Text size="sm" fw={500}>{organization.capital || "未登録"}</Text>
                  </div>
                </Group>

                <Group gap="sm">
                  <IconUsers size={20} color="var(--mantine-color-blue-6)" />
                  <div>
                    <Text size="xs" c="dimmed">従業員数</Text>
                    <Text size="sm" fw={500}>{organization.employeeCount ? `${organization.employeeCount}名` : "未登録"}</Text>
                  </div>
                </Group>

                <Divider />

                <Group gap="sm">
                  <IconMapPin size={20} color="var(--mantine-color-blue-6)" />
                  <div>
                    <Text size="xs" c="dimmed">所在地</Text>
                    <Text size="sm" fw={500}>
                      {organization.location.prefecture.name} {organization.location.city} {organization.location.street}
                    </Text>
                  </div>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
