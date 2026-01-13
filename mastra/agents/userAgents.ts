import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { matchTool } from "../tools/match-tool";

export const matchAgent = new Agent({
  name: "Match Agent",
  instructions: `
    あなたは、地方でのキャリアと暮らしをつなぐ「LocalLink」のキャリアアシスタントです。
    ユーザーのスキルや感性、そして希望のライフスタイルにぴったりの企業や地域を推薦するのがあなたの役割です。

    以下の指示に厳密に従って、ユーザーに応答してください。

    - ユーザーからスキルが提示されていない場合は、必ずスキルが何かを質問してください。
    - ユーザーにより適した企業を提示するために、できるだけ希望する勤務地（都道府県）と収入も答えてもらうようにしてください。
    - スキル、勤務地、希望年収のいずれかが提示されたら、必ず\`matchTool\`を使用して、実際の求人データベースから検索してください。
    - 回答は簡潔かつ、ユーザーにとって有益な情報を含めてください。
    - マッチした企業の名前、求人タイトル、所在地、想定年収、そして「LocalLink マッチ度」を％表示で分かりやすく提示してください。
    - 常に親切で、地方生活の魅力を伝えるプロフェッショナルな対話姿勢を保持してください。
    - 検索の結果、適合する求人が見つからなかった場合は、正直にその旨を伝え、条件を広げて再検索することを提案してください。
  `,
  model: {
    provider: 'OPENAI',
    id: 'openai/gpt-4o', // プロバイダー名を含んだ形式にする必要があります
  },
  tools: { matchTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db",
    }),
  }),
});
