import { Card, Text, Avatar, Group, Button, Stack, Badge, Divider } from '@mantine/core';
import { IconMail, IconPhone, IconMapPin, IconEdit } from '@tabler/icons-react';
import styles from './ProfileCard.module.css';

interface ProfileCardProps {
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  bio: string;
  skills: string[];
  onEdit?: () => void;
}

export default function ProfileCard({
  name,
  email,
  phone,
  location,
  role,
  bio,
  skills,
  onEdit,
}: ProfileCardProps) {
  return (
    <Card shadow="lg" padding="xl" radius="md" withBorder className={styles.card}>
      <Group justify="space-between" mb="md">
        <Group>
          <Avatar size="xl" radius="md" color="blue">
            {name.charAt(0)}
          </Avatar>
          <div>
            <Text size="xl" fw={700}>
              {name}
            </Text>
            <Text size="sm" color="dimmed">
              {role}
            </Text>
          </div>
        </Group>
        <Button leftSection={<IconEdit size={16} />} variant="light" onClick={onEdit}>
          編集
        </Button>
      </Group>

      <Divider my="md" />

      <Stack gap="md">
        <div>
          <Text size="sm" fw={500} mb="xs">
            自己紹介
          </Text>
          <Text size="sm" color="dimmed">
            {bio}
          </Text>
        </div>

        <div>
          <Text size="sm" fw={500} mb="xs">
            連絡先
          </Text>
          <Stack gap="xs">
            <Group gap="xs">
              <IconMail size={16} color="gray" />
              <Text size="sm">{email}</Text>
            </Group>
            <Group gap="xs">
              <IconPhone size={16} color="gray" />
              <Text size="sm">{phone}</Text>
            </Group>
            <Group gap="xs">
              <IconMapPin size={16} color="gray" />
              <Text size="sm">{location}</Text>
            </Group>
          </Stack>
        </div>

        <div>
          <Text size="sm" fw={500} mb="xs">
            スキル
          </Text>
          <Group gap="xs">
            {skills.map((skill) => (
              <Badge key={skill} variant="light" color="blue">
                {skill}
              </Badge>
            ))}
          </Group>
        </div>
      </Stack>
    </Card>
  );
}
