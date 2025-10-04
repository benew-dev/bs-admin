/* eslint-disable react/prop-types */
"use client";

import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import OrdersFilter from "../orders/OrdersFilter";
import OrderContext from "@/context/OrderContext";
import Loading from "@/app/loading";

const CustomPagination = dynamic(
  () => import("@/components/layouts/CustomPagniation"),
);

const OrdersTable = dynamic(() => import("../orders/table/OrdersTable"), {
  loading: () => <Loading />,
});

import Search from "../layouts/Search";

const OverviewAllStats = dynamic(() => import("./OverviewAllStats"), {
  loading: () => <Loading />,
});

const Overview = ({ orders, categories, paymentTypes }) => {
  const { deleteOrder, error, loading, setLoading, clearErrors } =
    useContext(OrderContext);

  const [open, setOpen] = useState(false);
  const [openStats, setOpenStats] = useState(false);
  const [openAdditionalData, setOpenAdditionalData] = useState(false);

  useEffect(() => {
    if (loading || orders !== null) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const deleteHandler = (id) => {
    deleteOrder(id);
  };

  return (
    <div className="relative overflow-x-auto">
      {/* Header amélioré avec gradient */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-t-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Business Overview
            </h1>
            <p className="text-indigo-100 text-sm">
              Vue d'ensemble complète de votre activité commerciale
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setOpenAdditionalData((prev) => !prev)}
              className="px-4 py-2.5 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              title="Informations additionnelles"
            >
              <i className="fa fa-info-circle" aria-hidden="true"></i>
              <span className="hidden sm:inline">Info</span>
            </button>
            <button
              onClick={() => setOpenStats((prev) => !prev)}
              className="px-4 py-2.5 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              title="Afficher les statistiques"
            >
              <i className="fa fa-chart-simple" aria-hidden="true"></i>
              <span className="hidden sm:inline">Stats</span>
            </button>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="px-4 py-2.5 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              title="Filtrer les commandes"
            >
              <i className="fa fa-sliders" aria-hidden="true"></i>
              <span className="hidden sm:inline">Filtres</span>
            </button>
            <Search setLoading={setLoading} />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`${!openStats && "hidden"} mb-6`}>
        <OverviewAllStats
          open={openStats}
          ordersCount={orders?.ordersCount}
          totalOrdersThisMonth={orders?.totalOrdersThisMonth}
          totalOrdersPaidThisMonth={orders?.totalOrdersPaidThisMonth}
          totalOrdersUnpaidThisMonth={orders?.totalOrdersUnpaidThisMonth}
          bestProductSoldSinceBeginning={
            orders?.descListProductSoldSinceBeginning?.[0] || null
          }
          bestCategorySoldSinceBeginning={
            orders?.descListCategorySoldSinceBeginning?.[0] || null
          }
          bestProductSoldThisMonth={
            orders?.descListProductSoldThisMonth?.[0] || null
          }
          userThatBoughtMostSinceBeginning={
            orders?.userThatBoughtMostSinceBeginning
          }
        />
      </div>

      {/* Additional Data Section avec design amélioré */}
      <div className={`${!openAdditionalData && "hidden"} mb-6`}>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <i className="fa fa-database text-indigo-600"></i>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800">
                Informations Complémentaires
              </h4>
              <p className="text-sm text-gray-500">
                Données de configuration de votre boutique
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                <i className="fa fa-tags text-gray-500"></i>
                Catégories de Produits
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories?.map((category, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-lg text-center hover:shadow-md transition-all duration-200"
                  >
                    <i className="fa fa-tag text-green-600 mb-1"></i>
                    <p className="font-medium text-gray-800 text-sm">
                      {category.categoryName}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Types */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                <i className="fa fa-credit-card text-gray-500"></i>
                Plateformes de Paiement
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {paymentTypes?.map((payment, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <i className="fa fa-wallet text-purple-600"></i>
                      <span className="font-bold text-gray-800">
                        {payment.paymentName}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-mono">
                      {payment.paymentNumber}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className={`${!open && "hidden"} mb-6`}>
        <OrdersFilter open={open} setLoading={setLoading} />
      </div>

      {/* Table Section avec design amélioré */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-8">
            <Loading />
          </div>
        ) : (
          <OrdersTable
            orders={orders?.orders}
            itemCount={orders?.filteredOrdersCount}
            deleteHandler={deleteHandler}
          />
        )}
      </div>

      {/* Pagination avec design amélioré */}
      {orders?.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <CustomPagination totalPages={orders?.totalPages} />
        </div>
      )}
    </div>
  );
};

export default Overview;
