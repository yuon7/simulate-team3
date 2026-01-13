import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PREFECTURES = [
  { id: 1, name: "北海道", code: "01" },
  { id: 2, name: "青森県", code: "02" },
  { id: 3, name: "岩手県", code: "03" },
  { id: 4, name: "宮城県", code: "04" },
  { id: 5, name: "秋田県", code: "05" },
  { id: 6, name: "山形県", code: "06" },
  { id: 7, name: "福島県", code: "07" },
  { id: 8, name: "茨城県", code: "08" },
  { id: 10, name: "群馬県", code: "10" },
  { id: 11, name: "埼玉県", code: "11" },
  { id: 12, name: "千葉県", code: "12" },
  { id: 13, name: "東京都", code: "13" },
  { id: 14, name: "神奈川県", code: "14" },
  { id: 15, name: "新潟県", code: "15" },
  { id: 20, name: "長野県", code: "20" },
  { id: 23, name: "愛知県", code: "23" },
  { id: 26, name: "京都府", code: "26" },
  { id: 27, name: "大阪府", code: "27" },
  { id: 28, name: "兵庫県", code: "28" },
  { id: 32, name: "島根県", code: "32" },
  { id: 33, name: "岡山県", code: "33" },
  { id: 34, name: "広島県", code: "34" },
  { id: 40, name: "福岡県", code: "40" },
  { id: 43, name: "熊本県", code: "43" },
  { id: 47, name: "沖縄県", code: "47" },
];

async function main() {
  console.log("Start seeding ...");

  // Clean up existing data to avoid desync
  console.log("Cleaning up existing data...");

  // 1. Delete leaf relations (most dependent)
  await prisma.message.deleteMany();
  await prisma.matchingScore.deleteMany();
  await prisma.application.deleteMany();
  await prisma.jobPostingSkill.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.desiredLocation.deleteMany();

  // 2. Delete mid-level entities
  await prisma.jobPosting.deleteMany();
  await prisma.staffProfile.deleteMany();
  await prisma.candidateProfile.deleteMany();

  // 3. Delete base entities
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();
  await prisma.location.deleteMany();

  console.log("Cleanup finished. Starting fresh seeding...");

  for (const pref of PREFECTURES) {
    await prisma.prefecture.upsert({
      where: { id: pref.id },
      update: {},
      create: pref,
    });
  }

  // Categories
  const categories = [
    "エンジニア", "デザイナー", "マーケティング", "営業", "事務・管理", "企画・経営", "接客・販売", "医療・福祉", "教育", "建設・土木"
  ];
  const catModels: any[] = [];
  for (const catName of categories) {
    const cat = await prisma.jobCategory.upsert({
      where: { name: catName },
      update: {},
      create: { name: catName },
    });
    catModels.push(cat);
  }

  // Skills
  const skills = ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Figma", "English", "Agile"];
  const skillModels: any = {};
  for (const skillName of skills) {
    const s = await prisma.skill.upsert({
      where: { name: skillName },
      update: {},
      create: { name: skillName },
    });
    skillModels[skillName] = s.id;
  }

  // Organizations & Jobs
  const orgs = [
    {
      name: "テック長野株式会社", pref: "長野県", city: "松本市", type: "COMPANY", jobs: [
        { title: "シニアフルスタックエンジニア", cat: "エンジニア", salaryMin: 6000000, salaryMax: 9000000, tags: ["リモートワーク可", "TypeScript", "自社サービス", "週休2日"] },
        { title: "UI/UXデザイナー", cat: "デザイナー", salaryMin: 4000000, salaryMax: 7000000, tags: ["Figma", "移住支援あり", "フレックス", "残業少なめ"] }
      ]
    },
    {
      name: "島根アグリ・イノベーション", pref: "島根県", city: "出雲市", type: "COMPANY", jobs: [
        { title: "スマート農業の企画・運用", cat: "企画・経営", salaryMin: 3500000, salaryMax: 5000000, tags: ["未経験歓迎", "農業IT", "地域貢献", "学歴不問", "転勤なし"] }
      ]
    },
    {
      name: "福岡ライフケアサポート", pref: "福岡県", city: "福岡市", type: "COMPANY", jobs: [
        { title: "介護福祉士（ユニット型）", cat: "医療・福祉", salaryMin: 3000000, salaryMax: 4500000, tags: ["資格手当あり", "福岡移住", "寮完備", "賞与あり", "週休2日"] }
      ]
    },
    {
      name: "京都伝統工芸デジタル販売", pref: "京都府", city: "京都市", type: "COMPANY", jobs: [
        { title: "海外向けECマーケーター", cat: "マーケティング", salaryMin: 4500000, salaryMax: 8000000, tags: ["英語活かせる", "伝統工芸", "フレックス", "服装自由"] }
      ]
    },
    {
      name: "北海道アウトドア観光局", pref: "北海道", city: "富良野市", type: "COMPANY", jobs: [
        { title: "アウトドアガイド・ツアー企画", cat: "企画・経営", salaryMin: 2800000, salaryMax: 4000000, tags: ["自然が好き", "英語", "寮完備", "未経験歓迎", "賞与あり"] }
      ]
    }
  ];

  for (const orgData of orgs) {
    const pref = await prisma.prefecture.findFirst({ where: { name: orgData.pref } });
    if (!pref) continue;

    const location = await prisma.location.upsert({
      where: {
        prefectureId_city_street: {
          prefectureId: pref.id,
          city: orgData.city,
          street: "メイン通り1-1",
        },
      },
      update: {},
      create: {
        prefectureId: pref.id,
        city: orgData.city,
        street: "メイン通り1-1",
      },
    });

    const org = await prisma.organization.upsert({
      where: { name: orgData.name },
      update: { locationId: location.id },
      create: {
        name: orgData.name,
        organizationType: orgData.type as any,
        locationId: location.id,
        description: `${orgData.pref}${orgData.city}を拠点に活動する${orgData.name}です。地域社会への貢献を目指しています。`,
      },
    });

    // Create a staff user for each org for testing
    const email = orgData.name === "テック長野株式会社"
      ? "technagano@example.com"
      : `${orgData.name.replace(/\s+/g, '').toLowerCase()}@example.com`;

    const user = await prisma.user.upsert({
      where: { email },
      update: { role: "STAFF", name: `${orgData.name} 採用担当` },
      create: {
        email,
        passwordHash: "managed_by_supabase",
        role: "STAFF",
        name: `${orgData.name} 採用担当`,
      },
    });

    await prisma.staffProfile.upsert({
      where: { userId: user.id },
      update: { organizationId: org.id },
      create: {
        userId: user.id,
        organizationId: org.id,
        title: orgData.name === "テック長野株式会社" ? "採用担当者" : "HRマネージャー",
      },
    });

    for (const jobData of orgData.jobs) {
      const cat = catModels.find(c => c.name === jobData.cat);
      await prisma.jobPosting.upsert({
        where: { id: -1 }, // This won't work for upsert without unique fields, let's just create if not exists
        update: {},
        create: {
          title: jobData.title,
          description: `${jobData.title}の募集です。詳細についてはお問い合わせください。地域の魅力を活かした働き方を提案しています。`,
          organizationId: org.id,
          employmentType: "正社員",
          jobCategoryId: cat?.id || catModels[0].id,
          locationId: location.id,
          salaryMin: jobData.salaryMin,
          salaryMax: jobData.salaryMax,
          tags: jobData.tags,
        }
      }).catch(async () => {
        // Fallback for JobPosting since it doesn't have a natural unique key in this seed
        const exists = await prisma.jobPosting.findFirst({
          where: { title: jobData.title, organizationId: org.id }
        });
        if (!exists) {
          await prisma.jobPosting.create({
            data: {
              title: jobData.title,
              description: `${jobData.title}の募集です。詳細についてはお問い合わせください。地域の魅力を活かした働き方を提案しています。`,
              organizationId: org.id,
              employmentType: "正社員",
              jobCategoryId: cat?.id || catModels[0].id,
              locationId: location.id,
              salaryMin: jobData.salaryMin,
              salaryMax: jobData.salaryMax,
              tags: jobData.tags,
            }
          });
        }
      });
    }
  }

  // Create mock candidate
  const candidateEmail = "candidate@example.com";
  const candidateUser = await prisma.user.upsert({
    where: { email: candidateEmail },
    update: { role: "CANDIDATE", name: "テスト 太郎" },
    create: {
      email: candidateEmail,
      passwordHash: "managed_by_supabase",
      role: "CANDIDATE",
      name: "テスト 太郎",
    },
  });

  await prisma.candidateProfile.upsert({
    where: { userId: candidateUser.id },
    update: { bio: "フルスタックエンジニアを目指して学習中です。地方での働き方に興味があります。" },
    create: {
      userId: candidateUser.id,
      bio: "フルスタックエンジニアを目指して学習中です。地方での働き方に興味があります。",
      gender: "男性",
      age: 28,
    }
  });

  console.log("Seeding finished.");
  console.log("\n--- Mock Login Info ---");
  console.log("Staff Example: technagano@example.com / password123 (Needs manual creation in Supabase)");
  console.log("Candidate: candidate@example.com / password123 (Needs manual creation in Supabase)");
  console.log("-----------------------\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
