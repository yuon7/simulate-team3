import { 
  Card, Title, Text, Stack, Group, Grid, GridCol, 
  Paper, Select, NumberInput, Divider, SegmentedControl, Alert, Badge, Switch 
} from "@mantine/core";
import { 
  IconTruck, IconHome, IconCar, IconSnowflake, IconWifi, IconCurrencyYen, IconMapPin 
} from "@tabler/icons-react";
import { ROOM_TYPES_DATA } from "@/features/LifeSimulator/InitialLogic";
import { SimulationResultSchema } from "@/features/LifeSimulator/InitialSchema";

type Props = {
  currentPref: string | null;
  targetPref: string | null;
  targetCity: string | null;
  roomType: string;
  isPeakSeason: boolean;
  targetRent: number | string;
  shikikin: number | string;
  reikin: number | string;
  carPlan: string;
  familySize: string;
  result: SimulationResultSchema;
  prefOptions: string[];
  cityOptions: string[];
  onChangeCurrentPref: (val: string | null) => void;
  onChangeTargetPref: (val: string | null) => void;
  onChangeTargetCity: (val: string | null) => void;
  onChangeRoomType: (val: string | null) => void;
  onChangePeakSeason: (val: boolean) => void;
  onChangeRent: (val: number | string) => void;
  onChangeShikikin: (val: number | string) => void;
  onChangeReikin: (val: number | string) => void;
  onChangeCarPlan: (val: string) => void;
  onChangeFamilySize: (val: string | null) => void;
};
export function InitialCostUI({ 
  currentPref, targetPref, targetCity, roomType, isPeakSeason,
  targetRent, shikikin, reikin, carPlan, familySize,
  result, prefOptions, cityOptions,
  onChangeCurrentPref, onChangeTargetPref, onChangeTargetCity, onChangeRoomType,
  onChangePeakSeason, onChangeRent, onChangeShikikin, onChangeReikin,
  onChangeCarPlan, onChangeFamilySize
}: Props) {
  return (
    <Card shadow="md" padding="xl" radius="md" withBorder>
      <Stack gap="xl">
        <Group>
          <IconTruck size={28} />
          <div>
            <Title order={3}>移住初期費用シミュレーター</Title>
            <Text c="dimmed" size="sm">
              引越し・賃貸契約・車の準備など、移住スタートに必要な「貯金額」を試算します。
            </Text>
          </div>
        </Group>
        <Grid>
          <GridCol span={{ base: 12, md: 5 }}>
            <Paper bg="gray.0" p="md" radius="md" h="100%">
              <Stack gap="md">
                <Badge color="orange" variant="light" fullWidth>Step 1: 現在の状況</Badge>
                <Select 
                  label="現在の居住地 (都道府県)" placeholder="県を選択" searchable
                  data={prefOptions} value={currentPref} onChange={onChangeCurrentPref}
                  leftSection={<IconMapPin size={16}/>}
                />
                <Group grow>
                   <Select 
                    label="世帯人数" data={['1人', '2人', '3人以上']}
                    value={familySize} onChange={onChangeFamilySize}
                  />
                  <Select 
                    label="部屋の広さ (荷物量)"
                    data={Object.keys(ROOM_TYPES_DATA).map(key => ({ value: key, label: ROOM_TYPES_DATA[key].label }))}
                    value={roomType} onChange={onChangeRoomType}
                  />
                </Group>
                 <Group justify="space-between" align="center">
                  <Text size="sm" fw={500}>引越し時期は3月〜4月？</Text>
                  <Switch 
                    label={isPeakSeason ? "はい (繁忙期)" : "いいえ (通常期)"} 
                    checked={isPeakSeason} onChange={(e) => onChangePeakSeason(e.currentTarget.checked)}
                    color="red"
                  />
                </Group>
                <Divider />
                <Badge color="blue" variant="light" fullWidth>Step 2: 移住先・住居</Badge>
                <Group grow>
                  <Select 
                    label="移住先の都道府県" placeholder="県を選択" searchable
                    data={prefOptions} value={targetPref} onChange={onChangeTargetPref}
                  />
                  <Select 
                    label="移住先の市町村" placeholder="市を選択" searchable
                    data={cityOptions} value={targetCity} onChange={onChangeTargetCity} disabled={!targetPref}
                  />
                </Group>
                <NumberInput 
                  label="想定家賃 (管理費込)" value={targetRent} onChange={onChangeRent} 
                  thousandSeparator suffix=" 円" step={1000}
                />
                <Group grow>
                  <NumberInput label="敷金 (ヶ月)" value={shikikin} onChange={onChangeShikikin} min={0} max={6} />
                  <NumberInput label="礼金 (ヶ月)" value={reikin} onChange={onChangeReikin} min={0} max={6} />
                </Group>

                <Divider />
                <Badge color="teal" variant="light" fullWidth>Step 3: 車の準備</Badge>
                <SegmentedControl 
                  fullWidth orientation="vertical" value={carPlan} onChange={onChangeCarPlan}
                  data={[
                    { label: '車なし / すでに所有 (費用なし)', value: 'none' },
                    { label: '今の車を持っていく (陸送費)', value: 'bring' },
                    { label: '現地で購入する (中古軽など)', value: 'buy' },
                  ]}
                />
              </Stack>
            </Paper>
          </GridCol>
          <GridCol span={{ base: 12, md: 7 }}>
            <Stack h="100%" justify="center">
              <Paper p="xl" radius="md" withBorder bg="blue.0">
                <Text ta="center" size="sm" fw={700} c="blue.9">移住に必要な推定貯金額</Text>
                <Group justify="center" gap="xs" align="flex-end" mt="xs">
                  <Text size="3rem" fw={900} c="blue.8" style={{ lineHeight: 1 }}>
                    {(result.grandTotal / 10000).toFixed(1)}
                  </Text>
                  <Text size="xl" fw={700} c="blue.8" mb="sm">万円</Text>
                </Group>
                <Text ta="center" size="sm" c="dimmed" mt="xs">
                  (約 {result.grandTotal.toLocaleString()} 円)
                </Text>
              </Paper>
              <Text fw={700} mt="md"><IconCurrencyYen size={18} style={{ verticalAlign: 'middle' }}/> 内訳シミュレーション</Text>
              <Stack gap="sm">
                <Paper p="sm" withBorder shadow="xs">
                  <Group justify="space-between">
                    <Group gap="xs"><IconHome size={20} color="teal"/><Text fw={600}>賃貸契約初期費用</Text></Group>
                    <Text fw={700}>{result.housingTotal.toLocaleString()} 円</Text>
                  </Group>
                  <Text size="xs" c="dimmed" mt={4} pl={30}>
                    敷金・礼金 + 前家賃({result.maeyachinCost.toLocaleString()}円)
                  </Text>
                </Paper>
                <Paper p="sm" withBorder shadow="xs">
                  <Group justify="space-between">
                    <Group gap="xs"><IconTruck size={20} color="orange"/><Text fw={600}>引越し費用</Text></Group>
                    <Text fw={700}>{result.movingTotal.toLocaleString()} 円</Text>
                  </Group>
                  <Text size="xs" c="dimmed" mt={4} pl={30}>
                    {ROOM_TYPES_DATA[roomType]?.label} / {isPeakSeason ? "繁忙期料金" : "通常期"}
                  </Text>
                </Paper>
                <Paper p="sm" withBorder shadow="xs">
                  <Group justify="space-between">
                    <Group gap="xs"><IconCar size={20} color="blue"/><Text fw={600}>車両・交通費</Text></Group>
                    <Text fw={700}>{result.carTotal.toLocaleString()} 円</Text>
                  </Group>
                  {carPlan === "buy" && <Text size="xs" c="dimmed" pl={30}>中古車購入・車庫証明・登録諸費用</Text>}
                  {carPlan === "bring" && <Text size="xs" c="dimmed" pl={30}>長距離移動・陸送費・登録変更手数料など</Text>}
                </Paper>
                {result.setupTotal > 0 && (
                  <Paper p="sm" withBorder shadow="xs">
                    <Group justify="space-between">
                      <Group gap="xs"><IconSnowflake size={20} color="cyan"/><Text fw={600}>雪国セットアップ</Text></Group>
                      <Text fw={700}>{result.setupTotal.toLocaleString()} 円</Text>
                    </Group>
                    <Text size="xs" c="dimmed" mt={4} pl={30}>
                       スタッドレスタイヤ・FF式ストーブ・雪かき道具
                    </Text>
                  </Paper>
                )}
              </Stack>
              <Alert variant="light" color="gray" title="⚠️ 計算に含まれない費用" icon={<IconWifi />} mt="md">
                <Text size="xs" style={{ lineHeight: 1.6 }}>
                  以下の費用は本試算に含まれていません。<br/>
                  ・仲介手数料（家賃の0.5〜1.1ヶ月分）<br/>
                  ・火災保険料、保証会社利用料、鍵交換代<br/>
                  ・家具家電の新規購入費
                </Text>
              </Alert>
            </Stack>
          </GridCol>
        </Grid>
      </Stack>
    </Card>
  );
}