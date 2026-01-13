"use client";

import {
  Container,
  Title,
  Card,
  Text,
  Center,
  Loader,
  Alert,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useParams } from "next/navigation";
import { JobForm } from "@/features/Company/Job/JobForm";

export default function EditJobPage() {
  const params = useParams();
  const id = params.id;

  const { data: job, error, isLoading } = useSWR(`/api/jobs/${id}`, fetcher);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );
  }

  if (error || !job) {
    return (
      <Container py="xl">
        <Alert icon={<IconInfoCircle />} title="エラー" color="red">
          求人情報の取得に失敗しました。
        </Alert>
      </Container>
    );
  }

  const initialValues = {
    id: job.id,
    title: job.title,
    description: job.description,
    employmentType: job.employmentType,
    jobCategoryId: job.jobCategoryId.toString(),
    tags: job.tags,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    location: job.location
      ? {
          prefectureId: job.location.prefectureId,
          city: job.location.city,
        }
      : null,
  };

  return (
    <Container size="sm" py="xl">
      <Title order={1} mb="xl">
        求人を編集
      </Title>

      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <JobForm mode="edit" initialValues={initialValues} />
      </Card>
    </Container>
  );
}
