/* eslint-disable react/prop-types */
"use client";

import OrderContext from "@/context/OrderContext";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const PaymentBox = ({ order }) => {
  const { updateOrder, error, clearErrors, updatedOrder, updated, setUpdated } =
    useContext(OrderContext);

  const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus);

  // Définir les transitions autorisées avec support CASH
  const allowedTransitions = {
    unpaid: ["paid", "cancelled"],
    pending_cash: ["paid", "cancelled"], // CASH peut être payé ou annulé
    paid: ["refunded"],
    refunded: [],
    cancelled: [],
  };

  // Obtenir les options disponibles selon le statut actuel
  const getAvailableOptions = (currentStatus) => {
    const transitions = allowedTransitions[currentStatus] || [];
    return transitions.length > 0
      ? [currentStatus, ...transitions]
      : [currentStatus];
  };

  const availableOptions = getAvailableOptions(paymentStatus);

  // Configuration des couleurs selon le statut
  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-600";
      case "unpaid":
        return "text-red-600";
      case "pending_cash":
        return "text-yellow-600";
      case "refunded":
        return "text-orange-600";
      case "cancelled":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getSelectColor = (status) => {
    switch (status) {
      case "paid":
        return "border-green-300 focus:border-green-500 focus:ring-green-200";
      case "unpaid":
        return "border-red-300 focus:border-red-500 focus:ring-red-200";
      case "pending_cash":
        return "border-yellow-300 focus:border-yellow-500 focus:ring-yellow-200";
      case "refunded":
        return "border-orange-300 focus:border-orange-500 focus:ring-orange-200";
      case "cancelled":
        return "border-gray-300 focus:border-gray-500 focus:ring-gray-200";
      default:
        return "border-gray-300 focus:border-gray-500 focus:ring-gray-200";
    }
  };

  // Badge pour indiquer le type de paiement CASH
  const getCashBadge = () => {
    if (
      order?.paymentInfo?.typePayment === "CASH" &&
      paymentStatus === "pending_cash"
    ) {
      return (
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
          💰 Espèces
        </span>
      );
    }
    return null;
  };

  useEffect(() => {
    if (updated) {
      setUpdated(false);

      if (updatedOrder._id === order?._id) {
        toast.success("Order Updated");
      }
    }

    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error, updated, updatedOrder, order, setUpdated, clearErrors]);

  useEffect(() => {
    setPaymentStatus(order?.paymentStatus);
  }, [order?.paymentStatus]);

  const handleChange = (e) => {
    const newStatus = e.target.value;

    if (newStatus === paymentStatus) {
      return;
    }

    setPaymentStatus(newStatus);

    const orderData = { paymentStatus: newStatus };
    updateOrder(order?._id, orderData);
  };

  const isDisabled = allowedTransitions[paymentStatus]?.length === 0;

  return (
    <td className="px-6 py-2">
      <div className="flex items-center flex-wrap gap-2">
        <select
          name="paymentStatus"
          value={paymentStatus}
          onChange={handleChange}
          disabled={isDisabled}
          className={`
            px-3 py-2 rounded-md border text-sm font-medium capitalize
            ${getSelectColor(paymentStatus)}
            ${getStatusColor(paymentStatus)}
            ${
              isDisabled
                ? "bg-gray-100 cursor-not-allowed opacity-60"
                : "bg-white hover:bg-gray-50 cursor-pointer"
            }
            focus:outline-none focus:ring-2 transition-colors duration-200
          `}
        >
          {availableOptions.map((status) => (
            <option key={status} value={status} className="capitalize">
              {status === "pending_cash" ? "Pending Cash" : status}
            </option>
          ))}
        </select>

        {getCashBadge()}

        {isDisabled && (
          <span className="text-xs text-gray-500 italic">(Final status)</span>
        )}
      </div>
    </td>
  );
};

export default PaymentBox;
