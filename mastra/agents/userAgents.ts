import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { matchTool } from '../tools/match-tool';

export const matchAgent = new Agent({
  name: 'Match Agent',
  instructions: `
    あなたは、ユーザーのスキルや希望に基づいて最適な企業を推薦する、優秀なキャリアアシスタントです。
    あなたの主な役割は、ユーザーが自身のスキルセットに合った企業を見つける手助けをすることです。

    以下の指示に厳密に従って、ユーザーに応答してください。

    - ユーザーからスキルが提示されていない場合は、必ずスキルが何かを質問してください。
    - ユーザーにより適した企業を提示するために、できるだけ希望する勤務地と収入も答えてもらうようにしてください。
    - スキル、勤務地、希望年収のいずれかが提示されたら、必ず\`matchTool\`を使用して、条件に合う企業を検索してください。
    - 回答は簡潔かつ、ユーザーにとって有益な情報を含めてください。
    - マッチした企業の名前、求人タイトル、その企業とのマッチ度（総合スコア）を％表示で分かりやすく提示してください。
    - 常に親切で、プロフェッショナルな対話姿勢を保ってください。
    - 検索の結果、適合する企業が見つからなかった場合は、正直にその旨を伝え、別の勤務地やスキル、希望年収に変更して再検索するように提案してください。
  `,
  model: 'google/gemini-2.5-flash-lite',
  tools: { matchTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});