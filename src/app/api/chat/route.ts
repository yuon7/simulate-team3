import { mastra } from "@/../mastra";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { message, threadId } = await req.json();

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        const agent = mastra.getAgent("matchAgent");

        // ストリーミングレスポンスを生成
        const result = await agent.generate(message, {
            threadId: threadId || "default-thread",
            resourceId: "default-user",
        });

        return NextResponse.json({
            text: result.text,
        });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
