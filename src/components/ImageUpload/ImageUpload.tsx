"use client";

import { useState, useEffect } from "react";
import {
  Avatar,
  FileButton,
  ActionIcon,
  Stack,
  Text,
  Group,
  Box,
  Tooltip,
} from "@mantine/core";
import { IconCamera, IconX } from "@tabler/icons-react";

interface ImageUploadProps {
  initialImageUrl?: string | null;
  onFileChange: (file: File | null) => void;
  label?: string;
  size?: number;
  error?: string;
}

export function ImageUpload({
  initialImageUrl,
  onFileChange,
  label,
  size = 120,
  error,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    initialImageUrl || null,
  );
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialImageUrl) {
      setPreview(initialImageUrl);
    }
  }, [initialImageUrl]);

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    if (newFile) {
      const url = URL.createObjectURL(newFile);
      setPreview(url);
      onFileChange(newFile);
    } else {
      setPreview(initialImageUrl || null);
      onFileChange(null);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFileChange(null);
  };

  return (
    <Stack align="center" gap="xs">
      {label && (
        <Text size="sm" fw={500}>
          {label}
        </Text>
      )}

      <Box pos="relative">
        <FileButton
          onChange={handleFileChange}
          accept="image/png,image/jpeg,image/webp"
        >
          {(props) => (
            <Avatar
              {...props}
              src={preview}
              size={size}
              radius={size}
              style={{
                cursor: "pointer",
                border: error
                  ? "2px solid var(--mantine-color-red-6)"
                  : "1px solid var(--mantine-color-gray-3)",
              }}
            >
              <IconCamera size={size / 3} stroke={1.5} />
            </Avatar>
          )}
        </FileButton>

        {preview && (
          <Tooltip label="リセット">
            <ActionIcon
              variant="white"
              color="gray"
              radius="xl"
              size="sm"
              pos="absolute"
              top={0}
              right={0}
              onClick={handleClear}
            >
              <IconX size={14} />
            </ActionIcon>
          </Tooltip>
        )}
      </Box>

      {error && (
        <Text c="red" size="xs">
          {error}
        </Text>
      )}
    </Stack>
  );
}
