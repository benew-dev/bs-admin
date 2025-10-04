/* eslint-disable react/prop-types */
import React from "react";
import { arrayHasData } from "@/helpers/helpers";
import Image from "next/image";

const UsersWithMostPurchasesThisMonthTable = ({
  usersThatBoughtMostThisMonth,
}) => {
  return arrayHasData(usersThatBoughtMostThisMonth) ? (
    <div className="w-full py-16 px-6">
      <div className="max-w-md mx-auto text-center">
        <div className="mx-auto w-24 h-24 mb-6 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h3 className="font-bold text-2xl text-gray-800 mb-3">
          Aucun Achat Ce Mois
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Les utilisateurs ayant effectué des achats ce mois apparaîtront ici.
        </p>
      </div>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs font-semibold uppercase bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-b-2 border-gray-300">
          <tr>
            <th scope="col" className="px-6 py-4">
              <div className="flex items-center gap-2">
                <i className="fa fa-trophy text-emerald-600"></i>
                Rang & Nom
              </div>
            </th>
            <th scope="col" className="px-6 py-4">
              <div className="flex items-center gap-2">
                <i className="fa fa-envelope text-gray-500"></i>
                Email
              </div>
            </th>
            <th scope="col" className="px-6 py-4">
              <div className="flex items-center gap-2">
                <i className="fa fa-phone text-gray-500"></i>
                Téléphone
              </div>
            </th>
            <th scope="col" className="px-6 py-4">
              <div className="flex items-center gap-2">
                <i className="fa fa-dollar-sign text-gray-500"></i>
                Montant Total
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {usersThatBoughtMostThisMonth?.map((user, index) => {
            // Fonction pour obtenir l'icône de rang
            const getRankIcon = (index) => {
              if (index === 0)
                return (
                  <i className="fa fa-trophy text-yellow-500 text-lg mr-2"></i>
                );
              if (index === 1)
                return (
                  <i className="fa fa-medal text-gray-400 text-lg mr-2"></i>
                );
              if (index === 2)
                return (
                  <i className="fa fa-medal text-orange-600 text-lg mr-2"></i>
                );
              return (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-bold mr-2">
                  {index + 1}
                </span>
              );
            };

            return (
              <tr
                key={user?._id}
                className="bg-white hover:bg-emerald-50 transition-colors duration-150"
              >
                {/* Nom avec avatar et rang */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    {getRankIcon(index)}
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                      <Image
                        src={
                          user?.result?.[0]?.avatar?.url
                            ? user.result[0].avatar.url
                            : "/images/default.png"
                        }
                        alt={user?.result?.[0]?.name || "User"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-gray-900">
                      {user?.result?.[0]?.name || "N/A"}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-3">
                  <span className="text-gray-700">
                    {user?.result?.[0]?.email || "N/A"}
                  </span>
                </td>

                {/* Téléphone */}
                <td className="px-6 py-3">
                  <span className="font-mono text-sm text-gray-700">
                    {user?.result?.[0]?.phone || "N/A"}
                  </span>
                </td>

                {/* Montant */}
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-1 font-bold text-lg text-emerald-700">
                    <i className="fa fa-dollar-sign text-sm"></i>
                    {user?.totalPurchases?.toFixed(2) || "0.00"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Résumé en bas de tableau */}
      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <div className="text-emerald-700">
            <i className="fa fa-users mr-2"></i>
            <span className="font-semibold">
              {usersThatBoughtMostThisMonth?.length || 0}
            </span>{" "}
            client{usersThatBoughtMostThisMonth?.length > 1 ? "s" : ""} ayant
            acheté ce mois
          </div>
          <div className="text-emerald-700 font-semibold">
            Revenus Générés: $
            {usersThatBoughtMostThisMonth
              ?.reduce((acc, user) => acc + (user?.totalPurchases || 0), 0)
              .toFixed(2) || "0.00"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersWithMostPurchasesThisMonthTable;
