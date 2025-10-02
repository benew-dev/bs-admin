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

  return (
    <>
      <header className="lg:flex justify-between mb-4">
        <div className="mb-4 lg:mb-0">
          <p className="font-semibold">
            <span>Order Number: {order?.orderNumber || order?._id} </span>
            <span className={getPaymentStatusColor(order?.paymentStatus)}>
              • {order?.paymentStatus?.toUpperCase()}
            </span>
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

        <div>
          <p className="text-gray-400 mb-1 font-semibold">Payment Info</p>
          <ul className="text-gray-600">
            <li>
              <span className="font-bold">Mode:</span>{" "}
              {order?.paymentInfo?.typePayment}
            </li>
            <li>
              <span className="font-bold">Sender:</span>{" "}
              {order?.paymentInfo?.paymentAccountName}
            </li>
            <li>
              <span className="font-bold">Number:</span>{" "}
              {order?.paymentInfo?.paymentAccountNumber}
            </li>
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
              <div>
                <span className="font-bold text-green-600">Paid At:</span>
                <p className="text-sm text-gray-600">
                  {formatDate(order?.paidAt)}
                </p>
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

      {/* Section récapitulatif final */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-600 mb-1">Order ID</p>
            <p className="text-sm font-mono text-gray-700">
              {order?.orderNumber || order?._id}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Status:{" "}
              <span
                className={`font-semibold ${getPaymentStatusColor(order?.paymentStatus)}`}
              >
                {order?.paymentStatus?.toUpperCase()}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-blue-600">
              ${order?.totalAmount?.toFixed(2)}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {order?.orderItems?.reduce(
                (total, item) => total + item.quantity,
                0,
              )}{" "}
              item(s)
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleOrderInfo;
