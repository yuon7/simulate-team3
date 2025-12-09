import { createClient } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";
import { TextInput, Textarea, NumberInput, Select, Button, Stack, Title } from "@mantine/core";
import { updateCompanyProfile } from "./action";
import { redirect } from "next/navigation";

export async function EditProfileForm() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const prisma = new PrismaClient();
  const staffProfile = await prisma.staffProfile.findUnique({
    where: { userId: user.id },
    include: {
      organization: {
        include: {
          location: true,
        },
      },
    },
  });

  if (!staffProfile || !staffProfile.organization) {
    return <div>組織情報が見つかりません</div>;
  }

  const { organization } = staffProfile;

  return (
    <form action={updateCompanyProfile}>
      <Stack gap="md">
        <Title order={3} size="h4">基本情報</Title>
        
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
          readOnly // Usually type doesn't change easily
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
        
        <TextInput
          label="ロゴURL"
          name="logoUrl"
          defaultValue={organization.logoUrl || ""}
          placeholder="https://example.com/logo.png"
        />

        <Title order={3} size="h4" mt="md">会社概要</Title>

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

         {/* TODO: Date founded input, Location inputs */}
        
        <Button type="submit" mt="xl" size="md">
          変更を保存する
        </Button>
      </Stack>
    </form>
  );
}
