"use client";

import { Container, Title, Text, Card, Group, Button, Stack, Table, Badge, ActionIcon, Tooltip } from "@mantine/core";
import { IconPlus, IconExternalLink, IconEdit, IconTrash } from "@tabler/icons-react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CompanyJobsPage() {
  const router = useRouter();
  const { data: jobs, error, isLoading } = useSWR("/api/jobs?mine=true", fetcher);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`求人「${title}」を削除してもよろしいですか？`)) return;

    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("削除に失敗しました");
      
      // Update local cache
      mutate("/api/jobs?mine=true");
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました");
    }
  };

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>求人管理</Title>
        <Button 
          component={Link}
          href="/company/jobs/new" 
          leftSection={<IconPlus size={16} />}
        >
          求人を新規作成
        </Button>
      </Group>

      {isLoading ? (
        <Text>読み込み中...</Text>
      ) : error ? (
        <Text c="red">データの取得に失敗しました</Text>
      ) : (
        <Card shadow="sm" radius="md" withBorder>
          <Table verticalSpacing="md" horizontalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>求人タイトル</Table.Th>
                <Table.Th>ステータス</Table.Th>
                <Table.Th>作成日</Table.Th>
                <Table.Th ta="right">アクション</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {jobs?.data?.map((job: any) => (
                <Table.Tr key={job.id}>
                  <Table.Td>
                    <Text fw={500}>{job.title}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color="blue" variant="light">募集中</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="flex-end">
                      <Tooltip label="編集">
                        <ActionIcon 
                          variant="light" 
                          component={Link} 
                          href={`/company/jobs/${job.id}/edit`}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="削除">
                        <ActionIcon 
                          variant="light" 
                          color="red"
                          onClick={() => handleDelete(job.id, job.title)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Button 
                        variant="subtle" 
                        size="xs" 
                        leftSection={<IconExternalLink size={14} />}
                        onClick={() => router.push(`/jobs/${job.id}`)}
                      >
                        詳細
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
              {(!jobs?.data || jobs.data.length === 0) && (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text ta="center" py="xl" c="dimmed">求人がありません。新しく作成してください。</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Card>
      )}
    </Container>
  );
}
