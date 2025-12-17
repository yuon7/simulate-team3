import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { calculateSkillScore, calculateLocationScore, calculateSalaryScore } from './546f9b28-0f53-4888-bc7f-b48f93a04936.mjs';

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

export { matchTool };
