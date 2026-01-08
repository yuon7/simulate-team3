import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import {
  calculateSkillScore,
  calculateLocationScore,
  calculateSalaryScore,
} from './scoring';

// 10社分のモックデータ
const MOCK_COMPANIES = [
  // 1: TechCorp Japan
  {
    id: 1, organizationName: 'TechCorp Japan', title: 'シニア・フロントエンドエンジニア (React)', location: '東京都', salaryMin: 7000000, salaryMax: 10000000,
    requiredSkills: [{ name: 'TypeScript', level: '必須' }, { name: 'React', level: '必須' }, { name: 'Node.js', level: '歓迎' }]
  },
  // 2: WebSolutions Inc.
  {
    id: 2, organizationName: 'WebSolutions Inc.', title: 'クラウドインフラエンジニア (AWS)', location: '大阪府', salaryMin: 6000000, salaryMax: 9000000,
    requiredSkills: [{ name: 'AWS', level: '必須' }, { name: 'Node.js', level: '歓迎' }]
  },
  // 3: AI-Lab Inc.
  {
    id: 3, organizationName: 'AI-Lab Inc.', title: 'AIリサーチャー / データサイエンティスト', location: '東京都', salaryMin: 8000000, salaryMax: 12000000,
    requiredSkills: [{ name: 'Python', level: '必須' }]
  },
  // 4: DataDrive Ltd.
  {
    id: 4, organizationName: 'DataDrive Ltd.', title: 'データエンジニア (GCP)', location: '福岡県福岡市', salaryMin: 5500000, salaryMax: 8500000,
    requiredSkills: [{ name: 'Python', level: '必須' }, { name: 'GCP', level: '必須' }]
  },
  // 5: CyberSecure Co.
  {
    id: 5, organizationName: 'CyberSecure Co.', title: 'セキュリティエンジニア', location: '神奈川県横浜市', salaryMin: 6000000, salaryMax: 9000000,
    requiredSkills: []
  },
  // 6: CloudNative Solutions
  {
    id: 6, organizationName: 'CloudNative Solutions', title: 'SRE / DevOpsエンジニア', location: '東京都', salaryMin: 7000000, salaryMax: 11000000,
    requiredSkills: [{ name: 'AWS', level: '必須' }, { name: 'Kubernetes', level: '必須' }, { name: 'Python', level: '歓迎' }]
  },
  // 7: Fintech Innovators
  {
    id: 7, organizationName: 'Fintech Innovators', title: 'バックエンドエンジニア (Java)', location: '大阪府', salaryMin: 6500000, salaryMax: 9500000,
    requiredSkills: [{ name: 'Java', level: '必須' }]
  },
  // 8: NextGen Mobility
  {
    id: 8, organizationName: 'NextGen Mobility', title: 'プロジェクトマネージャー (PM)', location: '神奈川県横浜市', salaryMin: 8000000, salaryMax: 13000000,
    requiredSkills: [{ name: 'AWS', level: '歓迎' }]
  },
  // 9: SaaS Creators
  {
    id: 9, organizationName: 'SaaS Creators', title: 'UI/UXデザイナー', location: '東京都', salaryMin: 5000000, salaryMax: 8000000,
    requiredSkills: [{ name: 'Figma', level: '必須' }]
  },
  // 10: Digital Marketing Partners
  {
    id: 10, organizationName: 'Digital Marketing Partners', title: 'Webマーケター (SEO/広告)', location: '北海道札幌市', salaryMin: 4000000, salaryMax: 6500000,
    requiredSkills: [{ name: 'Google Analytics', level: '必須' }]
  },
];


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
  id: 'find-matching-companies',
  description: 'ユーザーのスキル、希望勤務地、希望年収、優先度に基づいて、最適な企業をスコアリングし、推薦順にリストアップします。',

  inputSchema: z.object({
    skills: z.array(z.string()).describe('ユーザーが持つスキルのリスト。例: ["React", "Node.js"]'),
    location: z.array(z.string()).optional().describe('希望する勤務地のリスト。例: ["Tokyo", "Osaka"]'),
    desiredSalary: z.number().optional(),
    priorities: z.object({
      skills: z.number(),
      location: z.number(),
      salary: z.number(),
    }).optional(),
  }),

  outputSchema: z.array(scoredCompanySchema),

  execute: async ({ context }) => {
    //チャットからのユーザー入力を取得
    const { skills, location, desiredSalary, priorities } = context;
    const defaultPriorities = { skills: 0.5, location: 0.3, salary: 0.2 };
    const effectivePriorities = priorities || defaultPriorities;

    //スコアリング
    const scoredCompanies = MOCK_COMPANIES.map(job => {
      const skillScore = calculateSkillScore(
        job.requiredSkills,  // モックデータ ( {name, level}[] )
        skills               // ユーザー入力 ( string[] )
      );

      const locationScore = calculateLocationScore(
        job.location,        // モックデータ ( string )
        location ?? []       // ユーザー入力 ( string[] )
      );

      const salaryScore = calculateSalaryScore(
        job.salaryMin,
        job.salaryMax,
        desiredSalary ?? null
      );

      // 総合スコアを計算
      const matchScore =
        (skillScore * effectivePriorities.skills) +
        (locationScore * effectivePriorities.location) +
        (salaryScore * effectivePriorities.salary);

      return {
        id: job.id,
        name: job.organizationName,
        title: job.title,
        location: job.location,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        matchScore,
      };
    });

    // ソートしてAIに返す
    const sortedCompanies = scoredCompanies.sort((a, b) => b.matchScore - a.matchScore);

    // 上位5件をAIに返す
    return sortedCompanies.slice(0, 5);
  },
});