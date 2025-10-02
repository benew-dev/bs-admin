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
    </article>
  );
});

UpdateOrder.displayName = "UpdateOrder";

export default UpdateOrder;
