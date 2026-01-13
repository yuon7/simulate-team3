"use client";

import { Container, Title, Text, Card, Table, Badge, Group, Button, Divider, Indicator } from "@mantine/core";
import Link from "next/link";
import { IconExternalLink, IconMessage } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { ChatModal } from "@/features/Messaging/ChatModal";

export default function CompanyApplicationsPage() {
  const { data: applications, error, isLoading } = useSWR("/api/applications", fetcher);
  const { data: profile } = useSWR("/api/profile", fetcher);
  
  const [chatOpened, { open: openChat, close: closeChat }] = useDisclosure(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const handleOpenChat = (app: any) => {
    setSelectedApp(app);
    openChat();
  };

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">応募状況確認</Title>

      {isLoading ? (
        <Text>読み込み中...</Text>
      ) : error ? (
        <Text c="red">データの取得に失敗しました</Text>
      ) : (
        <Card shadow="sm" radius="md" withBorder>
          <Table verticalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>候補者名</Table.Th>
                <Table.Th>応募求人</Table.Th>
                <Table.Th>ステータス</Table.Th>
                <Table.Th>応募日</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {applications?.map((app: any) => (
                <Table.Tr key={app.id}>
                  <Table.Td>
                    <Text 
                      fw={500} 
                      component={Link} 
                      href={`/candidates/${app.candidateId}`}
                      c="blue"
                      style={{ textDecoration: 'none' }}
                    >
                      {app.candidate?.user?.name || "名前なし"}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{app.jobPosting?.title}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color="orange" variant="light">
                      {app.status === "PENDING" ? "選考中" : app.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button 
                        variant="subtle" 
                        size="xs" 
                        leftSection={<IconExternalLink size={14} />}
                        component={Link}
                        href={`/candidates/${app.candidateId}`}
                      >
                        プロフィール
                      </Button>
                      <Indicator 
                        disabled={!app.unreadCount || app.unreadCount === 0} 
                        color="red" 
                        size={10} 
                        offset={2}
                      >
                        <Button 
                          variant="light" 
                          size="xs" 
                          leftSection={<IconMessage size={14} />}
                          onClick={() => handleOpenChat(app)}
                        >
                          メッセージ
                        </Button>
                      </Indicator>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
              {(!applications || applications.length === 0) && (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text ta="center" py="xl" c="dimmed">現在、応募はありません。</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Card>
      )}

      <ChatModal 
        applicationId={selectedApp?.id}
        opened={chatOpened}
        onClose={closeChat}
        currentUserId={profile?.id}
        otherPartyName={selectedApp?.candidate?.user?.name || "候補者"}
      />
    </Container>
  );
}
