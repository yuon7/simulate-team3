
import { matchTool } from "./mastra/tools/match-tool";

async function main() {
    console.log("Testing matchTool with keywords...");

    const result = await matchTool.execute({
        context: {
            skills: ["マーケティング", "英語"],
            // ユーザー入力: "英語力を活かして、日本の伝統工芸品を海外に広める仕事に興味があります... 古い街並みが残る場所で働きたいです。"
            keywords: ["伝統工芸", "古い街並み", "海外", "英語", "マーケティング"],
            desiredSalary: 4000000,
            location: [] // 場所は特定しない
        }
    } as any);

    console.log("--- Result ---");
    result.forEach((r: any) => {
        console.log(`[Score: ${r.matchScore}] ${r.name} - ${r.title} (${r.location})`);
    });
}

main();
