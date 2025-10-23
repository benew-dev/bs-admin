/* eslint-disable react/prop-types */
import React from "react";
import { arrayHasData } from "@/helpers/helpers";
import Link from "next/link";

const OrdersPendingCashList = ({ listOrdersPendingCashThisMonth }) => {
  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fonction pour calculer le temps écoulé
  const getTimeSinceCreation = (createdAt) => {
    if (!createdAt) return "N/A";
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  // Fonction pour obtenir la couleur de l'urgence
  const getUrgencyColor = (createdAt) => {
    if (!createdAt) return "text-gray-500";
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));

    if (diffInHours > 48) return "text-red-600 font-bold"; // Plus de 2 jours
    if (diffInHours > 24) return "text-orange-600 font-medium"; // Plus de 1 jour
    return "text-yellow-600"; // Récent
  };

  return arrayHasData(listOrdersPendingCashThisMonth) ? (
    <div className="w-full py-8">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 mb-4 text-yellow-300">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <p className="font-bold text-xl text-yellow-600">
          No Pending Cash Orders This Month
        </p>
        <p className="text-gray-500 mt-2">
          Orders with cash payment will appear here when available.
        </p>
      </div>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left bg-white">
        <thead className="text-xs text-gray-700 uppercase bg-yellow-50 border-b-2 border-yellow-200">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Order Number
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Total Amount
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Items
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Payment Status
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Payment Method
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Created At
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Time Elapsed
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {listOrdersPendingCashThisMonth?.map((item) => (
            <tr
              key={item?._id}
              className="bg-white hover:bg-yellow-25 transition-colors"
            >
              <td className="px-4 py-3 font-mono text-sm font-medium text-yellow-700">
                {item?.orderNumber || `#${item?._id?.slice(-8)}`}
              </td>
              <td className="px-4 py-3 font-semibold text-yellow-600">
                ${item?.totalAmount?.toFixed(2) || "0.00"}
              </td>
              <td className="px-4 py-3 text-center">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {item?.itemCount || 0}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                  PENDING CASH
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium flex items-center gap-1 w-fit">
                  <i className="fa fa-money-bill-wave text-xs"></i>
                  CASH
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600 text-xs">
                {formatDate(item?.createdAt)}
              </td>
              <td
                className={`px-4 py-3 text-xs ${getUrgencyColor(item?.createdAt)}`}
              >
                {getTimeSinceCreation(item?.createdAt)}
              </td>
              <td className="px-4 py-3 text-center">
                <Link
                  href={`/admin/orders/${item?._id}`}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-md hover:bg-yellow-200 hover:border-yellow-400 transition-colors duration-200"
                  title={`Manage cash payment for order ${item?.orderNumber || item?._id}`}
                >
                  <i
                    className="fa fa-hand-holding-usd mr-1"
                    aria-hidden="true"
                  ></i>
                  Confirm Payment
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Résumé en bas de tableau */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex justify-between items-center text-sm mb-2">
          <div className="text-yellow-700">
            <span className="font-semibold">
              {listOrdersPendingCashThisMonth?.length || 0}
            </span>{" "}
            orders pending cash payment this month
          </div>
          <div className="text-yellow-700 font-semibold">
            Expected Revenue: $
            {listOrdersPendingCashThisMonth
              ?.reduce((acc, order) => acc + (order?.totalAmount || 0), 0)
              .toFixed(2) || "0.00"}
          </div>
        </div>

        {/* Alertes d'urgence pour les commandes en attente */}
        {(() => {
          const urgentOrders = listOrdersPendingCashThisMonth?.filter(
            (order) => {
              const diffInHours = Math.floor(
                (new Date() - new Date(order.createdAt)) / (1000 * 60 * 60),
              );
              return diffInHours > 24;
            },
          );

          if (urgentOrders?.length > 0) {
            return (
              <div className="text-xs text-orange-600 bg-orange-100 p-2 rounded border border-orange-300">
                <i className="fa fa-clock mr-1"></i>
                <span className="font-semibold">
                  {urgentOrders.length}
                </span>{" "}
                orders waiting for cash payment over 24h
              </div>
            );
          }
          return null;
        })()}

        {/* Note informative */}
        <div className="mt-2 text-xs text-yellow-700 bg-yellow-50 p-2 rounded border border-yellow-200">
          <i className="fa fa-info-circle mr-1"></i>
          These orders are waiting for cash payment confirmation. Mark them as
          "paid" once cash is received.
        </div>
      </div>
    </div>
  );
};

export default OrdersPendingCashList;
