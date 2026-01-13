"use client";

import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  Group,
  Avatar,
  Badge,
  Divider,
  Grid,
  Button,
} from "@mantine/core";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCertificate,
  IconTarget,
  IconMessage,
} from "@tabler/icons-react";
import { ChatModal } from "@/features/Messaging/ChatModal";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

type CandidateProfileContentProps = {
  candidate: any;
  avatarUrl: string | null;
  applicationId: number | null;
  currentUserId: string | null;
};

export function CandidateProfileContent({
  candidate,
  avatarUrl,
  applicationId,
  currentUserId,
}: CandidateProfileContentProps) {
  const [chatOpened, { open: openChat, close: closeChat }] =
    useDisclosure(false);

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Group align="flex-start" gap="xl">
            <Avatar
              src={avatarUrl}
              size={120}
              radius="xl"
              name={candidate.user.name}
            />
            <Stack gap="xs" style={{ flex: 1 }}>
              <Group justify="space-between">
                <div>
                  <Title order={1}>{candidate.user.name}</Title>
                  <Text c="dimmed" size="lg">
                    {candidate.gender} / {candidate.age}歳
                  </Text>
                </div>
                {applicationId && (
                  <Button
                    leftSection={<IconMessage size={18} />}
                    variant="light"
                    onClick={openChat}
                  >
                    メッセージを送る
                  </Button>
                )}
              </Group>

              <Group gap="lg" mt="sm">
                <Group gap="xs">
                  <IconMail size={18} color="var(--mantine-color-dimmed)" />
                  <Text size="sm">{candidate.user.email}</Text>
                </Group>
                {candidate.user.phone && (
                  <Group gap="xs">
                    <IconPhone size={18} color="var(--mantine-color-dimmed)" />
                    <Text size="sm">{candidate.user.phone}</Text>
                  </Group>
                )}
              </Group>
            </Stack>
          </Group>
        </Card>

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="xl">
              <section>
                <Title order={3} mb="md">
                  自己PR / 経歴
                </Title>
                <Card shadow="xs" padding="lg" radius="md" withBorder>
                  <Text style={{ whiteSpace: "pre-wrap" }}>
                    {candidate.bio || "自己紹介は未登録です。"}
                  </Text>
                </Card>
              </section>

              <section>
                <Title order={3} mb="md">
                  保有スキル
                </Title>
                <Card shadow="xs" padding="lg" radius="md" withBorder>
                  <Group gap="xs">
                    {candidate.userSkills.map((us: any) => (
                      <Badge
                        key={us.skillId}
                        size="lg"
                        variant="light"
                        leftSection={<IconCertificate size={14} />}
                      >
                        {us.skill.name} ({us.proficiency})
                      </Badge>
                    ))}
                    {candidate.userSkills.length === 0 && (
                      <Text c="dimmed">スキル情報は未登録です。</Text>
                    )}
                  </Group>
                </Card>
              </section>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Title order={3} mb="md">
              希望条件
            </Title>
            <Card shadow="xs" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <div>
                  <Group gap="xs" mb={4}>
                    <IconTarget size={18} color="var(--mantine-color-blue-6)" />
                    <Text size="xs" c="dimmed" fw={700}>
                      希望職種
                    </Text>
                  </Group>
                  <Text size="sm" fw={500}>
                    {candidate.desiredJob?.name || "未設定"}
                  </Text>
                </div>

                <Divider />

                <div>
                  <Group gap="xs" mb={4}>
                    <IconMapPin size={18} color="var(--mantine-color-blue-6)" />
                    <Text size="xs" c="dimmed" fw={700}>
                      希望勤務地
                    </Text>
                  </Group>
                  <Stack gap={4}>
                    {candidate.desiredLocations.map((dl: any) => (
                      <Text key={dl.locationId} size="sm" fw={500}>
                        {dl.location.prefecture.name} {dl.location.city}
                      </Text>
                    ))}
                    {candidate.desiredLocations.length === 0 && (
                      <Text size="sm" c="dimmed">
                        未設定
                      </Text>
                    )}
                  </Stack>
                </div>

                <Divider />

                <div>
                  <Text size="xs" c="dimmed" fw={700} mb={4}>
                    希望年収
                  </Text>
                  <Text size="sm" fw={500}>
                    {candidate.desiredSalary
                      ? `${candidate.desiredSalary}万円程度`
                      : "未設定"}
                  </Text>
                </div>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>

      {applicationId && (
        <ChatModal
          applicationId={applicationId}
          opened={chatOpened}
          onClose={closeChat}
          currentUserId={currentUserId}
          otherPartyName={candidate.user.name}
        />
      )}
    </Container>
  );
}
