"use client";

import {
  Modal,
  Stack,
  ScrollArea,
  TextInput,
  ActionIcon,
  Group,
  Text,
  Paper,
  Loader,
  Center,
  Divider,
} from "@mantine/core";
import { IconSend, IconUser } from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: number;
  applicationId: number;
  senderId: string;
  content: string;
  readAt: string | null;
  createdAt: string;
};

type ChatModalProps = {
  applicationId: number | null;
  opened: boolean;
  onClose: () => void;
  currentUserId: string | null;
  otherPartyName: string;
};

export function ChatModal({
  applicationId,
  opened,
  onClose,
  currentUserId,
  otherPartyName,
}: ChatModalProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const { data: messages, isLoading } = useSWR<Message[]>(
    applicationId ? `/api/messages?applicationId=${applicationId}` : null,
    fetcher,
  );

  const scrollToBottom = () => {
    if (viewport.current) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages]);

  // Mark as read when opened or new messages arrive
  useEffect(() => {
    if (opened && applicationId) {
      markAsRead();
    }
  }, [opened, messages?.length]);

  const markAsRead = async () => {
    if (!applicationId) return;
    try {
      await fetch("/api/messages/read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });
      // Invalidate applications list to clear badge
      mutate("/api/applications");
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

  // Supabase Realtime
  useEffect(() => {
    if (!applicationId || !opened) return;

    const channel = supabase
      .channel(`chat:${applicationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `applicationId=eq.${applicationId}`,
        },
        () => {
          // Re-fetch messages when a new one is inserted
          mutate(`/api/messages?applicationId=${applicationId}`);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [applicationId, opened]);

  const handleSend = async () => {
    if (!content.trim() || !applicationId) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, content }),
      });

      if (res.ok) {
        setContent("");
        mutate(`/api/messages?applicationId=${applicationId}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`${otherPartyName} さんとのメッセージ`}
      size="lg"
      styles={{ body: { padding: 0 } }}
    >
      <Stack gap={0} h={500}>
        <ScrollArea h={440} p="md" viewportRef={viewport}>
          {isLoading ? (
            <Center h="100%">
              <Loader size="sm" />
            </Center>
          ) : (
            <Stack gap="xs">
              {messages?.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <Group
                    key={msg.id}
                    justify={isMe ? "flex-end" : "flex-start"}
                    align="flex-end"
                    gap="xs"
                  >
                    {!isMe && (
                      <Paper radius="xl" p={4} withBorder>
                        <IconUser size={16} />
                      </Paper>
                    )}

                    {isMe && (
                      <Text size="xs" opacity={0.5} mb={2}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    )}

                    <Paper
                      p="xs"
                      radius="md"
                      bg={isMe ? "blue" : "gray.1"}
                      c={isMe ? "white" : "black"}
                      style={{ maxWidth: "70%" }}
                    >
                      <Text size="sm" style={{ wordBreak: "break-word" }}>
                        {msg.content}
                      </Text>
                    </Paper>

                    {!isMe && (
                      <Text size="xs" opacity={0.5} mb={2}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    )}
                  </Group>
                );
              })}
              {messages?.length === 0 && (
                <Text c="dimmed" ta="center" mt="xl">
                  まだメッセージはありません。
                </Text>
              )}
            </Stack>
          )}
        </ScrollArea>

        <Divider />

        <Group p="md" gap="xs">
          <TextInput
            placeholder="メッセージを入力..."
            style={{ flex: 1 }}
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={sending}
          />
          <ActionIcon
            variant="filled"
            color="blue"
            size="lg"
            onClick={handleSend}
            loading={sending}
            disabled={!content.trim()}
          >
            <IconSend size={18} />
          </ActionIcon>
        </Group>
      </Stack>
    </Modal>
  );
}
