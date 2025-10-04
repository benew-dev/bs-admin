/* eslint-disable react/prop-types */
import React from "react";

const OverviewStatCard = ({
  title,
  content,
  indication,
  color,
  icon,
  amount,
  quantity,
}) => {
  // Définir les couleurs selon le type
  const getColorClasses = (colorType) => {
    switch (colorType) {
      case "green":
        return {
          bg: "bg-green-50 hover:bg-green-100",
          border: "border-green-200",
          badge: "bg-green-100",
          badgeText: "text-green-700",
          icon: "text-green-600",
          value: "text-green-700",
        };
      case "red":
        return {
          bg: "bg-red-50 hover:bg-red-100",
          border: "border-red-200",
          badge: "bg-red-100",
          badgeText: "text-red-700",
          icon: "text-red-600",
          value: "text-red-700",
        };
      case "blue":
        return {
          bg: "bg-blue-50 hover:bg-blue-100",
          border: "border-blue-200",
          badge: "bg-blue-100",
          badgeText: "text-blue-700",
          icon: "text-blue-600",
          value: "text-blue-700",
        };
      case "purple":
        return {
          bg: "bg-purple-50 hover:bg-purple-100",
          border: "border-purple-200",
          badge: "bg-purple-100",
          badgeText: "text-purple-700",
          icon: "text-purple-600",
          value: "text-purple-700",
        };
      case "orange":
        return {
          bg: "bg-orange-50 hover:bg-orange-100",
          border: "border-orange-200",
          badge: "bg-orange-100",
          badgeText: "text-orange-700",
          icon: "text-orange-600",
          value: "text-orange-700",
        };
      default:
        return {
          bg: "bg-gray-50 hover:bg-gray-100",
          border: "border-gray-200",
          badge: "bg-gray-100",
          badgeText: "text-gray-700",
          icon: "text-gray-600",
          value: "text-gray-700",
        };
    }
  };

  const colors = getColorClasses(color);

  return (
    <div
      className={`
        ${colors.bg} ${colors.border}
        border-2 rounded-lg p-4 
        transition-all duration-300 ease-in-out
        transform hover:-translate-y-1 hover:shadow-lg
        flex flex-col justify-between
        h-full
      `}
    >
      {/* Header avec icône et titre */}
      <div className="flex items-start justify-between mb-3">
        <div
          className={`${colors.badge} rounded-lg px-3 py-1.5 shadow-sm flex-1`}
        >
          <p
            className={`${colors.badgeText} text-xs font-semibold uppercase tracking-wide line-clamp-2`}
          >
            {title || "N/A"}
          </p>
        </div>
        {icon && (
          <div className={`${colors.icon} ml-2`}>
            <i className={`fa ${icon} text-lg`} aria-hidden="true"></i>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className="mb-3">
        <p className="text-gray-900 font-bold text-base leading-tight line-clamp-2">
          {content || "Aucun"}
        </p>
      </div>

      {/* Stats optionnelles - Montant et Quantité */}
      {(amount || quantity) && (
        <div className="space-y-2 mb-3 pt-2 border-t border-gray-200">
          {amount && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 font-medium">
                Montant:
              </span>
              <span className={`${colors.value} font-bold text-sm`}>
                ${amount}
              </span>
            </div>
          )}
          {quantity && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 font-medium">
                Quantité:
              </span>
              <span className="text-gray-800 font-semibold text-sm">
                {quantity}{" "}
                <span className="text-xs text-gray-500">
                  unité{quantity > 1 ? "s" : ""}
                </span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Indication */}
      <div className="pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500 font-medium">
          <i className="fa fa-calendar mr-1" aria-hidden="true"></i>
          {indication || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default OverviewStatCard;
