import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import {
  calculateSkillScore,
  calculateLocationScore,
  calculateSalaryScore,
} from "./scoring";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 企業情報のスキーマ
const scoredCompanySchema = z.object({
  id: z.number(),
  name: z.string(),
  title: z.string(),
  location: z.string(),
  salaryMin: z.number().nullable(),
  salaryMax: z.number().nullable(),
  matchScore: z.number(), // 総合スコア
});

export const matchTool = createTool({
  id: "find-matching-companies",
  description:
    "ユーザーのスキル、希望勤務地、希望年収、優先度に基づいて、実際のデータベースから最適な求人を検索し、スコアリングしてリストアップします。",

  inputSchema: z.object({
    skills: z
      .array(z.string())
      .describe('ユーザーが持つスキルのリスト。例: ["React", "Node.js"]'),
    location: z
      .array(z.string())
      .optional()
      .describe('希望する勤務地のリスト（都道府県名）。例: ["東京都", "長野県"]'),
    desiredSalary: z.number().optional().describe("希望年収（円）"),
    priorities: z
      .object({
        skills: z.number(),
        location: z.number(),
        salary: z.number(),
      })
      .optional()
      .describe("スコアリングの優先度（合計1.0になるように指定）"),
  }),

  outputSchema: z.array(scoredCompanySchema),

  execute: async ({ context }) => {
    // チャットからのユーザー入力を取得
    const { skills, location, desiredSalary, priorities } = context;
    const defaultPriorities = { skills: 0.5, location: 0.3, salary: 0.2 };
    const effectivePriorities = priorities || defaultPriorities;

    try {
      // データベースから求人情報を取得（関連スキルと組織・場所情報を含める）
      const jobPostings = await prisma.jobPosting.findMany({
        include: {
          organization: true,
          location: {
            include: {
              prefecture: true,
            },
          },
          requiredSkills: {
            include: {
              skill: true,
            },
          },
        },
      });

      // スコアリング
      const scoredCompanies = jobPostings.map((job) => {
        // 求人の要求スキルをフォーマット
        const formattedSkills = job.requiredSkills.map((rs) => ({
          name: rs.skill.name,
          level: rs.level === "MUST" ? "必須" : "歓迎",
        }));

        const skillScore = calculateSkillScore(
          formattedSkills,
          skills || [],
        );

        const locationScore = calculateLocationScore(
          job.location.prefecture.name, // 都道府県名で比較
          location ?? [],
        );

        const salaryScore = calculateSalaryScore(
          job.salaryMin,
          job.salaryMax,
          desiredSalary ?? null,
        );

        // 総合スコアを計算
        const matchScore =
          skillScore * effectivePriorities.skills +
          locationScore * effectivePriorities.location +
          salaryScore * effectivePriorities.salary;

        return {
          id: job.id,
          name: job.organization.name,
          title: job.title,
          location: `${job.location.prefecture.name}${job.location.city}`,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          matchScore: Math.round(matchScore * 100) / 100, // 小数点第2位まで
        };
      });

      // マッチ度が高い順にソート（0.1以上のものに限定）
      const sortedCompanies = scoredCompanies
        .filter(c => c.matchScore > 0.1)
        .sort((a, b) => b.matchScore - a.matchScore);

      // 上位5件をAIに返す
      return sortedCompanies.slice(0, 5);
    } catch (error) {
      console.error("Error in matchTool db query:", error);
      return [];
    } finally {
      await prisma.$disconnect();
    }
  },
});
