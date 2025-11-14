"use client";

import { useState, useEffect } from "react";
import { getAllDatesWithData, getDataForDate, deleteDataForDate } from "@/lib/storage";

interface HistoryViewProps {
  onEditDate: (date: string) => void;
}

export default function HistoryView({ onEditDate }: HistoryViewProps) {
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  const dates = isClient ? getAllDatesWithData() : [];

  const toggleExpanded = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const handleDelete = (date: string) => {
    deleteDataForDate(date);
    setShowDeleteConfirm(null);
    // Force re-render by clearing expanded state
    setExpandedDates(new Set());
  };

  if (dates.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No history yet. Start tracking your meals!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">History</h2>
      
      {dates.map((date) => {
        const dayData = getDataForDate(date);
        const isExpanded = expandedDates.has(date);
        
        // Use daily target if set, otherwise fall back to meal totals
        const effectiveTargetMin = dayData.dailyTargetMin ?? dayData.totalPlannedMin;
        const effectiveTargetMax = dayData.dailyTargetMax ?? dayData.totalPlannedMax;
        
        // Determine background color based on target
        const isOverTarget =
          dayData.totalActual > effectiveTargetMax && effectiveTargetMax > 0;
        const isUnderTarget =
          dayData.totalActual < effectiveTargetMin && effectiveTargetMin > 0;
        const isWithinTarget =
          dayData.totalActual >= effectiveTargetMin &&
          dayData.totalActual <= effectiveTargetMax &&
          effectiveTargetMax > 0;

        return (
          <div key={date} className="bg-white rounded-lg shadow">
            {/* Summary Header */}
            <div
              className={`p-4 cursor-pointer ${
                isOverTarget
                  ? "bg-red-50"
                  : isUnderTarget
                  ? "bg-yellow-50"
                  : isWithinTarget
                  ? "bg-green-50"
                  : "bg-gray-50"
              }`}
              onClick={() => toggleExpanded(date)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-lg">{date}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Total: {dayData.totalActual}g
                    {effectiveTargetMax > 0 && (
                      <span>
                        {" "}
                        / {dayData.dailyTargetMin || dayData.dailyTargetMax
                          ? "Daily Target"
                          : "Meal Target"}: {effectiveTargetMin}-{effectiveTargetMax}g
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditDate(date);
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(date);
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                  <span className="text-gray-400">
                    {isExpanded ? "▼" : "▶"}
                  </span>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="p-4 border-t space-y-3">
                {dayData.meals.map((meal, index) => {
                  if (meal.actual === 0 && meal.plannedMax === 0) return null;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{meal.type}</div>
                        <div className="text-sm text-gray-600">
                          {meal.plannedMin > 0 || meal.plannedMax > 0 ? (
                            <span>
                              Planned: {meal.plannedMin}-{meal.plannedMax}g
                            </span>
                          ) : (
                            <span>No plan</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">
                          {meal.actual}g
                        </div>
                        <div className="text-xs text-gray-500">Actual</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm === date && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                  <h3 className="text-lg font-semibold mb-2">Delete Day</h3>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to delete all data for {date}? This
                    action cannot be undone.
                  </p>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(date)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
