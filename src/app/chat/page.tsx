"use client";

import { useState, useRef, useEffect } from "react";
import {
  ActionIcon,
  Text,
  TextInput,
  Stack,
  ScrollArea,
  Group,
  Container,
  Paper,
  Title,
} from "@mantine/core";
import { IconSend, IconRobot, IconUser } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function ChatPage() {
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
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
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "エラーが発生しました。もう一度お試しください。",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="md" py="xl" h="calc(100vh - 80px)">
      <Paper
        shadow="sm"
        p="md"
        radius="md"
        h="100%"
        display="flex"
        style={{ flexDirection: "column" }}
      >
        <Group mb="md" justify="center">
          <IconRobot size={24} color="var(--mantine-color-emerald-6)" />
          <Title order={3}>LocalLink AI Assistant</Title>
        </Group>

        <ScrollArea style={{ flex: 1 }} viewportRef={scrollRef} mb="md">
          <Stack gap="md" px="xs">
            {messages.map((msg) => (
              <Group
                key={msg.id}
                align="flex-start"
                justify={msg.role === "user" ? "flex-end" : "flex-start"}
                gap="xs"
              >
                {msg.role === "ai" && (
                  <IconRobot
                    size={28}
                    color="var(--mantine-color-emerald-6)"
                    style={{ marginTop: 4 }}
                  />
                )}
                {msg.role === "user" && (
                  <Text
                    size="xs"
                    c="dimmed"
                    style={{ alignSelf: "flex-end", marginBottom: 4 }}
                  >
                    {msg.timestamp.toLocaleTimeString("ja-JP", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                )}
                <Paper
                  p="sm"
                  radius="lg"
                  bg={msg.role === "user" ? "emerald.1" : "gray.0"}
                  px="lg"
                  maw="80%"
                >
                  <div className="markdown-body" style={{ fontSize: "14px" }}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "var(--mantine-color-emerald-7)",
                              textDecoration: "underline",
                            }}
                          >
                            {children}
                          </a>
                        ),
                        p: ({ children }) => (
                          <Text size="md" mb="xs">
                            {children}
                          </Text>
                        ),
                        ul: ({ children }) => (
                          <ul
                            style={{
                              paddingLeft: "1.5em",
                              marginBottom: "0.5em",
                            }}
                          >
                            {children}
                          </ul>
                        ),
                        li: ({ children }) => (
                          <li style={{ marginBottom: "0.2em" }}>{children}</li>
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </Paper>
                {msg.role === "ai" && (
                  <Text
                    size="xs"
                    c="dimmed"
                    style={{ alignSelf: "flex-end", marginBottom: 4 }}
                  >
                    {msg.timestamp.toLocaleTimeString("ja-JP", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                )}
                {msg.role === "user" && (
                  <IconUser size={28} color="gray" style={{ marginTop: 4 }} />
                )}
              </Group>
            ))}
            {isLoading && (
              <Group align="center" gap="xs">
                <IconRobot size={28} color="var(--mantine-color-emerald-6)" />
                <Text size="sm" c="dimmed">
                  入力中...
                </Text>
              </Group>
            )}
          </Stack>
        </ScrollArea>

        <Group gap="xs">
          <TextInput
            ref={inputRef}
            placeholder="AIに相談する..."
            style={{ flex: 1 }}
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.nativeEvent.isComposing && handleSend()
            }
            size="md"
            disabled={isLoading}
          />
          <ActionIcon
            variant="filled"
            color="emerald"
            size="xl"
            onClick={handleSend}
            loading={isLoading}
          >
            <IconSend size={24} />
          </ActionIcon>
        </Group>
      </Paper>
    </Container>
  );
}
