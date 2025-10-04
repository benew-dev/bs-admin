/* eslint-disable react/prop-types */
"use client";

import React from "react";
import { arrayHasData } from "@/helpers/helpers";
import OverviewStatCard from "./OverviewStatCard";

const OverviewAllStats = ({
  open,
  ordersCount,
  totalOrdersThisMonth,
  totalOrdersPaidThisMonth,
  totalOrdersUnpaidThisMonth,
  bestProductSoldSinceBeginning,
  bestCategorySoldSinceBeginning,
  bestProductSoldThisMonth,
  userThatBoughtMostSinceBeginning,
}) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const dataOrders = [
    {
      title: "Toutes les Commandes",
      content: `${ordersCount === undefined || ordersCount === null ? "0 commande" : `${ordersCount} commande${ordersCount > 1 ? "s" : ""}`}`,
      indication: "Depuis le début",
      color: "blue",
      icon: "fa-shopping-cart",
    },
    {
      title: "Commandes Ce Mois",
      content: `${totalOrdersThisMonth?.[0]?.totalOrders === undefined || totalOrdersThisMonth?.[0]?.totalOrders === null ? "0 commande" : `${totalOrdersThisMonth[0]?.totalOrders} commande${totalOrdersThisMonth[0]?.totalOrders > 1 ? "s" : ""}`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: "purple",
      icon: "fa-calendar-check",
    },
    {
      title: "Payées Ce Mois",
      content: `${totalOrdersPaidThisMonth?.[0] === undefined ? "0 commande" : `${totalOrdersPaidThisMonth[0]?.totalOrdersPaid} commande${totalOrdersPaidThisMonth[0]?.totalOrdersPaid > 1 ? "s" : ""}`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: "green",
      icon: "fa-check-circle",
    },
    {
      title: "Non Payées Ce Mois",
      content: `${totalOrdersUnpaidThisMonth?.[0] === undefined ? "0 commande" : `${totalOrdersUnpaidThisMonth[0]?.totalOrdersUnpaid} commande${totalOrdersUnpaidThisMonth[0]?.totalOrdersUnpaid > 1 ? "s" : ""}`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: "red",
      icon: "fa-exclamation-circle",
    },
  ];

  const dataOthers = [
    {
      title: "Meilleur Produit Vendu",
      content: arrayHasData(bestProductSoldSinceBeginning?.productName)
        ? "Aucun"
        : bestProductSoldSinceBeginning?.productName?.[0]?.substring(0, 15) +
          "...",
      indication: "Depuis le début",
      amount: bestProductSoldSinceBeginning?.totalAmount?.toFixed(2) || "0.00",
      quantity: bestProductSoldSinceBeginning?.totalQuantity || 0,
      color: "green",
      icon: "fa-trophy",
    },
    {
      title: "Meilleure Catégorie",
      content: bestCategorySoldSinceBeginning?._id || "Aucune",
      indication: "Depuis le début",
      amount: bestCategorySoldSinceBeginning?.totalAmount?.toFixed(2) || "0.00",
      quantity: bestCategorySoldSinceBeginning?.totalQuantity || 0,
      color: "blue",
      icon: "fa-star",
    },
    {
      title: "Meilleur Produit du Mois",
      content: arrayHasData(bestProductSoldThisMonth?.productName)
        ? "Aucun"
        : bestProductSoldThisMonth?.productName?.[0]?.substring(0, 15) + "...",
      indication: `${currentMonth}/${currentYear}`,
      amount: bestProductSoldThisMonth?.totalAmount?.toFixed(2) || "0.00",
      quantity: bestProductSoldThisMonth?.totalQuantity || 0,
      color: "purple",
      icon: "fa-medal",
    },
    {
      title: "Meilleur Client",
      content: `${
        arrayHasData(userThatBoughtMostSinceBeginning)
          ? "Aucun"
          : `${
              userThatBoughtMostSinceBeginning?.[0]?.result?.[0]?.name?.substring(
                0,
                15,
              ) + "..."
            }`
      }`,
      indication: "Depuis le début",
      color: "orange",
      icon: "fa-user-crown",
    },
  ];

  return (
    <div className={`${!open && "hidden"}`}>
      {/* Orders Stats Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <i className="fa fa-chart-bar text-indigo-600"></i>
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-800">
              Statistiques des Commandes
            </h4>
            <p className="text-sm text-gray-500">
              Vue d'ensemble de l'activité des commandes
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dataOrders?.map((item, index) => (
            <OverviewStatCard
              key={index}
              title={item?.title}
              content={item?.content}
              indication={item?.indication}
              color={item?.color}
              icon={item?.icon}
              amount={item?.amount}
              quantity={item?.quantity}
            />
          ))}
        </div>
      </div>

      {/* Products/Users Stats Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <i className="fa fa-chart-line text-indigo-600"></i>
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-800">
              Top Performances
            </h4>
            <p className="text-sm text-gray-500">
              Meilleurs produits, catégories et clients
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dataOthers?.map((item, index) => (
            <OverviewStatCard
              key={index}
              title={item?.title}
              content={item?.content}
              indication={item?.indication}
              color={item?.color}
              icon={item?.icon}
              amount={item?.amount}
              quantity={item?.quantity}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewAllStats;
