"use client";

import { useState, useMemo } from "react";
import { LifeCostUI } from "@/components/LifeSimulator/LifeCostUI";
import { calculateLifeCost } from "./LifeCostLogic";

export function LifeCostFeature() {
  const [currentRent, setCurrentRent] = useState<number | string>(85000);
  const [currentFood, setCurrentFood] = useState<number | string>(45000);
  const [currentElec, setCurrentElec] = useState<number | string>(8000);
  const [currentGas, setCurrentGas] = useState<number | string>(5000);
  const [currentWater, setCurrentWater] = useState<number | string>(4000);
  const [targetRegionKey, setTargetRegionKey] = useState<string>("nagano");
  const [familySize, setFamilySize] = useState("1");
  const [hasCar, setHasCar] = useState("no");
  const [gasType, setGasType] = useState("city");
  const result = useMemo(() => {
    return calculateLifeCost({
      currentRent: Number(currentRent),
      currentFood: Number(currentFood),
      currentElec: Number(currentElec),
      currentGas: Number(currentGas),
      currentWater: Number(currentWater),
      targetRegionKey,
      familySize: Number(familySize),
      hasCar: hasCar === "yes",
      gasType: gasType as 'city' | 'propane'
    });
  }, [currentRent, currentFood, currentElec, currentGas, currentWater, targetRegionKey, familySize, hasCar, gasType]);
  return (
    <LifeCostUI
      currentRent={currentRent}
      currentFood={currentFood}
      currentElec={currentElec}
      currentGas={currentGas}
      currentWater={currentWater}
      targetRegionKey={targetRegionKey}
      familySize={familySize}
      hasCar={hasCar}
      gasType={gasType}
      result={result}
      onChangeCurrentRent={setCurrentRent}
      onChangeCurrentFood={setCurrentFood}
      onChangeCurrentElec={setCurrentElec}
      onChangeCurrentGas={setCurrentGas}
      onChangeCurrentWater={setCurrentWater}
      onChangeTargetRegionKey={setTargetRegionKey}
      onChangeFamilySize={setFamilySize}
      onChangeHasCar={setHasCar}
      onChangeGasType={setGasType}
    />
  );
}