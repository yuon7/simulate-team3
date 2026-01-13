
import { matchAgent } from "./mastra/agents/userAgents";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Testing Agent with Profile Context Injection...");

    // 1. Fetch Profile (Simulating what runs in route.ts)
    const userEmail = "candidate@example.com";
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
            candidate: {
                include: {
                    userSkills: {
                        include: { skill: true }
                    },
                    desiredLocations: {
                        include: { location: { include: { prefecture: true } } }
                    }
                }
            }
        }
    });

    if (!user || !user.candidate) {
        console.error("Test user not found. Please run seed.");
        return;
    }

    const c = user.candidate;
    // Make sure bio has keywords we want to test
    console.log("Current Bio:", c.bio);
    // Should be "フルスタックエンジニアを目指して学習中です。地方での働き方に興味があります。" from seed.
    // matchTool should pick up "地方" maybe? Or strict skill match.

    // Let's mimic the route.ts logic
    const skills = c.userSkills.map(us => `${us.skill.name}`).join(", ");
    const locations = c.desiredLocations.map(dl => dl.location.prefecture.name).join(", ");

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

    const userMessage = "私におすすめの企業はありますか？"; // Very generic question
    const fullMessage = profileContext + "\n" + userMessage;

    console.log("\n--- Sending Message to Agent ---");
    console.log(fullMessage);
    console.log("--------------------------------\n");

    const result = await matchAgent.generate(fullMessage);

    console.log("--- Agent Response ---");
    console.log(result.text);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
