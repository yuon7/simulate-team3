import { mastra } from "@/../mastra";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { message, threadId } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // 簡易的なユーザー特定（デモ用）
    const userEmail = "candidate@example.com";
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        candidate: {
          include: {
            userSkills: {
              include: { skill: true },
            },
            desiredLocations: {
              include: { location: { include: { prefecture: true } } },
            },
          },
        },
      },
    });

    let contextMessage = message;
    if (user?.candidate) {
      const c = user.candidate;
      const skills = c.userSkills.map((us) => `${us.skill.name}`).join(", ");
      const locations = c.desiredLocations
        .map((dl) => dl.location.prefecture.name)
        .join(", ");

      const profileContext = `
【ユーザー情報のコンテキスト】
以下の情報はデータベースにあるユーザーのプロフィールです。
ユーザーの明示的な入力がない場合でも、この情報を考慮してマッチングや回答を行ってください。
特にスキルや自己紹介の文脈（キーワード）は重要です。

- 名前: ${user.name}
- 自己紹介: ${c.bio || "なし"}
- 保有スキル: ${skills || "なし"}
- 希望勤務地: ${locations || "指定なし"}
--------------------------------------------------
ユーザーのメッセージ:
`;
      contextMessage = `${profileContext}\n${message}`;
    }

    const agent = mastra.getAgent("matchAgent");

    // ストリーミングレスポンスを生成 (Standard v5 stream)
    const result = await agent.stream(contextMessage, {
      threadId: threadId || "default-thread",
      resourceId: "default-user",
    });

    // フロントエンドがJSONを期待しているため、ストリームをサーバー側で全受信して返す
    let fullText = "";
    for await (const chunk of result.textStream) {
      fullText += chunk;
    }

    return NextResponse.json({
      text: fullText,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        error: `Internal Server Error: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    );
  }
}
