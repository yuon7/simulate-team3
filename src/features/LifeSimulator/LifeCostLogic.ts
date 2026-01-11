import { 
  RegionData, 
  LifeCostInputSchema, 
  LifeCostResultSchema,
  MonthlyCostData 
} from "./LifeCostSchema";

export const REGION_FACTORS: Record<string, RegionData> = {
  tokyo: { name: "東京都 (基準)", rent: 1.0, food: 1.0, isSnowy: false, climate: 'moderate', propaneRatio: 0.1 },
  hokkaido: { name: "北海道 (積雪モデル)", rent: 0.6, food: 0.95, isSnowy: true, climate: 'cold', propaneRatio: 0.6 },
  aomori: { name: "青森県 (寒冷・過疎)", rent: 0.45, food: 0.9, isSnowy: true, climate: 'cold', propaneRatio: 0.8 },
  niigata: { name: "新潟県 (日本海豪雪)", rent: 0.5, food: 0.92, isSnowy: true, climate: 'cold', propaneRatio: 0.7 },
  nagano: { name: "長野県 (内陸寒冷)", rent: 0.55, food: 0.93, isSnowy: true, climate: 'cold', propaneRatio: 0.7 },
  yamanashi: { name: "山梨県 (首都圏近郊)", rent: 0.6, food: 0.95, isSnowy: false, climate: 'moderate', propaneRatio: 0.8 },
  shizuoka: { name: "静岡県 (太平洋温暖)", rent: 0.65, food: 0.96, isSnowy: false, climate: 'moderate', propaneRatio: 0.6 },
  fukuoka: { name: "福岡県 (地方中核)", rent: 0.7, food: 0.9, isSnowy: false, climate: 'moderate', propaneRatio: 0.4 },
  kagawa: { name: "香川県 (瀬戸内穏やか)", rent: 0.5, food: 0.88, isSnowy: false, climate: 'moderate', propaneRatio: 0.6 },
  miyazaki: { name: "宮崎県 (南国・過疎)", rent: 0.45, food: 0.85, isSnowy: false, climate: 'warm', propaneRatio: 0.7 },
  okinawa: { name: "沖縄県 (離島モデル)", rent: 0.55, food: 0.95, isSnowy: false, climate: 'warm', propaneRatio: 0.9 },
};

export const calculateLifeCost = (input: LifeCostInputSchema): LifeCostResultSchema => {
  const region = REGION_FACTORS[input.targetRegionKey] || REGION_FACTORS["tokyo"];
  const people = input.familySize;
  const newRent = Math.round(input.currentRent * region.rent);
  const newFood = Math.round(input.currentFood * region.food);
  let carCost = 0;
  if (input.hasCar) {
    carCost = 35000 + (people * 2000); 
    if (input.targetRegionKey === "tokyo") carCost += 20000; 
  }
  let baseGas = input.currentGas;
  if (input.gasType === "propane") {
    baseGas = Math.round(input.currentGas * 1.8); 
  }
  const baseWater = Math.round(input.currentWater * 1.1); 
  const monthlyData: MonthlyCostData[] = [];
  let totalYearlyCost = 0;

  for (let month = 1; month <= 12; month++) {
    let monthElec = input.currentElec;
    let monthGas = baseGas;
    let snowCost = 0;

    // 冬季 (12-3月)
    if (month <= 3 || month >= 12) {
      if (region.climate === 'cold') {
        monthElec += 5000 * people; 
        monthGas += 4000 * people; 
        if (region.isSnowy) snowCost = 3000 + (people * 500);
      } else if (region.climate === 'moderate') {
        monthElec += 2000 * people;
        monthGas += 2000 * people;
      }
    } 
    // 夏季 (7-9月)
    else if (month >= 7 && month <= 9) {
      if (region.climate === 'warm' || input.targetRegionKey === 'tokyo') {
        monthElec += 3000 * people; 
      } else if (region.climate === 'cold') {
        monthElec = Math.max(monthElec - 1000, 2000); // 涼しい
      }
    }

    const utilityTotal = baseWater + monthElec + monthGas + snowCost;
    const totalMonth = newRent + newFood + carCost + utilityTotal;
    totalYearlyCost += totalMonth;

    monthlyData.push({
      name: `${month}月`,
      住居費: newRent,
      食費: newFood,
      "車・交通": carCost,
      "水道光熱・雪": utilityTotal,
      amt: totalMonth,
    });
  }

  const avgMonthly = Math.round(totalYearlyCost / 12);
  const currentTotal = input.currentRent + input.currentFood + input.currentElec + input.currentGas + input.currentWater;
  const diff = currentTotal - avgMonthly;

  return {
    region,
    monthlyData,
    avgMonthly,
    currentTotal,
    diff,
  };
};