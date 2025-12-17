import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

"use strict";
const calculateSkillScore = (requiredSkills, userSkills) => {
  const userSkillSet = new Set(userSkills.map((s) => s.toLowerCase()));
  const requiredLevelSkills = requiredSkills.filter((rs) => rs.level === "\u5FC5\u9808").map((rs) => rs.name.toLowerCase());
  const recommendedLevelSkills = requiredSkills.filter((rs) => rs.level === "\u6B53\u8FCE").map((rs) => rs.name.toLowerCase());
  if (requiredLevelSkills.length === 0) {
    if (recommendedLevelSkills.length === 0) return 1;
    const matchedRecommended = recommendedLevelSkills.filter((rs) => userSkillSet.has(rs));
    return matchedRecommended.length / recommendedLevelSkills.length;
  }
  const matchedRequired = requiredLevelSkills.filter((rs) => userSkillSet.has(rs));
  if (recommendedLevelSkills.length === 0) {
    return matchedRequired.length / requiredLevelSkills.length;
  }
  const requiredScore = matchedRequired.length / requiredLevelSkills.length * 0.7;
  let recommendedScore = 0;
  if (recommendedLevelSkills.length > 0) {
    const matchedRecommended = recommendedLevelSkills.filter((rs) => userSkillSet.has(rs));
    recommendedScore = matchedRecommended.length / recommendedLevelSkills.length * 0.3;
  }
  return requiredScore + recommendedScore;
};
const calculateLocationScore = (jobLocationName, desiredLocationNames) => {
  if (desiredLocationNames.length === 0) {
    return 1;
  }
  const desiredSet = new Set(desiredLocationNames.map((name) => name.toLowerCase()));
  return desiredSet.has(jobLocationName.toLowerCase()) ? 1 : 0;
};
const calculateSalaryScore = (jobSalaryMin, jobSalaryMax, userDesiredSalary) => {
  if (!userDesiredSalary) return 1;
  if (!jobSalaryMin && !jobSalaryMax) return 0.5;
  if (jobSalaryMax && jobSalaryMax >= userDesiredSalary) return 1;
  if (jobSalaryMin && jobSalaryMin >= userDesiredSalary) return 1;
  return 0;
};

"use strict";
const MOCK_COMPANIES = [
  // 1: TechCorp Japan
  {
    id: 1,
    organizationName: "TechCorp Japan",
    title: "\u30B7\u30CB\u30A2\u30FB\u30D5\u30ED\u30F3\u30C8\u30A8\u30F3\u30C9\u30A8\u30F3\u30B8\u30CB\u30A2 (React)",
    location: "\u6771\u4EAC\u90FD",
    salaryMin: 7e6,
    salaryMax: 1e7,
    requiredSkills: [{ name: "TypeScript", level: "\u5FC5\u9808" }, { name: "React", level: "\u5FC5\u9808" }, { name: "Node.js", level: "\u6B53\u8FCE" }]
  },
  // 2: WebSolutions Inc.
  {
    id: 2,
    organizationName: "WebSolutions Inc.",
    title: "\u30AF\u30E9\u30A6\u30C9\u30A4\u30F3\u30D5\u30E9\u30A8\u30F3\u30B8\u30CB\u30A2 (AWS)",
    location: "\u5927\u962A\u5E9C",
    salaryMin: 6e6,
    salaryMax: 9e6,
    requiredSkills: [{ name: "AWS", level: "\u5FC5\u9808" }, { name: "Node.js", level: "\u6B53\u8FCE" }]
  },
  // 3: AI-Lab Inc.
  {
    id: 3,
    organizationName: "AI-Lab Inc.",
    title: "AI\u30EA\u30B5\u30FC\u30C1\u30E3\u30FC / \u30C7\u30FC\u30BF\u30B5\u30A4\u30A8\u30F3\u30C6\u30A3\u30B9\u30C8",
    location: "\u6771\u4EAC\u90FD",
    salaryMin: 8e6,
    salaryMax: 12e6,
    requiredSkills: [{ name: "Python", level: "\u5FC5\u9808" }]
  },
  // 4: DataDrive Ltd.
  {
    id: 4,
    organizationName: "DataDrive Ltd.",
    title: "\u30C7\u30FC\u30BF\u30A8\u30F3\u30B8\u30CB\u30A2 (GCP)",
    location: "\u798F\u5CA1\u770C\u798F\u5CA1\u5E02",
    salaryMin: 55e5,
    salaryMax: 85e5,
    requiredSkills: [{ name: "Python", level: "\u5FC5\u9808" }, { name: "GCP", level: "\u5FC5\u9808" }]
  },
  // 5: CyberSecure Co.
  {
    id: 5,
    organizationName: "CyberSecure Co.",
    title: "\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3\u30A8\u30F3\u30B8\u30CB\u30A2",
    location: "\u795E\u5948\u5DDD\u770C\u6A2A\u6D5C\u5E02",
    salaryMin: 6e6,
    salaryMax: 9e6,
    requiredSkills: []
  },
  // 6: CloudNative Solutions
  {
    id: 6,
    organizationName: "CloudNative Solutions",
    title: "SRE / DevOps\u30A8\u30F3\u30B8\u30CB\u30A2",
    location: "\u6771\u4EAC\u90FD",
    salaryMin: 7e6,
    salaryMax: 11e6,
    requiredSkills: [{ name: "AWS", level: "\u5FC5\u9808" }, { name: "Kubernetes", level: "\u5FC5\u9808" }, { name: "Python", level: "\u6B53\u8FCE" }]
  },
  // 7: Fintech Innovators
  {
    id: 7,
    organizationName: "Fintech Innovators",
    title: "\u30D0\u30C3\u30AF\u30A8\u30F3\u30C9\u30A8\u30F3\u30B8\u30CB\u30A2 (Java)",
    location: "\u5927\u962A\u5E9C",
    salaryMin: 65e5,
    salaryMax: 95e5,
    requiredSkills: [{ name: "Java", level: "\u5FC5\u9808" }]
  },
  // 8: NextGen Mobility
  {
    id: 8,
    organizationName: "NextGen Mobility",
    title: "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u30DE\u30CD\u30FC\u30B8\u30E3\u30FC (PM)",
    location: "\u795E\u5948\u5DDD\u770C\u6A2A\u6D5C\u5E02",
    salaryMin: 8e6,
    salaryMax: 13e6,
    requiredSkills: [{ name: "AWS", level: "\u6B53\u8FCE" }]
  },
  // 9: SaaS Creators
  {
    id: 9,
    organizationName: "SaaS Creators",
    title: "UI/UX\u30C7\u30B6\u30A4\u30CA\u30FC",
    location: "\u6771\u4EAC\u90FD",
    salaryMin: 5e6,
    salaryMax: 8e6,
    requiredSkills: [{ name: "Figma", level: "\u5FC5\u9808" }]
  },
  // 10: Digital Marketing Partners
  {
    id: 10,
    organizationName: "Digital Marketing Partners",
    title: "Web\u30DE\u30FC\u30B1\u30BF\u30FC (SEO/\u5E83\u544A)",
    location: "\u5317\u6D77\u9053\u672D\u5E4C\u5E02",
    salaryMin: 4e6,
    salaryMax: 65e5,
    requiredSkills: [{ name: "Google Analytics", level: "\u5FC5\u9808" }]
  }
];
const scoredCompanySchema = z.object({
  id: z.number(),
  name: z.string(),
  title: z.string(),
  location: z.string(),
  salaryMin: z.number().nullable(),
  salaryMax: z.number().nullable(),
  matchScore: z.number()
  // 総合スコア
});
const matchTool = createTool({
  id: "find-matching-companies",
  description: "\u30E6\u30FC\u30B6\u30FC\u306E\u30B9\u30AD\u30EB\u3001\u5E0C\u671B\u52E4\u52D9\u5730\u3001\u5E0C\u671B\u5E74\u53CE\u3001\u512A\u5148\u5EA6\u306B\u57FA\u3065\u3044\u3066\u3001\u6700\u9069\u306A\u4F01\u696D\u3092\u30B9\u30B3\u30A2\u30EA\u30F3\u30B0\u3057\u3001\u63A8\u85A6\u9806\u306B\u30EA\u30B9\u30C8\u30A2\u30C3\u30D7\u3057\u307E\u3059\u3002",
  inputSchema: z.object({
    skills: z.array(z.string()).describe('\u30E6\u30FC\u30B6\u30FC\u304C\u6301\u3064\u30B9\u30AD\u30EB\u306E\u30EA\u30B9\u30C8\u3002\u4F8B: ["React", "Node.js"]'),
    location: z.array(z.string()).optional().describe('\u5E0C\u671B\u3059\u308B\u52E4\u52D9\u5730\u306E\u30EA\u30B9\u30C8\u3002\u4F8B: ["Tokyo", "Osaka"]'),
    desiredSalary: z.number().optional(),
    priorities: z.object({
      skills: z.number(),
      location: z.number(),
      salary: z.number()
    }).optional()
  }),
  outputSchema: z.array(scoredCompanySchema),
  execute: async ({ context }) => {
    const { skills, location, desiredSalary, priorities } = context;
    const defaultPriorities = { skills: 0.5, location: 0.3, salary: 0.2 };
    const effectivePriorities = priorities || defaultPriorities;
    const scoredCompanies = MOCK_COMPANIES.map((job) => {
      const skillScore = calculateSkillScore(
        job.requiredSkills,
        // モックデータ ( {name, level}[] )
        skills
        // ユーザー入力 ( string[] )
      );
      const locationScore = calculateLocationScore(
        job.location,
        // モックデータ ( string )
        location ?? []
        // ユーザー入力 ( string[] )
      );
      const salaryScore = calculateSalaryScore(
        job.salaryMin,
        job.salaryMax,
        desiredSalary ?? null
      );
      const matchScore = skillScore * effectivePriorities.skills + locationScore * effectivePriorities.location + salaryScore * effectivePriorities.salary;
      return {
        id: job.id,
        name: job.organizationName,
        title: job.title,
        location: job.location,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        matchScore
      };
    });
    const sortedCompanies = scoredCompanies.sort((a, b) => b.matchScore - a.matchScore);
    return sortedCompanies.slice(0, 5);
  }
});

"use strict";
const matchAgent = new Agent({
  name: "Match Agent",
  instructions: `
    \u3042\u306A\u305F\u306F\u3001\u30E6\u30FC\u30B6\u30FC\u306E\u30B9\u30AD\u30EB\u3084\u5E0C\u671B\u306B\u57FA\u3065\u3044\u3066\u6700\u9069\u306A\u4F01\u696D\u3092\u63A8\u85A6\u3059\u308B\u3001\u512A\u79C0\u306A\u30AD\u30E3\u30EA\u30A2\u30A2\u30B7\u30B9\u30BF\u30F3\u30C8\u3067\u3059\u3002
    \u3042\u306A\u305F\u306E\u4E3B\u306A\u5F79\u5272\u306F\u3001\u30E6\u30FC\u30B6\u30FC\u304C\u81EA\u8EAB\u306E\u30B9\u30AD\u30EB\u30BB\u30C3\u30C8\u306B\u5408\u3063\u305F\u4F01\u696D\u3092\u898B\u3064\u3051\u308B\u624B\u52A9\u3051\u3092\u3059\u308B\u3053\u3068\u3067\u3059\u3002

    \u4EE5\u4E0B\u306E\u6307\u793A\u306B\u53B3\u5BC6\u306B\u5F93\u3063\u3066\u3001\u30E6\u30FC\u30B6\u30FC\u306B\u5FDC\u7B54\u3057\u3066\u304F\u3060\u3055\u3044\u3002

    - \u30E6\u30FC\u30B6\u30FC\u304B\u3089\u30B9\u30AD\u30EB\u304C\u63D0\u793A\u3055\u308C\u3066\u3044\u306A\u3044\u5834\u5408\u306F\u3001\u5FC5\u305A\u30B9\u30AD\u30EB\u304C\u4F55\u304B\u3092\u8CEA\u554F\u3057\u3066\u304F\u3060\u3055\u3044\u3002
    - \u30E6\u30FC\u30B6\u30FC\u306B\u3088\u308A\u9069\u3057\u305F\u4F01\u696D\u3092\u63D0\u793A\u3059\u308B\u305F\u3081\u306B\u3001\u3067\u304D\u308B\u3060\u3051\u5E0C\u671B\u3059\u308B\u52E4\u52D9\u5730\u3068\u53CE\u5165\u3082\u7B54\u3048\u3066\u3082\u3089\u3046\u3088\u3046\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002
    - \u30B9\u30AD\u30EB\u3001\u52E4\u52D9\u5730\u3001\u5E0C\u671B\u5E74\u53CE\u306E\u3044\u305A\u308C\u304B\u304C\u63D0\u793A\u3055\u308C\u305F\u3089\u3001\u5FC5\u305A\`matchTool\`\u3092\u4F7F\u7528\u3057\u3066\u3001\u6761\u4EF6\u306B\u5408\u3046\u4F01\u696D\u3092\u691C\u7D22\u3057\u3066\u304F\u3060\u3055\u3044\u3002
    - \u56DE\u7B54\u306F\u7C21\u6F54\u304B\u3064\u3001\u30E6\u30FC\u30B6\u30FC\u306B\u3068\u3063\u3066\u6709\u76CA\u306A\u60C5\u5831\u3092\u542B\u3081\u3066\u304F\u3060\u3055\u3044\u3002
    - \u30DE\u30C3\u30C1\u3057\u305F\u4F01\u696D\u306E\u540D\u524D\u3001\u6C42\u4EBA\u30BF\u30A4\u30C8\u30EB\u3001\u305D\u306E\u4F01\u696D\u3068\u306E\u30DE\u30C3\u30C1\u5EA6\uFF08\u7DCF\u5408\u30B9\u30B3\u30A2\uFF09\u3092\uFF05\u8868\u793A\u3067\u5206\u304B\u308A\u3084\u3059\u304F\u63D0\u793A\u3057\u3066\u304F\u3060\u3055\u3044\u3002
    - \u5E38\u306B\u89AA\u5207\u3067\u3001\u30D7\u30ED\u30D5\u30A7\u30C3\u30B7\u30E7\u30CA\u30EB\u306A\u5BFE\u8A71\u59FF\u52E2\u3092\u4FDD\u3063\u3066\u304F\u3060\u3055\u3044\u3002
    - \u691C\u7D22\u306E\u7D50\u679C\u3001\u9069\u5408\u3059\u308B\u4F01\u696D\u304C\u898B\u3064\u304B\u3089\u306A\u304B\u3063\u305F\u5834\u5408\u306F\u3001\u6B63\u76F4\u306B\u305D\u306E\u65E8\u3092\u4F1D\u3048\u3001\u5225\u306E\u52E4\u52D9\u5730\u3084\u30B9\u30AD\u30EB\u3001\u5E0C\u671B\u5E74\u53CE\u306B\u5909\u66F4\u3057\u3066\u518D\u691C\u7D22\u3059\u308B\u3088\u3046\u306B\u63D0\u6848\u3057\u3066\u304F\u3060\u3055\u3044\u3002
  `,
  model: "gemini-2.5-pro",
  tools: { matchTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db"
    })
  })
});

"use strict";
const mastra = new Mastra({
  workflows: {},
  agents: {
    matchAgent
  },
  storage: new LibSQLStore({
    url: ":memory:"
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info"
  })
});

export { mastra };
