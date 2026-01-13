import {
  Card,
  Title,
  Text,
  Select,
  Badge,
  Group,
  Stack,
  Alert,
  Grid,
  GridCol,
  Box,
} from "@mantine/core";
import {
  IconCoin,
  IconMapPin,
  IconInfoCircle,
  IconBuildingCottage,
  IconBuildingSkyscraper,
  IconMap,
} from "@tabler/icons-react";
import { REGIONS_DATA } from "@/features/LifeSimulator/SupportLogic";
import { SupportItemSchema } from "@/features/LifeSimulator/SupportSchema";
type Props = {
  selectedRegion: string | null;
  selectedPref: string | null;
  selectedArea: string | null;
  selectedCity: string | null;
  prefectureOptions: string[];
  areaOptions: string[];
  cityOptions: string[];
  filteredSupports: SupportItemSchema[];
  totalAmount: number;
  onChangeRegion: (val: string | null) => void;
  onChangePref: (val: string | null) => void;
  onChangeArea: (val: string | null) => void;
  onChangeCity: (val: string | null) => void;
};
export function SupportNavigatorUI({
  selectedRegion,
  selectedPref,
  selectedArea,
  selectedCity,
  prefectureOptions,
  areaOptions,
  cityOptions,
  filteredSupports,
  totalAmount,
  onChangeRegion,
  onChangePref,
  onChangeArea,
  onChangeCity,
}: Props) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="lg">
        <div>
          <Title order={4} mb="xs">
            🧭 支援制度ナビ
          </Title>
          <Text c="dimmed" size="sm">
            47都道府県・全自治体対応。地域ごとの移住支援金や独自の補助金を検索します。
          </Text>
        </div>
        <Box p="md" bg="gray.0" style={{ borderRadius: "8px" }}>
          <Grid align="flex-end">
            <GridCol span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                label="① 地方"
                placeholder="地方を選択"
                data={REGIONS_DATA.map((r) => r.region)}
                value={selectedRegion}
                onChange={onChangeRegion}
                leftSection={<IconMapPin size={16} />}
              />
            </GridCol>
            <GridCol span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                label="② 都道府県"
                placeholder={selectedRegion ? "県を選択" : "-"}
                data={prefectureOptions}
                value={selectedPref}
                onChange={onChangePref}
                disabled={!selectedRegion}
                leftSection={<IconBuildingCottage size={16} />}
              />
            </GridCol>
            <GridCol span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                label="③ 地域"
                placeholder={selectedPref ? "エリアを選択" : "-"}
                data={areaOptions}
                value={selectedArea}
                onChange={onChangeArea}
                disabled={!selectedPref}
                leftSection={<IconMap size={16} />}
              />
            </GridCol>
            <GridCol span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                label="④ 都市"
                placeholder={selectedArea ? "市町村を選択" : "-"}
                data={cityOptions}
                value={selectedCity}
                onChange={onChangeCity}
                disabled={!selectedArea}
                leftSection={<IconBuildingSkyscraper size={16} />}
                searchable
              />
            </GridCol>
          </Grid>
        </Box>
        {selectedCity ? (
          <>
            {filteredSupports.length > 0 ? (
              <>
                <Alert
                  variant="light"
                  color="teal"
                  title={`${selectedPref} ${selectedCity} の支援額試算`}
                  icon={<IconCoin />}
                  radius="md"
                >
                  <Group align="flex-end" gap="xs">
                    <Text size="xl" fw={700} c="teal">
                      最大
                    </Text>
                    <Text
                      size="3rem"
                      fw={900}
                      c="teal"
                      style={{ lineHeight: 1 }}
                    >
                      {(totalAmount / 10000).toLocaleString()}
                    </Text>
                    <Text size="xl" fw={700} c="teal">
                      万円
                    </Text>
                  </Group>
                  <Text size="xs" mt="sm">
                    ※制度の適用には条件があります（世帯構成・年齢・就業等）。詳細は自治体HPをご確認ください。
                  </Text>
                </Alert>
                <Stack gap="md">
                  <Text fw={600}>
                    利用可能な制度一覧 ({filteredSupports.length}件)
                  </Text>
                  {filteredSupports.map((item, index) => (
                    <Card
                      key={`${item.city}-${index}`}
                      withBorder
                      padding="sm"
                      radius="md"
                    >
                      <Group
                        justify="space-between"
                        align="start"
                        wrap="nowrap"
                      >
                        <Stack gap="xs" style={{ flex: 1 }}>
                          <Group gap="xs">
                            <Badge color="blue" variant="light">
                              {item.category}
                            </Badge>
                            <Text fw={600} size="sm">
                              {item.title}
                            </Text>
                          </Group>
                          <Text size="xs" c="dimmed">
                            {item.description}
                          </Text>
                        </Stack>
                        <Badge size="lg" color="green" variant="outline">
                          {item.amount.toLocaleString()}円
                        </Badge>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </>
            ) : (
              <Alert color="gray" icon={<IconInfoCircle />}>
                {selectedCity} の詳細な支援金データは現在登録されていません。
                <br />
                （※一般的な国の移住支援金制度などが利用できる可能性があります）
              </Alert>
            )}
          </>
        ) : (
          <Alert color="gray" icon={<IconInfoCircle />}>
            上部から場所を選択すると、支援制度と金額が表示されます。
          </Alert>
        )}
      </Stack>
    </Card>
  );
}
