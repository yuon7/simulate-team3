import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "質問内容を入力してください。" },
        { status: 400 }
      );
    }

    // INIAD API サーバー URL＋APIキー
    const apiKey = process.env.INIAD_OPENAI_API_KEY!;
    const baseURL = process.env.INIAD_OPENAI_BASE_URL!; // 例: https://api.openai.iniad.org/api/v1

    const payload = {
      model: "gpt-4.1", // あなたが授業で使っていたモデル
      messages: [
        { role: "system", content: "あなたは地方移住のアドバイザーです。" },
        { role: "user", content: message }
      ]
    };

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    const reply = data?.choices?.[0]?.message?.content ?? "回答を取得できませんでした。";

    return NextResponse.json({ reply });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "サーバー内部でエラーが発生しました。" },
      { status: 500 }
    );
  }
}
