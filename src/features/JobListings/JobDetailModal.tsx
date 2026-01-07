"use client";

import { Modal, Button, Text, Group, Badge, Stack, Title, Divider, LoadingOverlay } from "@mantine/core";
import { IconBuilding, IconMapPin, IconCurrencyYen, IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

// Define the Job type here or import it if shared (currently defined locally in JobCards)
// For simplicity and decoupling, I'll redefine the shape expected by this modal.
type Job = {
  id: number;
  title: string;
  description: string;
  employmentType: string;
  tags: string[];
  organization: {
    name: string;
  };
  location: {
    city: string;
    prefecture: {
      name: string;
    };
  } | null;
  salaryMin: number | null;
  salaryMax: number | null;
};

type JobDetailModalProps = {
  job: Job | null;
  opened: boolean;
  onClose: () => void;
};

export function JobDetailModal({ job, opened, onClose }: JobDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!job) return null;

  const handleApply = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobPostingId: job.id }),
      });

      if (res.status === 409) {
        // Already applied
        setApplied(true);
        notifications.show({
          title: "応募済み",
          message: "この求人は既に応募済みです。",
          color: "blue",
        });
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to apply");
      }

      setApplied(true);
      notifications.show({
        title: "応募完了",
        message: "求人への応募が完了しました。",
        color: "green",
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "エラー",
        message: "応募に失敗しました。後ほど再度お試しください。",
        color: "red",
        icon: <IconX size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="求人詳細" size="lg">
      <LoadingOverlay visible={loading} />
      <Stack gap="md">
        <Group justify="space-between" align="start">
          <div>
            <Title order={3}>{job.title}</Title>
            <Text size="sm" c="dimmed">{job.organization.name}</Text>
          </div>
          <Badge size="lg">{job.employmentType}</Badge>
        </Group>

        <Group gap="md">
          <Group gap="xs">
            <IconMapPin size={18} />
            <Text size="sm">
              {job.location ? `${job.location.prefecture.name} ${job.location.city}` : '勤務地未定'}
            </Text>
          </Group>
          <Group gap="xs">
            <IconCurrencyYen size={18} />
            <Text size="sm">
              {job.salaryMin ? `${job.salaryMin}万円~` : "応相談"}
            </Text>
          </Group>
        </Group>

        <Divider />

        <div>
          <Text fw={500} mb="xs">仕事内容</Text>
          <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
            {job.description}
          </Text>
        </div>

        <Group gap="xs">
          {job.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </Group>

        <Divider />

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>閉じる</Button>
          <Button 
            onClick={handleApply} 
            disabled={applied}
            color={applied ? "green" : "blue"}
          >
            {applied ? "応募済み" : "この求人に応募する"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
