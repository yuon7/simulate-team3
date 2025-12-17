// スキルスコア (必須 0.7点 + 歓迎 0.3点)
export const calculateSkillScore = (
  requiredSkills: { name: string, level: string | null }[],
  userSkills: string[]
): number => {
  // ユーザーのスキルを小文字のSetにする (例: {"react", "typescript"})
  const userSkillSet = new Set(userSkills.map(s => s.toLowerCase()));

  // 求人側のスキルを分類
  const requiredLevelSkills = requiredSkills
    .filter(rs => rs.level === '必須')
    .map(rs => rs.name.toLowerCase());

  const recommendedLevelSkills = requiredSkills
    .filter(rs => rs.level === '歓迎')
    .map(rs => rs.name.toLowerCase());

  // 必須スキルが設定されていない求人
  if (requiredLevelSkills.length === 0) {
    if (recommendedLevelSkills.length === 0) return 1; // スキル指定なしだったら満点
    // 歓迎スキルだけで判断
    const matchedRecommended = recommendedLevelSkills.filter(rs => userSkillSet.has(rs));
    return (matchedRecommended.length / recommendedLevelSkills.length);
  }

  // 必須スキルが設定されている場合
  const matchedRequired = requiredLevelSkills.filter(rs => userSkillSet.has(rs));

  if (recommendedLevelSkills.length === 0) {
    // 歓迎スキルなし
    return (matchedRequired.length / requiredLevelSkills.length);
  }

  // 必須スキルと歓迎スキル両方あり
  // 必須スキルの達成度 (0.7点満点)
  const requiredScore = (matchedRequired.length / requiredLevelSkills.length) * 0.7;

  // 歓迎スキルの達成度 (0.3点満点)
  let recommendedScore = 0;
  if (recommendedLevelSkills.length > 0) {
    const matchedRecommended = recommendedLevelSkills.filter(rs => userSkillSet.has(rs));
    recommendedScore = (matchedRecommended.length / recommendedLevelSkills.length) * 0.3;
  }

  return requiredScore + recommendedScore;
};

// 勤務地スコア (完全一致で1点、希望なしで1点、その他0点)
export const calculateLocationScore = (
  jobLocationName: string,
  desiredLocationNames: string[]
): number => {
  // 勤務地を希望してない場合は満点
  if (desiredLocationNames.length === 0) {
    return 1;
  }
  // 希望リストを小文字のSetにする
  const desiredSet = new Set(desiredLocationNames.map(name => name.toLowerCase()));

  // 求人の勤務地が希望リストに含まれていれば1点
  return desiredSet.has(jobLocationName.toLowerCase()) ? 1 : 0;
};

// 給与スコア（最低よりも高ければ1点、希望なしで1点、企業の給与設定なしは0.5点、その他0点）
export const calculateSalaryScore = (
  jobSalaryMin: number | null,
  jobSalaryMax: number | null,
  userDesiredSalary: number | null
): number => {
  if (!userDesiredSalary) return 1;
  if (!jobSalaryMin && !jobSalaryMax) return 0.5;
  if (jobSalaryMax && (jobSalaryMax >= userDesiredSalary)) return 1;
  if (jobSalaryMin && (jobSalaryMin >= userDesiredSalary)) return 1;
  return 0;
};