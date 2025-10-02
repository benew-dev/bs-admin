/* eslint-disable react/prop-types */
"use client";

import React, { memo, useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";

const CustomPagination = dynamic(
  () => import("@/components/layouts/CustomPagniation"),
);

import OrderContext from "@/context/OrderContext";

const OrdersTable = dynamic(() => import("./table/OrdersTable"), {
  loading: () => <Loading />,
});

import Search from "../layouts/Search";
import OrdersFilter from "./OrdersFilter";
import { toast } from "react-toastify";

const OrderInfoStats = dynamic(() => import("./card/OrderInfoStats"), {
  loading: () => <Loading />,
});

const Orders = memo(({ orders }) => {
  const { error, loading, setLoading, clearErrors } = useContext(OrderContext);
  const [open, setOpen] = useState(false);
  const [openStats, setOpenStats] = useState(false);

  useEffect(() => {
    if (loading) {
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

  return (
    <div className="relative overflow-x-auto">
      {/* Header amélioré avec gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Gestion des Commandes
            </h1>
            <p className="text-blue-100 text-sm">
              Gérez et suivez toutes les commandes de votre boutique
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setOpenStats((prev) => !prev)}
              className="px-4 py-2.5 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              title="Afficher les statistiques"
            >
              <i className="fa fa-chart-simple" aria-hidden="true"></i>
              <span className="hidden sm:inline">Stats</span>
            </button>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="px-4 py-2.5 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
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
        <OrderInfoStats
          open={openStats}
          ordersCount={orders?.ordersCount}
          totalOrdersThisMonth={orders?.totalOrdersThisMonth}
          paidOrdersCount={orders?.paidOrdersCount}
          totalOrdersPaidThisMonth={orders?.totalOrdersPaidThisMonth}
          totalOrdersUnpaidThisMonth={orders?.totalOrdersUnpaidThisMonth}
        />
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
});

Orders.displayName = "Orders";

export default Orders;
