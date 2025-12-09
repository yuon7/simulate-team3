import { createClient } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";
import { Text, Group, Badge, Stack, Avatar } from "@mantine/core";
import { IconMapPin, IconBuilding, IconUsers, IconCalendar } from "@tabler/icons-react";

export async function CompanyProfileSummary() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <Text>ログインしていません。</Text>;

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
    return <Text>企業情報が見つかりません。</Text>;
  }

  const { organization } = staffProfile;

  return (
    <Stack gap="md">
      <Group align="flex-start">
         <Avatar 
          src={organization.logoUrl} 
          alt={organization.name} 
          size="xl" 
          radius="md"
          color="blue"
        >
          {organization.name.charAt(0)}
        </Avatar>
        
        <div>
          <Group gap="xs" mb={4}>
            <Title order={3} size="h4">{organization.name}</Title>
            <Badge variant="light">{organization.organizationType}</Badge>
          </Group>
          
          {organization.industry && (
            <Text size="sm" c="dimmed" mb={8}>{organization.industry}</Text>
          )}

          <Group gap="lg">
            <Group gap={4}>
              <IconMapPin size={16} color="gray" />
              <Text size="sm">
                {organization.location.prefectureId /* Map ID to name later */} 
                {organization.location.city}
              </Text>
            </Group>
            
            {organization.employeeCount && (
              <Group gap={4}>
                <IconUsers size={16} color="gray" />
                <Text size="sm">{organization.employeeCount}名</Text>
              </Group>
            )}

            {organization.foundedDate && (
              <Group gap={4}>
                <IconCalendar size={16} color="gray" />
                <Text size="sm">{new Date(organization.foundedDate).getFullYear()}年設立</Text>
              </Group>
            )}
          </Group>
        </div>
      </Group>

      {organization.description && (
        <div>
          <Text fw={500} size="sm" mb={4}>事業内容</Text>
          <Text size="sm" lineClamp={3}>
            {organization.description}
          </Text>
        </div>
      )}
      
      {!organization.description && (
        <Text c="dimmed" size="sm" fs="italic">
          詳細情報はまだ登録されていません。「プロフィール編集」から情報を追加してください。
        </Text>
      )}
    </Stack>
  );
}

// Helper needed for Title component in server component? 
// Actually Mantine components work in server components if they render basic HTML/CSS.
// Using Mantine Title/Text directly is fine.
import { Title } from "@mantine/core";
