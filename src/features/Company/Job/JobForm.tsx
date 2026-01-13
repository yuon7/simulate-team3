"use client";

import { useForm } from "@mantine/form";
import {
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  TagsInput,
  Box,
  LoadingOverlay,
  NumberInput,
} from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PREFECTURES } from "@/constants/prefectures";

const EMPLOYMENT_TYPES = [
  "正社員",
  "契約社員",
  "業務委託",
  "アルバイト",
  "パート",
];

const JOB_CATEGORIES = [
  { value: "1", label: "エンジニア" },
  { value: "2", label: "デザイナー" },
  { value: "3", label: "営業" },
  { value: "4", label: "マーケティング" },
];

interface JobFormProps {
  initialValues?: {
    id?: number;
    title: string;
    description: string;
    employmentType: string;
    jobCategoryId: string;
    tags: string[];
    salaryMin?: number | null;
    salaryMax?: number | null;
    location?: {
      prefectureId: number;
      city: string;
    } | null;
  };
  mode: "create" | "edit";
}

export function JobForm({ initialValues, mode }: JobFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      employmentType: initialValues?.employmentType || "正社員",
      jobCategoryId: initialValues?.jobCategoryId || "1",
      tags: initialValues?.tags || [],
      salaryMin: initialValues?.salaryMin || undefined,
      salaryMax: initialValues?.salaryMax || undefined,
      prefectureId: initialValues?.location?.prefectureId?.toString() || "",
      city: initialValues?.location?.city || "",
    },
    validate: {
      title: (value: string) =>
        value.length < 2 ? "タイトルは2文字以上で入力してください" : null,
      description: (value: string) =>
        value.length < 10 ? "求人詳細は10文字以上で入力してください" : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const url =
        mode === "create" ? "/api/jobs" : `/api/jobs/${initialValues?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          jobCategoryId: parseInt(values.jobCategoryId),
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to ${mode} job`);
      }

      router.push("/company/jobs");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(`求人の${mode === "create" ? "作成" : "更新"}に失敗しました。`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maw={600} mx="auto" pos="relative">
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          withAsterisk
          label="求人タイトル"
          placeholder="例：Webアプリケーションエンジニア"
          mb="md"
          {...form.getInputProps("title")}
        />

        <Group grow mb="md">
          <Select
            label="職種"
            data={JOB_CATEGORIES}
            {...form.getInputProps("jobCategoryId")}
          />

          <Select
            label="雇用形態"
            data={EMPLOYMENT_TYPES}
            {...form.getInputProps("employmentType")}
          />
        </Group>

        <Group grow mb="md">
          <NumberInput
            label="想定年収 (最低)"
            placeholder="400"
            suffix=" 万円"
            {...form.getInputProps("salaryMin")}
          />
          <NumberInput
            label="想定年収 (最高)"
            placeholder="800"
            suffix=" 万円"
            {...form.getInputProps("salaryMax")}
          />
        </Group>

        <Group grow mb="md">
          <Select
            label="勤務地 (都道府県)"
            placeholder="選択してください"
            data={PREFECTURES.map((p) => ({
              value: p.id.toString(),
              label: p.name,
            }))}
            searchable
            {...form.getInputProps("prefectureId")}
          />
          <TextInput
            label="勤務地 (市区町村)"
            placeholder="〇〇市"
            {...form.getInputProps("city")}
          />
        </Group>

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
          data={[
            "リモートワーク可",
            "フレックス",
            "未経験歓迎",
            "賞与あり",
            "移住支援あり",
            "寮完備",
            "週休2日",
            "転勤なし",
            "残業少なめ",
            "学歴不問",
            "服装自由",
          ]}
          mb="xl"
          {...form.getInputProps("tags")}
        />

        <Group justify="flex-end">
          <Button variant="default" onClick={() => router.back()}>
            キャンセル
          </Button>
          <Button type="submit">
            {mode === "create" ? "求人を作成する" : "求人を更新する"}
          </Button>
        </Group>
      </form>
    </Box>
  );
}
