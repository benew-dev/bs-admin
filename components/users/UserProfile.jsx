"use client";

import React from "react";

const UserProfile = ({ data }) => {
  const user = data?.user;
  const orders = data?.orders || [];

  // Formater la date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculer le total dépensé
  const totalSpent = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Card avec Avatar */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 border border-slate-200">
          <div className="relative h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
                  src={user?.avatar?.url || "/images/default.png"}
                  alt={user?.name || "User"}
                />
                {user?.isActive && (
                  <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full shadow-lg"></div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-20 pb-6 px-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  {user?.name}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user?.role === "admin"
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {user?.role?.toUpperCase()}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user?.isActive
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {user?.isActive ? "ACTIF" : "INACTIF"}
                  </span>
                </div>
              </div>

              {/* Stats rapides */}
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {orders.length}
                  </div>
                  <div className="text-xs text-slate-500 uppercase">
                    Commandes
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${totalSpent.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 uppercase">
                    Total dépensé
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grille d'informations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Informations de contact */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Contact</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 uppercase mb-1">Email</p>
                <p className="text-sm font-medium text-slate-700">
                  {user?.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase mb-1">
                  Téléphone
                </p>
                <p className="text-sm font-medium text-slate-700">
                  {user?.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Adresse</h3>
            </div>
            <div className="space-y-2">
              {user?.address?.street ? (
                <>
                  <p className="text-sm font-medium text-slate-700">
                    {user.address.street}
                  </p>
                  <p className="text-sm text-slate-600">
                    {user.address.city && `${user.address.city}, `}
                    {user.address.country}
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-400 italic">
                  Aucune adresse enregistrée
                </p>
              )}
            </div>
          </div>

          {/* Activité */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Activité</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 uppercase mb-1">
                  Dernière connexion
                </p>
                <p className="text-sm font-medium text-slate-700">
                  {formatDate(user?.lastLogin)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase mb-1">
                  Membre depuis
                </p>
                <p className="text-sm font-medium text-slate-700">
                  {formatDate(user?.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des commandes */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">
                Historique des commandes
              </h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {orders.length} commande{orders.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-slate-600 mb-2">
                Aucune commande
              </p>
              <p className="text-sm text-slate-500">
                Cet utilisateur n'a pas encore passé de commande.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Numéro
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Paiement
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-medium text-slate-700">
                          {order.orderNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-slate-800">
                          ${order.totalAmount?.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : order.paymentStatus === "unpaid"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : order.paymentStatus === "refunded"
                                  ? "bg-orange-100 text-orange-700 border border-orange-200"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              order.paymentStatus === "paid"
                                ? "bg-green-500"
                                : order.paymentStatus === "unpaid"
                                  ? "bg-red-500"
                                  : order.paymentStatus === "refunded"
                                    ? "bg-orange-500"
                                    : "bg-slate-500"
                            }`}
                          ></span>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            {order.paymentInfo?.typePayment}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {new Date(order.createdAt).toLocaleDateString(
                            "fr-FR",
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <a
                          href={`/admin/orders/${order._id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm border border-blue-200"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          Voir
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
