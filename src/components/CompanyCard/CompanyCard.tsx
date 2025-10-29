'use client';

import { Card, Text, Group, Badge, Stack, Button, Divider } from '@mantine/core';
import { IconMail, IconPhone, IconMapPin, IconBuilding } from '@tabler/icons-react';

type CompanyCardProps = {
  name: string;
  industry: string;
  location: string;
  established: string;
  employees: string;
  email: string;
  phone: string;
  description: string;
  services: string[];
  hiring?: boolean;
};

export function CompanyCard({
  name,
  industry,
  location,
  established,
  employees,
  email,
  phone,
  description,
  services,
  hiring,
}: CompanyCardProps) {
  return (
    <Card shadow="md" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <div>
          <Text fw={700} size="lg">{name}</Text>
          <Text c="dimmed">{industry}</Text>
        </div>

        {hiring && (
          <Badge color="green" size="lg" variant="filled">
            採用中
          </Badge>
        )}
      </Group>

      <Divider mb="md" />

      <Stack gap="xs">
        <Text><IconMapPin size={16} style={{ marginRight: 4 }} /> {location}</Text>
        <Text><IconBuilding size={16} style={{ marginRight: 4 }} /> 設立: {established}</Text>
        <Text>従業員数: {employees}</Text>
        <Text><IconMail size={16} style={{ marginRight: 4 }} /> {email}</Text>
        <Text><IconPhone size={16} style={{ marginRight: 4 }} /> {phone}</Text>
      </Stack>

      <Text mt="md">{description}</Text>

      <Group mt="md">
        {services.map((service) => (
          <Badge key={service} color="blue" variant="light">
            {service}
          </Badge>
        ))}
      </Group>

      <Button mt="lg" fullWidth color="blue">
        企業サイトを見る
      </Button>
    </Card>
  );
}
