/* eslint-disable react/prop-types */
"use client";

import dynamic from "next/dynamic";
import Loading from "@/app/loading";
import React, { useState } from "react";

const UserPurchasingsStats = dynamic(
  () => import("./card/UserPurchasingsStats"),
  {
    loading: () => <Loading />,
  },
);

const UsersWithMostPurchasesThisMonthTable = dynamic(
  () => import("./table/UsersWithMostPurchasesThisMonthTable"),
  {
    loading: () => <Loading />,
  },
);
import { arrayHasData } from "@/helpers/helpers";

const UsersPurchasings = ({ data }) => {
  const [open, setOpen] = useState(false);

  const totalAmount = arrayHasData(data?.usersThatBoughtMostThisMonth)
    ? 0
    : data?.usersThatBoughtMostThisMonth?.reduce(
        (acc, currentValue) => acc + (currentValue?.totalPurchases || 0),
        0,
      );

  return (
    <div className="relative overflow-x-auto">
      {/* Header amélioré avec gradient */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-t-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Statistiques d'Achats des Utilisateurs
            </h1>
            <p className="text-emerald-100 text-sm">
              Analysez le comportement d'achat de vos clients
            </p>
          </div>
          <button
            title="Afficher les statistiques"
            onClick={() => setOpen((prev) => !prev)}
            className="px-4 py-2.5 bg-white text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <i className="fa fa-chart-simple" aria-hidden="true"></i>
            <span className="hidden sm:inline">Stats</span>
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`${!open && "hidden"} mb-6`}>
        <UserPurchasingsStats
          open={open}
          totalUsersThatBought={data?.totalUsersThatBought}
          totalUsersThatBoughtThisMonth={data?.totalUsersThatBoughtThisMonth}
          userThatBoughtMostSinceBeginning={
            data?.userThatBoughtMostSinceBeginning
          }
          usersThatBoughtMostThisMonth={
            data?.usersThatBoughtMostThisMonth !== null &&
            data?.usersThatBoughtMostThisMonth?.length !== undefined &&
            data?.usersThatBoughtMostThisMonth[0]
          }
        />
      </div>

      {/* Table Section avec design amélioré */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        {/* Header de la table */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <i className="fa fa-trophy text-emerald-600"></i>
            Utilisateurs avec le Plus d'Achats Ce Mois
          </h2>
          <div className="text-sm">
            <span className="text-gray-600 font-medium">Montant Total: </span>
            <span className="font-bold text-emerald-700">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <UsersWithMostPurchasesThisMonthTable
          usersThatBoughtMostThisMonth={data?.usersThatBoughtMostThisMonth}
        />
      </div>
    </div>
  );
};

export default UsersPurchasings;
