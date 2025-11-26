"use client";
import { Card, Title, Text, TextInput, Button } from "@mantine/core";
import { useState } from "react";

export function SupportNavigator() {
  const [pref, setPref] = useState("");
  const [info, setInfo] = useState<string | null>(null);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4}>🧭 支援制度ナビ（デモ）</Title>
      <Text mt="xs" c="dimmed">
        都道府県名を入力して、移住支援制度を確認（現在はダミー応答です）。
      </Text>

      <TextInput
        mt="md"
        placeholder="例：福井県"
        value={pref}
        onChange={(e) => setPref(e.currentTarget.value)}
      />
      <Button
        mt="md"
        onClick={() =>
          setInfo(
            `🏠 ${pref || "指定地域"} の移住支援金：最大100万円、住宅補助あり（仮データ）`
          )
        }
      >
        確認する
      </Button>

      {info && (
        <Text mt="md" fw={500}>
          {info}
        </Text>
      )}
    </Card>
  );
}