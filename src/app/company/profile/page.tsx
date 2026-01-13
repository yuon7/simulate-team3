"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Text,
  Avatar,
  Group,
  Stack,
  Badge,
  Divider,
  Button,
  Title,
} from "@mantine/core";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconEdit,
  IconBuilding,
} from "@tabler/icons-react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";

export default function CompanyProfilePage() {
  const {
    data: profile,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/profile", fetcher);
  const router = useRouter();

  // Revalidate on focus or mount to ensure fresh data
  useEffect(() => {
    mutate();
  }, [mutate]);

  if (isLoading) {
    return (
      <Container py="xl">
        <Text>読み込み中...</Text>
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container py="xl">
        <Text c="red">プロフィールの読み込みに失敗しました。</Text>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Title order={1} mb="xl">
        企業プロフィール
      </Title>

      <Card shadow="lg" padding="xl" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Group>
            <Avatar size="xl" radius="md" color="blue" src={profile.avatarUrl}>
              <IconBuilding size={40} />
            </Avatar>
            <div>
              <Text size="xl" fw={700}>
                {profile.name}
              </Text>
              <Text size="sm" c="dimmed">
                {profile.organizationName}
              </Text>
            </div>
          </Group>
          <Button
            leftSection={<IconEdit size={16} />}
            variant="light"
            onClick={() => router.push("/company/profile/edit")}
          >
            編集
          </Button>
        </Group>

        <Divider my="md" />

        <Stack gap="md">
          <div>
            <Text size="sm" fw={500} mb="xs">
              組織情報
            </Text>
            <Stack gap="xs">
              <Group gap="xs">
                <IconBuilding size={16} color="gray" />
                <Text size="sm">{profile.organizationName}</Text>
                <Badge variant="light">
                  {profile.organizationType === "COMPANY" ? "企業" : "自治体"}
                </Badge>
              </Group>
              <Group gap="xs">
                <IconMapPin size={16} color="gray" />
                <Text size="sm">{profile.location}</Text>
              </Group>
            </Stack>
          </div>

          <div>
            <Text size="sm" fw={500} mb="xs">
              担当者情報
            </Text>
            <Stack gap="xs">
              <Group gap="xs">
                <IconMail size={16} color="gray" />
                <Text size="sm">{profile.email}</Text>
              </Group>
              {profile.phone && (
                <Group gap="xs">
                  <IconPhone size={16} color="gray" />
                  <Text size="sm">{profile.phone}</Text>
                </Group>
              )}
              {profile.department && (
                <Text size="sm">部署: {profile.department}</Text>
              )}
              {profile.title && <Text size="sm">役職: {profile.title}</Text>}
            </Stack>
          </div>
        </Stack>
      </Card>
    </Container>
  );
}
