/* eslint-disable react/prop-types */
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useState } from "react";
import Loading from "@/app/loading";

const ProductSalesStat = dynamic(() => import("./card/ProductSalesStat"), {
  loading: () => <Loading />,
});

const ListProductSoldThisMonth = dynamic(
  () => import("./table/ListProductSoldThisMonth"),
  {
    loading: () => <Loading />,
  },
);

import { arrayHasData } from "@/helpers/helpers";

const ProductSales = ({ data }) => {
  const [open, setOpen] = useState(false);

  const totalAmount = arrayHasData(data?.descListProductSoldThisMonth)
    ? 0
    : data?.descListProductSoldThisMonth?.reduce(
        (acc, currentValue) => acc + (currentValue?.totalAmount || 0),
        0,
      );

  const totalQuantity = arrayHasData(data?.descListProductSoldThisMonth)
    ? 0
    : data?.descListProductSoldThisMonth?.reduce(
        (acc, currentValue) => acc + (currentValue?.totalQuantity || 0),
        0,
      );

  const getArrayLastIndex = (arrayLength) => {
    const lastIndex = arrayLength - 1;
    return lastIndex;
  };

  return (
    <div className="relative overflow-x-auto">
      {/* Header amélioré avec gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Statistiques de Ventes
            </h1>
            <p className="text-purple-100 text-sm">
              Analysez les performances de vos produits et catégories
            </p>
          </div>
          <button
            title="Afficher les statistiques"
            onClick={() => setOpen((prev) => !prev)}
            className="px-4 py-2.5 bg-white text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <i className="fa fa-chart-simple" aria-hidden="true"></i>
            <span className="hidden sm:inline">Stats</span>
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`${!open && "hidden"} mb-6`}>
        <ProductSalesStat
          open={open}
          bestProductSoldSinceBeginning={
            data?.descListProductSoldSinceBeginning?.[0] || null
          }
          leastProductSoldSinceBeginning={
            data?.descListProductSoldSinceBeginning?.[
              getArrayLastIndex(data?.descListProductSoldSinceBeginning?.length)
            ] || null
          }
          bestCategorySoldSinceBeginning={
            data?.descListCategorySoldSinceBeginning?.[0] || null
          }
          leastCategorySoldSinceBeginning={
            data?.descListCategorySoldSinceBeginning?.[
              getArrayLastIndex(
                data?.descListCategorySoldSinceBeginning?.length,
              )
            ] || null
          }
          bestProductSoldThisMonth={
            data?.descListProductSoldThisMonth?.[0] || null
          }
          leastProductSoldThisMonth={
            data?.descListProductSoldThisMonth?.[
              getArrayLastIndex(data?.descListProductSoldThisMonth?.length)
            ] || null
          }
          bestCategorySoldThisMonth={
            data?.descListCategorySoldThisMonth?.[0] || null
          }
          leastCategorySoldThisMonth={
            data?.descListCategorySoldThisMonth?.[
              getArrayLastIndex(data?.descListCategorySoldThisMonth?.length)
            ] || null
          }
        />
      </div>

      {/* Table Section avec design amélioré */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        {/* Header de la table */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <i className="fa fa-trophy text-purple-600"></i>
            Produits Générant le Plus de Revenus Ce Mois
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-600 font-medium">Montant Total: </span>
              <span className="font-bold text-purple-700">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600 font-medium">Quantité: </span>
              <span className="font-bold text-purple-700">{totalQuantity}</span>
            </div>
          </div>
        </div>

        <ListProductSoldThisMonth
          productSoldThisMonth={data?.descListProductSoldThisMonth}
        />
      </div>
    </div>
  );
};

export default ProductSales;
