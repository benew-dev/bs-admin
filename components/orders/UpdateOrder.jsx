/* eslint-disable react/prop-types */
"use client";

import dynamic from "next/dynamic";
import React, { memo, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import OrderContext from "@/context/OrderContext";
import Loading from "@/app/loading";

const SingleOrderInfo = dynamic(() => import("./SingleOrderInfo"), {
  loading: () => <Loading />,
});

const UpdateOrder = memo(({ order }) => {
  const { updateOrder, error, clearErrors, updated, setUpdated } =
    useContext(OrderContext);

  const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus);
  const [cancelReason, setCancelReason] = useState(order?.cancelReason || "");
  const [showCancelReason, setShowCancelReason] = useState(false);

  // Vérifier si c'est un paiement en espèces
  const isCashPayment = order?.paymentInfo?.typePayment === "CASH";

  useEffect(() => {
    if (updated) {
      setUpdated(false);
      toast.success("Order Updated Successfully");
    }

    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, updated]);

  // Afficher le champ de raison d'annulation si nécessaire
  useEffect(() => {
    setShowCancelReason(
      paymentStatus === "refunded" || paymentStatus === "cancelled",
    );
  }, [paymentStatus]);

  const submitHandler = () => {
    // Validation
    if (
      (paymentStatus === "refunded" || paymentStatus === "cancelled") &&
      !cancelReason.trim()
    ) {
      toast.error("Please provide a reason for refund/failure");
      return;
    }

    const orderData = {
      paymentStatus,
      ...(showCancelReason &&
        cancelReason.trim() && { cancelReason: cancelReason.trim() }),
    };

    updateOrder(order?._id, orderData);
  };

  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-300";
      case "unpaid":
        return isCashPayment
          ? "bg-yellow-100 text-yellow-700 border-yellow-300 animate-pulse"
          : "bg-red-100 text-red-700 border-red-300";
      case "refunded":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "cancelled":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <article
      className={`p-4 lg:p-6 mb-5 rounded-xl shadow-lg border-2 ${
        isCashPayment
          ? "bg-gradient-to-br from-white via-yellow-50 to-white border-yellow-300"
          : "bg-white border-blue-200"
      }`}
    >
      {/* En-tête avec badge de statut et indicateur CASH */}
      <div className="mb-6 pb-4 border-b-2 border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                isCashPayment ? "bg-yellow-500" : "bg-blue-600"
              }`}
            >
              <i
                className={`text-white text-xl ${
                  isCashPayment ? "fa fa-money-bill-wave" : "fa fa-file-invoice"
                }`}
              ></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Order Details
                {isCashPayment && (
                  <span className="px-2 py-1 bg-yellow-500 text-white rounded-md text-sm font-semibold shadow-sm">
                    💰 CASH
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {order?.orderNumber || order?._id}
              </p>
            </div>
          </div>

          <span
            className={`px-4 py-2 rounded-full text-sm font-bold border-2 shadow-md ${getStatusBadgeStyle(order?.paymentStatus)}`}
          >
            {order?.paymentStatus?.toUpperCase()}
            {isCashPayment && order?.paymentStatus === "unpaid" && (
              <i className="fa fa-clock ml-2 animate-spin"></i>
            )}
          </span>
        </div>

        {/* Bannière d'alerte pour paiement CASH non payé */}
        {isCashPayment && order?.paymentStatus === "unpaid" && (
          <div className="mt-4 p-4 bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-400 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <i className="fa fa-exclamation-triangle text-yellow-600 text-xl mt-0.5"></i>
              <div className="flex-1">
                <p className="font-bold text-yellow-900 mb-1">
                  Paiement en Espèces en Attente
                </p>
                <p className="text-sm text-yellow-800">
                  Cette commande attend un paiement en espèces. Assurez-vous de
                  recevoir le montant avant de marquer la commande comme payée.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <SingleOrderInfo order={order} />

      <hr className="my-6 border-t-2 border-gray-200" />

      {/* Section d'actions rapides pour les paiements CASH */}
      {isCashPayment && order?.paymentStatus === "unpaid" && (
        <div className="mt-6 p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-md">
                <i className="fa fa-hand-holding-usd text-white text-lg"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-yellow-900">
                  Actions Rapides - Paiement CASH
                </h3>
                <p className="text-xs text-yellow-700">
                  Gérez le paiement en espèces de cette commande
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                updateOrder(order?._id, { paymentStatus: "paid" });
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <i className="fa fa-check-circle text-lg"></i>
              <span>Confirmer Réception Espèces</span>
            </button>

            <button
              onClick={() => {
                const reason = prompt("Raison de l'annulation:");
                if (reason) {
                  updateOrder(order?._id, {
                    paymentStatus: "cancelled",
                    cancelReason: reason,
                  });
                }
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <i className="fa fa-times-circle text-lg"></i>
              <span>Annuler la Commande</span>
            </button>
          </div>

          <div className="mt-4 p-3 bg-white bg-opacity-70 rounded-lg border border-yellow-400">
            <p className="text-xs text-yellow-900 flex items-start gap-2">
              <i className="fa fa-info-circle mt-0.5"></i>
              <span>
                <strong>Important:</strong> Cliquez sur "Confirmer Réception
                Espèces" uniquement après avoir physiquement reçu le paiement en
                espèces du client. Le stock restera réservé jusqu'à la
                confirmation ou l'annulation.
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Message de confirmation pour paiement CASH reçu */}
      {isCashPayment && order?.paymentStatus === "paid" && (
        <div className="mt-6 p-5 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-md">
              <i className="fa fa-check-double text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-900 mb-1">
                Paiement en Espèces Confirmé
              </h3>
              <p className="text-sm text-green-700">
                Le paiement en espèces pour cette commande a été reçu et
                confirmé le{" "}
                <strong>
                  {new Date(order?.paidAt).toLocaleDateString("fr-FR")}
                </strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
});

UpdateOrder.displayName = "UpdateOrder";

export default UpdateOrder;
