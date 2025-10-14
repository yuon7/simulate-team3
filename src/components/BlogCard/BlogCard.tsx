import { Card, Text, Group, Badge, Image, Button } from '@mantine/core';
import { IconCalendar, IconUser, IconClock } from '@tabler/icons-react';
import styles from './BlogCard.module.css';

interface BlogCardProps {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
}

export default function BlogCard({
  id,
  title,
  excerpt,
  author,
  date,
  category,
  readTime,
  image,
}: BlogCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className={styles.card}>
      <Card.Section>
        <Image
          src={image}
          height={160}
          alt={title}
          fallbackSrc="https://via.placeholder.com/400x200?text=No+Image"
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Badge color="blue" variant="light">
          {category}
        </Badge>
        <Text size="xs" color="dimmed">
          {readTime}
        </Text>
      </Group>

      <Text fw={500} size="lg" mb="xs" className={styles.title}>
        {title}
      </Text>

      <Text size="sm" color="dimmed" mb="md" className={styles.excerpt}>
        {excerpt}
      </Text>

      <Group justify="space-between">
        <Group gap="xs">
          <Group gap={4}>
            <IconUser size={14} color="gray" />
            <Text size="xs" color="dimmed">
              {author}
            </Text>
          </Group>
          <Group gap={4}>
            <IconCalendar size={14} color="gray" />
            <Text size="xs" color="dimmed">
              {date}
            </Text>
          </Group>
        </Group>
        <Button variant="light" size="xs">
          読む
        </Button>
      </Group>
    </Card>
  );
}
