"use client";
import { Card, Title, Text, Textarea, Button } from "@mantine/core";
import { useState } from "react";

export function LifeChatAssistant() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<string | null>(null);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4}>💬 暮らし相談AI（デモ）</Title>
      <Text mt="xs" c="dimmed">
        ChatGPTと話して、理想の暮らしを相談できます（現在はダミー応答です）。
      </Text>

      <Textarea
        mt="md"
        placeholder="例：自然が多くて静かな場所に住みたい"
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
      />
      <Button
        mt="md"
        onClick={() => setReply("🌳 自然豊かな地域なら長野県や熊本県がおすすめです！")}
      >
        相談する
      </Button>

      {reply && (
        <Text mt="md" fw={500}>
          {reply}
        </Text>
      )}
    </Card>
  );
}
