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

export { calculateLocationScore, calculateSalaryScore, calculateSkillScore };
