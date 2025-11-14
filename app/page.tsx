"use client";

import { useState } from "react";
import MealTracker from "@/components/MealTracker";
import CalendarView from "@/components/CalendarView";
import HistoryView from "@/components/HistoryView";
import { getTodayDate } from "@/lib/storage";

type View = "tracker" | "calendar" | "history";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("tracker");
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setCurrentView("tracker");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-500 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Daily Carb Tracker</h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-around">
            <button
              onClick={() => setCurrentView("tracker")}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                currentView === "tracker"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              Track
            </button>
            <button
              onClick={() => setCurrentView("calendar")}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                currentView === "calendar"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setCurrentView("history")}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                currentView === "history"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              History
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-6">
        {currentView === "tracker" && (
          <MealTracker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        )}
        {currentView === "calendar" && (
          <CalendarView onDateSelect={handleDateSelect} />
        )}
        {currentView === "history" && (
          <HistoryView onEditDate={handleDateSelect} />
        )}
      </main>
    </div>
  );
}
