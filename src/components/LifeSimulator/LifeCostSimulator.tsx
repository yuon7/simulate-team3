"use client";
import { Card, Title, Text, TextInput, Button, Group } from "@mantine/core";
import { useState } from "react";

export function LifeCostSimulator() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState<string | null>(null);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4}>💰 生活コスト試算（デモ）</Title>
      <Text mt="xs" c="dimmed">
        移住先を入力して、概算の生活費をシミュレーション（現在はダミーです）。
      </Text>

      <Group mt="md">
        <TextInput
          placeholder="例：長野県松本市"
          value={city}
          onChange={(e) => setCity(e.currentTarget.value)}
        />
        <Button
          onClick={() => setResult(`📊 ${city || "指定地域"} の生活費は月約12万円です（仮）`)}
        >
          試算する
        </Button>
      </Group>

      {result && (
        <Text mt="md" fw={500}>
          {result}
        </Text>
      )}
    </Card>
  );
}