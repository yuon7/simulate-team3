"use client";

import { useState, useMemo } from "react";
import { InitialCostUI } from "@/components/LifeSimulator/InitialCostUI";
import { REGIONS, PREFECTURE_AREAS } from "./supportData"; 
import { getDistFactor, calculateInitialCost } from "./InitialLogic";

export function InitialCostFeature() {
  // State（記憶）
  const [currentPref, setCurrentPref] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<string>("1dk");
  const [isPeakSeason, setIsPeakSeason] = useState(false);
  const [targetPref, setTargetPref] = useState<string | null>(null);
  const [targetCity, setTargetCity] = useState<string | null>(null);
  const [targetRent, setTargetRent] = useState<number | string>(60000);
  const [shikikin, setShikikin] = useState<number | string>(1);
  const [reikin, setReikin] = useState<number | string>(1);
  const [carPlan, setCarPlan] = useState("none");
  const [familySize, setFamilySize] = useState("1");
  const prefOptions = useMemo(() => REGIONS.flatMap(r => r.prefs), []);
  const cityOptions = useMemo(() => {
    if (!targetPref || !PREFECTURE_AREAS[targetPref]) return [];
    return Object.values(PREFECTURE_AREAS[targetPref]).flat();
  }, [targetPref]);
  const result = useMemo(() => {
    const distFactor = getDistFactor(currentPref, targetPref);
    const isSnowy = ["北海道", "青森県", "秋田県", "岩手県", "山形県", "新潟県", "長野県"].includes(targetPref || "");
    const isOverseas = ["北海道", "沖縄県"].includes(currentPref || "") || ["北海道", "沖縄県"].includes(targetPref || "");
    const distGroupMatch = distFactor < 2.0; 
    return calculateInitialCost(
      { roomType, distFactor, isPeak: isPeakSeason },
      { rent: Number(targetRent), shikikinMonth: Number(shikikin), reikinMonth: Number(reikin) },
      { plan: carPlan as 'none'|'bring'|'buy', distGroupMatch, isOverseas },
      isSnowy
    );
  }, [roomType, isPeakSeason, currentPref, targetPref, targetRent, shikikin, reikin, carPlan]);
  return (
    <InitialCostUI
      currentPref={currentPref}
      targetPref={targetPref}
      targetCity={targetCity}
      roomType={roomType}
      isPeakSeason={isPeakSeason}
      targetRent={targetRent}
      shikikin={shikikin}
      reikin={reikin}
      carPlan={carPlan}
      familySize={familySize}
      result={result}
      prefOptions={prefOptions}
      cityOptions={cityOptions}
      onChangeCurrentPref={setCurrentPref}
      onChangeTargetPref={setTargetPref}
      onChangeTargetCity={setTargetCity}
      onChangeRoomType={(v) => v && setRoomType(v)}
      onChangePeakSeason={setIsPeakSeason}
      onChangeRent={setTargetRent}
      onChangeShikikin={setShikikin}
      onChangeReikin={setReikin}
      onChangeCarPlan={setCarPlan}
      onChangeFamilySize={(v) => v && setFamilySize(v)}
    />
  );
}