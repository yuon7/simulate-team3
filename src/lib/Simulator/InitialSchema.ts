export interface MoveConditionSchema {
  roomType: string;    
  distFactor: number;  
  isPeak: boolean;     
}

export interface HousingCostSchema {
  rent: number;
  shikikinMonth: number;
  reikinMonth: number;  
}

export interface CarCostSchema {
  plan: 'none' | 'bring' | 'buy';
  distGroupMatch: boolean;
  isOverseas: boolean;
}

export interface SimulationResultSchema {
  housingTotal: number; 
  maeyachinCost: number;
  movingTotal: number;  
  carTotal: number;     
  setupTotal: number;
  grandTotal: number;
}