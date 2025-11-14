export type MealType =
  | "Breakfast"
  | "Intra/Post Workout"
  | "Lunch"
  | "Snack 1"
  | "Snack 2"
  | "Snack 3"
  | "Dinner";

export interface Meal {
  type: MealType;
  plannedMin: number;
  plannedMax: number;
  actual: number;
}

export interface DayData {
  date: string; // YYYY-MM-DD format
  meals: Meal[];
  totalActual: number;
  totalPlannedMin: number;
  totalPlannedMax: number;
}

export const MEAL_TYPES: MealType[] = [
  "Breakfast",
  "Intra/Post Workout",
  "Lunch",
  "Snack 1",
  "Snack 2",
  "Snack 3",
  "Dinner",
];
