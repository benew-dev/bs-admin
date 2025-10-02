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

  return (
    <article className="p-4 lg:p-6 mb-5 bg-white border-2 border-blue-200 rounded-lg shadow-md">
      {/* En-tête avec badge de statut */}
      <div className="mb-6 pb-4 border-b-2 border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i className="fa fa-file-invoice text-blue-600"></i>
            Order Details
          </h2>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              order?.paymentStatus === "paid"
                ? "bg-green-100 text-green-700"
                : order?.paymentStatus === "unpaid"
                  ? "bg-red-100 text-red-700"
                  : order?.paymentStatus === "refunded"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-700"
            }`}
          >
            {order?.paymentStatus?.toUpperCase()}
          </span>
        </div>
      </div>

      <SingleOrderInfo order={order} />

      <hr className="my-6 border-t-2 border-gray-200" />

      {/* Section de mise à jour du statut */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fa fa-edit text-blue-600"></i>
          Update Payment Status
        </h3>

        <div className="space-y-4">
          {/* Sélecteur de statut de paiement */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Payment Status
            </label>
            <div className="relative">
              <select
                className="block appearance-none border-2 border-gray-300 bg-white rounded-lg py-3 px-4 hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full transition-all duration-200"
                name="paymentStatus"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                required
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <i className="absolute inset-y-0 right-0 p-3 text-gray-400 pointer-events-none">
                <svg
                  width="22"
                  height="22"
                  className="fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M7 10l5 5 5-5H7z"></path>
                </svg>
              </i>
            </div>
          </div>

          {/* Champ de raison d'annulation/remboursement */}
          {showCancelReason && (
            <div className="animate-fadeIn">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Reason for{" "}
                {paymentStatus === "refunded" ? "Refund" : "Cancelled"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                className="block w-full border-2 border-gray-300 bg-white rounded-lg py-3 px-4 hover:border-orange-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 resize-none"
                rows="3"
                placeholder={`Explain why this order is being ${paymentStatus === "refunded" ? "refunded" : "marked as cancelled"}...`}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {cancelReason.length}/200 characters
              </p>
            </div>
          )}

          {/* Note informative */}
          <div className="p-4 bg-white border-2 border-blue-300 rounded-lg">
            <div className="flex items-start gap-3">
              <i className="fa fa-info-circle text-blue-600 text-lg mt-0.5"></i>
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-1">
                  Important Information
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>
                    • <strong>Unpaid:</strong> Order awaiting payment
                  </li>
                  <li>
                    • <strong>Paid:</strong> Payment confirmed successfully
                  </li>
                  <li>
                    • <strong>Refunded:</strong> Payment returned to customer
                  </li>
                  <li>
                    • <strong>Cancelled:</strong> Payment transaction cancelled
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bouton de mise à jour */}
          <button
            type="button"
            className="w-full px-6 py-3 text-center text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            onClick={submitHandler}
          >
            <i className="fa fa-save"></i>
            Update Order Status
          </button>
        </div>
      </div>
    </article>
  );
});

UpdateOrder.displayName = "UpdateOrder";

export default UpdateOrder;
