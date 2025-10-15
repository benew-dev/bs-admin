"use client";

import Link from "next/link";

export default function AlertsPanel({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
        <div className="flex items-center">
          <span className="text-2xl mr-3">✅</span>
          <div>
            <p className="font-bold text-green-800">Tout va bien !</p>
            <p className="text-sm text-green-700">
              Aucune alerte pour le moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Tri par priorité
  const sorted = alerts.sort((a, b) => {
    const priority = { high: 3, medium: 2, low: 1 };
    return priority[b.priority] - priority[a.priority];
  });

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold mb-4">⚠️ Alertes</h2>
      {sorted.map((alert, index) => (
        <div
          key={index}
          className={`border-l-4 p-4 rounded-r-lg ${
            alert.type === "warning"
              ? "bg-orange-50 border-orange-500"
              : alert.type === "success"
                ? "bg-green-50 border-green-500"
                : "bg-blue-50 border-blue-500"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="font-bold text-gray-800">{alert.title}</p>
              <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
              {alert.details && (
                <ul className="text-xs text-gray-600 mt-2 space-y-1">
                  {alert.details.slice(0, 3).map((detail, i) => (
                    <li key={i}>• {detail}</li>
                  ))}
                  {alert.details.length > 3 && (
                    <li>... et {alert.details.length - 3} autres</li>
                  )}
                </ul>
              )}
            </div>
            {alert.action && (
              <Link
                href={alert.action}
                className="ml-4 px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                {alert.actionText}
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
