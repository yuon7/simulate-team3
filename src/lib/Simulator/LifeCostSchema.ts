export interface RegionData {
  name: string;
  rent: number;       
  food: number;       
  isSnowy: boolean;   
  climate: 'cold' | 'moderate' | 'warm'; 
  propaneRatio: number; 
}

export interface MonthlyCostData {
  name: string;
  住居費: number;
  食費: number;
  "車・交通": number;
  "水道光熱・雪": number;
  amt: number; 
}

export interface LifeCostInputSchema {
  currentRent: number;
  currentFood: number;
  currentElec: number;
  currentGas: number;
  currentWater: number;
  
  targetRegionKey: string;
  familySize: number;
  hasCar: boolean;
  gasType: 'city' | 'propane';
}

export interface LifeCostResultSchema {
  region: RegionData;
  monthlyData: MonthlyCostData[]; 
  avgMonthly: number; 
  currentTotal: number; 
  diff: number; 
}