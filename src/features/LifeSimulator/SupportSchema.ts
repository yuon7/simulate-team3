export interface SupportItemSchema {
  city: string;
  category: string;
  title: string;
  description: string;
  amount: number;
}

export interface SupportResultSchema {
  filteredSupports: SupportItemSchema[];
  totalAmount: number;
}

export interface RegionDefSchema {
  region: string;
  prefs: string[];
}