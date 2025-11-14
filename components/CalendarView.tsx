"use client";

import { useState, useEffect } from "react";
import { getAllData } from "@/lib/storage";

interface CalendarViewProps {
  onDateSelect: (date: string) => void;
}

export default function CalendarView({ onDateSelect }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  const allData = isClient ? getAllData() : {};

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDateKey = (day: number): string => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  const getDayColor = (dateKey: string): string => {
    const dayData = allData[dateKey];
    if (!dayData || dayData.totalActual === 0) return "bg-gray-100";

    // Use daily target if set, otherwise fall back to meal totals
    const effectiveTargetMin = dayData.dailyTargetMin ?? dayData.totalPlannedMin;
    const effectiveTargetMax = dayData.dailyTargetMax ?? dayData.totalPlannedMax;

    // No target set
    if (effectiveTargetMax === 0) return "bg-gray-100";

    // Red: Over target max
    if (dayData.totalActual > effectiveTargetMax) {
      return "bg-red-200 border-red-400";
    }

    // Yellow/Orange: Below target min
    if (dayData.totalActual < effectiveTargetMin) {
      return "bg-yellow-200 border-yellow-400";
    }

    // Green: Within or at target range
    return "bg-green-200 border-green-400";
  };

  // Build calendar grid
  const calendarDays: (number | null)[] = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            &lt; Prev
          </button>
          <h2 className="text-2xl font-bold">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={handleNextMonth}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Next &gt;
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-sm text-gray-600 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateKey = formatDateKey(day);
            const dayData = allData[dateKey];
            const colorClass = getDayColor(dateKey);

            return (
              <button
                key={dateKey}
                onClick={() => onDateSelect(dateKey)}
                className={`aspect-square ${colorClass} border-2 rounded-lg p-2 hover:opacity-80 transition-opacity flex flex-col items-center justify-center`}
              >
                <div className="font-bold text-lg">{day}</div>
                {dayData && dayData.totalActual > 0 && (
                  <div className="text-xs font-semibold mt-1">
                    {dayData.totalActual}g
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 border-2 border-green-400 rounded"></div>
            <span>Within Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 border-2 border-yellow-400 rounded"></div>
            <span>Below Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border-2 border-red-400 rounded"></div>
            <span>Over Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border-2 rounded"></div>
            <span>No Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
