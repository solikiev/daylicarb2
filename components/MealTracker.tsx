"use client";

import { useState, useMemo } from "react";
import { DayData, Meal } from "@/lib/types";
import {
  getDataForDate,
  saveDataForDate,
  calculateTotals,
  copyDayData,
  getTodayDate,
  getAllDatesWithData,
} from "@/lib/storage";

interface MealTrackerProps {
  selectedDate: string;
  onDateChange?: (date: string) => void;
}

export default function MealTracker({
  selectedDate,
  onDateChange,
}: MealTrackerProps) {
  // Use a version counter to force re-renders when data changes
  const [version, setVersion] = useState(0);
  const [copyFromDate, setCopyFromDate] = useState<string>("");

  // Derive dayData from selectedDate and version
  const dayData = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = version; // Force dependency on version
    return getDataForDate(selectedDate);
  }, [selectedDate, version]);

  const handleMealChange = (
    index: number,
    field: keyof Meal,
    value: number
  ) => {
    const updatedMeals = [...dayData.meals];
    updatedMeals[index] = {
      ...updatedMeals[index],
      [field]: value,
    };

    const totals = calculateTotals(updatedMeals);
    const updatedDayData: DayData = {
      ...dayData,
      meals: updatedMeals,
      ...totals,
    };

    saveDataForDate(updatedDayData);
    setVersion((v) => v + 1);
  };

  const handleCopyDay = () => {
    if (copyFromDate && copyFromDate !== selectedDate) {
      copyDayData(copyFromDate, selectedDate);
      setVersion((v) => v + 1);
    }
  };

  const handleClearMeal = (index: number) => {
    const updatedMeals = [...dayData.meals];
    updatedMeals[index] = {
      ...updatedMeals[index],
      plannedMin: 0,
      plannedMax: 0,
      actual: 0,
    };

    const totals = calculateTotals(updatedMeals);
    const updatedDayData: DayData = {
      ...dayData,
      meals: updatedMeals,
      ...totals,
    };

    saveDataForDate(updatedDayData);
    setVersion((v) => v + 1);
  };

  const availableDates = getAllDatesWithData();

  const isOverTarget =
    dayData.totalActual > dayData.totalPlannedMax && dayData.totalPlannedMax > 0;
  const isUnderTarget =
    dayData.totalActual < dayData.totalPlannedMax && dayData.totalActual > 0;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Date Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">
            {selectedDate === getTodayDate() ? "Today" : selectedDate}
          </h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange?.(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Total Display */}
        <div
          className={`text-center p-4 rounded-lg ${
            isOverTarget
              ? "bg-red-100 border-red-300"
              : isUnderTarget
              ? "bg-green-100 border-green-300"
              : "bg-gray-100 border-gray-300"
          } border-2`}
        >
          <div className="text-sm text-gray-600">Total Carbs</div>
          <div className="text-4xl font-bold">{dayData.totalActual}g</div>
          {dayData.totalPlannedMax > 0 && (
            <div className="text-sm text-gray-600 mt-1">
              Target: {dayData.totalPlannedMin}-{dayData.totalPlannedMax}g
            </div>
          )}
        </div>
      </div>

      {/* Copy From Another Day */}
      {availableDates.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">Copy from another day</h3>
          <div className="flex gap-2">
            <select
              value={copyFromDate}
              onChange={(e) => setCopyFromDate(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg"
            >
              <option value="">Select a date...</option>
              {availableDates
                .filter((date) => date !== selectedDate)
                .map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
            </select>
            <button
              onClick={handleCopyDay}
              disabled={!copyFromDate}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* Meals */}
      <div className="space-y-4">
        {dayData.meals.map((meal, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">{meal.type}</h3>
              <button
                onClick={() => handleClearMeal(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Clear
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Planned Range */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Planned Min (g)
                </label>
                <input
                  type="number"
                  value={meal.plannedMin || ""}
                  onChange={(e) =>
                    handleMealChange(
                      index,
                      "plannedMin",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border rounded-lg text-lg"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Planned Max (g)
                </label>
                <input
                  type="number"
                  value={meal.plannedMax || ""}
                  onChange={(e) =>
                    handleMealChange(
                      index,
                      "plannedMax",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border rounded-lg text-lg"
                  min="0"
                />
              </div>

              {/* Actual */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Actual (g)
                </label>
                <input
                  type="number"
                  value={meal.actual || ""}
                  onChange={(e) =>
                    handleMealChange(
                      index,
                      "actual",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border rounded-lg text-lg font-semibold"
                  min="0"
                />
              </div>
            </div>

            {/* Visual indicator */}
            {meal.plannedMax > 0 && meal.actual > 0 && (
              <div className="mt-3">
                <div className="text-xs text-gray-600 mb-1">
                  {meal.plannedMin}-{meal.plannedMax}g
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      meal.actual > meal.plannedMax
                        ? "bg-red-500"
                        : meal.actual >= meal.plannedMin
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        (meal.actual / meal.plannedMax) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
