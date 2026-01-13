"use client";

import {
  Container,
  Title,
  Text,
  Card,
  Table,
  Badge,
  Group,
  Button,
  Loader,
  Center,
  Stack,
  Indicator,
} from "@mantine/core";
import { IconMessage, IconBuilding } from "@tabler/icons-react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { ChatModal } from "@/features/Messaging/ChatModal";

export default function CandidateApplicationsPage() {
  const {
    data: applications,
    error,
    isLoading,
  } = useSWR("/api/applications", fetcher);
  const { data: profile } = useSWR("/api/profile", fetcher);

  const [chatOpened, { open: openChat, close: closeChat }] =
    useDisclosure(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const handleOpenChat = (app: any) => {
    setSelectedApp(app);
    openChat();
  };

  if (isLoading) {
    return (
      <Center h="calc(100vh - 200px)">
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={2} mb="xs">
            応募履歴・メッセージ
          </Title>
          <Text c="dimmed">
            これまでに募集に応募した求人の一覧と、企業とのやり取りを確認できます。
          </Text>
        </div>

        <Card shadow="sm" radius="md" withBorder>
          <Table verticalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>企業・自治体名</Table.Th>
                <Table.Th>応募求人</Table.Th>
                <Table.Th>ステータス</Table.Th>
                <Table.Th>応募日</Table.Th>
                <Table.Th>操作</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {applications?.map((app: any) => (
                <Table.Tr key={app.id}>
                  <Table.Td>
                    <Group gap="xs">
                      <IconBuilding
                        size={16}
                        color="var(--mantine-color-dimmed)"
                      />
                      <Text
                        fw={500}
                        component={Link}
                        href={`/organizations/${app.jobPosting.organizationId}`}
                        c="blue"
                        style={{ textDecoration: "none" }}
                      >
                        {app.jobPosting.organization.name}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text
                      size="sm"
                      component={Link}
                      href={`/jobs/${app.jobPostingId}`}
                      c="gray.7"
                    >
                      {app.jobPosting.title}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        app.status === "PENDING"
                          ? "yellow"
                          : app.status === "APPROVED"
                            ? "green"
                            : "gray"
                      }
                      variant="light"
                    >
                      {app.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Indicator
                      disabled={!app.unreadCount || app.unreadCount === 0}
                      color="red"
                      size={10}
                      offset={2}
                    >
                      <Button
                        variant="light"
                        leftSection={<IconMessage size={14} />}
                        size="xs"
                        onClick={() => handleOpenChat(app)}
                      >
                        メッセージ
                      </Button>
                    </Indicator>
                  </Table.Td>
                </Table.Tr>
              ))}
              {(!applications || applications.length === 0) && (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text ta="center" py="xl" c="dimmed">
                      まだ応募した求人はありません。
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Card>
      </Stack>

      <ChatModal
        applicationId={selectedApp?.id}
        opened={chatOpened}
        onClose={closeChat}
        currentUserId={profile?.id}
        otherPartyName={
          selectedApp?.jobPosting?.organization?.name || "企業担当者"
        }
      />
    </Container>
  );
}
