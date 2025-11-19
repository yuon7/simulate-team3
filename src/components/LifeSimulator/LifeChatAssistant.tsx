"use client";

import { useState } from "react";
import { Card, Textarea, Button, Text } from "@mantine/core";

export default function LifeChatAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/simulate/life-chat", {
        method: "POST",
        body: JSON.stringify({ message: question }),
      });

      const data = await res.json();
      setAnswer(data.reply || "回答を取得できませんでした。");
    } catch (err) {
      console.error(err);
      setAnswer("サーバーとの通信に失敗しました。");
    }

    setLoading(false);
  };

  return (
    <Card withBorder padding="lg" radius="md">
      <Textarea
        label="質問を入力"
        placeholder="例：福岡に移住した場合の生活費を教えて"
        minRows={3}
        value={question}
        onChange={(e) => setQuestion(e.currentTarget.value)}
      />

      <Button
        mt="md"
        onClick={handleSend}
        loading={loading}
      >
        回答を取得する
      </Button>

      {answer && (
        <Card mt="md" padding="md" radius="md" withBorder>
          <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
            {answer}
          </Text>
        </Card>
      )}
    </Card>
  );
}

