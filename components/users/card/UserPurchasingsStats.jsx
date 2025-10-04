/* eslint-disable react/prop-types */
import React from "react";
import { arrayHasData } from "@/helpers/helpers";
import UserStatCard from "./UserStatCard";

const UserPurchasingsStats = ({
  open,
  totalUsersThatBought,
  totalUsersThatBoughtThisMonth,
  userThatBoughtMostSinceBeginning,
  usersThatBoughtMostThisMonth,
}) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const data = [
    {
      title: "Clients Ayant Acheté",
      content: `${arrayHasData(totalUsersThatBought) ? "0 client" : `${totalUsersThatBought[0]?.totalUsers} client${totalUsersThatBought[0]?.totalUsers > 1 ? "s" : ""}`}`,
      indication: "Depuis le début",
      color: "blue",
      icon: "fa-users",
    },
    {
      title: "Meilleur Client Global",
      content: `${arrayHasData(userThatBoughtMostSinceBeginning) ? "Aucun" : `${userThatBoughtMostSinceBeginning[0]?.result[0]?.name?.substring(0, 15)}...`}`,
      indication: `${userThatBoughtMostSinceBeginning?.[0]?.totalPurchases || 0} commande${userThatBoughtMostSinceBeginning?.[0]?.totalPurchases > 1 ? "s" : ""}`,
      color: "green",
      icon: "fa-crown",
    },
    {
      title: "Acheteurs Ce Mois",
      content: `${arrayHasData(totalUsersThatBoughtThisMonth) ? "0 client" : `${totalUsersThatBoughtThisMonth[0]?.totalUsers} client${totalUsersThatBoughtThisMonth[0]?.totalUsers > 1 ? "s" : ""}`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: "purple",
      icon: "fa-calendar-check",
    },
    {
      title: "Meilleur Client du Mois",
      content: `${usersThatBoughtMostThisMonth === null || usersThatBoughtMostThisMonth?.result?.[0] === undefined ? "Aucun" : `${usersThatBoughtMostThisMonth?.result[0]?.name?.substring(0, 15)}...`}`,
      indication: `${currentMonth}/${currentYear}: $${usersThatBoughtMostThisMonth === null || usersThatBoughtMostThisMonth?.result?.[0] === undefined ? "0.00" : usersThatBoughtMostThisMonth?.totalPurchases?.toFixed(2)}`,
      color: "orange",
      icon: "fa-medal",
    },
  ];

  return (
    <div
      className={`${!open && "hidden"} bg-white rounded-lg shadow-md border border-gray-200 p-6`}
    >
      {/* Header des stats */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
          <i className="fa fa-chart-pie text-emerald-600"></i>
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-800">
            Statistiques d'Achats Détaillées
          </h4>
          <p className="text-sm text-gray-500">
            Performance des clients par période
          </p>
        </div>
      </div>

      {/* Grid des cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.map((item, index) => (
          <UserStatCard
            key={index}
            title={item?.title}
            content={item?.content}
            indication={item?.indication}
            color={item?.color}
            icon={item?.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default UserPurchasingsStats;
