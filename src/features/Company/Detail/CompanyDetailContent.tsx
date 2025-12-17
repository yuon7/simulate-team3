import { PrismaClient } from "@prisma/client";
import { Title, Text, Group, Badge, Stack, Avatar, Card, Grid, Button } from "@mantine/core";
import { IconMapPin, IconUsers, IconCalendar, IconWorld } from "@tabler/icons-react";
import Link from "next/link";
// import { notFound } from "next/navigation"; // Optional: handle 404

export async function CompanyDetailContent({ id }: { id: number }) {
  const prisma = new PrismaClient();
  
  if (isNaN(id)) {
      return <div>Invalid ID</div>;
  }

  const organization = await prisma.organization.findUnique({
    where: { id },
    include: {
      location: true,
      // jobs: true // Future: Include active jobs
    },
  });

  if (!organization) {
    // notFound();
    return <div>企業が見つかりません</div>;
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Card withBorder shadow="sm" radius="md" p="xl">
          <Group align="flex-start" mb="lg">
             <Avatar 
              src={organization.logoUrl} 
              alt={organization.name} 
              size="120" 
              radius="md"
              color="blue"
            >
              {organization.name.charAt(0)}
            </Avatar>
            
            <div style={{ flex: 1 }}>
              <Group gap="xs" mb={4}>
                <Title order={1}>{organization.name}</Title>
                <Badge variant="light" size="lg">{organization.organizationType}</Badge>
              </Group>
              
              {organization.industry && (
                <Text size="lg" c="dimmed" mb="md">{organization.industry}</Text>
              )}

              <Group gap="lg">
                <Group gap={4}>
                  <IconMapPin size={18} color="gray" />
                  <Text>
                    {organization.location.prefectureId /* Create helper for pref name later */} 
                    {organization.location.city}
                  </Text>
                </Group>
                 {organization.websiteUrl && (
                  <Group gap={4}>
                    <IconWorld size={18} color="gray" />
                    <Text component="a" href={organization.websiteUrl} target="_blank" c="blue">
                      Webサイト
                    </Text>
                  </Group>
                )}
              </Group>
            </div>
          </Group>

          <Stack gap="xl">
            <section>
              <Title order={2} size="h3" mb="sm">私たちの想い・事業内容</Title>
              <Text size="md" style={{ whiteSpace: "pre-wrap" }}>
                {organization.description || "詳細情報は登録されていません。"}
              </Text>
            </section>

            <section>
              <Title order={2} size="h3" mb="sm">会社概要</Title>
              <Card withBorder variant="light" p={0}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {organization.foundedDate && (
                       <tr style={{ borderBottom: "1px solid #dee2e6" }}>
                        <th style={{ textAlign: "left", padding: "12px", width: "30%", backgroundColor: "#f8f9fa" }}>設立年</th>
                        <td style={{ padding: "12px" }}>{new Date(organization.foundedDate).getFullYear()}年</td>
                      </tr>
                    )}
                     <tr style={{ borderBottom: "1px solid #dee2e6" }}>
                        <th style={{ textAlign: "left", padding: "12px", width: "30%", backgroundColor: "#f8f9fa" }}>従業員数</th>
                        <td style={{ padding: "12px" }}>{organization.employeeCount ? `${organization.employeeCount}名` : "-"}</td>
                      </tr>
                      <tr>
                        <th style={{ textAlign: "left", padding: "12px", width: "30%", backgroundColor: "#f8f9fa" }}>資本金</th>
                        <td style={{ padding: "12px" }}>{organization.capital || "-"}</td>
                      </tr>
                  </tbody>
                </table>
              </Card>
            </section>
          </Stack>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card withBorder shadow="sm" radius="md" p="lg" mb="md">
          <Title order={3} size="h4" mb="md">募集中の求人</Title>
          <Text c="dimmed" size="sm">現在募集中の求人はありません。</Text>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
