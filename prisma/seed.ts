const { 
  PrismaClient, 
  UserRole, 
  OrganizationType, 
  SkillProficiency, 
  SkillLevel, 
  ApplicationStatus 
} = require('@prisma/client');

const prisma = new PrismaClient();

// 1. 都道府県データ
const prefecturesData = [
  { name: '北海道', code: '01' }, { name: '青森県', code: '02' }, 
  { name: '岩手県', code: '03' }, { name: '宮城県', code: '04' },
  { name: '秋田県', code: '05' }, { name: '山形県', code: '06' }, 
  { name: '福島県', code: '07' }, { name: '茨城県', code: '08' },
  { name: '栃木県', code: '09' }, { name: '群馬県', code: '10' }, 
  { name: '埼玉県', code: '11' }, { name: '千葉県', code: '12' },
  { name: '東京都', code: '13' }, { name: '神奈川県', code: '14' }, 
  { name: '新潟県', code: '15' }, { name: '富山県', code: '16' },
  { name: '石川県', code: '17' }, { name: '福井県', code: '18' }, 
  { name: '山梨県', code: '19' }, { name: '長野県', code: '20' },
  { name: '岐阜県', code: '21' }, { name: '静岡県', code: '22' }, 
  { name: '愛知県', code: '23' }, { name: '三重県', code: '24' },
  { name: '滋賀県', code: '25' }, { name: '京都府', code: '26' }, 
  { name: '大阪府', code: '27' }, { name: '兵庫県', code: '28' },
  { name: '奈良県', code: '29' }, { name: '和歌山県', code: '30' }, 
  { name: '鳥取県', code: '31' }, { name: '島根県', code: '32' },
  { name: '岡山県', code: '33' }, { name: '広島県', code: '34' }, 
  { name: '山口県', code: '35' }, { name: '徳島県', code: '36' },
  { name: '香川県', code: '37' }, { name: '愛媛県', code: '38' }, 
  { name: '高知県', code: '39' }, { name: '福岡県', code: '40' },
  { name: '佐賀県', code: '41' }, { name: '長崎県', code: '42' }, 
  { name: '熊本県', code: '43' }, { name: '大分県', code: '44' },
  { name: '宮崎県', code: '45' }, { name: '鹿児島県', code: '46' }, 
  { name: '沖縄県', code: '47' },
];

async function seedPrefectures() {
  console.log('--- 47都道府県データのシード開始 ---');
  const result = await prisma.prefecture.createMany({
    data: prefecturesData,
    skipDuplicates: true,
  });
  console.log(`✅ Prefectureに ${result.count} 件のデータを登録しました。`);
}

async function seedTestUsersAndJobs() {
  console.log('\n--- テストデータのシード開始 ---');

  // 1. 共通で必要となるマスターデータの作成/取得
  const tokyoPref = await prisma.prefecture.findUniqueOrThrow({ where: { code: '13' } });
  
  // Location: 東京都千代田区
  const chiyodaLocation = await prisma.location.upsert({
    where: { prefectureId_city_street: { prefectureId: tokyoPref.id, city: '千代田区', street: '丸の内1-1-1' } },
    update: {},
    create: {
      prefecture: { connect: { id: tokyoPref.id } },
      city: '千代田区',
      street: '丸の内1-1-1',
    },
  });

  // JobCategory: エンジニア
  const engineerCategory = await prisma.jobCategory.upsert({
    where: { name: 'エンジニア' },
    update: {},
    create: { name: 'エンジニア' },
  });
  
  // Skill: TypeScript
  const typescriptSkill = await prisma.skill.upsert({
    where: { name: 'TypeScript' },
    update: {},
    create: { name: 'TypeScript' },
  });

  // 2. 企業・自治体担当者 (Staff) の登録と関連データ

  const testOrganization = await prisma.organization.upsert({
    where: { name: 'テスト株式会社' },
    update: {},
    create: {
      name: 'テスト株式会社',
      organizationType: OrganizationType.COMPANY,
      description: '次世代マッチングプラットフォームを提供する企業です。',
      location: { connect: { id: chiyodaLocation.id } },
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      email: 'staff.test@example.com',
      passwordHash: 'hashed_password_for_staff',
      role: UserRole.STAFF,
      name: '佐藤 担当',
      phone: '09011112222',
      staff: {
        create: {
          organization: { connect: { id: testOrganization.id } },
          department: '人事部',
          title: '採用担当',
        },
      },
    },
  });
  console.log(`✅ 担当者ユーザー登録完了: ${staffUser.email}`);
  
  // 3. 求人情報 (JobPosting) の登録
  const jobPosting = await prisma.jobPosting.create({
    data: {
      title: 'フロントエンドエンジニア募集',
      description: 'Typescriptを用いたWebアプリケーション開発に従事していただきます。',
      organization: { connect: { id: testOrganization.id } },
      jobCategory: { connect: { id: engineerCategory.id } },
      location: { connect: { id: chiyodaLocation.id } },
      salaryMin: 5000000,
      salaryMax: 8000000,
      requiredSkills: {
        create: [{
          skill: { connect: { id: typescriptSkill.id } },
          level: SkillLevel.MUST,
          proficiency: SkillProficiency.INTERMEDIATE,
        }],
      },
    },
  });
  console.log(`✅ 求人情報登録完了: ${jobPosting.title}`);

  // 4. 候補者 (Candidate) の登録
  const candidateUser = await prisma.user.create({
    data: {
      email: 'candidate.test@example.com',
      passwordHash: 'hashed_password_for_candidate',
      role: UserRole.CANDIDATE,
      name: '田中 太郎',
      phone: '08033334444',
      candidate: {
        create: {
          gender: '男性',
          age: 30,
          bio: 'ウェブ開発経験5年。新しい技術に意欲的です。',
          desiredSalary: 6000000,
          desiredJob: { connect: { id: engineerCategory.id } },
          // 希望勤務地
          desiredLocations: {
            create: [{ location: { connect: { id: chiyodaLocation.id } } }],
          },
          // スキルの登録
          userSkills: {
            create: [{
              skill: { connect: { id: typescriptSkill.id } },
              proficiency: SkillProficiency.ADVANCED,
            }],
          },
        },
      },
    },
  });
  console.log(`✅ 候補者ユーザー登録完了: ${candidateUser.email}`);
  
  // 5. 応募 (Application) の登録
  await prisma.application.create({
      data: {
          candidate: { connect: { userId: candidateUser.id } },
          jobPosting: { connect: { id: jobPosting.id } },
          status: ApplicationStatus.PENDING,
      },
  });
  console.log(`✅ 応募登録完了: ${candidateUser.name} -> ${jobPosting.title}`);
}

// すべてのシード処理を実行するメイン関数
async function main() {
  await seedPrefectures(); // 最初に都道府県を登録
  await seedTestUsersAndJobs(); // 次に関連データとユーザーを登録
}

// 実行処理
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });