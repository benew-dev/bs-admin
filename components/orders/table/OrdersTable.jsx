/* eslint-disable react/prop-types */
import React from "react";
import OrderItem from "./OrderItem";

const OrdersTable = ({ orders, itemCount }) => {
  // Vérifier si orders est un array valide avec des données
  const hasOrders = Array.isArray(orders) && orders.length > 0;

  return (
    <div>
      {/* Header du tableau avec compteur amélioré */}
      <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <i className="fa fa-shopping-cart text-blue-600"></i>
          Dernières Commandes
        </h2>
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm">
            {itemCount || 0}
          </span>
          <span className="text-sm text-gray-600 font-medium">
            Commande{itemCount > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* État vide avec design amélioré */}
      {itemCount === 0 && (
        <div className="w-full py-16 px-6">
          <div className="max-w-md mx-auto text-center">
            <div className="mx-auto w-24 h-24 mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-blue-500"
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
            <h3 className="font-bold text-2xl text-gray-800 mb-3">
              Aucune Commande
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Les commandes de vos clients apparaîtront ici dès qu'ils
              effectueront leurs achats.
            </p>
          </div>
        </div>
      )}

      {/* Tableau des commandes avec design amélioré */}
      {hasOrders ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs font-semibold uppercase bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-b-2 border-gray-300">
              <tr>
                <th scope="col" className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <i className="fa fa-hashtag text-gray-500"></i>
                    Commande
                  </div>
                </th>
                <th scope="col" className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <i className="fa fa-dollar-sign text-gray-500"></i>
                    Montant
                  </div>
                </th>
                <th scope="col" className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <i className="fa fa-check-circle text-gray-500"></i>
                    Statut Paiement
                  </div>
                </th>
                <th scope="col" className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <i className="fa fa-credit-card text-gray-500"></i>
                    Méthode
                  </div>
                </th>
                <th scope="col" className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <i className="fa fa-cog text-gray-500"></i>
                    Actions
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order) => (
                <OrderItem key={order?._id} order={order} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !hasOrders &&
        itemCount !== 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs font-semibold uppercase bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-b-2 border-gray-300">
                <tr>
                  <th scope="col" className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <i className="fa fa-hashtag text-gray-500"></i>
                      Commande
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <i className="fa fa-dollar-sign text-gray-500"></i>
                      Montant
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <i className="fa fa-check-circle text-gray-500"></i>
                      Statut Paiement
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <i className="fa fa-credit-card text-gray-500"></i>
                      Méthode
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <i className="fa fa-user text-gray-500"></i>
                      Client
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <i className="fa fa-cog text-gray-500"></i>
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <OrderItem key={orders?._id} order={orders} />
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default OrdersTable;
