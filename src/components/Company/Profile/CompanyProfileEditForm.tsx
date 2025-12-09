import { Container, Title, Button, Group } from "@mantine/core";
import Link from "next/link";
import { EditProfileForm } from "@/features/Company/Profile/EditProfileForm";
import styles from "./CompanyProfileEditForm.module.css";

export function CompanyProfileEditForm() {
  return (
    <Container size="sm" py="xl" className={styles.container}>
      <Group justify="space-between" mb="xl">
        <Title order={1}>企業情報編集</Title>
        <Button variant="subtle" component={Link} href="/company">
          キャンセル
        </Button>
      </Group>

      <EditProfileForm />
    </Container>
  );
}
