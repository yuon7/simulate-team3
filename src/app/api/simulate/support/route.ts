// src/app/api/simulate/support/route.ts
import { NextResponse } from "next/server";

type SupportQuery = {
  region?: string;
  age?: number;
  employment?: string; // 学生 / 社会人 / フリーランス など
};

// ----- 仮データベース（後で拡張可能） -----
const SUPPORT_DB = [
  {
    region: "福井県",
    title: "ふくい移住支援金",
    amount: "最大100万円",
    conditions: "東京圏からのUIターン・40歳未満の若者優遇",
  },
  {
    region: "福井県",
    title: "住宅取得応援事業",
    amount: "最大120万円補助",
    conditions: "県内で住宅購入・子育て世帯優遇",
  },
  {
    region: "北海道",
    title: "北海道若者移住支援金",
    amount: "最大60万円",
    conditions: "道外からの移住者向け",
  },
  {
    region: "長野県",
    title: "信州移住支援金",
    amount: "最大80万円",
    conditions: "県内就業・テレワーク移住者など",
  },
];

export async function POST(req: Request) {
  const body: SupportQuery = await req.json();
  const region = body.region ?? "";

  // 絞り込み（地域一致）
  const results = SUPPORT_DB.filter((item) =>
    item.region.includes(region)
  );

  return NextResponse.json({
    success: true,
    count: results.length,
    region,
    supports: results,
  });
}
