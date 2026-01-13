"use client";
import { useState, useMemo } from "react";
import { SupportNavigatorUI } from "@/components/LifeSimulator/SupportNavigatorUI";
import { 
  getPrefectures, 
  getAreas, 
  getCities, 
  calculateSupportData 
} from "./SupportLogic";

export function SupportNavigatorFeature() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedPref, setSelectedPref] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const prefectureOptions = useMemo(() => getPrefectures(selectedRegion), [selectedRegion]);
  const areaOptions = useMemo(() => getAreas(selectedPref), [selectedPref]);
  const cityOptions = useMemo(() => getCities(selectedPref, selectedArea), [selectedPref, selectedArea]);
  const { filteredSupports, totalAmount } = useMemo(() => {
    return calculateSupportData(selectedCity);
  }, [selectedCity]);
  const handleRegionChange = (val: string | null) => {
    setSelectedRegion(val);
    setSelectedPref(null);
    setSelectedArea(null);
    setSelectedCity(null);
  };
  const handlePrefChange = (val: string | null) => {
    setSelectedPref(val);
    setSelectedArea(null);
    setSelectedCity(null);
  };
  const handleAreaChange = (val: string | null) => {
    setSelectedArea(val);
    setSelectedCity(null);
  };
  return (
    <SupportNavigatorUI
      selectedRegion={selectedRegion}
      selectedPref={selectedPref}
      selectedArea={selectedArea}
      selectedCity={selectedCity}
      prefectureOptions={prefectureOptions}
      areaOptions={areaOptions}
      cityOptions={cityOptions}
      filteredSupports={filteredSupports}
      totalAmount={totalAmount}
      onChangeRegion={handleRegionChange}
      onChangePref={handlePrefChange}
      onChangeArea={handleAreaChange}
      onChangeCity={setSelectedCity}
    />
  );
}