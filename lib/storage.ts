import { DayData, Meal, MEAL_TYPES } from "./types";

const STORAGE_KEY = "dailycarb_data";

// Helper to create an empty meal structure
export function createEmptyMeal(type: string): Meal {
  return {
    type: type as Meal["type"],
    plannedMin: 0,
    plannedMax: 0,
    actual: 0,
  };
}

// Helper to create a new day with empty meals
export function createEmptyDay(date: string): DayData {
  return {
    date,
    meals: MEAL_TYPES.map(createEmptyMeal),
    totalActual: 0,
    totalPlannedMin: 0,
    totalPlannedMax: 0,
    dailyTargetMin: undefined,
    dailyTargetMax: undefined,
  };
}

// Calculate totals for a day
export function calculateTotals(meals: Meal[]): {
  totalActual: number;
  totalPlannedMin: number;
  totalPlannedMax: number;
} {
  return meals.reduce(
    (acc, meal) => ({
      totalActual: acc.totalActual + (meal.actual || 0),
      totalPlannedMin: acc.totalPlannedMin + (meal.plannedMin || 0),
      totalPlannedMax: acc.totalPlannedMax + (meal.plannedMax || 0),
    }),
    { totalActual: 0, totalPlannedMin: 0, totalPlannedMax: 0 }
  );
}

// Get all data from localStorage
export function getAllData(): Record<string, DayData> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return {};
  }
}

// Save all data to localStorage
export function saveAllData(data: Record<string, DayData>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
}

// Get data for a specific date
export function getDataForDate(date: string): DayData {
  const allData = getAllData();
  return allData[date] || createEmptyDay(date);
}

// Save data for a specific date
export function saveDataForDate(dayData: DayData): void {
  const allData = getAllData();
  const totals = calculateTotals(dayData.meals);
  const updatedDayData = {
    ...dayData,
    ...totals,
  };
  allData[dayData.date] = updatedDayData;
  saveAllData(allData);
}

// Delete data for a specific date
export function deleteDataForDate(date: string): void {
  const allData = getAllData();
  delete allData[date];
  saveAllData(allData);
}

// Copy day data from one date to another
export function copyDayData(fromDate: string, toDate: string): void {
  const sourceData = getDataForDate(fromDate);
  if (sourceData && sourceData.meals.length > 0) {
    const copiedData: DayData = {
      ...sourceData,
      date: toDate,
    };
    saveDataForDate(copiedData);
  }
}

// Format date as YYYY-MM-DD
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Get today's date as YYYY-MM-DD
export function getTodayDate(): string {
  return formatDate(new Date());
}

// Check if date is in the past
export function isDateInPast(date: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
}

// Get all dates with data sorted by date (newest first)
export function getAllDatesWithData(): string[] {
  const allData = getAllData();
  return Object.keys(allData).sort((a, b) => b.localeCompare(a));
}
