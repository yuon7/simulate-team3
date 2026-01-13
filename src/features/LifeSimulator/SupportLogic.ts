import { REGIONS, PREFECTURE_AREAS } from "./supportData";
import { CITY_SUPPORT_LIST } from "./supportData2";
import { SupportResultSchema } from "./SupportSchema";

export const REGIONS_DATA = REGIONS;
export const getPrefectures = (region: string | null): string[] => {
  if (!region) return [];
  const target = REGIONS.find((r) => r.region === region);
  return target ? target.prefs : [];
};

export const getAreas = (pref: string | null): string[] => {
  if (!pref) return [];
  const areas = PREFECTURE_AREAS[pref];
  return areas ? Object.keys(areas) : [];
};

export const getCities = (pref: string | null, area: string | null): string[] => {
  if (!pref || !area) return [];
  return PREFECTURE_AREAS[pref][area] || [];
};

export const calculateSupportData = (city: string | null): SupportResultSchema => {
  if (!city) return { filteredSupports: [], totalAmount: 0 };
  const filteredSupports = CITY_SUPPORT_LIST.filter((item) => item.city === city);
  const totalAmount = filteredSupports.reduce((sum, item) => sum + item.amount, 0);

  return { filteredSupports, totalAmount };
};