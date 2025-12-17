import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { calculateLocationScore, calculateSalaryScore, calculateSkillScore } from "../tools/scoring";


// スキルマスタ (ネスト用)
const skillSchema = z.object({
  id: z.number(),
  name: z.string(),
});

// 勤務地マスタ (ネスト用)
const locationSchema = z.object({
  id: z.number(),
  name: z.string(),
});

// 候補者の保有スキル (リレーション先を含む)
const userSkillSchema = z.object({
  userId: z.string(),
  skillId: z.number(),
  skill: skillSchema,
});

// 候補者の希望勤務地 (リレーション先を含む)
const desiredLocationSchema = z.object({
  candidateId: z.string(),
  locationId: z.number(),
  location: locationSchema,
});

// 候補者の希望年収
const desiredSalary = z.number().nullable(); // 候補者が年収を設定していない場合 (null) も許容

//ユーザー情報の取得
const getUserInfoStep = createStep({
  id: "get-user-info",
  description: "ユーザーのスキル、希望勤務地、希望年収、優先度を取得します。",
  inputSchema: z.object({
    skill: skillSchema,
    desiredLocations: z.array(locationSchema),
    desiredSalary,
    priority: z.enum(["skills", "location", "salary"]),
    mockCompanies: z.array(z.object({
      id: z.number(),
      name: z.string(),
      title: z.string(),
      location: z.string(),
      salaryMin: z.number().nullable(),
      salaryMax: z.number().nullable(),
      requiredSkills: z.array(
        z.object({
          name: z.string(),
          level: z.string().nullable(),
        })
      ),
    })),
  }),
  outputSchema: z.object({
    skills: z.array(z.string()),
    desiredLocations: z.array(z.string()),
    desiredSalary: z.number().nullable(),
    priority: z.enum(["skills", "location", "salary"]),
    mockCompanies: z.array(z.object({
      id: z.number(),
      name: z.string(),
      title: z.string(),
      location: z.string(),
      salaryMin: z.number().nullable(),
      salaryMax: z.number().nullable(),
      requiredSkills: z.array(
        z.object({
          name: z.string(),
          level: z.string().nullable(),
        })
      ),
    })),
  }),
  execute: async ({ inputData }) => {
    try {
      const skills = inputData.skill ? [inputData.skill.name] : [];
      const desiredLocations = (inputData.desiredLocations ?? []).map(loc => loc.name);
      const desiredSalary =
        inputData.desiredSalary && inputData.desiredSalary !== null
          ? inputData.desiredSalary
          : null;
      return {
        skills,
        desiredLocations,
        desiredSalary,
        priority: inputData.priority,
        mockCompanies: inputData.mockCompanies,
      };
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      throw new Error("ユーザー情報の取得に失敗しました");
    }
  },
});
const matchStep = createStep({
  id: "match-companies",
  description: "ユーザーのスキル、希望勤務地、希望年収、優先度に基づいて、最適な企業をスコアリングし、推薦順にリストアップします。",
  inputSchema: z.object({
    skills: z.array(z.string()),
    desiredLocations: z.array(z.string()),
    desiredSalary: z.number().nullable(),
    priority: z.enum(["skills", "location", "salary"]),
    mockCompanies: z.array(z.object({
      id: z.number(),
      name: z.string(),
      title: z.string(),
      location: z.string(),
      salaryMin: z.number().nullable(),
      salaryMax: z.number().nullable(),
      requiredSkills: z.array(
        z.object({
          name: z.string(),
          level: z.string().nullable(),
        })
      ),
    })),
  }),
  outputSchema: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      title: z.string(),
      location: z.string(),
      salaryMin: z.number().nullable(),
      salaryMax: z.number().nullable(),
      matchScore: z.number(),
    })
  ),
  execute: async ({ inputData }) => {
    const prioritiesMap = {
      skills: { skills: 0.5, location: 0.3, salary: 0.2 },
      location: { skills: 0.3, location: 0.5, salary: 0.2 },
      salary: { skills: 0.2, location: 0.3, salary: 0.5 },
    };
    const priorities = prioritiesMap[inputData.priority];

    // スコアリング
    return inputData.mockCompanies.map(job => {
      const skillScore = calculateSkillScore(
        job.requiredSkills,
        inputData.skills
      );
      const locationScore = calculateLocationScore(
        job.location,
        inputData.desiredLocations
      );
      const salaryScore = calculateSalaryScore(
        job.salaryMin,
        job.salaryMax,
        inputData.desiredSalary ?? null
      );
      const matchScore =
        (skillScore * priorities.skills) +
        (locationScore * priorities.location) +
        (salaryScore * priorities.salary);

      return {
        id: job.id,
        name: job.name,
        title: job.title,
        location: job.location,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        matchScore,
      };
    });
  },
});

//スコアの高い順にソートして、上位5社を返すステップ
const sortAndSelectStep = createStep({
  id: "sort-and-select",
  description: "スコアの高い順に企業をソートし、上位5社を返します。",
  inputSchema: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      title: z.string(),
      location: z.string(),
      salaryMin: z.number().nullable(),
      salaryMax: z.number().nullable(),
      matchScore: z.number(),
    })
  ),
  outputSchema: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      title: z.string(),
      location: z.string(),
      salaryMin: z.number().nullable(),
      salaryMax: z.number().nullable(),
      matchScore: z.number(),
    })
  ),
  execute: async ({ inputData }) => {
    const sorted = inputData.sort((a, b) => b.matchScore - a.matchScore);
    return sorted.slice(0, 5);
  },
});

// マッチングワークフローの定義 
export const matchWorkflow = createWorkflow({
  id: "match-workflow",
  description: "ユーザーのスキル、希望勤務地、希望年収、優先度に基づいて最適な企業を推薦します。",
  inputSchema: z.object({
    skill: skillSchema,
    desiredLocations: z.array(locationSchema),
    desiredSalary: z.number().nullable(),
    priority: z.enum(["skills", "location", "salary"]),
    mockCompanies: z.array(z.object({
      id: z.number(),
      name: z.string(),
      title: z.string(),
      location: z.string(),
      salaryMin: z.number().nullable(),
      salaryMax: z.number().nullable(),
      requiredSkills: z.array(
        z.object({
          name: z.string(),
          level: z.string().nullable(),
        })
      ),
    })),
  }),
  outputSchema: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      title: z.string(),
      location: z.string(),
      salaryMin: z.number().nullable(),
      salaryMax: z.number().nullable(),
      matchScore: z.number(),
    })
  ),
})
  .then(getUserInfoStep)
  .then(matchStep)
  .then(sortAndSelectStep);

matchWorkflow.commit();