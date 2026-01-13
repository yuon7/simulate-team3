"use client";

import { useFormState } from "react-dom";
import { createCompanyProfile } from "./action";
import { PREFECTURES } from "@/constants/prefectures";
import {
  Container,
  Card,
  Title,
  Text,
  TextInput,
  Select,
  Button,
  Stack,
  Group,
  Alert,
  Divider,
  FileInput,
} from "@mantine/core";
import { IconAlertCircle, IconPhoto } from "@tabler/icons-react";
import { ImageUpload } from "@/components/ImageUpload/ImageUpload";

const initialState = {
  error: "",
};

export default function CompanyOnboardingPage() {
  const [state, formAction] = useFormState(createCompanyProfile, initialState);

  return (
    <Container size="md" py="xl">
      <Card shadow="lg" padding="xl" radius="md" withBorder>
        <Title order={1} mb="md">
          企業・自治体情報登録
        </Title>
        <Text c="dimmed" mb="xl">
          求人を掲載するために、組織情報と担当者情報を登録してください。
        </Text>

        {state?.error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="エラー"
            color="red"
            mb="md"
          >
            {state.error}
          </Alert>
        )}

        <form action={formAction}>
          <Stack gap="lg">
            <Stack align="center" mb="lg">
              <ImageUpload
                label="組織ロゴ / プロフィール画像"
                onFileChange={(file: File | null) => {
                  const input = document.querySelector(
                    'input[name="avatar"]',
                  ) as HTMLInputElement;
                  if (input) {
                    const dataTransfer = new DataTransfer();
                    if (file) dataTransfer.items.add(file);
                    input.files = dataTransfer.files;
                  }
                }}
              />
              <input
                type="file"
                name="avatar"
                style={{ display: "none" }}
                accept="image/png,image/jpeg,image/jpg"
              />
            </Stack>

            {/* Organization Section */}
            <div>
              <Title order={3} mb="md">
                組織情報
              </Title>

              <Stack gap="md">
                <TextInput
                  label="組織名 (企業名・自治体名)"
                  placeholder="株式会社〇〇 / 〇〇市役所"
                  name="orgName"
                  required
                  withAsterisk
                />

                <Select
                  label="組織種別"
                  placeholder="選択してください"
                  name="orgType"
                  required
                  withAsterisk
                  data={[
                    { value: "COMPANY", label: "一般企業" },
                    { value: "GOVERNMENT", label: "自治体" },
                  ]}
                />

                <Group grow>
                  <Select
                    label="都道府県"
                    placeholder="選択してください"
                    name="prefectureId"
                    required
                    withAsterisk
                    searchable
                    data={PREFECTURES.map((pref) => ({
                      value: pref.id.toString(),
                      label: pref.name,
                    }))}
                  />

                  <TextInput
                    label="市区町村"
                    placeholder="〇〇市"
                    name="city"
                    required
                    withAsterisk
                  />
                </Group>
              </Stack>
            </div>

            <Divider />

            {/* Staff Information Section */}
            <div>
              <Title order={3} mb="md">
                担当者情報
              </Title>

              <Stack gap="md">
                <TextInput
                  label="担当者名"
                  placeholder="山田 太郎"
                  name="staffName"
                  required
                  withAsterisk
                />

                <Group grow>
                  <TextInput
                    label="部署名"
                    placeholder="人事部"
                    name="department"
                  />

                  <TextInput label="役職" placeholder="採用担当" name="title" />
                </Group>
              </Stack>
            </div>

            <Button type="submit" fullWidth size="lg" mt="md">
              登録してはじめる
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
