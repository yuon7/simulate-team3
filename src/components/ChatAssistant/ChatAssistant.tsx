"use client";

import { useState, useRef, useEffect } from "react";
import {
  ActionIcon,
  Paper,
  Text,
  TextInput,
  Stack,
  ScrollArea,
  Group,
  Avatar,
  Box,
  Badge,
} from "@mantine/core";
import { IconMessage, IconSend, IconX, IconRobot } from "@tabler/icons-react";
import styles from "./ChatAssistant.module.css";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

export const ChatAssistant = () => {
  const [opened, setOpened] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "こんにちは！LocalLink キャリアアシスタントです。あなたのスキルや希望にぴったりの地域・求人探しをお手伝いします。どのようなお仕事をお探しですか？",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: data.text || "申し訳ありません、エラーが発生しました。",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {!opened && (
        <div className={styles.trigger} onClick={() => setOpened(true)}>
          <IconMessage size={32} />
        </div>
      )}

      {opened && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <Group gap="xs">
              <IconRobot size={20} />
              <Text size="sm" fw={700}>
                LocalLink Assistant
              </Text>
            </Group>
            <ActionIcon
              variant="transparent"
              color="white"
              onClick={() => setOpened(false)}
            >
              <IconX size={20} />
            </ActionIcon>
          </div>

          <ScrollArea className={styles.messageList} viewportRef={scrollRef}>
            <Stack gap="md">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.message} ${
                    msg.role === "user" ? styles.userMessage : styles.aiMessage
                  }`}
                >
                  <Text size="sm">{msg.text}</Text>
                  <Text
                    size="xs"
                    mt={4}
                    opacity={0.7}
                    ta={msg.role === "user" ? "right" : "left"}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </div>
              ))}
              {isLoading && (
                <div className={`${styles.message} ${styles.aiMessage}`}>
                  <Text size="sm">入力中...</Text>
                </div>
              )}
            </Stack>
          </ScrollArea>

          <div className={styles.inputArea}>
            <Group gap="xs">
              <TextInput
                placeholder="メッセージを入力..."
                style={{ flex: 1 }}
                value={input}
                onChange={(e) => setInput(e.currentTarget.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <ActionIcon
                variant="filled"
                color="var(--primary-green)"
                size="lg"
                onClick={handleSend}
                disabled={isLoading}
              >
                <IconSend size={20} />
              </ActionIcon>
            </Group>
          </div>
        </div>
      )}
    </div>
  );
};
