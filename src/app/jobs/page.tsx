"use client";

import { Container, Title, Stack, Group, TextInput, Select, Grid, Card, Text, Badge, Button, Loader, Center, Pagination } from "@mantine/core";
import { IconSearch, IconMapPin, IconBriefcase, IconCurrencyDollar } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import Link from "next/link";
import { JobCards } from "@/features/JobListings/JobCards";

export default function JobSearchPage() {
  const [query, setQuery] = useState("");
  const [prefectureId, setPrefectureId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  // Fetch prefectures for filter
  const { data: prefectures } = useSWR("/api/prefectures", fetcher);
  // Fetch categories for filter
  const { data: categories } = useSWR("/api/categories", fetcher);

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (prefectureId) params.append("prefectureId", prefectureId);
    if (categoryId) params.append("jobCategoryId", categoryId);
    if (selectedTags.length > 0) params.append("tags", selectedTags.join(","));
    params.append("page", page.toString());
    params.append("limit", "12");
    return params.toString();
  };

  const { data: jobsData, isLoading } = useSWR(`/api/jobs?${buildQuery()}`, fetcher);

  const prefectureData = prefectures?.map((p: any) => ({ value: p.id.toString(), label: p.name })) || [];
  const categoryData = categories?.map((c: any) => ({ value: c.id.toString(), label: c.name })) || [];
  
  const commonTags = ["リモートワーク可", "フレックス", "未経験歓迎", "賞与あり", "移住支援あり", "寮完備", "週休2日", "転勤なし"];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="xs">求人を探す</Title>
          <Text c="dimmed">地域や職種、タグからあなたにぴったりの仕事を見つけましょう。</Text>
        </div>

        <Card withBorder radius="md" p="md" shadow="sm">
          <Stack gap="md">
            <Grid align="flex-end">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <TextInput
                  label="キーワード"
                  placeholder="求人タイトル、内容など"
                  leftSection={<IconSearch size={16} />}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.currentTarget.value);
                    setPage(1);
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Select
                  label="地域"
                  placeholder="都道府県を選択"
                  leftSection={<IconMapPin size={16} />}
                  data={prefectureData}
                  value={prefectureId}
                  onChange={(val) => {
                    setPrefectureId(val);
                    setPage(1);
                  }}
                  clearable
                  searchable
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Select
                  label="職種"
                  placeholder="職種を選択"
                  leftSection={<IconBriefcase size={16} />}
                  data={categoryData}
                  value={categoryId}
                  onChange={(val) => {
                    setCategoryId(val);
                    setPage(1);
                  }}
                  clearable
                  searchable
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 1 }}>
                 <Button fullWidth variant="light" onClick={() => {
                   setQuery("");
                   setPrefectureId(null);
                   setCategoryId(null);
                   setSelectedTags([]);
                   setPage(1);
                 }}>
                   リセット
                 </Button>
              </Grid.Col>
            </Grid>
            
            <Group gap="xs">
              <Text size="sm" fw={500}>タグで絞り込む:</Text>
              <Group gap={8}>
                {commonTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant={selectedTags.includes(tag) ? "filled" : "outline"}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedTags(prev => 
                        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                      );
                      setPage(1);
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </Group>
            </Group>
          </Stack>
        </Card>

        {isLoading ? (
          <Center h={300}>
            <Loader size="lg" />
          </Center>
        ) : (
          <Stack gap="xl">
            <Text fw={500}>{jobsData?.meta?.total || 0} 件の求人が見つかりました</Text>
            
            <Grid>
               {jobsData?.data?.map((job: any) => (
                 <Grid.Col key={job.id} span={{ base: 12, sm: 6, lg: 4 }}>
                   <Card withBorder radius="md" p="md" h="100%" component={Link} href={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                     <Stack justify="space-between" h="100%">
                       <div>
                         <Group justify="space-between" mb="xs" wrap="nowrap">
                           <Text fw={700} size="lg" truncate="end" style={{ flex: 1 }}>{job.title}</Text>
                           <Badge variant="light">{job.employmentType}</Badge>
                         </Group>
                         
                         <Group gap="xs" mb="xs">
                           <Text size="sm" c="blue" fw={500}>{job.organization.name}</Text>
                         </Group>

                         <Group gap="xs" mb="xs">
                           <IconMapPin size={14} color="gray" />
                           <Text size="xs" c="dimmed">
                             {job.location.prefecture.name} {job.location.city}
                           </Text>
                         </Group>

                         <Group gap="xs" mb="md">
                           <IconCurrencyDollar size={14} color="gray" />
                           <Text size="xs" c="dimmed">
                             {job.salaryMin ? `${(job.salaryMin / 10000).toLocaleString()}万円` : '下限なし'} 
                             〜 
                             {job.salaryMax ? `${(job.salaryMax / 10000).toLocaleString()}万円` : '上限なし'}
                           </Text>
                         </Group>

                         <Text size="sm" lineClamp={3} c="gray.7">
                           {job.description}
                         </Text>
                       </div>

                       <Group gap={4} mt="md">
                         {job.tags?.slice(0, 3).map((tag: string) => (
                           <Badge key={tag} variant="outline" size="xs" color="gray">{tag}</Badge>
                         ))}
                       </Group>
                     </Stack>
                   </Card>
                 </Grid.Col>
               ))}
            </Grid>

            {jobsData?.meta?.totalPages > 1 && (
              <Center mt="xl">
                <Pagination 
                  total={jobsData.meta.totalPages} 
                  value={page} 
                  onChange={setPage} 
                />
              </Center>
            )}
            
            {jobsData?.data?.length === 0 && (
              <Center h={200}>
                <Text c="dimmed">条件に一致する求人はありませんでした。</Text>
              </Center>
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
