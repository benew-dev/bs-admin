/* eslint-disable react/prop-types */
"use client";

import Link from "next/link";

export default function InsightsPanel({ insights }) {
  if (!insights) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Insights automatiques */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">💡 Insights</h2>

        {insights.insights && insights.insights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  insight.type === "success"
                    ? "bg-green-50 border-green-200"
                    : insight.type === "warning"
                      ? "bg-orange-50 border-orange-200"
                      : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start">
                  <span className="text-3xl mr-3">{insight.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">
                      {insight.title}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {insight.message}
                    </p>
                    {insight.value && (
                      <p className="text-xs text-gray-600 mt-2 font-semibold">
                        {insight.value}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Pas assez de données pour générer des insights
          </p>
        )}
      </div>

      {/* Recommandations */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">🎯 Recommandations</h2>

        {insights.recommendations && insights.recommendations.length > 0 ? (
          <div className="space-y-3">
            {insights.recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.priority === "high"
                    ? "bg-red-50 border-red-500"
                    : rec.priority === "medium"
                      ? "bg-orange-50 border-orange-500"
                      : "bg-blue-50 border-blue-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          rec.priority === "high"
                            ? "bg-red-200 text-red-800"
                            : rec.priority === "medium"
                              ? "bg-orange-200 text-orange-800"
                              : "bg-blue-200 text-blue-800"
                        }`}
                      >
                        {rec.priority === "high"
                          ? "URGENT"
                          : rec.priority === "medium"
                            ? "IMPORTANT"
                            : "INFO"}
                      </span>
                    </div>
                    <p className="font-bold text-gray-800">{rec.title}</p>
                    <p className="text-sm text-gray-700 mt-1">{rec.action}</p>
                  </div>
                  {rec.link && (
                    <Link
                      href={rec.link}
                      className="ml-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Voir
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <p className="text-green-800 font-semibold">
                Tout est sous contrôle ! Aucune action urgente nécessaire.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
