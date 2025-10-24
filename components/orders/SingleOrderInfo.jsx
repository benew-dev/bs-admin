/* eslint-disable react/prop-types */
import Image from "next/image";
import React from "react";

const SingleOrderInfo = ({ order }) => {
  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fonction pour obtenir la couleur du statut de paiement
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-500";
      case "unpaid":
        return "text-red-500";
      case "refunded":
        return "text-orange-500";
      case "cancelled":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  // Vérifier si c'est un paiement en espèces
  const isCashPayment = order?.paymentInfo?.typePayment === "CASH";

  return (
    <>
      <header className="lg:flex justify-between mb-4">
        <div className="mb-4 lg:mb-0">
          <p className="font-semibold flex items-center flex-wrap gap-2">
            <span>Order Number: {order?.orderNumber || order?._id} </span>
            <span className={getPaymentStatusColor(order?.paymentStatus)}>
              • {order?.paymentStatus?.toUpperCase()}
            </span>
            {isCashPayment && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 border-2 border-yellow-600 shadow-md">
                <i className="fa fa-money-bill-wave mr-1.5"></i>
                CASH PAYMENT
              </span>
            )}
          </p>
          <p className="text-gray-500">
            Created: {formatDate(order?.createdAt)}
          </p>
          <p className="text-gray-500">
            Last Updated: {formatDate(order?.updatedAt)}
          </p>
          <p className="text-sm text-gray-600">
            Total Items:{" "}
            {order?.itemCount ||
              order?.orderItems?.reduce(
                (total, item) => total + item.quantity,
                0,
              )}
          </p>
        </div>
      </header>

      {/* Bannière spéciale pour les paiements en espèces */}
      {isCashPayment && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 rounded-xl border-2 border-yellow-300 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-md">
              <i className="fa fa-hand-holding-usd text-white text-xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-yellow-900 mb-2 flex items-center gap-2">
                <span>Paiement en Espèces</span>
                {order?.paymentStatus === "unpaid" && (
                  <span className="text-xs px-2 py-0.5 bg-yellow-600 text-white rounded-full animate-pulse">
                    En attente
                  </span>
                )}
              </h3>
              <p className="text-sm text-yellow-800 mb-2">
                {order?.paymentInfo?.cashPaymentNote ||
                  "Le paiement sera effectué en espèces à la livraison ou au retrait"}
              </p>
              {order?.paymentStatus === "unpaid" && (
                <div className="mt-3 p-3 bg-white bg-opacity-70 rounded-lg border border-yellow-400">
                  <p className="text-xs text-yellow-900 font-medium flex items-center gap-2">
                    <i className="fa fa-info-circle"></i>
                    <span>
                      Une fois l'espèces reçu, veuillez mettre à jour le statut
                      de la commande à "PAID"
                    </span>
                  </p>
                </div>
              )}
              {order?.paymentStatus === "paid" && (
                <div className="mt-3 p-3 bg-green-100 rounded-lg border border-green-400">
                  <p className="text-xs text-green-800 font-medium flex items-center gap-2">
                    <i className="fa fa-check-circle"></i>
                    <span>Paiement en espèces reçu et confirmé</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-gray-400 mb-1 font-semibold">Person</p>
          <ul className="text-gray-600">
            <li className="font-medium">{order?.user?.name}</li>
            <li>Phone: {order?.user?.phone}</li>
            <li className="text-sm">{order?.user?.email}</li>
          </ul>
        </div>

        <div>
          <p className="text-gray-400 mb-1 font-semibold">Financial Details</p>
          <ul className="text-gray-600">
            <li>
              <span className="font-bold">Total Amount:</span> $
              {order?.totalAmount?.toFixed(2)}
            </li>
            <li className="text-sm text-gray-500">
              (
              {order?.orderItems?.reduce(
                (total, item) => total + item.quantity,
                0,
              )}{" "}
              items × avg $
              {(
                order?.totalAmount /
                order?.orderItems?.reduce(
                  (total, item) => total + item.quantity,
                  0,
                )
              ).toFixed(2)}
              )
            </li>
          </ul>
        </div>

        <div
          className={`p-4 rounded-lg border-2 ${
            isCashPayment
              ? "bg-yellow-50 border-yellow-300"
              : "bg-white border-gray-200"
          }`}
        >
          <p className="text-gray-400 mb-2 font-semibold flex items-center gap-2">
            Payment Info
            {isCashPayment && (
              <span className="text-yellow-600 text-lg">💰</span>
            )}
          </p>
          <ul className="text-gray-600 space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="font-bold">Mode:</span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  isCashPayment
                    ? "bg-yellow-500 text-white"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {order?.paymentInfo?.typePayment}
              </span>
            </li>
            <li>
              <span className="font-bold">
                {isCashPayment ? "Received by:" : "Sender:"}
              </span>{" "}
              {order?.paymentInfo?.paymentAccountName}
            </li>
            {!isCashPayment && (
              <li>
                <span className="font-bold">Number:</span>{" "}
                {order?.paymentInfo?.paymentAccountNumber}
              </li>
            )}
            {isCashPayment && (
              <li className="text-xs text-yellow-700 italic">
                <i className="fa fa-wallet mr-1"></i>
                Cash on delivery/pickup
              </li>
            )}
            <li>
              <span className="font-bold">Payment Date:</span>{" "}
              {formatDate(order?.paymentInfo?.paymentDate)}
            </li>
          </ul>
        </div>
      </div>

      {/* Section Historique des dates */}
      {(order?.paidAt || order?.cancelledAt) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700 mb-3 font-semibold flex items-center gap-2">
            <i className="fa fa-clock text-blue-600"></i>
            Order Timeline
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <span className="font-bold text-gray-600">Created At:</span>
              <p className="text-sm text-gray-600">
                {formatDate(order?.createdAt)}
              </p>
            </div>
            {order?.paidAt && (
              <div
                className={`p-3 rounded-lg ${
                  isCashPayment ? "bg-yellow-50 border border-yellow-200" : ""
                }`}
              >
                <span className="font-bold text-green-600 flex items-center gap-1">
                  <i className="fa fa-check-circle"></i>
                  Paid At:
                </span>
                <p className="text-sm text-gray-600">
                  {formatDate(order?.paidAt)}
                </p>
                {isCashPayment && (
                  <p className="text-xs text-yellow-700 mt-1 font-medium flex items-center gap-1">
                    <i className="fa fa-money-bill-wave"></i>
                    Cash received
                  </p>
                )}
              </div>
            )}
            {order?.cancelledAt && (
              <div>
                <span className="font-bold text-red-600">Cancelled At:</span>
                <p className="text-sm text-gray-600">
                  {formatDate(order?.cancelledAt)}
                </p>
              </div>
            )}
          </div>
          {order?.cancelReason && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="font-bold text-red-600 flex items-center gap-2">
                <i className="fa fa-exclamation-circle"></i>
                Cancellation Reason:
              </span>
              <p className="text-red-700 mt-1">{order?.cancelReason}</p>
            </div>
          )}
        </div>
      )}

      <hr className="my-4" />

      {/* Section des produits avec plus de détails */}
      <div>
        <p className="text-gray-700 mb-3 font-semibold flex items-center gap-2">
          <i className="fa fa-shopping-bag text-blue-600"></i>
          Order Items
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {order?.orderItems?.map((item) => (
            <figure
              className="flex flex-row p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
              key={item?._id}
            >
              <div>
                <div className="block w-20 h-20 rounded-md border border-gray-200 overflow-hidden p-2 bg-gray-50">
                  <Image
                    src={item?.image}
                    height={60}
                    width={60}
                    alt={item?.name}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
              <figcaption className="ml-3 flex-1">
                <p className="font-semibold text-gray-900">
                  {item?.name.substring(0, 35)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <i className="fa fa-tag text-xs mr-1"></i>
                  {item?.category}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  ${item?.price?.toFixed(2)} × {item?.quantity}
                </p>
                <p className="mt-2 font-bold text-blue-600">
                  ${" "}
                  {item?.subtotal?.toFixed(2) ||
                    (item?.price * item?.quantity).toFixed(2)}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Section récapitulatif final avec design adapté pour CASH */}
      <div
        className={`mt-6 p-5 rounded-xl border-2 shadow-lg ${
          isCashPayment
            ? "bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-50 border-yellow-300"
            : "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-600 mb-1">Order ID</p>
            <p className="text-sm font-mono text-gray-700 font-semibold">
              {order?.orderNumber || order?._id}
            </p>
            <p className="text-xs text-gray-600 mt-2 flex items-center gap-2">
              <span>Status:</span>
              <span
                className={`font-semibold ${getPaymentStatusColor(order?.paymentStatus)}`}
              >
                {order?.paymentStatus?.toUpperCase()}
              </span>
            </p>
            {isCashPayment && (
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-yellow-500 text-white shadow-sm">
                  <i className="fa fa-money-bill-wave mr-1"></i>
                  CASH
                </span>
                {order?.paymentStatus === "unpaid" && (
                  <span className="text-xs text-yellow-700 font-medium animate-pulse">
                    ⏳ Awaiting payment
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600 mb-1">Total Amount</p>
            <p
              className={`text-3xl font-bold ${
                isCashPayment ? "text-yellow-600" : "text-blue-600"
              }`}
            >
              ${order?.totalAmount?.toFixed(2)}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {order?.orderItems?.reduce(
                (total, item) => total + item.quantity,
                0,
              )}{" "}
              item(s)
            </p>
            {isCashPayment && order?.paymentStatus === "unpaid" && (
              <p className="text-xs text-yellow-700 mt-2 font-medium">
                💰 Cash payment expected
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleOrderInfo;
