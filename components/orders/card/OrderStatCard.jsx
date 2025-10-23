/* eslint-disable react/prop-types */
"use client";

import React from "react";

const OrderStatCard = ({ title, content, indication, color }) => {
  // Définir les couleurs selon le type (avec support pour yellow)
  const getColorClasses = (colorType) => {
    switch (colorType) {
      case "green":
        return {
          bg: "bg-green-100 hover:bg-green-200",
          badge: "bg-white",
          badgeText: "text-green-600",
          border: "border-green-300",
        };
      case "blue":
        return {
          bg: "bg-blue-100 hover:bg-blue-200",
          badge: "bg-white",
          badgeText: "text-blue-600",
          border: "border-blue-300",
        };
      case "purple":
        return {
          bg: "bg-purple-100 hover:bg-purple-200",
          badge: "bg-white",
          badgeText: "text-purple-600",
          border: "border-purple-300",
        };
      case "teal":
        return {
          bg: "bg-teal-100 hover:bg-teal-200",
          badge: "bg-white",
          badgeText: "text-teal-600",
          border: "border-teal-300",
        };
      case "orange":
        return {
          bg: "bg-orange-100 hover:bg-orange-200",
          badge: "bg-white",
          badgeText: "text-orange-600",
          border: "border-orange-300",
        };
      case "yellow":
        return {
          bg: "bg-yellow-100 hover:bg-yellow-200",
          badge: "bg-white",
          badgeText: "text-yellow-600",
          border: "border-yellow-300",
        };
      case "red":
        return {
          bg: "bg-red-100 hover:bg-red-200",
          badge: "bg-white",
          badgeText: "text-red-600",
          border: "border-red-300",
        };
      default:
        return {
          bg: "bg-blue-100 hover:bg-blue-200",
          badge: "bg-white",
          badgeText: "text-blue-600",
          border: "border-blue-300",
        };
    }
  };

  const colors = getColorClasses(color);

  return (
    <div
      className={`
        h-auto p-4 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(20%-0.6rem)] 
        border-2 ${colors.border} ${colors.bg} 
        rounded-lg shadow-md hover:shadow-lg 
        flex flex-col justify-between
        transition-all duration-300 ease-in-out
        transform hover:-translate-y-1
      `}
    >
      {/* Badge du titre */}
      <div className={`${colors.badge} rounded-full px-3 py-1 w-fit shadow-sm`}>
        <p
          className={`${colors.badgeText} text-xs font-semibold uppercase tracking-wide`}
        >
          {title}
        </p>
      </div>

      {/* Contenu principal */}
      <p className="text-gray-900 font-bold text-2xl pt-4 pl-1 leading-tight">
        {content}
      </p>

      {/* Indication */}
      <p className="text-gray-600 text-xs font-medium pt-3 pl-1 pb-1">
        {indication}
      </p>
    </div>
  );
};

export default OrderStatCard;
