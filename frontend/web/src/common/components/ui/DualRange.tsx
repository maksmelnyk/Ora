import React, { useState, useEffect, useCallback } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { cn } from "../../utils";

export interface DualRangeProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  className?: string;
  label?: string;
}

export const DualRange: React.FC<DualRangeProps> = ({
  min,
  max,
  value,
  step = 1,
  onChange,
  className,
  label,
}) => {
  const [minVal, maxVal] = value;
  const [pendingMin, setPendingMin] = useState<number>(minVal);
  const [pendingMax, setPendingMax] = useState<number>(maxVal);
  const [inputMin, setInputMin] = useState<string>(minVal.toString());
  const [inputMax, setInputMax] = useState<string>(maxVal.toString());

  useEffect(() => {
    setPendingMin(minVal);
    setPendingMax(maxVal);
    setInputMin(minVal.toString());
    setInputMax(maxVal.toString());
  }, [minVal, maxVal]);

  const getPercent = useCallback(
    (val: number) => {
      if (max === min) return 0;
      return ((val - min) / (max - min)) * 100;
    },
    [min, max]
  );

  const handleSliderMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value);
    const validMin = Math.min(newMin, pendingMax);
    setPendingMin(validMin);
    setInputMin(validMin.toString());
  };

  const handleSliderMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value);
    const validMax = Math.max(newMax, pendingMin);
    setPendingMax(validMax);
    setInputMax(validMax.toString());
  };

  const handleInputMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setInputMin(value);
      if (value !== "") {
        const newMin = Number(value);
        setPendingMin(Math.min(newMin, pendingMax));
      }
    }
  };

  const handleInputMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setInputMax(value);
      if (value !== "") {
        const newMax = Number(value);
        setPendingMax(Math.max(newMax, pendingMin));
      }
    }
  };

  const handleBlurMin = () => {
    const parsedMin = Number(inputMin);
    if (inputMin === "" || isNaN(parsedMin)) {
      setInputMin(pendingMin.toString());
    }
  };

  const handleBlurMax = () => {
    const parsedMax = Number(inputMax);
    if (inputMax === "" || isNaN(parsedMax)) {
      setInputMax(pendingMax.toString());
    }
  };

  const handleApply = () => {
    let finalMin = Number(inputMin);
    let finalMax = Number(inputMax);

    if (isNaN(finalMin) || finalMin < min) finalMin = pendingMin;
    if (isNaN(finalMax) || finalMax > max) finalMax = pendingMax;

    if (finalMin > finalMax) {
      if (finalMin !== pendingMin) {
        finalMin = finalMax;
      } else {
        [finalMin, finalMax] = [finalMax, finalMin];
      }
    }

    onChange([finalMin, finalMax]);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative h-6 mt-2">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 rounded transform -translate-y-1/2" />
        <div
          className="absolute top-1/2 h-1 bg-ora-teal rounded transform -translate-y-1/2"
          style={{
            left: `${getPercent(pendingMin)}%`,
            width: `${getPercent(pendingMax) - getPercent(pendingMin)}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={pendingMin}
          onChange={handleSliderMin}
          className="absolute pointer-events-none appearance-none w-full h-6 bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ora-teal"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={pendingMax}
          onChange={handleSliderMax}
          className="absolute pointer-events-none appearance-none w-full h-6 bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ora-teal"
        />
      </div>
      <div className="flex items-center space-x-4">
        <Input
          type="text"
          inputMode="numeric"
          value={inputMin}
          onChange={handleInputMinChange}
          onBlur={handleBlurMin}
          className="text-center"
          style={{ width: "80px" }}
        />
        <span className="text-sm flex-shrink-0">to</span>
        <Input
          type="text"
          inputMode="numeric"
          value={inputMax}
          onChange={handleInputMaxChange}
          onBlur={handleBlurMax}
          className="text-center"
          style={{ width: "80px" }}
        />
        <Button onClick={handleApply} size="lg" variant="outline">
          OK
        </Button>
      </div>
    </div>
  );
};

export default DualRange;
