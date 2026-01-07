export type SupportItem = {
  id: string;
  title: string;
  amount: number;
  category: string;
  description: string;
};

// ▼ 1. 日本の地方・都道府県マスタデータ
export const REGIONS = [
  { region: "北海道・東北", prefs: ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"] },
  { region: "関東", prefs: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"] },
  { region: "中部", prefs: ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"] },
  { region: "近畿", prefs: ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"] },
  { region: "中国", prefs: ["鳥取県", "島根県", "岡山県", "広島県", "山口県"] },
  { region: "四国", prefs: ["徳島県", "香川県", "愛媛県", "高知県"] },
  { region: "九州・沖縄", prefs: ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"] },
];

// ▼都道府県ごとの県庁所在地マスタ
// (とりあえず今は各県1つずつ)
export const PREFECTURAL_CAPITALS: Record<string, string[]> = {
  "北海道": ["札幌市"], "青森県": ["青森市"], "岩手県": ["盛岡市"], "宮城県": ["仙台市"], "秋田県": ["秋田市"], "山形県": ["山形市"], "福島県": ["福島市"],
  "茨城県": ["水戸市"], "栃木県": ["宇都宮市"], "群馬県": ["前橋市"], "埼玉県": ["さいたま市"], "千葉県": ["千葉市"], "東京都": ["新宿区"], "神奈川県": ["横浜市"],
  "新潟県": ["新潟市"], "富山県": ["富山市"], "石川県": ["金沢市"], "福井県": ["福井市"], "山梨県": ["甲府市"], "長野県": ["長野市"], "岐阜県": ["岐阜市"], "静岡県": ["静岡市"], "愛知県": ["名古屋市"],
  "三重県": ["津市"], "滋賀県": ["大津市"], "京都府": ["京都市"], "大阪府": ["大阪市"], "兵庫県": ["神戸市"], "奈良県": ["奈良市"], "和歌山県": ["和歌山市"],
  "鳥取県": ["鳥取市"], "島根県": ["松江市"], "岡山県": ["岡山市"], "広島県": ["広島市"], "山口県": ["山口市"],
  "徳島県": ["徳島市"], "香川県": ["高松市"], "愛媛県": ["松山市"], "高知県": ["高知市"],
  "福岡県": ["福岡市"], "佐賀県": ["佐賀市"], "長崎県": ["長崎市"], "熊本県": ["熊本市"], "大分県": ["大分市"], "宮崎県": ["宮崎市"], "鹿児島県": ["鹿児島市"], "沖縄県": ["那覇市"]
};
// (都市が選ばれたら、その都市名も考慮してデータを返せるように拡張可能
//  だが今は「県」ベースのデータに都市名を混ぜて返す
export const getSupportsForCity = (prefName: string, cityName: string): SupportItem[] => {
  // 基本セット
  const baseSupports: SupportItem[] = [
    {
      id: `${prefName}_base_1`,
      title: `${prefName}移住支援金`,
      amount: 1000000,
      category: "移住支援",
      description: "東京圏から移住し、就業・起業等を行う世帯に最大100万円を支給。",
    },
    // 都市独自の支援金（ダミー）
    {
      id: `${cityName}_unique_1`,
      title: `${cityName}定住促進奨励金`,
      amount: 200000,
      category: "定住",
      description: `${cityName}への転入世帯に対し、生活用品購入費等を助成（試算）。`,
    }
  ];

  // 都道府県ごとの独自データ(仮)
  const specialSupports: Record<string, SupportItem[]> = {
    "北海道": [
      { id: "hk_1", title: "北海道わくわくテレワーク支援", amount: 300000, category: "テレワーク", description: "道外企業の仕事を継続したまま移住する方に支給。" }
    ],
    "宮城県": [
      { id: "my_1", title: "みやぎ移住・定住推進補助金", amount: 500000, category: "住宅", description: "県内での住宅取得にかかる費用を一部補助。" }
    ],
    "東京都": [
      { id: "tk_1", title: "創業助成事業", amount: 3000000, category: "起業", description: "都内での創業にかかる経費の一部を助成。" }
    ],
    "長野県": [
      { id: "ng_1", title: "信州リゾートテレワーク支援", amount: 200000, category: "テレワーク", description: "IT人材等の移住・滞在費を補助。" },
      { id: "ng_2", title: "空き家改修等補助金", amount: 500000, category: "住宅", description: "空き家バンク登録物件の改修費用を補助。" }
    ],
    "福井県": [
      { id: "fk_1", title: "結婚新生活支援事業", amount: 600000, category: "結婚", description: "新婚世帯の引越し・家賃を補助。" },
      { id: "fk_2", title: "多子世帯子育て応援金", amount: 100000, category: "子育て", description: "第3子以降のお子さんがいる世帯へ支給。" }
    ],
    "兵庫県": [
      { id: "hg_1", title: "ひょうご五国移住支援", amount: 300000, category: "移住支援", description: "県外からの若者世帯の移住を特別支援。" }
    ],
    "鳥取県": [
      { id: "tt_1", title: "とっとり住まいる支援", amount: 1000000, category: "住宅", description: "県産材を使用した住宅の新築・購入を支援。" }
    ],
    "高知県": [
      { id: "kc_1", title: "二段階移住支援", amount: 200000, category: "体験", description: "まずは市街地でお試し移住するための費用を補助。" }
    ],
    "福岡県": [
      { id: "fo_1", title: "福岡県空き家活用補助金", amount: 500000, category: "住宅", description: "空き家の改修工事や家財処分費用を補助。" }
    ],
    "沖縄県": [
      { id: "ok_1", title: "沖縄UIターン就業サポート", amount: 200000, category: "就業", description: "県内企業への就職活動にかかる渡航費等を助成。" }
    ],
  };

  const prefExtras = specialSupports[prefName] || [
    {
      id: `${prefName}_generic_1`,
      title: `${prefName}住宅取得支援事業`,
      amount: 300000,
      category: "住宅",
      description: "若者・子育て世帯の住宅取得やリフォーム費用を一部補助（試算）。",
    },
  ];

  return [...baseSupports, ...prefExtras];
};