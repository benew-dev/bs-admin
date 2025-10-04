/* eslint-disable react/prop-types */
import React from "react";
import { arrayHasData, customLoader } from "@/helpers/helpers";
import Image from "next/image";

const ListProductSoldThisMonth = ({ productSoldThisMonth }) => {
  return arrayHasData(productSoldThisMonth) ? (
    <div className="w-full py-16 px-6">
      <div className="max-w-md mx-auto text-center">
        <div className="mx-auto w-24 h-24 mb-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-purple-500"
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
          Aucune Vente Ce Mois
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Les produits vendus ce mois apparaîtront ici. Commencez à promouvoir
          vos produits pour augmenter vos ventes.
        </p>
      </div>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs font-semibold uppercase bg-gradient-to-r from-purple-100 to-purple-200 text-gray-700 border-b-2 border-purple-300">
          <tr>
            <th scope="col" className="px-6 py-4">
              <div className="flex items-center gap-2">
                <i className="fa fa-box text-purple-600"></i>
                Produit
              </div>
            </th>
            <th scope="col" className="px-6 py-4">
              <div className="flex items-center gap-2">
                <i className="fa fa-dollar-sign text-purple-600"></i>
                Montant
              </div>
            </th>
            <th scope="col" className="px-6 py-4">
              <div className="flex items-center gap-2">
                <i className="fa fa-shopping-cart text-purple-600"></i>
                Quantité
              </div>
            </th>
            <th scope="col" className="px-6 py-4">
              <div className="flex items-center gap-2">
                <i className="fa fa-tag text-purple-600"></i>
                Catégorie
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {productSoldThisMonth?.map((product, index) => {
            // Calcul du rang pour afficher une médaille
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
                className="bg-white hover:bg-purple-50 transition-colors duration-150"
                key={product._id || index}
              >
                {/* Nom avec image et rang */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    {getRankIcon(index)}
                    <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                      <Image
                        loader={customLoader}
                        src={
                          product?.productImage
                            ? product.productImage
                            : "/images/default_product.png"
                        }
                        alt={product?.productName || "Product"}
                        title={product?.productName || "Product"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-gray-900 line-clamp-2">
                      {product?.productName || "N/A"}
                    </span>
                  </div>
                </td>

                {/* Montant */}
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-1 font-bold text-lg text-purple-700">
                    <i className="fa fa-dollar-sign text-sm"></i>
                    {product?.totalAmount?.toFixed(2) || "0.00"}
                  </span>
                </td>

                {/* Quantité */}
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                    <i className="fa fa-box text-xs"></i>
                    {product?.totalQuantity || 0}
                  </span>
                </td>

                {/* Catégorie */}
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                    <i className="fa fa-tag"></i>
                    {product?.productCategory || "Non catégorisé"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Résumé en bas de tableau */}
      <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <div className="text-purple-700">
            <i className="fa fa-chart-bar mr-2"></i>
            <span className="font-semibold">
              {productSoldThisMonth?.length || 0}
            </span>{" "}
            produit{productSoldThisMonth?.length > 1 ? "s" : ""} vendu
            {productSoldThisMonth?.length > 1 ? "s" : ""} ce mois
          </div>
          <div className="flex items-center gap-4">
            <div className="text-purple-700">
              <span className="font-medium">Revenus: </span>
              <span className="font-bold">
                $
                {productSoldThisMonth
                  ?.reduce(
                    (acc, product) => acc + (product?.totalAmount || 0),
                    0,
                  )
                  .toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="text-purple-700">
              <span className="font-medium">Total unités: </span>
              <span className="font-bold">
                {productSoldThisMonth?.reduce(
                  (acc, product) => acc + (product?.totalQuantity || 0),
                  0,
                ) || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListProductSoldThisMonth;
