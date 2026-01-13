"use client";

import { useForm } from "@mantine/form";
import {
  TextInput,
  Textarea,
  Button,
  Group,
  Box,
  LoadingOverlay,
  TagsInput,
  FileInput,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { mutate } from "swr";
import { createClient } from "@/lib/supabase/client";
import { IconPhoto } from "@tabler/icons-react";
import { ImageUpload } from "@/components/ImageUpload/ImageUpload";

type ProfileData = {
  name: string;
  phone: string;
  bio: string;
  skills: string[];
  avatarUrl?: string | null;
};

type EditProfileFormProps = {
  initialData: ProfileData;
  onSuccess: () => void;
  onCancel: () => void;
};

export function EditProfileForm({
  initialData,
  onSuccess,
  onCancel,
}: EditProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm({
    initialValues: {
      name: initialData.name,
      phone: initialData.phone,
      bio: initialData.bio,
      skills: initialData.skills,
    },
    validate: {
      name: (value) => (value.length < 1 ? "名前を入力してください" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      let avatarPath = null;

      if (file) {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${user.id}/${Math.random().toString(36).substring(7)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(fileName, file, { upsert: true });

          if (uploadError) throw uploadError;
          avatarPath = fileName;
        }
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, avatarPath }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      // Revalidate SWR cache
      await mutate("/api/profile");

      onSuccess();
    } catch (error) {
      console.error(error);
      alert("プロフィールの更新に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <ImageUpload
          initialImageUrl={initialData.avatarUrl}
          onFileChange={setFile}
          label="プロフィール画像"
        />

        <TextInput
          withAsterisk
          label="氏名"
          mb="md"
          {...form.getInputProps("name")}
        />

        <TextInput label="電話番号" mb="md" {...form.getInputProps("phone")} />

        <Textarea
          label="自己紹介"
          minRows={4}
          mb="md"
          {...form.getInputProps("bio")}
        />

        <TagsInput
          label="スキル"
          placeholder="スキルを入力してEnterで追加"
          data={[
            "React",
            "Next.js",
            "TypeScript",
            "Node.js",
            "Python",
            "Go",
            "Java",
          ]}
          mb="xl"
          {...form.getInputProps("skills")}
        />

        <Group justify="flex-end">
          <Button variant="default" onClick={onCancel}>
            キャンセル
          </Button>
          <Button type="submit">保存する</Button>
        </Group>
      </form>
    </Box>
  );
}
