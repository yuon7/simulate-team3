import { Container, Title, Card } from "@mantine/core";
import { CreateJobForm } from "@/features/Company/Job/CreateJobForm";

export default function CreateJobPage() {
  return (
    <Container size="sm" py="xl">
      <Title order={1} mb="xl" ta="center">求人を作成する</Title>
      
      <Card withBorder shadow="sm" radius="md" p="xl">
        <CreateJobForm />
      </Card>
    </Container>
  );
}
