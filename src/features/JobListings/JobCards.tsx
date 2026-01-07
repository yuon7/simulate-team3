"use client"

import { Grid, Card, Badge, Group, Button, Stack, Title, Text, Loader, Center, Alert } from "@mantine/core"
import { IconMapPin, IconBuilding, IconCurrencyYen, IconArrowRight, IconInfoCircle } from "@tabler/icons-react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import jobCardStyles from "./JobCards.module.css"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import { JobDetailModal } from "./JobDetailModal"

type Job = {
  id: number
  title: string
  description: string
  employmentType: string
  tags: string[]
  organization: {
    name: string
  }
  location: {
    city: string
    prefecture: {
      name: string
    }
  } | null
  salaryMin: number | null
  salaryMax: number | null
}

type JobsResponse = {
  data: Job[]
  meta: {
    total: number
  }
}

type JobCardsProps = {
  company?: string; 
};

export function JobCards({ company }: JobCardsProps) {
  // Filters could be passed here
  const { data, error, isLoading } = useSWR<JobsResponse>('/api/jobs', fetcher)
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleOpenDetail = (job: Job) => {
    setSelectedJob(job);
    open();
  };

  if (isLoading) {
    return (
      <Center h={200}>
        <Loader />
      </Center>
    )
  }

  if (error) {
    return (
      <Alert icon={<IconInfoCircle />} title="エラー" color="red" mb="xl">
        求人情報の取得に失敗しました。
      </Alert>
    )
  }

  const jobs = data?.data || []
  
  // Note: Client-side filtering for 'company' prop is suboptimal for large datasets, 
  // but matches the previous existing logic. Ideally, pass filter to API.
  const jobsToDisplay = company
    ? jobs.filter((job) => job.organization.name === company)
    : jobs;
  


  if (jobsToDisplay.length === 0) {
    return (
       <Alert icon={<IconInfoCircle />} title="お知らせ" color="blue" mb="xl">
        現在掲載されている求人はありません。
      </Alert>
    )
  }

  return (
    <>
      <Grid gutter="lg" mb={48}>
        {jobsToDisplay.map((job) => (
          <Grid.Col key={job.id} span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" className={jobCardStyles.jobCard}>
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <Title order={4}>{job.title}</Title>
                  <Badge variant="light" color="blue">
                    {job.employmentType}
                  </Badge>
                </Group>

                <Stack gap="xs">
                  <Group gap="xs">
                    <IconBuilding size={16} className={jobCardStyles.icon} />
                    <Text size="sm" c="dimmed">
                      {job.organization.name}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <IconMapPin size={16} className={jobCardStyles.icon} />
                    <Text size="sm" c="dimmed">
                       {job.location ? `${job.location.prefecture.name} ${job.location.city}` : '勤務地未定'}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <IconCurrencyYen size={16} className={jobCardStyles.icon} />
                    <Text size="sm" c="dimmed">
                      {job.salaryMin ? `${job.salaryMin}万円~` : "応相談"}
                    </Text>
                  </Group>
                </Stack>

                <Text size="sm" c="dimmed" lineClamp={2}>
                  {job.description}
                </Text>

                <Group gap="xs">
                  {job.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </Group>

                <Group gap="sm" mt="md">
                  <Button 
                    flex={1} 
                    rightSection={<IconArrowRight size={16} />}
                    onClick={() => handleOpenDetail(job)}
                  >
                    詳細を見る
                  </Button>
                  <Button variant="outline">生活シミュレーション</Button>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
      
      <JobDetailModal 
        job={selectedJob} 
        opened={opened} 
        onClose={close} 
      />
    </>
  )
}