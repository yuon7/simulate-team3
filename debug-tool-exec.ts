import { matchTool } from "./mastra/tools/match-tool";

async function main() {
    console.log("Testing matchTool execution...");
    try {
        const context = {
            skills: ["マーケティング"],
            location: ["東京"],
            desiredSalary: 5000000
        };

        // @ts-ignore
        const result = await matchTool.execute({ context });
        console.log("Result:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Tool Execution Error:", error);
    }
}

main();
