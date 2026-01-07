"use client";

import { useForm, zodResolver } from "@mantine/form";
import { TextInput, Textarea, NumberInput, Select, Button, Group, TagsInput, Box, LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

// employment type options (mock for now, ideally from Enum or DB)
const EMPLOYMENT_TYPES = ["正社員", "契約社員", "業務委託", "アルバイト", "パート"];

// mock job categories (ideally from DB)
const JOB_CATEGORIES = [
  { value: "1", label: "エンジニア" },
  { value: "2", label: "デザイナー" },
  { value: "3", label: "営業" },
  { value: "4", label: "マーケティング" },
];

export function CreateJobForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      employmentType: "正社員",
      jobCategoryId: "1",
      tags: [],
      organizationId: 1, // Validation bypass: Hardcoded for now as auth is not fully enforced
    },
    validate: {
      title: (value: string) => (value.length < 2 ? "タイトルは2文字以上で入力してください" : null),
      description: (value: string) => (value.length < 10 ? "求人詳細は10文字以上で入力してください" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          jobCategoryId: parseInt(values.jobCategoryId),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create job");
      }

      const data = await res.json();
      console.log("Job created:", data);
      
      // Redirect to company dashboard or listings
      router.push("/"); 
      router.refresh();
      
    } catch (error) {
      console.error(error);
      alert("求人の作成に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maw={600} mx="auto" pos="relative">
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          withAsterisk
          label="求人タイトル"
          placeholder="例：Webアプリケーションエンジニア"
          mb="md"
          {...form.getInputProps("title")}
        />

        <Select
          label="職種"
          data={JOB_CATEGORIES}
          mb="md"
          {...form.getInputProps("jobCategoryId")}
        />

        <Select
          label="雇用形態"
          data={EMPLOYMENT_TYPES}
          mb="md"
          {...form.getInputProps("employmentType")}
        />

        <Textarea
          withAsterisk
          label="仕事内容・詳細"
          placeholder="具体的な業務内容や魅力を記述してください"
          minRows={5}
          mb="md"
          {...form.getInputProps("description")}
        />

        <TagsInput
          label="特徴タグ"
          placeholder="タグを入力してEnterで追加"
          data={["リモートワーク可", "フレックス", "未経験歓迎", "賞与あり", "移住支援あり"]}
          mb="xl"
          {...form.getInputProps("tags")}
        />

        <Group justify="flex-end">
           <Button variant="default" onClick={() => router.back()}>キャンセル</Button>
           <Button type="submit">求人を作成する</Button>
        </Group>
      </form>
    </Box>
  );
}
