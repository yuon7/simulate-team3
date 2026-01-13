"use client";

import { useFormState } from "react-dom";
import { createCandidateProfile } from "./action";
import { 
  Container, 
  Card, 
  Title, 
  Text, 
  TextInput, 
  Select, 
  Textarea, 
  Button, 
  FileInput, 
  Stack,
  Group,
  Alert
} from "@mantine/core";
import { IconPhoto, IconAlertCircle } from "@tabler/icons-react";
import { PREFECTURES } from "@/constants/prefectures";
import { ImageUpload } from "@/components/ImageUpload/ImageUpload";

const initialState = {
  error: "",
};

export default function CandidateOnboardingPage() {
  const [state, formAction] = useFormState(createCandidateProfile, initialState);

  return (
    <Container size="md" py="xl">
      <Card shadow="lg" padding="xl" radius="md" withBorder>
        <Title order={1} mb="md">求職者プロフィール登録</Title>
        <Text c="dimmed" mb="xl">
          あなたにぴったりの仕事や移住先を見つけるために、プロフィールを入力してください。
        </Text>

        {state?.error && (
          <Alert icon={<IconAlertCircle size={16} />} title="エラー" color="red" mb="md">
            {state.error}
          </Alert>
        )}

        <form action={formAction}>
          <Stack gap="md">
            <Stack align="center" mb="lg">
              <ImageUpload
                label="プロフィール画像"
                onFileChange={(file: File | null) => {
                  // Standard form submission needs the file in an input
                  const input = document.querySelector('input[name="avatar"]') as HTMLInputElement;
                  if (input) {
                    const dataTransfer = new DataTransfer();
                    if (file) dataTransfer.items.add(file);
                    input.files = dataTransfer.files;
                  }
                }}
              />
              <input type="file" name="avatar" style={{ display: "none" }} accept="image/png,image/jpeg,image/jpg" />
            </Stack>

            <TextInput
              label="お名前"
              placeholder="山田 太郎"
              name="name"
              required
              withAsterisk
            />

            <Group grow>
              <Select
                label="性別"
                placeholder="選択してください"
                name="gender"
                required
                withAsterisk
                data={[
                  { value: "男性", label: "男性" },
                  { value: "女性", label: "女性" },
                  { value: "その他", label: "その他" },
                  { value: "回答しない", label: "回答しない" },
                ]}
              />

              <TextInput
                label="年齢"
                placeholder="25"
                name="age"
                type="number"
                min={15}
                max={100}
                required
                withAsterisk
              />
            </Group>

            <Select
              label="出身都道府県"
              placeholder="選択してください"
              name="prefectureId"
              searchable
              data={PREFECTURES.map((pref) => ({
                value: pref.id.toString(),
                label: pref.name,
              }))}
            />

            <TextInput
              label="出身市区町村"
              placeholder="例: 渋谷区"
              name="city"
              description="出身都道府県を選択した場合は入力してください"
            />

            <Textarea
              label="自己紹介"
              placeholder="これまでの経歴や、移住・転職にかける思いなどを自由にご記入ください。"
              name="bio"
              minRows={4}
              autosize
            />

            <Button type="submit" fullWidth size="lg" mt="md">
              登録してはじめる
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
