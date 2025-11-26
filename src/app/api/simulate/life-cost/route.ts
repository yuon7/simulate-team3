// src/app/api/simulate/life-cost/route.ts
import { NextResponse } from "next/server";

type ReqBody = {
  region?: string;
  family?: string;
  transport?: string;
  householdSize?: number; // optional alternative to family
  unit?: "monthly" | "yearly"; // default monthly
  notes?: string;
  // future: customModifiers?: { rent?: number, food?: number, transport?: number }
};

function formatYen(n: number) {
  return n.toLocaleString("ja-JP") + "円";
}

/** 内部の固定データ（初期版） */
const BASE_COSTS: Record<string, { rent: number; food: number; transport: number }> = {
  "東京都": { rent: 80000, food: 40000, transport: 15000 },
  "大阪府": { rent: 60000, food: 38000, transport: 12000 },
  "福井県": { rent: 45000, food: 35000, transport: 10000 },
  "北海道": { rent: 50000, food: 36000, transport: 11000 },
  "長野県": { rent: 48000, food: 36000, transport: 10000 },
  "宮城県": { rent: 52000, food: 37000, transport: 10500 },
  // 必要に応じて拡張してください
};

const FAMILY_FACTORS: Record<string, number> = {
  "一人暮らし": 1.0,
  "single": 1.0,
  "二人暮らし": 1.7,
  "couple": 1.7,
  "ふたり": 1.7,
  "三人家族": 2.0,
  "四人家族": 2.5,
  "family": 2.5,
};

const TRANSPORT_FACTORS: Record<string, number> = {
  "電車": 1.0,
  "train": 1.0,
  "車": 1.3,
  "car": 1.3,
  "自転車": 0.7,
  "bicycle": 0.7,
  "徒歩": 0.6,
  "walk": 0.6,
};

function findRegionKey(input?: string) {
  if (!input) return "東京都";
  const q = input.trim().toLowerCase();
  // Exact match first
  for (const k of Object.keys(BASE_COSTS)) {
    if (k.toLowerCase() === q) return k;
  }
  // Partial match
  for (const k of Object.keys(BASE_COSTS)) {
    if (k.toLowerCase().includes(q)) return k;
  }
  // fallback
  return "東京都";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ReqBody;

    const regionInput = body.region ?? "";
    const regionKey = findRegionKey(regionInput);

    const unit = body.unit === "yearly" ? "yearly" : "monthly";

    // family/family size resolution
    let family = body.family?.trim() ?? "";
    if (!family && typeof body.householdSize === "number") {
      const n = body.householdSize;
      if (n <= 1) family = "一人暮らし";
      else if (n === 2) family = "二人暮らし";
      else family = `${n}人家族`;
    }
    if (!family) family = "一人暮らし";

    // normalized family factor
    const famKey = Object.keys(FAMILY_FACTORS).find((k) =>
      k.toLowerCase() === family.toLowerCase()
    );
    const familyFactor = famKey ? FAMILY_FACTORS[famKey] : FAMILY_FACTORS["一人暮らし"];

    // transport
    const transportInput = (body.transport ?? "電車").trim();
    const transKey = Object.keys(TRANSPORT_FACTORS).find((k) =>
      k.toLowerCase() === transportInput.toLowerCase()
    );
    const transportFactor = transKey ? TRANSPORT_FACTORS[transKey] : TRANSPORT_FACTORS["電車"];

    const base = BASE_COSTS[regionKey] ?? BASE_COSTS["東京都"];

    // compute monthly values
    const rent = Math.round(base.rent * familyFactor);
    const food = Math.round(base.food * familyFactor);
    const transportCost = Math.round(base.transport * transportFactor);
    const utilities = Math.round((rent + food) * 0.08); // 簡易的に水道光熱は住居+食費の8%
    const other = Math.round((rent + food + transportCost) * 0.05); // 雑費として5%
    const subtotalMonthly = rent + food + transportCost + utilities + other;

    const monthly = {
      rent,
      food,
      transport: transportCost,
      utilities,
      other,
      subtotal: subtotalMonthly,
    };

    const yearly = {
      rent: rent * 12,
      food: food * 12,
      transport: transportCost * 12,
      utilities: Math.round(utilities * 12),
      other: Math.round(other * 12),
      subtotal: Math.round(subtotalMonthly * 12),
    };

    const result = unit === "yearly" ? yearly : monthly;

    const breakdown = {
      region: regionKey,
      family,
      familyFactor,
      transport: transportInput || "電車",
      transportFactor,
      unit,
      amounts: result,
      formatted: {
        rent: formatYen(result.rent),
        food: formatYen(result.food),
        transport: formatYen(result.transport),
        utilities: formatYen(result.utilities),
        other: formatYen(result.other),
        subtotal: formatYen(result.subtotal),
      },
      assumptions: {
        baseSource: "固定ローカルDB（サンプル）",
        notes:
          "この試算は簡易モデルです。実際の家賃・食費等は物件・生活スタイルで変動します。将来的には統計データで精緻化します。",
      },
    };

    return NextResponse.json({
      success: true,
      query: { region: regionInput, resolvedRegion: regionKey, family, transport: transportInput, unit },
      breakdown,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("life-cost error:", err);
    return NextResponse.json(
      { success: false, error: "リクエスト処理中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}

