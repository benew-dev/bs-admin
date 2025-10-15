"use client";

import { useState, useEffect } from "react";

export default function MonthlyReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/monthly-stats")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading monthly report:", err);
        setLoading(false);
      });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Génération du rapport...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const currentMonth = new Date().toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      {/* En-tête */}
      <div className="border-b-2 border-gray-200 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Rapport Mensuel
            </h1>
            <p className="text-lg text-gray-600 mt-1">{currentMonth}</p>
          </div>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors print:hidden"
          >
            📄 Imprimer / PDF
          </button>
        </div>
      </div>

      {/* Vue d'ensemble */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          📊 Vue d'ensemble
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Commandes</p>
            <p className="text-3xl font-bold text-blue-600">
              {data.thisMonth.totalOrders}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              vs {data.lastMonth.totalOrders} le mois dernier
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Revenus</p>
            <p className="text-2xl font-bold text-green-600">
              {data.thisMonth.totalRevenue.toLocaleString()} FDj
            </p>
            <p className="text-xs text-gray-500 mt-1">
              vs {data.lastMonth.totalRevenue.toLocaleString()} FDj
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-gray-600 mb-1">Panier moyen</p>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(data.thisMonth.avgOrderValue)} FDj
            </p>
            <p className="text-xs text-gray-500 mt-1">
              vs {Math.round(data.lastMonth.avgOrderValue)} FDj
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <p className="text-sm text-gray-600 mb-1">Taux conversion</p>
            <p className="text-2xl font-bold text-orange-600">
              {data.comparison.conversionRate}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {data.thisMonth.paidOrders} payées / {data.thisMonth.totalOrders}{" "}
              total
            </p>
          </div>
        </div>
      </section>

      {/* Croissance */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Croissance</h2>
        <div className="grid grid-cols-3 gap-4">
          <div
            className={`p-4 rounded-lg border-2 ${
              data.comparison.ordersGrowth >= 0
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <p className="text-sm text-gray-600">Commandes</p>
            <p
              className={`text-3xl font-bold ${
                data.comparison.ordersGrowth >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {data.comparison.ordersGrowth >= 0 ? "+" : ""}
              {data.comparison.ordersGrowth}%
            </p>
          </div>

          <div
            className={`p-4 rounded-lg border-2 ${
              data.comparison.revenueGrowth >= 0
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <p className="text-sm text-gray-600">Revenus</p>
            <p
              className={`text-3xl font-bold ${
                data.comparison.revenueGrowth >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {data.comparison.revenueGrowth >= 0 ? "+" : ""}
              {data.comparison.revenueGrowth}%
            </p>
          </div>

          <div
            className={`p-4 rounded-lg border-2 ${
              data.comparison.avgOrderGrowth >= 0
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <p className="text-sm text-gray-600">Panier moyen</p>
            <p
              className={`text-3xl font-bold ${
                data.comparison.avgOrderGrowth >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {data.comparison.avgOrderGrowth >= 0 ? "+" : ""}
              {data.comparison.avgOrderGrowth}%
            </p>
          </div>
        </div>
      </section>

      {/* Top produits */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          🏆 Top 10 Produits
        </h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                  Rang
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                  Produit
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">
                  Quantité
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">
                  Revenus
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.topProducts.slice(0, 10).map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    #{index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600">
                    {product.quantity}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                    {product.revenue.toLocaleString()} FDj
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Répartition par catégorie */}
      {data.categoryBreakdown && data.categoryBreakdown.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📂 Performance par Catégorie
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {data.categoryBreakdown.map((cat, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <p className="font-semibold text-gray-800">
                  {cat._id || "Non catégorisé"}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">
                    {cat.quantity} ventes
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {cat.revenue.toLocaleString()} FDj
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Statuts des commandes */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          📦 Statuts des Commandes
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Payées</p>
            <p className="text-2xl font-bold text-green-600">
              {data.thisMonth.paidOrders}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {(
                (data.thisMonth.paidOrders / data.thisMonth.totalOrders) *
                100
              ).toFixed(1)}
              % du total
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">En attente</p>
            <p className="text-2xl font-bold text-orange-600">
              {data.thisMonth.unpaidOrders}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {(
                (data.thisMonth.unpaidOrders / data.thisMonth.totalOrders) *
                100
              ).toFixed(1)}
              % du total
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Annulées</p>
            <p className="text-2xl font-bold text-red-600">
              {data.thisMonth.cancelledOrders}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {(
                (data.thisMonth.cancelledOrders / data.thisMonth.totalOrders) *
                100
              ).toFixed(1)}
              % du total
            </p>
          </div>
        </div>
      </section>

      {/* Pied de page */}
      <div className="border-t-2 border-gray-200 pt-6 mt-8 text-center text-sm text-gray-500">
        <p>
          Rapport généré le{" "}
          {new Date().toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
