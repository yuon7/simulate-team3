"use client";

import { useState, useMemo } from "react";
import { 
  Card, Title, Text, Stack, Group, Grid, GridCol, 
  Paper, Select, NumberInput, Divider, SegmentedControl, Alert, Badge, Switch 
} from "@mantine/core";
import { 
  IconTruck, IconHome, IconCar, IconSnowflake, IconWifi, IconCurrencyYen, IconMapPin 
} from "@tabler/icons-react";
import { REGIONS, PREFECTURE_AREAS } from "./supportData"; 

// ▼ 引越しの基礎運賃（荷物量ベース）
const ROOM_TYPES: Record<string, { label: string; baseCost: number }> = {
  "1r": { label: "1R / 1K (単身・荷物少)", baseCost: 30000 },
  "1dk": { label: "1DK / 1LDK (単身・荷物多)", baseCost: 50000 },
  "2dk": { label: "2DK / 2LDK (2人世帯)", baseCost: 80000 },
  "3ldk": { label: "3LDK〜 (ファミリー)", baseCost: 120000 },
};

// ▼ 距離計算用の簡易エリア定義
// (同じグループ内なら近距離、離れるほど高くなるロジック用)
const PREF_GROUPS: Record<string, string> = {
  "北海道": "hokkaido",
  "青森県": "tohoku", "岩手県": "tohoku", "宮城県": "tohoku", "秋田県": "tohoku", "山形県": "tohoku", "福島県": "tohoku",
  "茨城県": "kanto", "栃木県": "kanto", "群馬県": "kanto", "埼玉県": "kanto", "千葉県": "kanto", "東京都": "kanto", "神奈川県": "kanto",
  "新潟県": "koshinetsu", "富山県": "koshinetsu", "石川県": "koshinetsu", "福井県": "koshinetsu", "山梨県": "koshinetsu", "長野県": "koshinetsu",
  "岐阜県": "tokai", "静岡県": "tokai", "愛知県": "tokai", "三重県": "tokai",
  "滋賀県": "kansai", "京都府": "kansai", "大阪府": "kansai", "兵庫県": "kansai", "奈良県": "kansai", "和歌山県": "kansai",
  "鳥取県": "chugoku", "島根県": "chugoku", "岡山県": "chugoku", "広島県": "chugoku", "山口県": "chugoku",
  "徳島県": "shikoku", "香川県": "shikoku", "愛媛県": "shikoku", "高知県": "shikoku",
  "福岡県": "kyushu", "佐賀県": "kyushu", "長崎県": "kyushu", "熊本県": "kyushu", "大分県": "kyushu", "宮崎県": "kyushu", "鹿児島県": "kyushu",
  "沖縄県": "okinawa"
};

export function InitialCostSimulator() {
  // --- 1. 現在の状況 ---
  const [currentPref, setCurrentPref] = useState<string | null>(null); // 出発地
  const [roomType, setRoomType] = useState<string>("1dk"); // 広さ
  const [isPeakSeason, setIsPeakSeason] = useState(false); // 繁忙期(3-4月)

  // --- 2. 移住先の状況 ---
  const [targetPref, setTargetPref] = useState<string | null>(null); // 目的地
  const [targetCity, setTargetCity] = useState<string | null>(null); // 市
  
  const [targetRent, setTargetRent] = useState<number | string>(60000); // 家賃
  const [shikikin, setShikikin] = useState<number | string>(1); // 敷金
  const [reikin, setReikin] = useState<number | string>(1); // 礼金

  // --- 3. 車・その他 ---
  const [carPlan, setCarPlan] = useState("none"); // none | bring | buy
  const [familySize, setFamilySize] = useState("1"); // 世帯人数

  // ▼ 都道府県リスト（選択肢用）
  const prefOptions = useMemo(() => {
    return REGIONS.flatMap(r => r.prefs);
  }, []);

  // ▼ 市町村リスト（supportData.ts活用）
  const cityOptions = useMemo(() => {
    if (!targetPref || !PREFECTURE_AREAS[targetPref]) return [];
    // PREFECTURE_AREAS[県名] は { エリア名: [市配列], ... } なので平坦化する
    return Object.values(PREFECTURE_AREAS[targetPref]).flat();
  }, [targetPref]);

  // ▼ 雪国判定（簡易）
  const isSnowy = useMemo(() => {
    if (!targetPref) return false;
    const snowPrefs = ["北海道", "青森県", "岩手県", "秋田県", "山形県", "福島県", "新潟県", "富山県", "石川県", "福井県", "長野県"];
    return snowPrefs.includes(targetPref);
  }, [targetPref]);

  // ▼ 計算ロジック
  const result = useMemo(() => {
    const rent = Number(targetRent) || 0;
    
    // 1. 🏠 住居初期費用 (敷金+礼金のみ)
    const shikikinCost = rent * (Number(shikikin) || 0);
    const reikinCost = rent * (Number(reikin) || 0);
    const housingTotal = shikikinCost + reikinCost;

    // 2. 🚚 引越し費用
    let moveBase = ROOM_TYPES[roomType]?.baseCost || 50000;
    
    // 距離係数の算出
    let distFactor = 1.0;
    if (currentPref && targetPref) {
      const groupA = PREF_GROUPS[currentPref];
      const groupB = PREF_GROUPS[targetPref];

      if (groupA === groupB) {
        distFactor = 1.2; // 同一地方（中距離）
        if (currentPref === targetPref) distFactor = 1.0; // 同一県内（近距離）
      } else {
        distFactor = 2.5; // 地方またぎ（長距離）
        // 海を越える移動（北海道・沖縄）
        if (groupA === "hokkaido" || groupB === "hokkaido" || groupA === "okinawa" || groupB === "okinawa") {
          distFactor = 4.0; 
        }
      }
    }
    
    // 繁忙期係数
    const seasonFactor = isPeakSeason ? 1.6 : 1.0;
    const movingTotal = Math.round(moveBase * distFactor * seasonFactor);

    // 3. 🚗 車・交通費
    let carTotal = 0;
    if (carPlan === "buy") {
      carTotal = 500000; // 中古軽自動車購入 + 諸費用
    } else if (carPlan === "bring") {
      // 陸送費判定
      if (currentPref && targetPref) {
        const groupA = PREF_GROUPS[currentPref];
        const groupB = PREF_GROUPS[targetPref];
        if (groupA === groupB) {
           carTotal = 0; // 近場なら自走とみなす
        } else if (groupA === "hokkaido" || groupB === "hokkaido" || groupA === "okinawa" || groupB === "okinawa") {
           carTotal = 80000; // フェリーが必要
        } else {
           carTotal = 50000; // 長距離陸送
        }
      }
    }

    // 4. ❄️ 生活セットアップ（雪対策のみ計上）
    let setupTotal = 0;
    if (isSnowy) {
      setupTotal += 80000; // ストーブ・スタッドレス・雪かき道具
    }

    const grandTotal = housingTotal + movingTotal + carTotal + setupTotal;

    return {
      housingTotal,
      movingTotal,
      carTotal,
      setupTotal,
      grandTotal,
      distFactor, // デバッグ用
    };
  }, [roomType, isPeakSeason, currentPref, targetPref, targetRent, shikikin, reikin, carPlan, isSnowy]);

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
          {/* ▼ 入力エリア */}
          <GridCol span={{ base: 12, md: 5 }}>
            <Paper bg="gray.0" p="md" radius="md" h="100%">
              <Stack gap="md">
                <Badge color="orange" variant="light" fullWidth>Step 1: 現在の状況</Badge>
                
                <Select 
                  label="現在の居住地 (都道府県)" 
                  placeholder="県を選択" searchable
                  data={prefOptions}
                  value={currentPref} onChange={setCurrentPref}
                  leftSection={<IconMapPin size={16}/>}
                />

                <Group grow>
                  <Select 
                    label="世帯人数"
                    data={['1人', '2人', '3人以上']}
                    value={familySize} onChange={(v) => v && setFamilySize(v)}
                  />
                  <Select 
                    label="部屋の広さ (荷物量)"
                    data={Object.keys(ROOM_TYPES).map(key => ({ value: key, label: ROOM_TYPES[key].label }))}
                    value={roomType} onChange={(v) => v && setRoomType(v)}
                  />
                </Group>
                
                <Group justify="space-between" align="center">
                  <Text size="sm" fw={500}>引越し時期は3月〜4月？</Text>
                  <Switch 
                    label={isPeakSeason ? "はい (繁忙期)" : "いいえ (通常期)"} 
                    checked={isPeakSeason} onChange={(e) => setIsPeakSeason(e.currentTarget.checked)}
                    color="red"
                  />
                </Group>

                <Divider />

                <Badge color="blue" variant="light" fullWidth>Step 2: 移住先・住居</Badge>
                <Group grow>
                  <Select 
                    label="移住先の都道府県" placeholder="県を選択" searchable
                    data={prefOptions}
                    value={targetPref} onChange={setTargetPref}
                  />
                  <Select 
                    label="移住先の市町村" placeholder="市を選択" searchable
                    data={cityOptions}
                    value={targetCity} onChange={setTargetCity}
                    disabled={!targetPref}
                  />
                </Group>

                <NumberInput 
                  label="想定家賃 (管理費込)" 
                  value={targetRent} onChange={setTargetRent} 
                  thousandSeparator suffix=" 円" step={1000}
                />
                <Group grow>
                  <NumberInput label="敷金 (ヶ月)" value={shikikin} onChange={setShikikin} min={0} max={6} />
                  <NumberInput label="礼金 (ヶ月)" value={reikin} onChange={setReikin} min={0} max={6} />
                </Group>

                <Divider />

                <Badge color="teal" variant="light" fullWidth>Step 3: 車の準備</Badge>
                <Text size="sm" fw={500}>移住後の車はどうしますか？</Text>
                <SegmentedControl 
                  fullWidth orientation="vertical"
                  value={carPlan} onChange={setCarPlan}
                  data={[
                    { label: '車なし / すでに所有 (費用なし)', value: 'none' },
                    { label: '今の車を持っていく (陸送費)', value: 'bring' },
                    { label: '現地で購入する (中古軽など)', value: 'buy' },
                  ]}
                />
              </Stack>
            </Paper>
          </GridCol>

          {/* ▼ 結果エリア */}
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
                    敷金・礼金のみ算出
                  </Text>
                </Paper>

                <Paper p="sm" withBorder shadow="xs">
                  <Group justify="space-between">
                    <Group gap="xs"><IconTruck size={20} color="orange"/><Text fw={600}>引越し費用</Text></Group>
                    <Text fw={700}>{result.movingTotal.toLocaleString()} 円</Text>
                  </Group>
                  <Text size="xs" c="dimmed" mt={4} pl={30}>
                    {ROOM_TYPES[roomType].label} / {isPeakSeason ? "繁忙期料金" : "通常期"}
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

                {isSnowy && (
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
                  以下の費用は本試算に含まれていません。別途ご準備ください。<br/>
                  ・仲介手数料（家賃の0.5〜1.1ヶ月分）<br/>
                  ・前家賃、火災保険料、保証会社利用料、鍵交換代<br/>
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