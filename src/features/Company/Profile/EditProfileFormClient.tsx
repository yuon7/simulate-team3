"use client";

import { useState } from "react";
import {
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Button,
  Stack,
  Title,
  Box,
  LoadingOverlay,
} from "@mantine/core";
import { ImageUpload } from "@/components/ImageUpload/ImageUpload";
import { updateCompanyProfile } from "./action";
import { Organization, Location } from "@prisma/client";

interface EditProfileFormClientProps {
  organization: Organization & { location: Location };
  initialLogoUrl?: string | null;
}

export function EditProfileFormClient({
  organization,
  initialLogoUrl,
}: EditProfileFormClientProps) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      let avatarPath = null;

      if (file) {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${user.id}/${Math.random().toString(36).substring(7)}.${fileExt}`;

          console.log("Client-side uploading logo to:", fileName);
          const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(fileName, file, { upsert: true });

          if (uploadError) {
            console.error("Client-side upload error:", uploadError);
            throw new Error(
              `画像のアップロードに失敗しました: ${uploadError.message}`,
            );
          }
          avatarPath = fileName;
        }
      }

      if (avatarPath) {
        formData.set("logoPath", avatarPath);
      }

      await updateCompanyProfile(formData);
    } catch (error: any) {
      if (error?.digest?.startsWith("NEXT_REDIRECT")) {
        throw error;
      }
      console.error(error);
      alert(error.message || "保存中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} />
      <form action={handleSubmit}>
        <Stack gap="md">
          <Title order={3} size="h4">
            基本情報
          </Title>

          <ImageUpload
            initialImageUrl={initialLogoUrl}
            onFileChange={setFile}
            label="組織ロゴ"
          />
          <input
            type="file"
            name="logoFile"
            style={{ display: "none" }}
            accept="image/png,image/jpeg,image/jpg"
          />

          <TextInput
            label="企業名"
            name="name"
            defaultValue={organization.name}
            required
          />

          <Select
            label="組織種別"
            name="organizationType"
            defaultValue={organization.organizationType}
            data={[
              { value: "COMPANY", label: "一般企業" },
              { value: "GOVERNMENT", label: "自治体" },
            ]}
            readOnly
          />

          <TextInput
            label="業界"
            name="industry"
            defaultValue={organization.industry || ""}
            placeholder="IT, 製造, 観光など"
          />

          <TextInput
            label="Webサイト"
            name="websiteUrl"
            defaultValue={organization.websiteUrl || ""}
            placeholder="https://example.com"
          />

          <Title order={3} size="h4" mt="md">
            会社概要
          </Title>

          <Textarea
            label="事業内容・紹介文"
            name="description"
            defaultValue={organization.description || ""}
            autosize
            minRows={4}
          />

          <NumberInput
            label="従業員数"
            name="employeeCount"
            defaultValue={organization.employeeCount || undefined}
            min={0}
          />

          <TextInput
            label="資本金"
            name="capital"
            defaultValue={organization.capital || ""}
            placeholder="1000万円"
          />

          <Button type="submit" mt="xl" size="md" loading={loading}>
            変更を保存する
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
