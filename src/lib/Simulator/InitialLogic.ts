import { 
  MoveConditionSchema, 
  HousingCostSchema, 
  CarCostSchema, 
  SimulationResultSchema 
} from "@/lib/Simulator/InitialSchema"; 

export const ROOM_TYPES_DATA: Record<string, { label: string; baseCost: number }> = {
  "1r": { label: "1R / 1K (単身・荷物少)", baseCost: 30000 },
  "1dk": { label: "1DK / 1LDK (単身・荷物多)", baseCost: 50000 },
  "2dk": { label: "2DK / 2LDK (2人世帯)", baseCost: 80000 },
  "3ldk": { label: "3LDK〜 (ファミリー)", baseCost: 120000 },
};

export const getDistFactor = (currentPref: string | null, targetPref: string | null): number => {
  if (!currentPref || !targetPref) return 1.0;

  const getGroup = (pref: string) => {
    if (["北海道"].includes(pref)) return "hokkaido";
    if (["沖縄県"].includes(pref)) return "okinawa";
    if (["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"].includes(pref)) return "tohoku";
    if (["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"].includes(pref)) return "kanto";
    return "other"; 
  };
  
  const groupA = getGroup(currentPref);
  const groupB = getGroup(targetPref);

  if (currentPref === targetPref) return 1.0; 
  if (groupA === groupB && groupA !== "other") return 1.5; 
  if (groupA === "hokkaido" || groupB === "hokkaido") return 4.0; 
  if (groupA === "okinawa" || groupB === "okinawa") return 4.0; 
  
  return 2.5; 
};

export const calculateInitialCost = (
  move: MoveConditionSchema,
  house: HousingCostSchema,
  car: CarCostSchema,
  isSnowy: boolean
): SimulationResultSchema => {
  
  // 1. 住居費
  const shikikinCost = house.rent * house.shikikinMonth;
  const reikinCost = house.rent * house.reikinMonth;
  const maeyachinCost = Number(house.rent);
  const housingTotal = shikikinCost + reikinCost + maeyachinCost;

  const base = ROOM_TYPES_DATA[move.roomType]?.baseCost || 50000;
  const season = move.isPeak ? 1.6 : 1.0;
  const movingTotal = Math.round(base * move.distFactor * season);

  let carTotal = 0;
  if (car.plan === 'buy') {
    carTotal = 500000;
  } else if (car.plan === 'bring') {
    if (car.distGroupMatch) carTotal = 0;
    else if (car.isOverseas) carTotal = 80000;
    else carTotal = 50000;
  }

  const setupTotal = isSnowy ? 80000 : 0;

  return {
    housingTotal,
    maeyachinCost, 
    movingTotal,
    carTotal,
    setupTotal,
    grandTotal: housingTotal + movingTotal + carTotal + setupTotal
  };
};